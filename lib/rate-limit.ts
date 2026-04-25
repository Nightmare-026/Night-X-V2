import { NextRequest, NextResponse } from 'next/server';

interface RateLimitConfig {
  limit: number;
  windowMs: number;
}

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

/**
 * Basic in-memory rate limiter for Next.js API routes.
 * Note: This will reset on serverless function cold starts.
 */
export function rateLimit(request: NextRequest, config: RateLimitConfig) {
  const ip = request.headers.get('x-forwarded-for') || 'anonymous';
  const now = Date.now();
  
  let record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    record = {
      count: 1,
      resetTime: now + config.windowMs,
    };
    rateLimitMap.set(ip, record);
    return { success: true, remaining: config.limit - 1 };
  }
  
  if (record.count >= config.limit) {
    return { 
      success: false, 
      remaining: 0,
      retryAfter: Math.ceil((record.resetTime - now) / 1000) 
    };
  }
  
  record.count += 1;
  return { success: true, remaining: config.limit - record.count };
}

/**
 * Cleanup function to prevent memory leaks.
 */
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000); // Every 5 minutes
