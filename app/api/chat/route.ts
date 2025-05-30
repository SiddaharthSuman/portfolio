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
const SYSTEM_INSTRUCTION = `You are Siddaharth Suman, a Senior Software Engineer and graduate student, responding directly to someone visiting your portfolio website.

PERSONALITY & TONE:
- Respond in first person (use "I", "my", "me")
- Be conversational, enthusiastic, and personable
- Show confidence in your abilities while remaining humble
- Be genuinely excited about your work and experiences
- Add personal touches to make responses feel authentic

RESPONSE GUIDELINES:
- Keep responses under 150 words for better readability
- Focus on your actual professional experience and skills
- If asked about something not in your background, politely redirect to what you can share
- Be specific about achievements and technologies when relevant
- Show personality - you're not just listing facts, you're having a conversation

YOUR BACKGROUND SUMMARY:
- Currently pursuing Master's in Informatics at Northeastern University, Boston (Jan 2024 - July 2025)
- Senior Software Engineer with 8+ years experience
- Recently at Code and Theory (Nov 2021 - Nov 2023) leading frontend teams
- Previously at FactSet (Dec 2018 - Oct 2021) developing financial tools
- Earlier experience at Infosys (Dec 2015 - Dec 2018) in systems automation
- Brief teaching experience at Institute of Forensic Science (Aug-Oct 2015)

TECHNICAL EXPERTISE:
- Languages: JavaScript, TypeScript, HTML5, CSS3, PHP, SQL, Java
- Frontend: React, Angular, Next.js, responsive design, component libraries
- Backend: Node.js, Oracle SQL, data optimization
- Cloud: AWS, Azure, Google Cloud Platform
- Tools: Docker, Git, Jenkins, Selenium, Bootstrap, Contentful

KEY ACHIEVEMENTS:
- Led frontend teams and improved accessibility by 20%
- Developed reusable component library reducing dev time by 30%
- Reduced query latency by 40% at FactSet
- Automated report generation saving 90% manual effort
- Mentored developers with 15% code quality improvement

CURRENT FOCUS:
- Completing Master's degree in Boston
- Available for opportunities starting 2025
- Interested in senior frontend/full-stack roles
- Open to discussing exciting projects and opportunities`;

// Resume data for context
// const RESUME_DATA = `
// SIDDAHARTH SUMAN
// Boston, MA | 857-316-7217 | siddaharthsuman@gmail.com | linkedin.com/in/siddaharthsuman

// EXPERIENCE:
// Senior Software Engineer (Nov 2021 – Nov 2023) - Code and Theory (formerly Y Media Labs), Bengaluru, India
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
// Master of Professional Studies - Informatics (Jan 2024 – July 2025) - Northeastern University, Boston, MA
// Bachelor of Engineering - Computer Engineering (Jun 2011 – May 2015) - Mumbai University, Mumbai, India
// `;

// Pattern matching responses - optimized and speaking as Siddaharth
const PATTERN_RESPONSES: Record<string, string> = {
  greeting:
    "Hi there! I'm Siddaharth Suman, and thanks for visiting my portfolio! I'm currently finishing my Master's at Northeastern here in Boston. I'd love to tell you about my experience in frontend development, team leadership, or my journey from India to Boston. What interests you most?",

  experience:
    "I've been coding professionally for over 8 years! Most recently, I led frontend teams at Code and Theory where we built a mental health app that improved accessibility by 20%. Before that, I was at FactSet optimizing financial data tools - managed to cut query times by 40%! I also spent time at Infosys automating enterprise systems. It's been quite a journey from systems engineering to leading frontend teams!",

  skills:
    "My sweet spot is modern JavaScript and React - I've built component libraries that cut development time by 30%! I'm fluent in TypeScript, Angular, Next.js, and I love working with cloud platforms like AWS and Azure. I also have a strong backend foundation with Node.js and SQL. Recently, I've been diving deeper into advanced React patterns and accessibility best practices.",

  education:
    "I'm currently wrapping up my Master's in Informatics at Northeastern University here in Boston - it's been an amazing experience! Before this, I did my Bachelor's in Computer Engineering back in Mumbai. The transition from India to Boston has been incredible, and I'm loving the tech scene here.",

  leadership:
    "Leading teams has been one of my favorite parts of my career! At Code and Theory, I mentored junior developers and saw a 15% improvement in code quality across the team. I really enjoy conducting architecture reviews, establishing coding standards, and helping others grow. There's something special about seeing a team member's 'aha' moment when they grasp a new concept!",

  location:
    "I'm based in Boston now, studying at Northeastern University! Originally from India, but Boston has become my second home. The tech community here is fantastic, and I love how walkable the city is. Plus, having seasons again after years in India has been refreshing!",

  contact:
    "I'd love to connect! You can reach me at siddaharthsuman@gmail.com or find me on LinkedIn at linkedin.com/in/siddaharthsuman. I'm always excited to discuss new opportunities, especially for roles starting in 2025 when I complete my Master's. Feel free to reach out!",

  projects:
    "I've worked on some exciting projects! The mental health application at Code and Theory was particularly rewarding - we focused heavily on accessibility and user engagement. At FactSet, I built financial data tools that processed complex queries efficiently. I also love creating reusable component libraries that make other developers' lives easier. Each project taught me something new!",

  future:
    "I'm graduating in 2025 and looking for my next challenge! I'm particularly interested in senior frontend or full-stack roles where I can lead teams and work on impactful products. I'd love to find a company that values both technical excellence and user experience. Boston has some amazing tech companies, so I'm excited to see what opportunities come up!",
};

function getPatternResponse(message: string): string | null {
  const input = message.toLowerCase();

  // Enhanced pattern matching with better keyword detection
  if (input.match(/^(hi|hello|hey|greetings|howdy)/)) {
    return PATTERN_RESPONSES.greeting;
  }

  if (
    input.includes('experience') ||
    input.includes('work') ||
    input.includes('job') ||
    input.includes('career') ||
    input.includes('background')
  ) {
    return PATTERN_RESPONSES.experience;
  }

  if (
    input.includes('skill') ||
    input.includes('technology') ||
    input.includes('tech') ||
    input.includes('programming') ||
    input.includes('languages') ||
    input.includes('framework')
  ) {
    return PATTERN_RESPONSES.skills;
  }

  if (
    input.includes('education') ||
    input.includes('degree') ||
    input.includes('university') ||
    input.includes('study') ||
    input.includes('school') ||
    input.includes('northeastern')
  ) {
    return PATTERN_RESPONSES.education;
  }

  if (
    input.includes('lead') ||
    input.includes('manage') ||
    input.includes('mentor') ||
    input.includes('team') ||
    input.includes('leadership')
  ) {
    return PATTERN_RESPONSES.leadership;
  }

  if (
    input.includes('location') ||
    input.includes('where') ||
    input.includes('based') ||
    input.includes('live') ||
    input.includes('boston')
  ) {
    return PATTERN_RESPONSES.location;
  }

  if (
    input.includes('contact') ||
    input.includes('email') ||
    input.includes('reach') ||
    input.includes('linkedin') ||
    input.includes('connect')
  ) {
    return PATTERN_RESPONSES.contact;
  }

  if (
    input.includes('project') ||
    input.includes('portfolio') ||
    input.includes('work on') ||
    input.includes('built')
  ) {
    return PATTERN_RESPONSES.projects;
  }

  if (
    input.includes('future') ||
    input.includes('next') ||
    input.includes('looking for') ||
    input.includes('opportunities') ||
    input.includes('hiring') ||
    input.includes('available')
  ) {
    return PATTERN_RESPONSES.future;
  }

  return null;
}

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

// Helper function to stream text word by word for smoother animation
function createWordByWordStream(text: string, delayMs: number = 50): ReadableStream<string> {
  const words = text.split(' ');
  let currentIndex = 0;

  return new ReadableStream({
    start(controller) {
      const sendWord = () => {
        if (currentIndex >= words.length) {
          controller.close();
          return;
        }

        const word = words[currentIndex];
        const textToSend = currentIndex === 0 ? word : ` ${word}`;
        controller.enqueue(textToSend);
        currentIndex++;

        // Variable delay based on word characteristics
        let delay = delayMs;
        if (word.length > 8) delay += 20; // Longer words
        if (word.includes(',') || word.includes('.')) delay += 80; // Punctuation pauses
        if (word.includes('!') || word.includes('?')) delay += 100; // Emphasis pauses

        setTimeout(sendWord, delay);
      };

      sendWord();
    },
  });
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

    // Try pattern matching first
    const patternResponse = getPatternResponse(message);
    if (patternResponse) {
      // Check if client wants streaming for pattern responses too
      const wantsStream = request.headers.get('accept') === 'text/stream';

      if (wantsStream) {
        // Stream pattern response word by word for consistency
        const encoder = new TextEncoder();
        const wordStream = createWordByWordStream(patternResponse, 60);
        const reader = wordStream.getReader();

        const readableStream = new ReadableStream({
          async start(controller) {
            try {
              while (true) {
                const { done, value } = await reader.read();
                if (done) {
                  controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                  break;
                }

                const data = JSON.stringify({
                  text: value,
                  source: 'pattern',
                });
                controller.enqueue(encoder.encode(`data: ${data}\n\n`));
              }
              controller.close();
            } catch (error) {
              console.error('Pattern streaming error:', error);
              controller.error(error);
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
        // Regular pattern response
        return Response.json({
          response: patternResponse,
          source: 'pattern',
          shouldAnimate: true,
          resetTime: Date.now() + 1800000,
        } as ChatResponse);
      }
    }

    // Check rate limit for AI responses
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

    const wantsStream = request.headers.get('accept') === 'text/stream';

    // Optimized generation config based on best practices
    const generationConfig = {
      temperature: 0.7, // Balanced creativity and consistency
      maxOutputTokens: 250, // Reasonable length for chat responses
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

                // Instead of sending chunk text directly, send it word by word
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
                  await new Promise((resolve) => setTimeout(resolve, 40));
                }
              }
            }
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            controller.close();
          } catch (error) {
            console.error('Streaming error:', error);
            // Send error through stream
            const errorData = JSON.stringify({
              error: 'Sorry, I encountered an issue. Try asking about my experience or skills!',
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
          "Sorry, I'm having some technical difficulties right now. Try asking me about my experience, skills, education, or how to contact me!",
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
