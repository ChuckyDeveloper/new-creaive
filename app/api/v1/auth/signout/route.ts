


import { NextRequest, NextResponse } from "next/server";
import { ALLOWED_ORIGIN, withCORS } from "../../lib/cors";
import { logger } from "../../lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clearCookies(res: NextResponse, cookieNames: string[], secure: boolean, sameSite: "lax" | "none") {
  for (const name of cookieNames) {
    res.cookies.set(name, "", {
      httpOnly: true,
      secure,
      sameSite: sameSite === "none" && !secure ? "lax" : sameSite, // guard: None must be Secure
      path: "/",
      maxAge: 0,
    });
  }
  return res;
}

function buildResponse(req: NextRequest) {
  const isProd = process.env.NODE_ENV === "production";
  // If deployed behind HTTPS, keep secure=true; in dev HTTPS might be off.
  const secure = isProd;
  // Use SameSite=None only when we explicitly allow cross-site and we are secure
  const wantCrossSite = !!ALLOWED_ORIGIN;
  const sameSite: "lax" | "none" = secure && wantCrossSite ? "none" : "lax";

  // Optionally validate Origin for CSRF hardening when cross-site is enabled
  const origin = req.headers.get("origin") || "";
  if (wantCrossSite && origin && origin !== ALLOWED_ORIGIN) {
    const forbidden = new NextResponse(JSON.stringify({ success: false, error: "Forbidden origin" }), { status: 403 });
    forbidden.headers.set("Content-Type", "application/json");
    return withCORS(forbidden);
  }

  const res = NextResponse.json({ success: true }, { status: 200 });
  // Clear all relevant auth cookies (extend this list to match your auth setup)
  clearCookies(res, ["session", "access_token", "refresh_token", "creaive_auth", "token"], secure, sameSite);

  // Caching protections
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  res.headers.set("Pragma", "no-cache");

  return withCORS(res);
}

export async function POST(req: NextRequest) {
  logger.request(req, "signout POST");
  const res = await buildResponse(req);
  logger.response(req, 200);
  return res;
}

// Optional convenience: allow GET signout as well (less ideal; POST is recommended)
export async function GET(req: NextRequest) {
  logger.request(req, "signout GET");
  const res = await buildResponse(req);
  logger.response(req, 200);
  return res;
}

// Handle CORS preflight if the client sends custom headers
export async function OPTIONS() {
  return withCORS(new NextResponse(null, { status: 204 }));
}
