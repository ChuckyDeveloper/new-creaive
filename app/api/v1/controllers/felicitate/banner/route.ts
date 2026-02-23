import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import { saveBufferAsPublicFile, webFileToBuffer, DEFAULT_ALLOWED } from "../../../lib/saveUpload";
import Banner from "../../../models/Banner";
import { requireRole } from "../../../lib/auth";
import { withCORS } from "../../../lib/cors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    const gate = requireRole(req, ["admin", "manager", "master"]);
    if (!gate.ok) return withCORS(NextResponse.json({ error: gate.error }, { status: gate.status }));

    const uploadedBy = gate.claims?.sub;
    const uploadedRole = gate.claims?.role;

    if (!uploadedBy || !uploadedRole) {
        return withCORS(NextResponse.json({ message: "User information missing" }, { status: 400 }));
    }

    await connectDB();

    const form = await req.formData();
    const file = form.get("file") as File | null;
    const title = (form.get("title") as string) || "";

    if (!file) {
        return withCORS(NextResponse.json({ message: "file is required" }, { status: 400 }));
    }

    let imageUrl: string;
    try {
        const buffer = await webFileToBuffer(file);
        const saved = await saveBufferAsPublicFile(buffer, file.type || "application/octet-stream", {
            subdir: "uploads/banners",
            allowed: DEFAULT_ALLOWED,
            maxBytes: 5 * 1024 * 1024,
            detectMeta: true,
            prefix: title || "banner",
        });
        imageUrl = saved.url;
    } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to store file";
        return withCORS(NextResponse.json({ message }, { status: 400 }));
    }

    const banner = await Banner.create({ title, imageUrl, isActive: false, uploadedBy, uploadedRole });
    return withCORS(NextResponse.json(banner, { status: 201 }));
}


export async function GET(req: NextRequest) {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const active = searchParams.get("active");

    const filter: Record<string, any> = {};
    if (active === "1") filter.isActive = true;

    const banners = await Banner.find(filter).sort({ createdAt: -1 }).lean();

    const res = NextResponse.json(banners, { status: 200 });
    res.headers.set("Cache-Control", "no-store");
    return withCORS(res);
}
