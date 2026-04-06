import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const PERSIST_DIR =
  process.env.PERSIST_DIR || path.join(process.cwd(), "persistent");
const UPLOAD_DIR = path.join(PERSIST_DIR, "uploads");

const MIME: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
};

/** GET /api/popup/image?f=popup-1234.png — serve uploaded image */
export async function GET(req: NextRequest) {
  const filename = req.nextUrl.searchParams.get("f");

  if (!filename) {
    return NextResponse.json({ error: "Missing filename" }, { status: 400 });
  }

  // Prevent path traversal
  const safe = path.basename(filename);
  const filepath = path.join(UPLOAD_DIR, safe);

  if (!fs.existsSync(filepath)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const ext = path.extname(safe).toLowerCase();
  const contentType = MIME[ext] || "application/octet-stream";
  const buffer = fs.readFileSync(filepath);

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
