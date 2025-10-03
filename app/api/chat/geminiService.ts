// app/api/chat/geminiService.ts
import { GoogleGenAI } from '@google/genai';

import { GENERATION_CONFIG, STREAMING_CONFIG, SYSTEM_INSTRUCTION } from './constants';
import { RateLimitResult, StreamData } from './types';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export function isGeminiAvailable(): boolean {
  return !!process.env.GEMINI_API_KEY;
}

export async function generateStreamingResponse(
  message: string,
  rateLimitResult: RateLimitResult
): Promise<ReadableStream> {
  const result = await genAI.models.generateContentStream({
    contents: [
      {
        parts: [{ text: `${SYSTEM_INSTRUCTION}\n\nUser: ${message}` }],
        role: 'user',
      },
    ],
    model: 'gemini-flash-latest',
    ...GENERATION_CONFIG,
  });

  const encoder = new TextEncoder();

  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of result) {
          const chunkText = chunk.text;
          if (chunkText) {
            // Send chunks word by word for smoother animation
            const words = chunkText.split(' ');
            for (const word of words) {
              const data: StreamData = {
                remaining: rateLimitResult.remaining,
                resetTime: rateLimitResult.resetTime,
                source: 'ai',
                text: word + ' ',
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
          remaining: rateLimitResult.remaining,
          source: 'ai',
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
    contents: [
      {
        parts: [{ text: `${SYSTEM_INSTRUCTION}\n\nUser: ${message}` }],
        role: 'user',
      },
    ],
    model: 'gemini-flash-latest',
    ...GENERATION_CONFIG,
  });

  return result.text || '';
}
