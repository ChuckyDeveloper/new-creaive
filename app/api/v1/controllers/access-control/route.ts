import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../lib/db";
import User, { ROLES } from "../../../../../app/api/v1/models/User";
import { requireRole } from "../../lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    const auth = requireRole(req, ["master"]); // ✅ เฉพาะ master
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    await connectDB();

    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();
    const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10) || 20, 100);
    const page = Math.max(parseInt(searchParams.get("page") || "1", 10) || 1, 1);

    const filter: any = {};
    if (q) {
        filter.$or = [
            { email: { $regex: q, $options: "i" } },
            { username: { $regex: q, $options: "i" } },
            { firstName: { $regex: q, $options: "i" } },
            { lastName: { $regex: q, $options: "i" } },
        ];
    }

    const total = await User.countDocuments(filter);
    const items = await User.find(filter)
        .select("+provider +providerId +role +emailVerified") // passwordHash ถูกซ่อนอยู่แล้ว
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

    return NextResponse.json({ items, total, page, limit, roles: ROLES });
}