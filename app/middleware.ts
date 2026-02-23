import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = new Set([
    "/",
    "/sign-in",       // ✅ ใช้เส้นทางนี้
    "/sign-up",
    "/terms",
    "/privacy",
    "/api/v1/auth/signin", // ถ้ามี route นี้
    "/api/v1/auth/signup",
]);

export function middleware(req: NextRequest) {
    const { pathname, search } = req.nextUrl;
    const isPublic = Array.from(PUBLIC_PATHS).some((p) => pathname.startsWith(p));
    const hasSession = req.cookies.get("session");

    // ห้าม redirect ตัวเองซ้ำ
    if (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")) {
        return NextResponse.next();
    }

    // ถ้าไม่มี session และไม่ใช่ public → ส่งไป /sign-in
    if (!hasSession && !isPublic) {
        const url = req.nextUrl.clone();
        url.pathname = "/sign-in";              // ✅ อย่าใช้ /auth/signin
        url.search = `?redirect=${encodeURIComponent(pathname + search)}`;
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/dashboard/:path*"],
};