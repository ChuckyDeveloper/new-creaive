import { NextRequest, NextResponse } from "next/server";
import { createHash, randomBytes } from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const b64url = (buf: Buffer) =>
    buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
const randomStr = (n = 32) => b64url(randomBytes(n));

export async function GET(req: NextRequest) {
    const isProd = process.env.NODE_ENV === "production";
    const url = new URL(req.url);
    const rawNext = url.searchParams.get("next") || "/dashboard";
    const next = rawNext.startsWith("/") ? rawNext : "/dashboard";   // ✅ sanitize

    // 🔎 debug ช่วยไล่ปัญหา redirect_uri
    console.info("[GOOGLE_OAUTH][start] redirect_uri =", process.env.GOOGLE_START_URIC);

    // PKCE
    const verifier = randomStr(32);
    const challenge = b64url(createHash("sha256").update(verifier).digest());
    const state = randomStr(16);
    const nonce = randomStr(16);

    const auth = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    auth.search = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
        response_type: "code",
        scope: "openid email profile",
        code_challenge: challenge,
        code_challenge_method: "S256",
        state,
        nonce,
        // ⬇️ ออปชัน ถ้าต้องการ refresh_token
        // access_type: "offline",
        // prompt: "consent",
        // include_granted_scopes: "true",
    }).toString();

    const res = NextResponse.redirect(auth.toString(), 302);
    // short-lived cookies (dev: SameSite=Lax + not Secure)
    const cookieOpts = { httpOnly: true as const, secure: isProd, sameSite: "lax" as const, path: "/", maxAge: 600 };
    res.cookies.set("g_pkce_verifier", verifier, cookieOpts);
    res.cookies.set("g_oauth_state", state, cookieOpts);
    res.cookies.set("g_oauth_nonce", nonce, cookieOpts);
    res.cookies.set("g_redirect", next, cookieOpts);
    return res;
}