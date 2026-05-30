const buckets = new Map<string, { count: number; reset: number }>();
const WINDOW_MS = 60_000;
const MAX = 10;

export function rateLimitLead(ip: string): boolean {
  const now = Date.now();
  const b = buckets.get(ip);
  if (!b || now > b.reset) {
    buckets.set(ip, { count: 1, reset: now + WINDOW_MS });
    return true;
  }
  if (b.count >= MAX) return false;
  b.count += 1;
  return true;
}
