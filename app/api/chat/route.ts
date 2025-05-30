// app/api/chat/route.ts
import { GoogleGenAI } from '@google/genai';
import { Redis } from '@upstash/redis';
import { NextRequest } from 'next/server';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Your resume data - based on your actual resume
const RESUME_DATA = `
SIDDAHARTH SUMAN
Boston, MA | 857-316-7217 | siddaharthsuman@gmail.com

EXPERIENCE:
Senior Software Engineer (Nov 2021 – Nov 2023) - Code and Theory (formerly Y Media Labs), Bengaluru, India
- Led a team of frontend web developers, delivering a high-performance mental health application
- Improved accessibility by 20% and increased user engagement by 15%
- Developed a reusable component library that reduced development time by 30%
- Conducted framework feasibility studies and established architecture for scalable frontend projects
- Mentored junior developers, resulting in 15% improvement in code quality

Software Engineer III (Dec 2018 – Oct 2021) - FactSet, Hyderabad, India
- Developed and optimized client-facing endpoints using JavaScript and NodeJS
- Reduced query latency by 40%, enhancing client satisfaction
- Created custom Oracle SQL data import package that cut data integration time by 35%
- Spearheaded development of financial data tool, improving system responsiveness

Senior Systems Engineer (Dec 2015 – Dec 2018) - Infosys, Hyderabad, India
- Automated report generation for 80+ production applications
- Reduced manual effort from 1 hour to 5 minutes, improving operational efficiency by 90%
- Developed mobile device management and workspace reservation systems

Assistant Professor (Aug 2015 – Oct 2015) - Institute of Forensic Science, Mumbai, India
- Instructed students in Cyber Forensics and programming

TECHNICAL SKILLS:
Languages: JavaScript, TypeScript, HTML5, CSS3, PHP, SQL, Java
Frameworks: React, Angular, Next.js, Docker, Contentful, Bootstrap, Selenium
Cloud: Azure, Amazon Web Services (AWS), Google Cloud Platform
Tools: Git, Jenkins, SVN

EDUCATION:
Master of Professional Studies - Informatics (Jan 2024 – Present) - Northeastern University, Boston, MA
Bachelor of Engineering - Computer Engineering (Jun 2011 – May 2015) - Mumbai University, Mumbai, India
`;

// Pattern matching responses - Speaking as Siddaharth directly
const PATTERN_RESPONSES: Record<string, string> = {
  greeting:
    "Hi there! I'm Siddaharth Suman. Thanks for visiting my portfolio! Feel free to ask me about my experience, skills, education, or projects. What would you like to know?",

  experience:
    "I have over 8 years of software engineering experience. I'm currently pursuing my Master's at Northeastern University in Boston. Most recently, I was a Senior Software Engineer at Code and Theory, where I led frontend teams and delivered a mental health application. Before that, I worked at FactSet developing financial data tools and at Infosys automating enterprise systems.",

  skills:
    "My core technical skills include JavaScript, TypeScript, React, Angular, Next.js, and Node.js. I also work with cloud platforms like AWS and Azure. I specialize in frontend architecture, team leadership, and building scalable web applications. I'm also experienced with Docker, Oracle SQL, and various DevOps tools.",

  education:
    "I'm currently pursuing a Master of Professional Studies in Informatics at Northeastern University here in Boston, which I started in January 2024. I completed my Bachelor of Engineering in Computer Engineering from Mumbai University back in 2015.",

  leadership:
    'At Code and Theory, I led a team of frontend developers and mentored junior developers, which resulted in a 15% improvement in code quality. I enjoy conducting framework feasibility studies, establishing scalable architectures, and delivering projects under tight deadlines. Leadership and mentoring are really important to me.',

  location:
    "I'm currently based in Boston, Massachusetts, where I'm pursuing my Master's degree at Northeastern University. It's been a great experience living and studying here!",

  contact:
    "You can reach me at siddaharthsuman@gmail.com or connect with me on LinkedIn at linkedin.com/in/siddaharthsuman. I'm always open to discussing new opportunities or interesting projects!",
};

function getPatternResponse(message: string): string | null {
  const input = message.toLowerCase();

  // Greeting patterns
  if (input.match(/^(hi|hello|hey|greetings)/)) {
    return PATTERN_RESPONSES.greeting;
  }

  // Experience patterns
  if (
    input.includes('experience') ||
    input.includes('work') ||
    input.includes('job') ||
    input.includes('career')
  ) {
    return PATTERN_RESPONSES.experience;
  }

  // Skills patterns
  if (
    input.includes('skill') ||
    input.includes('technology') ||
    input.includes('tech') ||
    input.includes('programming')
  ) {
    return PATTERN_RESPONSES.skills;
  }

  // Education patterns
  if (
    input.includes('education') ||
    input.includes('degree') ||
    input.includes('university') ||
    input.includes('study')
  ) {
    return PATTERN_RESPONSES.education;
  }

  // Leadership patterns
  if (
    input.includes('lead') ||
    input.includes('manage') ||
    input.includes('mentor') ||
    input.includes('team')
  ) {
    return PATTERN_RESPONSES.leadership;
  }

  // Location patterns
  if (
    input.includes('location') ||
    input.includes('where') ||
    input.includes('based') ||
    input.includes('live')
  ) {
    return PATTERN_RESPONSES.location;
  }

  // Contact patterns
  if (
    input.includes('contact') ||
    input.includes('email') ||
    input.includes('reach') ||
    input.includes('linkedin')
  ) {
    return PATTERN_RESPONSES.contact;
  }

  return null; // No pattern match, use AI
}

async function checkRateLimit(
  identifier: string
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  try {
    const key = `chat_rate:${identifier}`;

    // Use Redis pipeline to check and increment atomically
    const pipeline = redis.pipeline();
    pipeline.incr(key);
    pipeline.ttl(key);

    const results = await pipeline.exec();
    const newCount = results[0] as number;
    const currentTtl = results[1] as number;

    // Set TTL only on first request (when TTL is -1, meaning no expiry set)
    if (currentTtl === -1) {
      await redis.expire(key, 3600); // 1 hour
    }

    const maxRequests = 10;
    const remaining = Math.max(0, maxRequests - newCount);
    const allowed = newCount <= maxRequests;

    // Calculate reset time (current time + TTL in seconds)
    const resetTime = currentTtl > 0 ? Date.now() + currentTtl * 1000 : Date.now() + 3600000;

    console.log(
      `Rate limit check for ${identifier}: ${newCount}/${maxRequests}, remaining: ${remaining}, TTL: ${currentTtl}s`
    );

    return { allowed, remaining, resetTime };
  } catch (error) {
    console.error('Rate limiting error:', error);
    // If Redis fails, allow the request
    return { allowed: true, remaining: 10, resetTime: Date.now() + 3600000 };
  }
}

interface ChatRequest {
  message: string;
}

interface ChatResponse {
  remaining: number;
  resetTime: number;
  response: string;
  source: 'pattern' | 'ai';
}

interface ErrorResponse {
  error: string;
  resetTime?: number;
  type?: 'rate_limit' | 'service_error' | 'validation_error';
}

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body: ChatRequest = await request.json();
    const { message } = body;

    // Input validation
    if (!message || typeof message !== 'string') {
      return Response.json(
        {
          error: 'Message is required and must be a string',
          type: 'validation_error',
        } as ErrorResponse,
        { status: 400 }
      );
    }

    if (message.length > 500) {
      return Response.json(
        {
          error: 'Message too long. Please keep it under 500 characters.',
          type: 'validation_error',
        } as ErrorResponse,
        { status: 400 }
      );
    }

    if (message.length < 2) {
      return Response.json(
        {
          error: 'Please ask a more specific question.',
          type: 'validation_error',
        } as ErrorResponse,
        { status: 400 }
      );
    }

    // Get client identifier for rate limiting - robust IP extraction
    const getClientIP = (request: NextRequest): string => {
      // Try multiple headers in order of preference
      const xForwardedFor = request.headers.get('x-forwarded-for');
      const xRealIP = request.headers.get('x-real-ip');
      const cfConnectingIP = request.headers.get('cf-connecting-ip'); // Cloudflare
      const xClientIP = request.headers.get('x-client-ip');
      const xClusterClientIP = request.headers.get('x-cluster-client-ip');
      const forwardedFor = request.headers.get('forwarded-for');
      const forwarded = request.headers.get('forwarded');

      // Check if we're in development
      const isDevelopment = process.env.NODE_ENV === 'development';

      // Parse x-forwarded-for (most common)
      if (xForwardedFor) {
        const ips = xForwardedFor.split(',').map((ip) => ip.trim());

        if (isDevelopment) {
          // In development, allow localhost addresses
          return ips[0] || 'localhost';
        } else {
          // In production, filter out private/localhost IPs
          const validIP = ips.find(
            (ip) =>
              ip &&
              !ip.startsWith('127.') &&
              !ip.startsWith('::1') &&
              !ip.startsWith('10.') &&
              !ip.startsWith('192.168.') &&
              !ip.startsWith('172.16.')
          );
          if (validIP) return validIP;
        }
      }

      // Try other headers
      if (xRealIP) {
        if (isDevelopment || (!xRealIP.startsWith('127.') && !xRealIP.startsWith('::1'))) {
          return xRealIP;
        }
      }
      if (cfConnectingIP) return cfConnectingIP;
      if (xClientIP) return xClientIP;
      if (xClusterClientIP) return xClusterClientIP;
      if (forwardedFor) return forwardedFor.split(',')[0].trim();

      // Parse forwarded header (RFC 7239)
      if (forwarded) {
        const match = forwarded.match(/for=([^;,\s]+)/);
        if (match) return match[1].replace(/"/g, '');
      }

      // Fallback based on environment
      return isDevelopment ? 'localhost' : 'anonymous';
    };

    const clientIP = getClientIP(request);

    // Debug logging (remove in production)
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Request headers:', {
      'x-forwarded-for': request.headers.get('x-forwarded-for'),
      'x-real-ip': request.headers.get('x-real-ip'),
      'cf-connecting-ip': request.headers.get('cf-connecting-ip'),
    });
    console.log('Detected client IP:', clientIP);

    // Try pattern matching first (free and fast)
    const patternResponse = getPatternResponse(message);
    if (patternResponse) {
      return Response.json({
        response: patternResponse,
        source: 'pattern',
      } as ChatResponse);
    }

    // Check rate limit
    const rateLimitResult = await checkRateLimit(clientIP);
    if (!rateLimitResult.allowed) {
      const resetDate = new Date(rateLimitResult.resetTime);
      const resetTimeString = resetDate.toLocaleTimeString();

      return Response.json(
        {
          error: `Rate limit exceeded. You can ask more questions after ${resetTimeString}.`,
          type: 'rate_limit',
          resetTime: rateLimitResult.resetTime,
        } as ErrorResponse,
        { status: 429 }
      );
    }

    // Use Gemini for complex questions
    if (!process.env.GEMINI_API_KEY) {
      return Response.json(
        {
          error:
            'AI service temporarily unavailable. Try asking about my experience, skills, or education.',
          type: 'service_error',
        } as ErrorResponse,
        { status: 503 }
      );
    }

    const prompt = `You are Siddaharth Suman responding directly to someone visiting your portfolio website. Answer as if you are speaking in first person about your own professional background based on this information:

${RESUME_DATA}

Guidelines:
- Respond as Siddaharth himself, not as an assistant
- Use "I", "my", "me" when referring to yourself
- Keep responses conversational and personable
- Focus on your professional experience and skills
- If asked about something not in your background, politely redirect to what you can share
- Keep responses under 100 words
- Be enthusiastic about your accomplishments but humble
- Add personal touches to make it feel authentic

User question: ${message}`;

    const result = await genAI.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
    });

    const response = result.text;

    return Response.json({
      response: response,
      source: 'ai',
      remaining: rateLimitResult.remaining,
      resetTime: rateLimitResult.resetTime,
    } as ChatResponse);
  } catch (error) {
    console.error('Chat API error:', error);

    // Provide helpful fallback response as Siddaharth
    return Response.json(
      {
        error:
          "Sorry, I'm having some technical difficulties right now. Try asking me about my experience, skills, education, or how to contact me!",
        type: 'service_error',
      } as ErrorResponse,
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(): Promise<Response> {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
