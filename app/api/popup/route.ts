import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

/*
 * Use a persistent volume directory instead of process.cwd()/public
 * so uploaded files survive container rebuilds.
 *
 * In Docker we mount a volume at /app/persistent.
 * In local dev, fall back to <project>/persistent.
 */
const PERSIST_DIR =
  process.env.PERSIST_DIR || path.join(process.cwd(), "persistent");
const DATA_FILE = path.join(PERSIST_DIR, "popup.json");
const UPLOAD_DIR = path.join(PERSIST_DIR, "uploads");

interface PopupData {
  enabled: boolean;
  imageUrl: string;
}

function ensureDirs() {
  if (!fs.existsSync(PERSIST_DIR))
    fs.mkdirSync(PERSIST_DIR, { recursive: true });
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

function readData(): PopupData {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw) as PopupData;
  } catch {
    return { enabled: false, imageUrl: "" };
  }
}

function writeData(data: PopupData) {
  ensureDirs();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

/** GET — return popup settings (shared by admin page & homepage popup) */
export async function GET() {
  const data = readData();
  return NextResponse.json(data);
}

/** POST — upload image + optionally set enabled */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;
    const enabled = formData.get("enabled");

    const data = readData();

    if (file && file.size > 0) {
      ensureDirs();

      // Remove old file if exists
      if (data.imageUrl) {
        const oldFile = path.join(UPLOAD_DIR, path.basename(data.imageUrl));
        if (fs.existsSync(oldFile)) fs.unlinkSync(oldFile);
      }

      // Save new image
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = path.extname(file.name) || ".png";
      const filename = `popup-${Date.now()}${ext}`;
      fs.writeFileSync(path.join(UPLOAD_DIR, filename), buffer);

      // Store as API-served path (not a static /public path)
      data.imageUrl = `/api/popup/image?f=${filename}`;
    }

    if (enabled !== null && enabled !== undefined) {
      data.enabled = enabled === "true";
    }

    writeData(data);
    return NextResponse.json(data);
  } catch (err) {
    console.error("Popup upload error:", err);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 },
    );
  }
}

/** PATCH — toggle enabled on/off */
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const data = readData();

    if (typeof body.enabled === "boolean") {
      data.enabled = body.enabled;
    }

    writeData(data);
    return NextResponse.json(data);
  } catch (err) {
    console.error("Popup toggle error:", err);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 },
    );
  }
}

/** DELETE — remove image and disable popup */
export async function DELETE() {
  try {
    const data = readData();

    if (data.imageUrl) {
      // Extract filename from the API path
      const url = new URL(data.imageUrl, "http://localhost");
      const fname = url.searchParams.get("f");
      if (fname) {
        const oldFile = path.join(UPLOAD_DIR, fname);
        if (fs.existsSync(oldFile)) fs.unlinkSync(oldFile);
      }
    }

    const newData: PopupData = { enabled: false, imageUrl: "" };
    writeData(newData);
    return NextResponse.json(newData);
  } catch (err) {
    console.error("Popup delete error:", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
