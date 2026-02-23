import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { withCORS } from "../../../lib/cors";
import { logger } from "../../../lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// tiny mime helper (avoid extra deps)
function mimeFor(ext: string) {
    switch (ext) {
        case ".jpg":
        case ".jpeg":
            return "image/jpeg";
        case ".png":
            return "image/png";
        case ".webp":
            return "image/webp";
        case ".gif":
            return "image/gif";
        case ".avif":
            return "image/avif";
        default:
            return "application/octet-stream";
    }
}

// sanitize a single path segment
function safeSegment(seg: string) {
    const s = path.basename(seg);            // strips slashes
    if (!s || s !== seg) return null;        // reject traversal
    if (s.includes("\0")) return null;       // no null bytes
    return s;
}

function buildSafePath(segments: string[], fileName: string) {
    const baseDir = path.resolve(process.cwd(), "public");
    const safeSegs = segments.map(safeSegment);
    if (safeSegs.some((s) => !s)) return null;

    const safeFile = safeSegment(fileName);
    if (!safeFile) return null;

    const full = path.resolve(baseDir, ...safeSegs as string[], safeFile);
    // ensure final path stays inside /public
    if (!full.startsWith(baseDir + path.sep)) return null;
    return full;
}

export async function HEAD(req: NextRequest, ctx: { params: { folder?: string[] } }) {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");
    const segments = ctx.params.folder ?? []; // e.g. ["productcontent"] or ["uploads","avatars"]

    if (!name) return withCORS(NextResponse.json({ error: "Filename required" }, { status: 400 }));

    const filePath = buildSafePath(segments, name);
    if (!filePath) return withCORS(NextResponse.json({ error: "Invalid path" }, { status: 400 }));

    try {
        logger.request(req, "image HEAD", { name, segments });
        const stat = await fs.stat(filePath);
        const res = new NextResponse(null, {
            status: 200,
            headers: {
                "Content-Length": String(stat.size),
                "Content-Disposition": `inline; filename="${path.basename(name)}"`,
                "Content-Type": mimeFor(path.extname(name).toLowerCase()),
                "Cache-Control": "no-store",
            },
        });
        logger.response(req, 200, { name, segments });
        return withCORS(res);
    } catch {
        logger.warn("image HEAD not found", { name, segments });
        return withCORS(NextResponse.json({ error: "File not found" }, { status: 404 }));
    }
}

export async function GET(req: NextRequest, ctx: { params: { folder?: string[] } }) {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");
    const segments = ctx.params.folder ?? [];
    try {

        if (!name) return withCORS(NextResponse.json({ error: "Filename required" }, { status: 400 }));

        const filePath = buildSafePath(segments, name);
        if (!filePath) return withCORS(NextResponse.json({ error: "Invalid path" }, { status: 400 }));

        logger.request(req, "image GET", { name, segments });
        const file = await fs.readFile(filePath).catch(() => null);
        if (!file) return withCORS(NextResponse.json({ error: "File not found" }, { status: 404 }));

        const ext = path.extname(name).toLowerCase();
        const contentType = mimeFor(ext);

        const res = new NextResponse(file, {
            status: 200,
            headers: {
                "Content-Type": contentType,
                "Content-Disposition": `inline; filename="${path.basename(name)}"`,
                "Cache-Control": "no-store",
            },
        });
        logger.response(req, 200, { name, segments });
        return withCORS(res);
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        logger.failure(req, err, { name, segments });
        return withCORS(NextResponse.json({ error: message }, { status: 500 }));
    }
}
