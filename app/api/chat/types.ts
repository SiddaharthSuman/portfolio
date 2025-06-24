// app/api/chat/types.ts
export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  remaining: number;
  resetTime: number;
  response: string;
  shouldAnimate?: boolean;
  source: 'ai';
}

export interface ErrorResponse {
  error: string;
  resetTime?: number;
  type?: 'rate_limit' | 'service_error' | 'validation_error';
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

export interface StreamData {
  error?: string;
  remaining?: number;
  resetTime?: number;
  source?: 'ai';
  text?: string;
}
