const MAX_NAME = 32;
const MAX_MESSAGE = 500;
const MAX_LIMIT = 100;
const COOLDOWN_SECONDS = 20;

const memoryRateLimit = new Map();

function jsonResponse(data, init = {}) {
  const headers = new Headers(init.headers || {});
  headers.set("Content-Type", "application/json");
  headers.set("Cache-Control", "no-store");
  return new Response(JSON.stringify(data), { ...init, headers });
}

function sanitize(input) {
  return String(input || "")
    .replace(/<[^>]*>/g, "")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getIp(request) {
  const cfIp = request.headers.get("CF-Connecting-IP");
  if (cfIp) return cfIp;
  const forwarded = request.headers.get("X-Forwarded-For");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}

async function checkRateLimit(env, ip) {
  if (env && env.GUESTBOOK_RL) {
    const key = `gb:${ip}`;
    const hit = await env.GUESTBOOK_RL.get(key);
    if (hit) return true;
    await env.GUESTBOOK_RL.put(key, "1", { expirationTtl: COOLDOWN_SECONDS });
    return false;
  }

  const last = memoryRateLimit.get(ip) || 0;
  const now = Date.now();
  if (now - last < COOLDOWN_SECONDS * 1000) return true;
  memoryRateLimit.set(ip, now);
  return false;
}

export async function onRequestGet({ request, env }) {
  if (!env.GUESTBOOK_DB) {
    return jsonResponse({ error: "Database not configured" }, { status: 500 });
  }

  const url = new URL(request.url);
  const limitParam = parseInt(url.searchParams.get("limit") || "50", 10);
  const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), MAX_LIMIT) : 50;

  const { results } = await env.GUESTBOOK_DB
    .prepare("SELECT id, name, message, created_at FROM guestbook ORDER BY created_at DESC LIMIT ?")
    .bind(limit)
    .all();

  return jsonResponse({ posts: results || [] });
}

export async function onRequestPost({ request, env }) {
  if (!env.GUESTBOOK_DB) {
    return jsonResponse({ error: "Database not configured" }, { status: 500 });
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = sanitize(payload.name).slice(0, MAX_NAME);
  const message = sanitize(payload.message).slice(0, MAX_MESSAGE);

  if (name.length < 1 || name.length > MAX_NAME) {
    return jsonResponse({ error: "Name must be 1-32 characters." }, { status: 400 });
  }
  if (message.length < 1 || message.length > MAX_MESSAGE) {
    return jsonResponse({ error: "Message must be 1-500 characters." }, { status: 400 });
  }

  const ip = getIp(request);
  const rateLimited = await checkRateLimit(env, ip);
  if (rateLimited) {
    return jsonResponse({ error: "Too many posts. Try again in ~20 seconds." }, { status: 429 });
  }

  const createdAt = Math.floor(Date.now() / 1000);
  const insert = await env.GUESTBOOK_DB
    .prepare("INSERT INTO guestbook (name, message, created_at) VALUES (?, ?, ?)")
    .bind(name, message, createdAt)
    .run();

  const id = insert.meta && insert.meta.last_row_id ? insert.meta.last_row_id : null;

  return jsonResponse({
    post: { id, name, message, created_at: createdAt }
  }, { status: 201 });
}
