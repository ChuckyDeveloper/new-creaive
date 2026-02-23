import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { withCORS } from "../../../lib/cors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function HEAD(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");
    if (!name) return withCORS(NextResponse.json({ error: "Filename required" }, { status: 400 }));

    const safe = path.basename(name);
    if (safe !== name) return withCORS(NextResponse.json({ error: "Invalid filename" }, { status: 400 }));

    const filePath = path.join(process.cwd(), "public", "productcontent", safe);
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
        return withCORS(res);
    } catch {
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

        // Prevent path traversal
        const safe = path.basename(name);
        if (safe !== name) {
            return withCORS(NextResponse.json({ error: "Invalid filename" }, { status: 400 }));
        }

        const filePath = path.join(process.cwd(), "public", "productcontent", safe);
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
        return withCORS(res);
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return withCORS(NextResponse.json({ error: message }, { status: 500 }));
    }
}
