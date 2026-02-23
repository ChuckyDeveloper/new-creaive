import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import User, { Role, ROLES } from "../../../../../../../app/api/v1/models/User";
import { requireRole } from "../../../../../../../app/api/v1/lib/auth";
import { logger } from "../../../../../../../app/api/v1/lib/logger";
import { connectDB } from "../../../../../../../app/api/v1/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    const auth = requireRole(req, ["master"]); // ✅ เฉพาะ master
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const id = params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ error: "INVALID_ID" }, { status: 400 });
    }

    let body: { role?: Role } = {};
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 });
    }

    const newRole = body.role;
    if (!newRole || !ROLES.includes(newRole)) {
        return NextResponse.json({ error: "INVALID_ROLE" }, { status: 400 });
    }

    logger.request(req, "access role patch", { id, by: auth.claims?.sub, role: newRole });
    await connectDB();

    const updated = await User.findByIdAndUpdate(
        id,
        { $set: { role: newRole } },
        { new: true, lean: true }
    );

    if (!updated) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    logger.response(req, 200, { id });
    return NextResponse.json({ ok: true, user: updated });
}


export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const auth = requireRole(req, ["master"]);
    if (!auth.ok) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    try {
        logger.request(req, "access user delete", { id, by: auth.claims?.sub });
        await connectDB();
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        logger.response(req, 200, { id });
        return NextResponse.json({
            ok: true,
            message: "User successfully deleted",
            user: deletedUser,
        });
    } catch (error) {
        logger.failure(req, error, { id });
        return NextResponse.json({
            error: "Failed to delete user",
            details: error instanceof Error ? error.message : error,
        }, { status: 500 });
    }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    // const auth = requireRole(req, ["master", "admin", "manager"]);
    // if (!auth.ok) {
    //     return NextResponse.json({ error: auth.error }, { status: auth.status });
    // }

    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    try {
        await connectDB();
        const user = await User.findById(id).lean();

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        logger.response(req, 200, { id });
        return NextResponse.json({ ok: true, user });
    } catch (error) {
        logger.failure(req, error, { id });
        return NextResponse.json({
            error: "Failed to fetch user",
            details: error instanceof Error ? error.message : error,
        }, { status: 500 });
    }
}
