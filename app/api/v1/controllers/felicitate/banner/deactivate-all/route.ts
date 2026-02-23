import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../../../../app/api/v1/lib/db";
import Banner from "../../../../../../../app/api/v1/models/Banner";
import { requireRole } from "../../../../../../../app/api/v1/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest) {
    const gate = requireRole(req, ["admin", "manager", "master"]);
    if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });

    await connectDB();
    const res = await Banner.updateMany(
        { isActive: true },
        { $set: { isActive: false } }
    );
    return NextResponse.json({
        ok: true,
        matched: res.matchedCount,        // mongoose version compatibility
        deactivated: res.modifiedCount,
    });
}
