import { NextResponse } from "next/server";
import FelicitateImage from "../../../models/FelicitateImage";
import { connectDB } from "../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  await connectDB();
  const now = new Date();

  const q = {
    enabled: true,
    $and: [
      { $or: [{ startsAt: null }, { startsAt: { $lte: now } }, { startsAt: { $exists: false } }] },
      { $or: [{ endsAt: null }, { endsAt: { $gte: now } }, { endsAt: { $exists: false } }] },
    ],
  };

  const doc = await FelicitateImage.findOne(q).sort({ priority: -1, updatedAt: -1 }).lean();
  return NextResponse.json({ modal: doc || null }, { status: 200 });
}
