import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../../../../../app/api/v1/lib/db";
import Banner from "../../../../../../../../app/api/v1/models/Banner";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    await connectDB();
    const banner = await Banner.findById(params.id);
    if (!banner) return NextResponse.json({ message: "Not found" }, { status: 404 });

    banner.isActive = !banner.isActive;
    await banner.save();

    return NextResponse.json({ id: banner.id, isActive: banner.isActive });
}
