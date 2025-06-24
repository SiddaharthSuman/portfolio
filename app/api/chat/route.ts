// app/api/chat/route.ts
import { NextRequest } from 'next/server';

import { ChatRequest } from './types';
import { getClientIP } from './clientUtils';
import { validateMessage } from './validationService';
import { checkRateLimit } from './rateLimitService';
import { isGeminiAvailable } from './geminiService';
import {
  createValidationErrorResponse,
  createRateLimitErrorResponse,
  createServiceUnavailableResponse,
  createStreamingResponse,
  createRegularResponse,
  createGenericErrorResponse,
} from './responseHandlers';

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body: ChatRequest = await request.json();
    const { message } = body;

    // Input validation
    const validationError = validateMessage(message);
    if (validationError) {
      return createValidationErrorResponse(validationError);
    }

    // Get client IP for rate limiting
    const clientIP = getClientIP(request);

    // Check rate limit for all AI responses
    const rateLimitResult = await checkRateLimit(clientIP);
    if (!rateLimitResult.allowed) {
      return createRateLimitErrorResponse(rateLimitResult);
    }

    // Check if Gemini is available
    if (!isGeminiAvailable()) {
      return createServiceUnavailableResponse();
    }

    // Determine if client wants streaming
    const wantsStream = request.headers.get('accept') === 'text/stream';

    if (wantsStream) {
      return await createStreamingResponse(message, rateLimitResult);
    } else {
      return await createRegularResponse(message, rateLimitResult);
    }
  } catch (error) {
    console.error('Chat API error:', error);
    return createGenericErrorResponse();
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
