import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { logger } from "../../lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Allow only your frontend during dev; set this in your server env
const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_ALLOWED_ORIGIN || "*";

function withCORS(res: NextResponse) {
    res.headers.set("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
    res.headers.set("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, Range");
    res.headers.set("Access-Control-Expose-Headers", "Content-Length, Content-Type, Content-Disposition");
    res.headers.set("Vary", "Origin");
    return res;
}

// Preflight
export function OPTIONS(_req: NextRequest) {
    return withCORS(new NextResponse(null, { status: 204 }));
}

// Optional HEAD (so the client can probe availability without downloading)
export async function HEAD(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");
    if (!name) return withCORS(NextResponse.json({ error: "Filename required" }, { status: 400 }));
    logger.request(req, "getImage HEAD", { name });

    const safe = path.basename(name);
    if (safe !== name) return withCORS(NextResponse.json({ error: "Invalid filename" }, { status: 400 }));

    const filePath = path.join(process.cwd(), "public", "event", safe);
    try {
        const stat = await fs.stat(filePath);
        const res = new NextResponse(null, {
            status: 200,
            headers: {
                "Content-Length": String(stat.size),
                "Content-Disposition": `inline; filename="${safe}"`,
                "Cache-Control": "no-store",
            },
        });
        logger.response(req, 200, { name: safe });
        return withCORS(res);
    } catch {
        logger.warn("getImage HEAD not found", { name: safe });
        return withCORS(NextResponse.json({ error: "File not found" }, { status: 404 }));
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const name = searchParams.get("name");
        if (!name) {
            return withCORS(NextResponse.json({ error: "Filename required" }, { status: 400 }));
        }
        logger.request(req, "getImage GET", { name });

        // Prevent path traversal
        const safe = path.basename(name);
        if (safe !== name) {
            return withCORS(NextResponse.json({ error: "Invalid filename" }, { status: 400 }));
        }

        const filePath = path.join(process.cwd(), "public", "event", safe);
        const file = await fs.readFile(filePath).catch(() => null);
        if (!file) {
            return withCORS(NextResponse.json({ error: "File not found" }, { status: 404 }));
        }

        const ext = path.extname(safe).toLowerCase();
        const contentType =
            ext === ".jpg" || ext === ".jpeg"
                ? "image/jpeg"
                : ext === ".webp"
                    ? "image/webp"
                    : "image/png";

        const res = new NextResponse(file, {
            status: 200,
            headers: {
                "Content-Type": contentType,
                "Content-Disposition": `inline; filename="${safe}"`,
                "Cache-Control": "no-store",
            },
        });
        logger.response(req, 200, { name: safe });
        return withCORS(res);
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        logger.failure(req, err);
        return withCORS(NextResponse.json({ error: message }, { status: 500 }));
    }
}
