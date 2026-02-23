import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Banner from "../../../../../../../../app/api/v1/models/Banner";
import { connectDB } from "../../../../../../../../app/api/v1/lib/db";
import { requireRole } from "../../../../../../../../app/api/v1/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const gate = requireRole(req, ["admin", "manager", "master"]);
    if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });

    await connectDB();

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ ok: false, error: "Invalid id" }, { status: 400 });
    }

    const target = await Banner.findById(id).lean() as { isActive: boolean, _id: string } | null;
    if (!target) {
        return NextResponse.json({ ok: false, error: "Banner not found" }, { status: 404 });
    }

    const activeCount = await Banner.countDocuments({ isActive: true });

    if (target.isActive) {
        if (activeCount > 1) {
            await Banner.updateMany(
                { _id: { $ne: id }, isActive: true },
                { $set: { isActive: false } }
            );
            return NextResponse.json({
                ok: true,
                id,
                alreadyActive: true,
                normalized: true,
            });
        }

        return NextResponse.json({ ok: true, id, alreadyActive: true });
    }

    if (activeCount === 0) {
        try {
            await Banner.updateOne({ _id: id }, { $set: { isActive: true } });
            return NextResponse.json({ ok: true, id, activated: true, fromEmpty: true });
        } catch (e: any) {
            if (e?.code === 11000) {
                // rare race; ให้ลองใหม่ด้านล่าง
            } else {
                return NextResponse.json(
                    { ok: false, error: e?.message ?? "activate failed" },
                    { status: 400 }
                );
            }
        }
    }

    const tryActivate = async () => {
        await Banner.updateMany(
            { _id: { $ne: id }, isActive: true },
            { $set: { isActive: false } }
        );
        await Banner.updateOne({ _id: id }, { $set: { isActive: true } });
    };

    let attempt = 0;
    while (attempt < 3) {
        try {
            await tryActivate();
            return NextResponse.json({ ok: true, id, switched: true });
        } catch (e: any) {
            if (e?.code === 11000) {
                attempt++;
                continue;
            }
            console.error("ACTIVATE ERROR:", e);
            return NextResponse.json(
                { ok: false, error: e?.message ?? "activate failed" },
                { status: 400 }
            );
        }
    }

    return NextResponse.json(
        { ok: false, error: "activate race condition, please retry" },
        { status: 409 }
    );
}
