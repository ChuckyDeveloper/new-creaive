// app/api/v1/lib/upload.ts
import fs from "fs/promises";
import path from "path";
import crypto, { randomUUID } from "crypto";
import { ensureDir, extFromFilename } from "./helper";

export type SaveOptions = {
    subdir?: string;              // e.g., "productcontent" (default "uploads")
    prefix?: string;              // filename prefix
    allowed?: Set<string>;        // allowed mime types
    maxBytes?: number;            // max size guard
    detectMeta?: boolean;         // try to detect width/height with sharp
};

export type SavedFile = {
    url: string;                  // public URL path (/productcontent/xx.png)
    filename: string;             // basename.ext
    filepath: string;             // absolute path on disk
    bytes: number;
    width?: number;
    height?: number;
};

export const DEFAULT_ALLOWED = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/avif",
]);

function extFromMime(mime: string) {
    const raw = mime.split("/")[1] || "bin";
    return raw === "jpeg" ? "jpg" : raw;
}

function safeBase(name: string) {
    return (
        name
            .toLowerCase()
            .replace(/\.[a-z0-9]+$/i, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")
            .slice(0, 60) || "file"
    );
}

// ---- Your original helper (kept for backward-compat)
export async function saveUploadFromBuffer(buf: Buffer, mime: string): Promise<string> {
    const ext = mime.split("/")[1] || "png";
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const saveDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(saveDir, { recursive: true });
    await fs.writeFile(path.join(saveDir, fileName), new Uint8Array(buf));
    return `/uploads/${fileName}`;
}


export async function saveUpload(file: File | null, subdir: string) {
    if (!file) return null;

    const uploadRoot =
        process.env.UPLOAD_DIR?.trim() || path.join(process.cwd(), "public", "uploads");
    const targetDir = path.join(uploadRoot, subdir);

    await ensureDir(targetDir);

    const buf = new Uint8Array(await file.arrayBuffer());
    const id = crypto.randomBytes(8).toString("hex");
    const ext = extFromFilename(file.name) || (file.type === "image/png" ? ".png" : file.type === "image/jpeg" ? ".jpg" : "");
    const filename = `${Date.now()}-${id}${ext || ""}`;

    const filepath = path.join(targetDir, filename);
    await fs.writeFile(filepath, buf);

    // Public URL (served from /public)
    const publicPath = `/uploads/${subdir}/${filename}`.replace(/\\/g, "/");
    return publicPath;
}

// ---- Enhanced saver: subdir, size guard, metadata
export async function saveBufferAsPublicFile(
    buf: Buffer,
    mime: string,
    opts: SaveOptions = {}
): Promise<SavedFile> {
    const {
        subdir = "uploads",
        prefix = "",
        allowed = DEFAULT_ALLOWED,
        maxBytes = 10 * 1024 * 1024, // 10MB
        detectMeta = false,
    } = opts;

    if (allowed.size && !allowed.has(mime)) {
        throw new Error(`Unsupported file type: ${mime}`);
    }
    if (buf.byteLength > maxBytes) {
        throw new Error(`File too large: ${(buf.byteLength / 1024 / 1024).toFixed(1)} MB`);
    }

    const ext = extFromMime(mime);
    const base = safeBase(prefix || "upload");
    const filename = `${Date.now()}-${randomUUID()}-${base}.${ext}`;
    const dir = path.join(process.cwd(), "public", subdir);
    await fs.mkdir(dir, { recursive: true });

    const filepath = path.join(dir, filename);
    await fs.writeFile(filepath, new Uint8Array(buf));

    const out: SavedFile = {
        url: `/${subdir}/${filename}`,
        filename,
        filepath,
        bytes: buf.byteLength,
    };

    if (detectMeta) {
        try {
            const sharp = (await import("sharp")).default;
            const meta = await sharp(filepath).metadata();
            out.width = meta.width ?? undefined;
            out.height = meta.height ?? undefined;
        } catch {
            // ignore if sharp is not installed/available
        }
    }

    return out;
}

export async function webFileToBuffer(file: File): Promise<Buffer> {
    const ab = await file.arrayBuffer();
    return Buffer.from(ab);
}

/**
 * Save multiple files from a FormData field name. Optionally align ALT texts
 * from another field (e.g., multiple 'alts' rows).
 */
export async function saveFilesField(
    form: FormData,
    field: string,
    opts: SaveOptions & { altsField?: string } = {}
) {
    const files = form.getAll(field) as File[];
    const alts = opts.altsField ? form.getAll(opts.altsField).map(x => x.toString()) : [];
    const saved: Array<{ url: string; alt?: string; width?: number; height?: number }> = [];

    for (let i = 0; i < files.length; i++) {
        const f = files[i];
        if (!f || !f.size) continue;

        const mime = f.type || "application/octet-stream";
        const buf = await webFileToBuffer(f);
        const res = await saveBufferAsPublicFile(buf, mime, opts);
        saved.push({
            url: res.url,
            alt: alts[i],
            width: res.width,
            height: res.height,
        });
    }
    return saved;
}
