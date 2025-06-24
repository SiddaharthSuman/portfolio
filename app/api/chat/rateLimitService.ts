// app/api/chat/rateLimitService.ts
import { Redis } from '@upstash/redis';

import { RateLimitResult } from './types';
import { RATE_LIMIT_CONFIG } from './constants';

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

export async function checkRateLimit(identifier: string): Promise<RateLimitResult> {
  try {
    const key = `chat_rate:${identifier}`;
    const pipeline = redis.pipeline();
    pipeline.incr(key);
    pipeline.ttl(key);

    const results = await pipeline.exec();
    const newCount = results[0] as number;
    const currentTtl = results[1] as number;

    if (currentTtl === -1) {
      await redis.expire(key, RATE_LIMIT_CONFIG.windowMs / 1000); // Convert to seconds
    }

    const remaining = Math.max(0, RATE_LIMIT_CONFIG.maxRequests - newCount);
    const allowed = newCount <= RATE_LIMIT_CONFIG.maxRequests;
    const resetTime =
      currentTtl > 0 ? Date.now() + currentTtl * 1000 : Date.now() + RATE_LIMIT_CONFIG.windowMs;

    return { allowed, remaining, resetTime };
  } catch (error) {
    console.error('Rate limiting error:', error);
    // Fail open - allow the request if rate limiting fails
    return {
      allowed: true,
      remaining: RATE_LIMIT_CONFIG.maxRequests,
      resetTime: Date.now() + RATE_LIMIT_CONFIG.windowMs,
    };
  }
}
