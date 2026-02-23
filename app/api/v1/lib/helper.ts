
import path from "path";
import { promises as fs } from "fs";


export function num(v: string | null, d: number) {
    const n = Number(v ?? d);
    return Number.isFinite(n) && n > 0 ? n : d;
}

export function truthy(v: string | null) {
    if (!v) return false;
    const s = v.toLowerCase();
    return s === "1" || s === "true" || s === "yes";
}

export function slugify(s: string) {
    return s
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 120);
}

export async function ensureDir(dir: string) {
    await fs.mkdir(dir, { recursive: true });
}

export function extFromFilename(filename?: string | null) {
    if (!filename) return "";
    const e = path.extname(filename);
    return e || "";
}