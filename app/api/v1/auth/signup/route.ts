// app/api/v1/auth/signup/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "../../lib/db";
import { ALLOWED_ORIGIN, withCORS } from "../../lib/cors";
import User from "../../models/User";
import { hashPassword } from "../../lib/password";
import { signSession } from "../../lib/jwt";
import { logger } from "../../lib/logger";


export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CreateUserSchema = z.object({
    username: z.string().min(3).max(50),
    firstName: z.string().min(1).max(100),
    lastName: z.string().min(1).max(100),
    role: z.enum(["user", "manager", "admin", "master"]).default("user"),
    email: z.string().email(),
    password: z.string().min(8),
    company: z.string().max(200).optional().or(z.literal("")),
    position: z.string().max(100).optional().or(z.literal("")),
    phone: z.string().max(30).optional().or(z.literal("")),
});

export async function POST(req: NextRequest) {
    try {
        logger.request(req, "signup start");
        await connectDB();

        const json = await req.json();
        const payload = CreateUserSchema.parse(json);
        const username = payload.username.toLowerCase().trim();
        const email = payload.email.toLowerCase().trim();

        if (await User.exists({ email })) {
            logger.warn("signup email taken", { email });
            return withCORS(
                NextResponse.json({ error: "EMAIL_TAKEN" }, { status: 409 })
            );
        }
        if (await User.exists({ username })) {
            logger.warn("signup username taken", { username });
            return withCORS(
                NextResponse.json({ error: "USERNAME_TAKEN" }, { status: 409 })
            );
        }

        const passwordHash = await hashPassword(payload.password);

        const created = await User.create({
            username,
            firstName: payload.firstName,
            lastName: payload.lastName,
            name: `${payload.firstName} ${payload.lastName}`.trim(),
            role: payload.role,
            email,
            passwordHash: passwordHash,
            company: payload.company || undefined,
            position: payload.position || undefined,
            phone: payload.phone || undefined,
        });

        const token = signSession({
            sub: created.id,
            email: created.email,
            role: created.role,
            username: created.username,
            name: created.name,
        });

        const isProd = process.env.NODE_ENV === "production";
        const maxAge = 60 * 60 * 24 * 7; // 7 days

        const res = NextResponse.json(
            {
                user: {
                    _id: created._id,
                    username: created.username,
                    name: created.name,
                    firstName: created.firstName,
                    lastName: created.lastName,
                    role: created.role,
                    email: created.email,
                    company: created.company,
                    position: created.position,
                    phone: created.phone,
                    createdAt: created.createdAt,
                },
            },
            { status: 201 }
        );

        res.cookies.set("session", token, {
            httpOnly: true,
            secure: isProd,
            sameSite: ALLOWED_ORIGIN ? "none" : "lax",
            path: "/",
            maxAge,
        });

        logger.response(req, 201, { userId: created._id });
        return withCORS(res);
    } catch (err: any) {
        if (err?.code === 11000) {
            const kv = err.keyValue || {};
            if (kv.email) {
                logger.warn("signup duplicate key: email", kv);
                return withCORS(
                    NextResponse.json({ error: "EMAIL_TAKEN" }, { status: 409 })
                );
            }
            if (kv.username) {
                logger.warn("signup duplicate key: username", kv);
                return withCORS(
                    NextResponse.json({ error: "USERNAME_TAKEN" }, { status: 409 })
                );
            }
            return withCORS(
                NextResponse.json({ error: "Duplicate key" }, { status: 409 })
            );
        }
        if (err?.name === "ZodError") {
            return withCORS(
                NextResponse.json({ error: "Validation failed", issues: err.issues }, { status: 400 })
            );
        }
        logger.failure(req, err);
        return withCORS(
            NextResponse.json({ error: "Server error" }, { status: 500 })
        );
    }
}
