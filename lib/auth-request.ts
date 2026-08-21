type RateLimitEntry = { count: number; resetAt: number };

export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (origin) return origin === new URL(request.url).origin;
  return request.headers.get("sec-fetch-site") === "same-origin";
}

function clientKey(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

export function createMemoryRateLimiter(maxAttempts: number, windowMs: number) {
  const attempts = new Map<string, RateLimitEntry>();

  return (request: Request) => {
    const now = Date.now();
    const key = clientKey(request);
    const current = attempts.get(key);

    if (!current || current.resetAt <= now) {
      attempts.set(key, { count: 1, resetAt: now + windowMs });
      if (attempts.size > 1000) {
        for (const [entryKey, entry] of attempts) {
          if (entry.resetAt <= now) attempts.delete(entryKey);
        }
      }
      return { allowed: true, retryAfter: 0 };
    }

    if (current.count >= maxAttempts) {
      return { allowed: false, retryAfter: Math.ceil((current.resetAt - now) / 1000) };
    }

    current.count += 1;
    return { allowed: true, retryAfter: 0 };
  };
}

export async function waitForMinimumDuration(startedAt: number, minimumMs: number) {
  const remaining = minimumMs - (Date.now() - startedAt);
  if (remaining > 0) await new Promise((resolve) => setTimeout(resolve, remaining));
}
