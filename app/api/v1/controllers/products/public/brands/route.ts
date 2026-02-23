// app/api/v1/product-contents/public/route.ts
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "../../../../lib/db";
import ProductContent from "../../../../models/ProductContent";
import CustomerBrand from "../../../../models/CustomerBrand"; // <— ใช้โมเดลนี้
import { num, truthy } from "../../../../lib/helper";

export const dynamic = "force-dynamic";

const isObjectId = (v?: string | null) =>
    !!v && mongoose.Types.ObjectId.isValid(v || "");

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const url = new URL(req.url);

        const q = url.searchParams.get("q");
        const category = url.searchParams.get("category");
        const tag = url.searchParams.get("tag");

        // รองรับการฟิลเตอร์แบรนด์ทั้งแบบ id/slug
        const brandParam =
            url.searchParams.get("brand") ||
            url.searchParams.get("brandId") ||
            url.searchParams.get("brand_id") ||
            url.searchParams.get("brandSlug");

        // โหมดดึง “เฉพาะแบรนด์”
        const onlyBrands =
            (url.searchParams.get("only") || "").toLowerCase() === "brands" ||
            (url.searchParams.get("distinct") || "").toLowerCase() === "brand";

        const page = num(url.searchParams.get("page"), 1);
        const limitParam = url.searchParams.get("limit");
        const sortParam = url.searchParams.get("sort") || "-publishedAt,-createdAt";
        const fieldsParam = url.searchParams.get("fields"); // e.g. "title,slug,images"

        const wantAll =
            truthy(url.searchParams.get("all")) ||
            (limitParam || "").toLowerCase() === "all";
        const limit = wantAll
            ? Number.MAX_SAFE_INTEGER
            : Math.min(num(limitParam, 20), 100);

        // ฟิลด์แบรนด์ใน ProductContent (รองรับทั้ง brandId/brand)
        const brandField =
            "brandId" in (ProductContent as any).schema.paths ? "brandId" : "brand";

        const filter: any = {
            visibility: "public",
            // ถ้าจะบังคับตามเวลาการเผยแพร่ เปิดคอมเมนต์ชุดนี้ได้
            // status: { $in: ["published", "scheduled"] },
            // $and: [
            //   { $or: [{ publishedAt: { $exists: false } }, { publishedAt: { $lte: new Date() } }] },
            //   { $or: [{ unpublishedAt: { $exists: false } }, { unpublishedAt: { $gt: new Date() } }] },
            // ],
        };

        if (q) filter.$text = { $search: q };
        if (category) filter.categories = category;
        if (tag) filter.tags = tag;

        // ฟิลเตอร์ด้วยแบรนด์ (id/slug)
        let brandId: mongoose.Types.ObjectId | null = null;
        if (brandParam) {
            if (mongoose.Types.ObjectId.isValid(brandParam)) {
                brandId = new mongoose.Types.ObjectId(brandParam);
            } else {
                // 👇 Tell TS exactly what lean() returns
                type LeanId = { _id: mongoose.Types.ObjectId };
                const b = await CustomerBrand
                    .findOne({ slug: brandParam }, { _id: 1 })
                    .lean<LeanId>()                // <— key line
                    .exec();

                brandId = b?._id ?? null;
            }
            if (!brandId) {
                return NextResponse.json({
                    mode: onlyBrands ? "brands" : "paged",
                    page: 1,
                    limit: 0,
                    total: 0,
                    pages: 1,
                    items: [],
                });
            }
            filter[brandField] = brandId;
        }

        // ---------- โหมด: ดึงเฉพาะ “แบรนด์ที่มีคอนเทนต์” ----------
        if (onlyBrands) {
            // อยากได้ทุกฟิลด์ของแบรนด์: ไม่ต้องใส่ projection (ปล่อย undefined)
            // ถ้าอยากเลือกฟิลด์บางตัว รองรับ ?fields=name,slug,logoUrl,coverUrl
            const projection = fieldsParam ? fieldsParam.split(",").join(" ") : undefined;

            // filter เพิ่มได้ถ้าต้องการ เช่น q (ค้นหาแบบเบา ๆ ด้วย regex)
            const brandFilter: any = {};
            if (q) {
                brandFilter.$or = [
                    { name: { $regex: q, $options: "i" } },
                    { slug: { $regex: q, $options: "i" } },
                    { description: { $regex: q, $options: "i" } },
                ];
            }

            // เรียงตามชื่อ (หรือจะใช้ sortParam ก็ได้)
            const sort = { name: 1 };

            if (wantAll) {
                const items = await CustomerBrand.find()

                return NextResponse.json({
                    mode: "brands",
                    page: 1,
                    limit: items.length,
                    total: items.length,
                    pages: 1,
                    items,
                });
            }

            const total = await CustomerBrand.countDocuments(brandFilter).exec();
            const skip = (page - 1) * limit;

            const items = await CustomerBrand.find(brandFilter, projection)
                .skip(skip)
                .limit(limit)
                .lean()
                .exec();

            return NextResponse.json({
                mode: "brands",
                page,
                limit,
                total,
                pages: Math.max(1, Math.ceil(total / limit)),
                items,
            });
        }

        // ---------- โหมดปกติ: คอนเทนต์ ----------
        const total = await ProductContent.countDocuments(filter);

        const projection = fieldsParam
            ? fieldsParam.split(",").join(" ")
            : undefined;

        let query = ProductContent.find(filter, projection).sort(
            sortParam.split(",").join(" ")
        );

        if (!wantAll) {
            query = query.skip((page - 1) * limit).limit(limit);
        }

        const items = await query.lean().exec();

        return NextResponse.json({
            mode: wantAll ? "all" : "paged",
            page: wantAll ? 1 : page,
            limit: wantAll ? items.length : limit,
            total,
            pages: wantAll ? 1 : Math.max(1, Math.ceil(total / limit)),
            items,
        });
    } catch (err) {
        console.error("[ProductContents][PUBLIC][GET] error:", err);
        return NextResponse.json(
            { error: "Failed to list published content." },
            { status: 500 }
        );
    }
}



// GET /api/v1/product-contents/public?only=brands
// GET /api/v1/product-contents/public?only=brands&all=1            // ทั้งหมด
// GET /api/v1/product-contents/public?only=brands&page=1&limit=12   // แบ่งหน้า
// GET /api/v1/product-contents/public?only=brands&category=ai
// GET /api/v1/product-contents/public?only=brands&q=hologram
// GET /api/v1/product-contents/public?only=brands&brand=68c78e68af45173e1c14178f
// GET /api/v1/product-contents/public?only=brands&brand=my-brand-slug