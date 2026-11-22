import { NextRequest } from 'next/server';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// In-memory sliding window cache per action & IP
const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up expired entries every 5 minutes to avoid memory leaks
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (now > record.resetTime) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp.trim();
  return '127.0.0.1';
}

export interface RateLimitOptions {
  limit: number;       // Maximum requests allowed in the window
  windowMs: number;    // Window duration in milliseconds
  actionName: string;  // Unique identifier for the action (e.g. 'register', 'update')
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
  error?: string;
}

/**
 * Checks and increments the rate limit for a client IP and specific action.
 */
export function checkRateLimit(
  request: NextRequest,
  options: RateLimitOptions
): RateLimitResult {
  const ip = getClientIp(request);
  const key = `${options.actionName}:${ip}`;
  const now = Date.now();

  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    // New window
    const resetTime = now + options.windowMs;
    rateLimitStore.set(key, { count: 1, resetTime });
    return {
      success: true,
      limit: options.limit,
      remaining: options.limit - 1,
      resetSeconds: Math.ceil(options.windowMs / 1000),
    };
  }

  // Window still active
  if (record.count >= options.limit) {
    const resetSeconds = Math.ceil((record.resetTime - now) / 1000);
    return {
      success: false,
      limit: options.limit,
      remaining: 0,
      resetSeconds,
      error: `Muitas tentativas. Por favor, aguarde ${resetSeconds} segundos antes de tentar novamente.`,
    };
  }

  // Increment within window
  record.count += 1;
  const remaining = Math.max(0, options.limit - record.count);
  const resetSeconds = Math.ceil((record.resetTime - now) / 1000);

  return {
    success: true,
    limit: options.limit,
    remaining,
    resetSeconds,
  };
}

/**
 * Helper to build rate limit headers
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    'X-RateLimit-Limit': String(result.limit),
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(result.resetSeconds),
  };

  if (!result.success) {
    headers['Retry-After'] = String(result.resetSeconds);
  }

  return headers;
}
