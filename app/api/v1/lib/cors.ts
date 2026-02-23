// lib/cors.ts
import { NextResponse } from "next/server";

export const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_ALLOWED_ORIGIN ?? "";

/** Attach CORS headers to a response */
export function withCORS(res: NextResponse, methods = "GET,POST,OPTIONS") {
    if (ALLOWED_ORIGIN) {
        res.headers.set("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
        res.headers.set("Access-Control-Allow-Methods", methods);
        res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.headers.set("Access-Control-Allow-Credentials", "true");
        res.headers.set("Vary", "Origin");
    }
    return res;
}

/** Preflight (OPTIONS) response */
export function preflight() {
    return withCORS(new NextResponse(null, { status: 204 }));
}
