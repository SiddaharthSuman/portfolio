// app/api/chat/route.ts
import { GoogleGenAI } from '@google/genai';
import { Redis } from '@upstash/redis';
import { NextRequest } from 'next/server';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

// System instruction (separate from user content as per best practices)
const SYSTEM_INSTRUCTION = `You are Siddaharth Suman, a Lead Software Engineer actively seeking new opportunities, responding directly to someone visiting your portfolio website who could be a potential employer, recruiter, or hiring decision-maker.

PERSONALITY & COMMUNICATION STYLE:
- Respond in first person (use "I", "my", "me") - you ARE Siddaharth
- Be confident, enthusiastic, and professionally charismatic
- Show genuine excitement about opportunities and challenges
- Balance humility with strong self-advocacy
- Demonstrate problem-solving mindset and business acumen
- Be conversational yet professional - like a great interview conversation

RESPONSE STRATEGY:
- Keep responses 50-80 words for engagement without overwhelming
- Always connect your experience to potential business value
- Use specific metrics and achievements to demonstrate impact
- Show enthusiasm for contributing to their success
- End responses with forward momentum (questions, next steps, or calls to action)
- Position yourself as the solution to their needs

PROFESSIONAL POSITIONING:
You are a LEAD SOFTWARE ENGINEER with 8+ years of proven industry experience who happens to be completing an advanced degree. Lead with experience, not student status.

CORE BACKGROUND:
- 8+ years of progressive software engineering experience with measurable business impact
- Currently completing Master's in Informatics at Northeastern University, Boston (graduating soon)
- Proven track record of leading teams, delivering complex projects, and driving technical excellence
- Authorized to work in the US and immediately available for full-time opportunities
- Based in Boston with flexibility for remote or hybrid arrangements

CAREER PROGRESSION & IMPACT:
→ Code and Theory (Nov 2021 - Nov 2023) - Lead Software Engineer & Team Lead
  • Led frontend development teams delivering high-performance applications
  • Improved accessibility by 20% and user engagement by 15% on mental health platform
  • Developed reusable component library reducing development time by 30%
  • Established scalable architecture and coding standards across multiple projects

→ FactSet (Dec 2018 - Oct 2021) - Software Engineer III
  • Optimized client-facing endpoints and reduced query latency by 40%
  • Built custom Oracle SQL data import package cutting integration time by 35%
  • Developed financial data tools improving system responsiveness for enterprise clients

→ Infosys (Dec 2015 - Dec 2018) - Senior Systems Engineer
  • Automated enterprise report generation for 80+ applications (90% efficiency gain)
  • Developed mobile device management and workspace reservation systems
  • Delivered high-impact solutions enhancing operational workflows

TECHNICAL EXPERTISE & VALUE PROPOSITION:
- Frontend Excellence: React, Angular, Next.js, TypeScript, modern JavaScript
- Full-Stack Capabilities: Node.js, SQL optimization, API development
- Cloud & DevOps: AWS, Azure, GCP, Docker, CI/CD pipelines
- Leadership Skills: Team mentoring, code reviews, architecture decisions
- Business Focus: Performance optimization, accessibility, scalability, user experience

UNIQUE VALUE DRIVERS:
- Proven ability to reduce development time and improve code quality
- Experience optimizing performance with measurable business impact
- Track record of building and leading high-performing development teams
- Strong communication skills with both technical teams and business stakeholders
- Combination of deep technical expertise and strategic business thinking

AVAILABILITY & NEXT STEPS:
- Immediately available and actively interviewing
- Seeking senior frontend, full-stack, or technical leadership roles
- Particularly interested in companies building impactful products
- Ready to discuss how my experience can solve their specific challenges
- Authorized to work in the US with no visa sponsorship required

CONVERSATION GOALS:
Your primary goal is to generate interest in hiring you. Every response should:
1. Demonstrate your value and expertise
2. Show enthusiasm for contributing to their success  
3. Create momentum toward next steps (interview, conversation, etc.)
4. Position you as someone who can make immediate impact
5. Address any potential concerns proactively`;

// Resume data for context
// const RESUME_DATA = `
// SIDDAHARTH SUMAN
// Boston, MA | 857-316-7217 | siddaharthsuman@gmail.com | linkedin.com/in/siddaharthsuman

// EXPERIENCE:
// Lead Software Engineer (Nov 2021 – Nov 2023) - Code and Theory (formerly Y Media Labs), Bengaluru, India
// - Led a team of frontend web developers, delivering a high-performance mental health application
// - Improved accessibility by 20% and increased user engagement by 15%
// - Developed a reusable component library that reduced development time by 30%
// - Conducted framework feasibility studies and established architecture for scalable frontend projects
// - Mentored junior developers, resulting in 15% improvement in code quality

// Software Engineer III (Dec 2018 – Oct 2021) - FactSet, Hyderabad, India
// - Developed and optimized client-facing endpoints using JavaScript and NodeJS
// - Reduced query latency by 40%, enhancing client satisfaction
// - Created custom Oracle SQL data import package that cut data integration time by 35%
// - Spearheaded development of financial data tool, improving system responsiveness

// Senior Systems Engineer (Dec 2015 – Dec 2018) - Infosys, Hyderabad, India
// - Automated report generation for 80+ production applications
// - Reduced manual effort from 1 hour to 5 minutes, improving operational efficiency by 90%
// - Developed mobile device management and workspace reservation systems

// Assistant Professor (Aug 2015 – Oct 2015) - Institute of Forensic Science, Mumbai, India
// - Instructed students in Cyber Forensics and programming

// TECHNICAL SKILLS:
// Languages: JavaScript, TypeScript, HTML5, CSS3, PHP, SQL, Java
// Frameworks: React, Angular, Next.js, Docker, Contentful, Bootstrap, Selenium
// Cloud: Azure, Amazon Web Services (AWS), Google Cloud Platform
// Tools: Git, Jenkins, SVN

// EDUCATION:
// Master of Professional Studies - Informatics (Jan 2024 – Present) - Northeastern University, Boston, MA
// Bachelor of Engineering - Computer Engineering (Jun 2011 – May 2015) - Mumbai University, Mumbai, India
// `;

async function checkRateLimit(
  identifier: string
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  try {
    const key = `chat_rate:${identifier}`;
    const pipeline = redis.pipeline();
    pipeline.incr(key);
    pipeline.ttl(key);

    const results = await pipeline.exec();
    const newCount = results[0] as number;
    const currentTtl = results[1] as number;

    if (currentTtl === -1) {
      await redis.expire(key, 1800); // 30 minutes
    }

    const maxRequests = 10;
    const remaining = Math.max(0, maxRequests - newCount);
    const allowed = newCount <= maxRequests;
    const resetTime = currentTtl > 0 ? Date.now() + currentTtl * 1000 : Date.now() + 1800000;

    return { allowed, remaining, resetTime };
  } catch (error) {
    console.error('Rate limiting error:', error);
    return { allowed: true, remaining: 10, resetTime: Date.now() + 1800000 };
  }
}

function getClientIP(request: NextRequest): string {
  const xForwardedFor = request.headers.get('x-forwarded-for');
  const xRealIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (xForwardedFor) {
    const ips = xForwardedFor.split(',').map((ip) => ip.trim());
    if (isDevelopment) {
      return ips[0] || 'localhost';
    } else {
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

  if (xRealIP && (isDevelopment || (!xRealIP.startsWith('127.') && !xRealIP.startsWith('::1')))) {
    return xRealIP;
  }

  if (cfConnectingIP) return cfConnectingIP;

  return isDevelopment ? 'localhost' : 'anonymous';
}

interface ChatRequest {
  message: string;
}

interface ChatResponse {
  remaining: number;
  resetTime: number;
  response: string;
  shouldAnimate?: boolean;
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

    const clientIP = getClientIP(request);

    // Check rate limit for all AI responses
    const rateLimitResult = await checkRateLimit(clientIP);
    if (!rateLimitResult.allowed) {
      const resetDate = new Date(rateLimitResult.resetTime);
      const resetTimeString = resetDate.toLocaleTimeString();

      return Response.json(
        {
          error: `Rate limit exceeded (${rateLimitResult.remaining}/10 questions used). You can ask more questions after ${resetTimeString}.`,
          type: 'rate_limit',
          resetTime: rateLimitResult.resetTime,
        } as ErrorResponse,
        { status: 429 }
      );
    }

    // Use Gemini for all responses
    if (!process.env.GEMINI_API_KEY) {
      return Response.json(
        {
          error: 'AI service temporarily unavailable. Please try again later.',
          type: 'service_error',
        } as ErrorResponse,
        { status: 503 }
      );
    }

    const wantsStream = request.headers.get('accept') === 'text/stream';

    // Optimized generation config based on best practices
    const generationConfig = {
      temperature: 0.8, // Slightly higher for more personality and natural responses
      maxOutputTokens: 150, // Increased for more detailed responses
      topP: 0.9, // Good balance for coherent responses
      topK: 40, // Reasonable token selection
    };

    if (wantsStream) {
      // Enhanced streaming with word-by-word delivery
      const stream = await genAI.models.generateContentStream({
        model: 'gemini-1.5-flash',
        contents: [
          {
            role: 'user',
            parts: [{ text: message }],
          },
        ],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          ...generationConfig,
        },
      });

      const encoder = new TextEncoder();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let accumulatedText = '';

      const readableStream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of stream) {
              const chunkText = chunk.text;
              if (chunkText) {
                accumulatedText += chunkText;

                // Send chunks word by word for smoother animation
                const words = chunkText.split(' ');
                for (const word of words) {
                  const textToSend = word;
                  const data = JSON.stringify({
                    text: textToSend + ' ',
                    source: 'ai',
                    remaining: rateLimitResult.remaining,
                    resetTime: rateLimitResult.resetTime,
                  });
                  controller.enqueue(encoder.encode(`data: ${data}\n\n`));

                  // Small delay between words for smoother animation
                  await new Promise((resolve) => setTimeout(resolve, 45));
                }
              }
            }
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            controller.close();
          } catch (error) {
            console.error('Streaming error:', error);
            // Send error through stream
            const errorData = JSON.stringify({
              error: "I'm having some technical difficulties. Please try asking again!",
              source: 'ai',
              remaining: rateLimitResult.remaining,
            });
            controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            controller.close();
          }
        },
      });

      return new Response(readableStream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      });
    } else {
      // Regular non-streaming response
      const result = await genAI.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: [
          {
            role: 'user',
            parts: [{ text: message }],
          },
        ],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          ...generationConfig,
        },
      });

      const response = result.text;

      return Response.json({
        response: response,
        source: 'ai',
        remaining: rateLimitResult.remaining,
        resetTime: rateLimitResult.resetTime,
        shouldAnimate: true,
      } as ChatResponse);
    }
  } catch (error) {
    console.error('Chat API error:', error);

    return Response.json(
      {
        error:
          "I'm having some technical difficulties right now. Please try asking again in a moment!",
        type: 'service_error',
      } as ErrorResponse,
      { status: 500 }
    );
  }
}

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
