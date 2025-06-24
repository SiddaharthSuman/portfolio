// app/api/chat/responseHandlers.ts
import { ChatResponse, ErrorResponse, RateLimitResult } from './types';
import { generateStreamingResponse, generateRegularResponse } from './geminiService';

export function createRateLimitErrorResponse(rateLimitResult: RateLimitResult): Response {
  const resetDate = new Date(rateLimitResult.resetTime);
  const resetTimeString = resetDate.toLocaleTimeString();

  const errorResponse: ErrorResponse = {
    error: `Rate limit exceeded (${rateLimitResult.remaining}/10 questions used). You can ask more questions after ${resetTimeString}.`,
    type: 'rate_limit',
    resetTime: rateLimitResult.resetTime,
  };

  return Response.json(errorResponse, { status: 429 });
}

export function createServiceUnavailableResponse(): Response {
  const errorResponse: ErrorResponse = {
    error: 'AI service temporarily unavailable. Please try again later.',
    type: 'service_error',
  };

  return Response.json(errorResponse, { status: 503 });
}

export function createValidationErrorResponse(errorResponse: ErrorResponse): Response {
  return Response.json(errorResponse, { status: 400 });
}

export async function createStreamingResponse(
  message: string,
  rateLimitResult: RateLimitResult
): Promise<Response> {
  const readableStream = await generateStreamingResponse(message, rateLimitResult);

  return new Response(readableStream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}

export async function createRegularResponse(
  message: string,
  rateLimitResult: RateLimitResult
): Promise<Response> {
  const response = await generateRegularResponse(message);

  const chatResponse: ChatResponse = {
    response: response,
    source: 'ai',
    remaining: rateLimitResult.remaining,
    resetTime: rateLimitResult.resetTime,
    shouldAnimate: true,
  };

  return Response.json(chatResponse);
}

export function createGenericErrorResponse(): Response {
  const errorResponse: ErrorResponse = {
    error: "I'm having some technical difficulties right now. Please try asking again in a moment!",
    type: 'service_error',
  };

  return Response.json(errorResponse, { status: 500 });
}
