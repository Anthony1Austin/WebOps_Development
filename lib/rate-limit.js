import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

function createContactLimiter() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const redis = new Redis({ url, token });
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '15 m'),
    prefix: 'contact-form',
    analytics: false,
  });
}

export const contactLimiter = createContactLimiter();

export async function rateLimitContact(ip) {
  if (!contactLimiter) {
    return { success: true, remaining: null, reset: 0 };
  }
  return contactLimiter.limit(ip);
}
