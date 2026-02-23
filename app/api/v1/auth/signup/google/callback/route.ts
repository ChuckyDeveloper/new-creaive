import { NextRequest, NextResponse } from "next/server";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { connectDB } from "../../../../../../../app/api/v1/lib/db";
import User from "./../../../../../../../app/api/v1/models/User";
import { signSession } from "../../../../../../../app/api/v1/lib/jwt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const SIGNIN_PATH = process.env.NEXT_PUBLIC_SIGNIN_PATH || "/sign-in";

const JWKS_URI = "https://www.googleapis.com/oauth2/v3/certs";
const ISSUERS = ["https://accounts.google.com", "accounts.google.com"];

function mask(s?: string | null) {
    if (!s) return "";
    if (s.length <= 10) return s[0] + "***";
    return s.slice(0, 6) + "..." + s.slice(-4);
}

function decodeHeader(token: string) {
    try {
        const [h] = token.split(".");
        return JSON.parse(Buffer.from(h, "base64url").toString("utf8"));
    } catch {
        return null;
    }
}

async function fetchJwksKids() {
    try {
        const res = await fetch(JWKS_URI, { cache: "no-store" });
        const json = await res.json();
        const kids = Array.isArray(json.keys) ? json.keys.map((k: any) => k.kid) : [];
        return kids;
    } catch (e) {
        console.error("[GOOGLE_OAUTH][jwks] fetch error:", e);
        return [];
    }
}

function getPublicBase(req: NextRequest) {
    const fromEnv = (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
    if (fromEnv) return fromEnv;
    const xfProto = req.headers.get("x-forwarded-proto");
    const xfHost = req.headers.get("x-forwarded-host");
    if (xfProto && xfHost) return `${xfProto}://${xfHost}`;
    const host = req.headers.get("host");
    return host ? `http://${host}` : req.nextUrl.origin; // fallback
}

export async function GET(req: NextRequest) {
    console.info("────────────────────────────────────────────────────────────────────────────────────────────────────────────────");
    console.info("[GOOGLE_OAUTH][callback] START");
    try {
        await connectDB();
        console.info("[GOOGLE_OAUTH][callback] DB connected");

        const PUBLIC_BASE = getPublicBase(req);

        const isProd = process.env.NODE_ENV === "production";
        const url = new URL(req.url);
        const code = url.searchParams.get("code");
        const state = url.searchParams.get("state");
        const oauthError = url.searchParams.get("error");
        console.info("[GOOGLE_OAUTH][callback] query:", { code: !!code, state: mask(state), oauthError });

        const stateCookie = req.cookies.get("g_oauth_state")?.value || null;
        const verifier = req.cookies.get("g_pkce_verifier")?.value || null;
        const nonceCookie = req.cookies.get("g_oauth_nonce")?.value || null;
        const rawRedirect = req.cookies.get("g_redirect")?.value || "/dashboard";
        const redirectTo = rawRedirect.startsWith("/") ? rawRedirect : "/dashboard";

        console.info("[GOOGLE_OAUTH][callback] cookies:", {
            has_stateCookie: !!stateCookie,
            has_verifier: !!verifier,
            has_nonceCookie: !!nonceCookie,
            redirectTo,
        });

        // Debug ENV (mask)
        console.info("[GOOGLE_OAUTH][callback] env:", {
            NODE_ENV: process.env.NODE_ENV,
            GOOGLE_CLIENT_ID: mask(process.env.GOOGLE_CLIENT_ID),
            GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
            SIGNIN_PATH,
            PUBLIC_BASE,
        });

        if (oauthError) {
            console.error("[GOOGLE_OAUTH][callback] oauthError:", oauthError);
            return NextResponse.redirect(new URL(`${SIGNIN_PATH}?error=${encodeURIComponent(oauthError)}`, PUBLIC_BASE));
        }

        if (!code || !state || !verifier || state !== stateCookie) {
            console.error("[GOOGLE_OAUTH][callback] state/pkce invalid", {
                has_code: !!code,
                has_state: !!state,
                has_verifier: !!verifier,
                state_matches: state === stateCookie,
            });
            return NextResponse.redirect(new URL(`${SIGNIN_PATH}?error=oauth_state`, PUBLIC_BASE));
        }

        console.info("[GOOGLE_OAUTH][callback] redirect_uri =", process.env.GOOGLE_REDIRECT_URI);

        const derivedRedirect = `${PUBLIC_BASE.replace(/\/$/, "")}${SIGNIN_PATH}/google/callback`;
        const redirectUriToUse = (!process.env.GOOGLE_REDIRECT_URI || /0\.0\.0\.0/.test(String(process.env.GOOGLE_REDIRECT_URI)))
            ? derivedRedirect
            : process.env.GOOGLE_REDIRECT_URI;
        console.info("[GOOGLE_OAUTH][callback] effective redirect_uri =", redirectUriToUse);

        // 1) Exchange code → tokens
        console.info("[GOOGLE_OAUTH][callback] token exchange: POST /oauth2/v4/token");
        const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                client_id: process.env.GOOGLE_CLIENT_ID!,
                client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                code,
                code_verifier: verifier,
                grant_type: "authorization_code",
                redirect_uri: redirectUriToUse,
            }),
        });

        const rawTokenText = await tokenRes.text().catch(() => "");
        console.info("[GOOGLE_OAUTH][callback] tokenRes.status =", tokenRes.status);
        if (!tokenRes.ok) {
            console.error("[GOOGLE_OAUTH] token exchange failed:", rawTokenText);
            return NextResponse.redirect(new URL(`${SIGNIN_PATH}?error=token_exchange`, PUBLIC_BASE));
        }

        let tokens: any = {};
        try {
            tokens = JSON.parse(rawTokenText);
        } catch {
            console.error("[GOOGLE_OAUTH] token parse failed");
            return NextResponse.redirect(new URL(`${SIGNIN_PATH}?error=token_parse`, PUBLIC_BASE));
        }

        console.info("[GOOGLE_OAUTH][callback] token fields:", {
            has_id_token: !!tokens.id_token,
            has_access_token: !!tokens.access_token,
            scope_len: tokens.scope ? String(tokens.scope).length : 0,
            expires_in: tokens.expires_in,
            token_type: tokens.token_type,
        });

        const idToken = tokens.id_token as string | undefined;
        if (!idToken) {
            console.error("[GOOGLE_OAUTH][callback] missing id_token");
            return NextResponse.redirect(new URL(`${SIGNIN_PATH}?error=missing_id_token`, PUBLIC_BASE));
        }

        // 2) Inspect id_token header (alg/kid)
        const hdr = decodeHeader(idToken);
        console.info("[GOOGLE_OAUTH][callback] id_token.header =", hdr);

        // 3) Fetch JWKS kids & compare
        const kids = await fetchJwksKids();
        console.info("[GOOGLE_OAUTH][callback] JWKS kids (count):", kids.length, kids);
        if (hdr?.kid && kids.length && !kids.includes(hdr.kid)) {
            console.warn("[GOOGLE_OAUTH][callback] header.kid not found in JWKS kids (possible rotation or cache issue)");
        }

        // 4) Verify id_token with JWKS (with retry on no-key)
        const JWKS = createRemoteJWKSet(new URL(JWKS_URI));
        const verifyOpts = {
            issuer: ISSUERS as any,
            audience: process.env.GOOGLE_CLIENT_ID,
            clockTolerance: 60, // 60s
        };

        const tryVerify = async (label: string) => {
            console.info(`[GOOGLE_OAUTH][callback] jwtVerify attempt = ${label}`);
            const res = await jwtVerify(idToken, JWKS, verifyOpts as any);
            console.info(`[GOOGLE_OAUTH][callback] jwtVerify SUCCESS = ${label}`);
            return res;
        };

        let verified;
        try {
            verified = await tryVerify("A");
        } catch (e: any) {
            console.error("[GOOGLE_OAUTH][callback] verify A failed:", e?.message || e);
            if (String(e?.message || e).includes("no applicable key")) {
                console.info("[GOOGLE_OAUTH][callback] retrying verify (B) after no applicable key");
                // ดึง JWKS ใหม่อีกรอบก่อนลองอีกครั้ง
                await fetchJwksKids();
                try {
                    verified = await tryVerify("B");
                } catch (e2: any) {
                    console.error("[GOOGLE_OAUTH][callback] verify B failed:", e2?.message || e2);
                    return NextResponse.redirect(new URL(`${SIGNIN_PATH}?error=verify_failed`, PUBLIC_BASE));
                }
            } else {
                return NextResponse.redirect(new URL(`${SIGNIN_PATH}?error=verify_failed`, PUBLIC_BASE));
            }
        }

        const { payload } = verified!;
        console.info("[GOOGLE_OAUTH][callback] payload claims:", {
            iss: payload.iss,
            aud: payload.aud,
            sub_len: String(payload.sub || "").length,
            email: payload.email,
            email_verified: payload.email_verified,
            has_nonce: !!payload.nonce,
            name: payload.name,
            given_name: payload.given_name,
            family_name: payload.family_name,
            picture: payload.picture ? "(set)" : "(none)",
        });

        // 5) nonce check (optional)
        if (nonceCookie && payload.nonce && payload.nonce !== nonceCookie) {
            console.error("[GOOGLE_OAUTH][callback] nonce mismatch", {
                expected: nonceCookie,
                actual: payload.nonce,
            });
            return NextResponse.redirect(new URL(`${SIGNIN_PATH}?error=bad_nonce`, PUBLIC_BASE));
        }

        // 6) Extract user info
        const googleId = String(payload.sub);
        const email = String(payload.email || "");
        const emailVerified = Boolean(payload.email_verified);
        const givenName = (payload.given_name as string) || "";
        const familyName = (payload.family_name as string) || "";
        const name = (payload.name as string) || "";
        const picture = (payload.picture as string) || "";

        const emailLocal = (email.split("@")[0] || "").toLowerCase();
        const displayName = name || [givenName, familyName].filter(Boolean).join(" ").trim() || emailLocal;

        let firstName = givenName;
        let lastName = familyName;
        if (!firstName && !lastName) {
            const parts = displayName.trim().split(/\s+/);
            firstName = parts[0] || emailLocal || "user";
            lastName = parts.slice(1).join(" ") || "-";
        }
        const username = (emailLocal || `user_${googleId.slice(0, 6)}`).toLowerCase();

        console.info("[GOOGLE_OAUTH][callback] upsert user:", {
            googleId_len: googleId.length,
            email,
            username,
            firstName,
            lastName,
            picture: picture ? "(set)" : "(none)",
            emailVerified,
        });

        // 7) Upsert/link user
        let user = await User.findOne({ $or: [{ provider: "google", providerId: googleId }, { email }] });
        if (!user) {
            user = await User.create({
                email,
                username,
                firstName,
                lastName,
                name: displayName,
                password: "!",
                provider: "google",
                providerId: googleId,
                picture,
                emailVerified,
                role: "user",
                passwordHash: "!",
            } as any);
            console.info("[GOOGLE_OAUTH][callback] user created:", { id: String(user._id), email });
        } else {
            if (!user.provider) user.provider = "google";
            if (!user.providerId) user.providerId = googleId;
            if (!user.picture && picture) user.picture = picture;
            if (!user.emailVerified && emailVerified) user.emailVerified = true;
            if (!user.firstName) user.firstName = firstName;
            if (!user.lastName) user.lastName = lastName;
            await user.save();
            console.info("[GOOGLE_OAUTH][callback] user updated:", { id: String(user._id), email });
        }

        // 8) Issue session cookie
        const token = signSession({
            sub: user.id,
            email: user.email,
            role: user.role,
            username: user.username,
            name: displayName,
        });
        console.info("[GOOGLE_OAUTH][callback] session token issued (jwt length):", token.length);

        const res = NextResponse.redirect(new URL(redirectTo, PUBLIC_BASE));
        res.cookies.set("session", token, {
            httpOnly: true,
            secure: isProd,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 8,
        });

        // cleanup temp cookies
        for (const c of ["g_pkce_verifier", "g_oauth_state", "g_oauth_nonce", "g_redirect"]) {
            res.cookies.set(c, "", { path: "/", maxAge: 0 });
        }

        console.info("[GOOGLE_OAUTH][callback] SUCCESS → redirect:", redirectTo);
        console.info("────────────────────────────────────────────────────────────────────────────────────────────────────────────────");
        return res;
    } catch (err: any) {
        console.error("[GOOGLE_OAUTH][callback] ERROR:", err?.stack || err);
        console.info("────────────────────────────────────────────────────────────────────────────────────────────────────────────────");
        const u = new URL(`${SIGNIN_PATH}?error=server_error`, getPublicBase(req));
        return NextResponse.redirect(u);
    }
}
