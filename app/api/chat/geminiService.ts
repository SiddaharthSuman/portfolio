// app/api/chat/geminiService.ts
import { GoogleGenAI } from '@google/genai';

import { SYSTEM_INSTRUCTION, GENERATION_CONFIG, STREAMING_CONFIG } from './constants';
import { RateLimitResult, StreamData } from './types';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export function isGeminiAvailable(): boolean {
  return !!process.env.GEMINI_API_KEY;
}

export async function generateStreamingResponse(
  message: string,
  rateLimitResult: RateLimitResult
): Promise<ReadableStream> {
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
      ...GENERATION_CONFIG,
    },
  });

  const encoder = new TextEncoder();

  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const chunkText = chunk.text;
          if (chunkText) {
            // Send chunks word by word for smoother animation
            const words = chunkText.split(' ');
            for (const word of words) {
              const data: StreamData = {
                text: word + ' ',
                source: 'ai',
                remaining: rateLimitResult.remaining,
                resetTime: rateLimitResult.resetTime,
              };

              controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));

              // Small delay between words for smoother animation
              await new Promise((resolve) => setTimeout(resolve, STREAMING_CONFIG.wordDelayMs));
            }
          }
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      } catch (error) {
        console.error('Streaming error:', error);
        // Send error through stream
        const errorData: StreamData = {
          error: "I'm having some technical difficulties. Please try asking again!",
          source: 'ai',
          remaining: rateLimitResult.remaining,
        };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(errorData)}\n\n`));
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      }
    },
  });

  return readableStream;
}

export async function generateRegularResponse(message: string): Promise<string> {
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
      ...GENERATION_CONFIG,
    },
  });

  return result.text || 'Sorry, I was unable to generate a response. Please try again.';
}
