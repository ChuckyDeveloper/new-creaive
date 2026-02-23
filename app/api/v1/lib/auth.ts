// app/api/v1/lib/auth.ts
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { verifySession } from "./jwt";

export type Claims =
    {
        sub: string;
        role: "user" | "admin" | "manager" | "master";
        email: string;
        username?: string;
    };

export function extractToken(req: NextRequest): string | null {
    const cookieToken = req.cookies.get("session")?.value;
    if (cookieToken) return cookieToken;

    const auth = req.headers.get("authorization") || req.headers.get("Authorization");
    if (auth && auth.toLowerCase().startsWith("bearer ")) {
        const token = auth.slice(7).trim();
        return token || null;
    }

    return null;
}

export function getUserFromCookies(): Claims | null {
    const token = cookies().get("session")?.value;
    if (!token) return null;
    try {
        return verifySession(token) as Claims;
    } catch {
        return null;
    }
}

export function requireRole(req: NextRequest, allowed: Claims["role"][]) {
    const token = extractToken(req);
    if (!token) return { ok: false as const, status: 401, error: "Unauthorized" };
    try {
        const claims = verifySession(token) as Claims;
        if (!allowed.includes(claims.role)) {
            return { ok: false as const, status: 403, error: "Forbidden" };
        }
        return { ok: true as const, claims };
    } catch {
        return { ok: false as const, status: 401, error: "Unauthorized" };
    }
}
