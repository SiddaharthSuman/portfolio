// components/ChatBot/types.ts
export interface Message {
  content: string;
  isError?: boolean;
  isTyping?: boolean;
  source?: 'ai';
  suggestions?: string[];
  timestamp: Date;
  type: 'user' | 'bot' | 'suggestions';
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
