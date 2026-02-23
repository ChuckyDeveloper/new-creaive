import { NextRequest, NextResponse } from "next/server";
import { FilterQuery, Types } from "mongoose";
import { connectDB } from "../../../../lib/db";
import CustomerBrand, { ICustomerBrand } from "../../../../models/CustomerBrand";

export const dynamic = "force-dynamic";

function projectionFrom(fieldsParam: string | null) {
    return fieldsParam ? fieldsParam.split(",").join(" ") : undefined;
}

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
    try {
        await connectDB();
        
        const idOrSlug = decodeURIComponent(params.slug ?? "").trim();
        if (!idOrSlug) {
            return NextResponse.json({ error: "Missing brand identifier." }, { status: 400 });
        }

        const url = new URL(req.url);
        const projection = projectionFrom(url.searchParams.get("fields")) || "_id name slug description logoUrl coverUrl createdAt updatedAt";

        const isObjectId = Types.ObjectId.isValid(idOrSlug);
        const baseFilter: FilterQuery<ICustomerBrand> = isObjectId
            ? { _id: idOrSlug }
            : { slug: idOrSlug.toLowerCase() };

        const filter: FilterQuery<ICustomerBrand> = {
            ...baseFilter,
            $and: [
                { $or: [{ visibility: "public" }, { visibility: { $exists: false } }] },
                { $or: [{ status: "active" }, { status: { $exists: false } }] },
            ],
        };

        const brand = await CustomerBrand.findOne(filter, projection).lean().exec();
        if (!brand) {
            return NextResponse.json({ error: "Brand not found." }, { status: 404 });
        }

        const res = NextResponse.json({ item: brand });
        res.headers.set("Cache-Control", "public, max-age=60");
        return res;
    } catch (err) {
        console.error("[CustomerBrands][PUBLIC][GET:one] error:", err);
        return NextResponse.json({ error: "Failed to load brand." }, { status: 500 });
    }
}
