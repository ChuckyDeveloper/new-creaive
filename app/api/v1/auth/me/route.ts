import { NextRequest, NextResponse } from "next/server";
import { withCORS } from "../../lib/cors";   
import { verifySession } from "../../lib/jwt";
import type { SessionClaims } from "../../lib/jwt";
import { extractToken } from "../../lib/auth";
import { logger } from "../../lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function error(status: number, message: string) {
  const res = NextResponse.json({ error: message }, { status });
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  res.headers.set("Vary", "Cookie");
  return withCORS(res);
}

/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     summary: Retrieve the authenticated user's information
 *     description: Retrieve the authenticated user's information.
 *     responses:
 *       200:
 *         description: The user's information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                 session:
 *                   type: object
 */
export async function GET(req: NextRequest) {
  try {
    logger.request(req, "auth.me start");
    const token = extractToken(req);
    if (!token) return error(401, "NO_TOKEN");

    let payload: SessionClaims & { name?: string; iat?: number; exp?: number };
    try {
      payload = verifySession<SessionClaims & { name?: string; iat?: number; exp?: number }>(token);
    } catch (e: any) {
      // TokenExpiredError or JsonWebTokenError
      const msg = e?.name === "TokenExpiredError" ? "TOKEN_EXPIRED" : (e?.message || "INVALID_TOKEN");
      return error(401, msg);
    }

    const user = {
      id: payload.sub || null,
      username: payload.username || null,
      name: payload.name || null,
      email: payload.email || null,
      role: payload.role || null,
      roles: payload.role ? [payload.role] : [],
      displayName: payload.username || payload.name || payload.email || null,
    };

    const nowSec = Math.floor(Date.now() / 1000);
    const session = {
      iat: payload.iat ?? null,
      exp: payload.exp ?? null,
      expiresInSec: payload.exp ? Math.max(0, payload.exp - nowSec) : null,
      isAuthenticated: true,
    };

    const res = NextResponse.json({ user, session }, { status: 200 });
    res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    res.headers.set("Vary", "Cookie");
    logger.response(req, 200, { userId: user.id, role: user.role });
    return withCORS(res);
  } catch (e: any) {
    logger.failure(req, e);
    return error(500, e?.message || "ME_ROUTE_ERROR");
  }
}

export async function OPTIONS(req: NextRequest) {
  const res = new NextResponse(null, { status: 204 });
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  res.headers.set("Vary", "Cookie");
  logger.response(req, 204);
  return withCORS(res);
}
