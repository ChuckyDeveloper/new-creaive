import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/api/v1/lib/db";
import ProductContent from "@/app/api/v1/models/ProductContent";
// 👇 สำคัญ: import เพื่อ register schema เข้ากับ mongoose connection
import CustomerBrand from "@/app/api/v1/models/CustomerBrand";
import { Types } from "mongoose";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
    try {
        await connectDB();

        const idOrSlug = decodeURIComponent(params.slug);
        const filter = Types.ObjectId.isValid(idOrSlug) ? { _id: idOrSlug } : { slug: idOrSlug };

        const doc = await ProductContent.findOne(filter)
            // ระบุ model ชัด ๆ ก็ได้ (ไม่ก็แค่ import ด้านบนพอ)
            .populate({ path: "brandId", model: CustomerBrand, select: "name slug logoUrl coverUrl description" })
            .lean();

        if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

        const out = {
            ...doc,
            brand: (doc as any).brandId,                         // object ที่ populate แล้ว
            brandId: (doc as any).brandId?._id ?? (doc as any).brandId, // คงค่า id ไว้ใน field brandId
        };

        return NextResponse.json(out);
    } catch (err) {
        console.error("[ProductContents][PUBLIC][GET:slug] error:", err);
        return NextResponse.json({ error: "Failed to load content." }, { status: 500 });
    }
}
