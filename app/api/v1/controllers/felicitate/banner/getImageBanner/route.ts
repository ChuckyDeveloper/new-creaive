import { NextRequest, NextResponse } from "next/server";
import { createReadStream, promises as fsp } from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function guessContentType(ext: string) {
    switch (ext.toLowerCase()) {
        case ".png": return "image/png";
        case ".jpg":
        case ".jpeg": return "image/jpeg";
        case ".webp": return "image/webp";
        default: return "application/octet-stream";
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const raw = searchParams.get("name");
        if (!raw) {
            return NextResponse.json({ error: "Filename required" }, { status: 400 });
        }

        const decoded = decodeURIComponent(raw);
        const fileName = path.basename(decoded); // prevent traversal
        const filePath = path.join(process.cwd(), "public", "uploads", "banners", fileName);

        await fsp.access(filePath).catch(() => {
            throw Object.assign(new Error("File not found"), { code: "ENOENT" });
        });

        const ext = path.extname(fileName);
        const contentType = guessContentType(ext);

        const stream = createReadStream(filePath);
        return new NextResponse(stream as any, {
            status: 200,
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=31536000, immutable",
                "Content-Disposition": `inline; filename="${fileName}"`,
            },
        });
    } catch (err: any) {
        if (err?.code === "ENOENT") {
            return NextResponse.json({ error: "File not found" }, { status: 404 });
        }
        return NextResponse.json({ error: err?.message || "Internal error" }, { status: 500 });
    }
}