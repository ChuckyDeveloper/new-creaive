import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "../../lib/db";
import User from "../../models/User";
import { signSession } from "../../lib/jwt";
import { ALLOWED_ORIGIN, withCORS } from "../../lib/cors";
import { logger } from "../../lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SigninSchema = z.object({
    identifier: z.string().min(1),
    password: z.string().min(8),
    rememberMe: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
    try {
        logger.request(req, "signin start");
        await connectDB();

        const body = await req.json();
        const { identifier, password, rememberMe } = SigninSchema.parse(body);

        const query = identifier.includes("@")
            ? { email: identifier.toLowerCase().trim() }
            : { username: identifier.toLowerCase().trim() };

        const user = await User.findOne(query).select("+passwordHash +password"); // include legacy field if present

        logger.info("signin user lookup", { id: user?._id, email: user?.email });

        if (!user) {
            logger.warn("signin failed: user not found", { identifier });
            return withCORS(NextResponse.json({ error: "Invalid credentials" }, { status: 401 }));
        }

        let ok = false;
        try {
            const hasCompare = typeof (user as any).comparePassword === "function";
            if (hasCompare) {
                ok = await (user as any).comparePassword(password);
            } else {
                const legacyHash: string | undefined = (user as any).passwordHash || (user as any).password;
                if (legacyHash) {
                    const { compare } = await import("bcryptjs");
                    ok = await compare(password, legacyHash);
                    if ((user as any).password && !(user as any).passwordHash) {
                        console.warn("Signin notice: using legacy 'password' field; consider migrating to 'passwordHash'", { id: user._id });
                    }
                } else {
                    console.warn("Signin warning: no password hash and no comparePassword method on user", { id: user._id });
                    ok = false;
                }
            }
        } catch (e) {
            logger.error("signin password compare error", e);
            ok = false;
        }

        if (!ok) {
            logger.warn("signin failed: bad password", { identifier, userId: user._id });
            return withCORS(NextResponse.json({ error: "Invalid credentials" }, { status: 401 }));
        }

        const displayNameParts = [user.firstName, user.lastName].filter(Boolean);
        const fallbackName = displayNameParts.length
            ? displayNameParts.join(" ").trim()
            : (user.username || user.email);
        const displayName = (user.name && user.name.trim()) || fallbackName;

        const token = signSession({
            sub: user.id,
            email: user.email,
            role: user.role,
            username: user.username,
            name: displayName,
        });

        logger.info("signin success", { userId: user._id, email: user.email });

        const isProd = process.env.NODE_ENV === "production";
        const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7; // 30d or 7d

        const res = NextResponse.json(
            {
                user: {
                    _id: user._id,
                    username: user.username,
                    name: displayName,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    email: user.email,
                    company: user.company,
                    position: user.position,
                    phone: user.phone,
                    createdAt: user.createdAt,
                },
            },
            { status: 200 }
        );

        res.cookies.set("session", token, {
            httpOnly: true,
            secure: isProd,
            sameSite: ALLOWED_ORIGIN ? "none" : "lax",
            path: "/",
            maxAge,
        });

        logger.response(req, 200, { userId: user._id });
        return withCORS(res);
    } catch (err: any) {
        if (err?.name === "ZodError") {
            return withCORS(NextResponse.json({ error: "Validation failed", issues: err.issues }, { status: 400 }));
        }
        logger.failure(req, err);
        return withCORS(NextResponse.json({ error: "Server error" }, { status: 500 }));
    }
}
