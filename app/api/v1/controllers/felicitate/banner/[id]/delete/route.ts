import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "../../../../../../../../app/api/v1/lib/auth";
import { connectDB } from "../../../../../../../../app/api/v1/lib/db";
import Banner from "../../../../../../../../app/api/v1/models/Banner";

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
    const gate = requireRole(_req, ["admin", "manager", "master"]);
    if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });

    await connectDB();

    const { id } = params;

    try {
        const banner = await Banner.findByIdAndDelete(id);
        if (!banner) {
            return NextResponse.json({ error: "Banner not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Banner deleted successfully" }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: "Failed to delete banner", details: err }, { status: 500 });
    }
}
