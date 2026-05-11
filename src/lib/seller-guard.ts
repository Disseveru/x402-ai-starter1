import { NextRequest } from "next/server";
import { isIP } from "node:net";
import { env } from "./env";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const CLEANUP_INTERVAL_MS = 60_000;
const RATE_LIMIT_WINDOW_MS = 60_000;

const rateLimitStore = new Map<string, RateLimitEntry>();
let lastCleanupAt = 0;

function cleanupExpiredEntries(now: number) {
  // Run cleanup at most once per minute to keep overhead low.
  if (now - lastCleanupAt < CLEANUP_INTERVAL_MS) {
    return;
  }
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key);
    }
  }
  lastCleanupAt = now;
}

export function validateSellerApiKey(request: NextRequest) {
  if (!env.SELLER_API_KEY) {
    return { ok: true as const };
  }

  const requestApiKey = request.headers.get("x-seller-api-key");
  if (requestApiKey !== env.SELLER_API_KEY) {
    return { ok: false as const, status: 401, error: "Unauthorized" };
  }

  return { ok: true as const };
}

function getRateLimitKey(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const rawIp = forwardedFor?.split(",")[0]?.trim() || "unknown";
  const ip = isIP(rawIp) ? rawIp : "unknown";
  return `${request.nextUrl.pathname}:${ip}`;
}

export function validateRateLimit(request: NextRequest) {
  const now = Date.now();
  cleanupExpiredEntries(now);
  const resetAt = now + RATE_LIMIT_WINDOW_MS;
  const key = getRateLimitKey(request);
  const existing = rateLimitStore.get(key);

  if (!existing || now > existing.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt });
    return { ok: true as const };
  }

  if (existing.count >= env.SELLER_RATE_LIMIT_PER_MINUTE) {
    return { ok: false as const, status: 429, error: "Rate limit exceeded" };
  }

  existing.count += 1;
  return { ok: true as const };
}
