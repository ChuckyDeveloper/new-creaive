// import { NextRequest, NextResponse } from "next/server";
// import { Types } from "mongoose";
// import { connectDB } from "../../../lib/db";
// import ProductContent from "../../../models/ProductContent";
// import CustomerBrand from "../../../models/CustomerBrand";
// import { num, truthy } from "../../../lib/helper";

// export const dynamic = "force-dynamic";

// export async function GET(req: NextRequest) {
//     try {
//         await connectDB();
//         const url = new URL(req.url);

//         const q = url.searchParams.get("q");
//         const category = url.searchParams.get("category");
//         const tag = url.searchParams.get("tag");

//         const page = num(url.searchParams.get("page"), 1);
//         const limitParam = url.searchParams.get("limit");
//         const sortParam = url.searchParams.get("sort") || "-publishedAt,-createdAt";
//         const fieldsParam = url.searchParams.get("fields");

//         const wantAll = truthy(url.searchParams.get("all")) || (limitParam?.toLowerCase() === "all");
//         const limit = wantAll ? Number.MAX_SAFE_INTEGER : Math.min(num(limitParam, 20), 100);
//         const now = new Date();
//         const filter: any = {
//             visibility: "public",
//             status: { $in: ["published", "scheduled"] },
//             // $and: [
//             //     { $or: [{ publishedAt: { $exists: false } }, { publishedAt: { $lte: now } }] },
//             //     { $or: [{ unpublishedAt: { $exists: false } }, { unpublishedAt: { $gt: now } }] },
//             // ],
//         };
//         if (q) filter.$text = { $search: q };
//         if (category) filter.categories = category;
//         if (tag) filter.tags = tag;

//         const total = await ProductContent.countDocuments(filter);
//         const projection = fieldsParam ? fieldsParam.split(",").join(" ") : undefined;
//         let query = ProductContent.find(filter, projection).sort(sortParam.split(",").join(" "));

//         if (!wantAll) {
//             query = query.skip((page - 1) * limit).limit(limit);
//         }

//         const items = await query.lean();

//         return NextResponse.json({
//             mode: wantAll ? "all" : "paged",
//             page: wantAll ? 1 : page,
//             limit: wantAll ? items.length : limit,
//             total,
//             pages: wantAll ? 1 : Math.max(1, Math.ceil(total / limit)),
//             items,
//         });
//     } catch (err) {
//         console.error("[ProductContents][PUBLIC][GET] error:", err);
//         return NextResponse.json({ error: "Failed to list published content." }, { status: 500 });
//     }
// }

// app/api/v1/controllers/products/public/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectDB } from "../../../lib/db";
import ProductContent from "../../../models/ProductContent";
import CustomerBrand from "../../../models/CustomerBrand";
import { num, truthy } from "../../../lib/helper";

/** Treat "published now" as:
 *  - status === "published"
 *  - (publishedAt unset OR <= now)
 *  - (unpublishedAt unset OR > now)
 */

export const dynamic = "force-dynamic";

function splitCSV(v: string | null) {
  return (v ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const url = new URL(req.url);

    // search & filters
    const q = url.searchParams.get("q");
    const category = url.searchParams.get("category");

    // accept both ?tag=foo&tag=bar and ?tags=foo,bar
    const tagParams = [
      ...url.searchParams.getAll("tag"),
      ...splitCSV(url.searchParams.get("tags")),
    ];
    const tagMode = (url.searchParams.get("tagMode") || "any").toLowerCase(); // "any" | "all"

    // pagination, sorting, fields
    const page = Math.max(1, num(url.searchParams.get("page"), 1));
    const limitParam = url.searchParams.get("limit");
    const wantAll =
      truthy(url.searchParams.get("all")) ||
      limitParam?.toLowerCase() === "all";
    const limit = wantAll
      ? Number.MAX_SAFE_INTEGER
      : Math.min(num(limitParam, 20), 100);
    const sortParam = url.searchParams.get("sort") || "-publishedAt,-createdAt";
    const fieldsParam = url.searchParams.get("fields");
    const withBrand = truthy(url.searchParams.get("withBrand")); // ?withBrand=1 to populate brand

    const now = new Date();

    // --- build filter: only "published now"
    const filter: any = {
      visibility: "public",
      status: "published",
      // $and: [
      //     { $or: [{ publishedAt: { $exists: false } }, { publishedAt: { $lte: now } }] },
      //     { $or: [{ unpublishedAt: { $exists: false } }, { unpublishedAt: { $gt: now } }] },
      // ],
    };

    if (q) filter.$text = { $search: q };
    if (category) filter.categories = category;

    if (tagParams.length) {
      filter.tags =
        tagMode === "all" ? { $all: tagParams } : { $in: tagParams };
    }
    const brandParam =
      url.searchParams.get("brand") ||
      url.searchParams.get("brandId") ||
      url.searchParams.get("brand_id") ||
      url.searchParams.get("brandSlug");

    if (brandParam) {
      let brandId: Types.ObjectId | null = null;
      if (Types.ObjectId.isValid(brandParam)) {
        brandId = new Types.ObjectId(brandParam);
      } else {
        type LeanBrandId = { _id: Types.ObjectId };
        const brandDoc = await CustomerBrand.findOne(
          { slug: brandParam.toLowerCase() },
          { _id: 1 }
        )
          .lean<LeanBrandId>()
          .exec();
        brandId = brandDoc?._id ?? null;
      }

      if (!brandId) {
        return NextResponse.json({
          mode: wantAll ? "all" : "paged",
          page: wantAll ? 1 : page,
          limit: 0,
          total: 0,
          pages: 1,
          items: [],
        });
      }

      filter.brandId = brandId;
    }

    // projection & query
    const projection = fieldsParam
      ? fieldsParam.split(",").join(" ")
      : undefined;

    const total = await ProductContent.countDocuments(filter);

    let query = ProductContent.find(filter, projection).sort(
      sortParam.split(",").join(" ")
    );
    if (withBrand) {
      query = query.populate({
        path: "brandId",
        select: "name slug logoUrl coverUrl description",
      });
    }
    if (!wantAll) {
      query = query.skip((page - 1) * limit).limit(limit);
    }

    // NOTE: using lean() -> schema toJSON transform won’t run, so massage brand manually
    const docs = await query.lean().exec();
    const items = docs.map((d: any) => {
      if (withBrand && d.brandId && d.brandId._id) {
        return { ...d, brand: d.brandId, brandId: d.brandId._id };
      }
      return d;
    });

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

// Query examples

// Only currently published (default) and filter by one tag:
// /api/v1/controllers/products/public?tag=ai-humans

// Multiple tags (ANY):
// /api/v1/controllers/products/public?tags=ai-humans,holovue

// Multiple tags (ALL):
// /api/v1/controllers/products/public?tags=ai-humans,holovue&tagMode=all

// Include populated brand:
// /api/v1/controllers/products/public?withBrand=1&fields=title,slug,images,tags
