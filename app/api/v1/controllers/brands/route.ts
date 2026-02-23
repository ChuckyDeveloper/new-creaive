// app/api/v1/controllers/brands/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "../../lib/auth";
import { connectDB } from "../../lib/db";
import CustomerBrand from "../../models/CustomerBrand";
import { num, slugify, truthy } from "../../lib/helper";
import { saveUpload } from "../../lib/saveUpload";

export const runtime = "nodejs";        // need FS
export const dynamic = "force-dynamic";


// ---------- GET /api/v1/controllers/brands ----------
export async function GET(req: NextRequest) {
    const gate = requireRole(req, ["manager", "admin", "master"]);
    if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });

    try {
        await connectDB();
        const url = new URL(req.url);

        // ค้นหาแบบบางเบา: q จะจับ name หรือ slug (case-insensitive)
        const q = url.searchParams.get("q");

        const page = num(url.searchParams.get("page"), 1);
        const limitParam = url.searchParams.get("limit");
        const wantAll = truthy(url.searchParams.get("all")) || limitParam?.toLowerCase() === "all";
        const limit = wantAll ? Number.MAX_SAFE_INTEGER : Math.min(num(limitParam, 20), 100);

        // เริ่มที่ sort ตามชื่อ ascending; อนุญาต เช่น sort="-createdAt,name"
        const sortParam = url.searchParams.get("sort") || "name";
        const fieldsParam = url.searchParams.get("fields"); // e.g. "_id,name,slug,logoUrl,coverUrl"
        const projection = fieldsParam ? fieldsParam.split(",").join(" ") : undefined;

        const filter: any = {};
        if (q && q.trim()) {
            const rx = new RegExp(q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
            filter.$or = [{ name: rx }, { slug: rx }];
        }

        let query = CustomerBrand.find(filter, projection).sort(sortParam.split(",").join(" "));
        const total = await CustomerBrand.countDocuments(filter);

        if (!wantAll) {
            query = query.skip((page - 1) * limit).limit(limit);
        }
        const items = await query.lean();

        return NextResponse.json({
            scope: "admin",
            mode: wantAll ? "all" : "paged",
            page: wantAll ? 1 : page,
            limit: wantAll ? items.length : limit,
            total,
            pages: wantAll ? 1 : Math.max(1, Math.ceil(total / limit)),
            items,
        });
    } catch (err) {
        console.error("[CustomerBrands][GET:list] error:", err);
        return NextResponse.json({ error: "Failed to list brands." }, { status: 500 });
    }
}

/* -----------------------------------------------------
   หมายเหตุ:
   - ฝั่ง UI เรียก /brands?all=1&fields=_id,name,slug,logoUrl,coverUrl
     → API นี้รองรับครบ (รองรับ q, sort, paging, projection)
   - ยังคง requireRole แบบเดียวกับ product-contents
----------------------------------------------------- */

// ----- ด้านล่างคง POST เดิมไว้ (ยกมาจากคำตอบก่อนหน้า) -----
/* ... POST implementation from previous message stays here ... */

// ---- POST /api/v1/controllers/brands ----
export async function POST(req: NextRequest) {
    const gate = requireRole(req, ["manager", "admin", "master"]);
    if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });

    try {
        await connectDB();

        const ct = req.headers.get("content-type") || "";
        const actorId = gate.claims?.sub;

        let name = "";
        let slug = "";
        let description = "";
        let logoUrl: string | null = null;
        let coverUrl: string | null = null;

        if (ct.includes("multipart/form-data")) {
            // ----- multipart path -----
            const form = await req.formData();

            name = (form.get("name") as string | null)?.trim() || "";
            slug = (form.get("slug") as string | null)?.trim() || "";
            description = (form.get("description") as string | null)?.trim() || "";

            if (!name) {
                return NextResponse.json({ error: "Name is required." }, { status: 400 });
            }

            if (!slug) slug = slugify(name);
            else slug = slugify(slug);

            // files
            const logo = form.get("logo") as unknown as File | null;
            const cover = form.get("cover") as unknown as File | null;

            logoUrl = await saveUpload(logo instanceof File ? logo : null, "brands");
            coverUrl = await saveUpload(cover instanceof File ? cover : null, "brands");
        } else {
            // ----- JSON path -----
            const body = await req.json().catch(() => ({} as any));
            name = (body?.name ?? "").toString().trim();
            slug = (body?.slug ?? "").toString().trim();
            description = (body?.description ?? "").toString().trim();
            logoUrl = body?.logoUrl ? String(body.logoUrl) : null;
            coverUrl = body?.coverUrl ? String(body.coverUrl) : null;

            if (!name) {
                return NextResponse.json({ error: "Name is required." }, { status: 400 });
            }
            if (!slug) slug = slugify(name);
            else slug = slugify(slug);
        }

        const payload: any = {
            name,
            slug,
            description,
        };

        if (logoUrl) payload.logoUrl = logoUrl;
        if (coverUrl) payload.coverUrl = coverUrl;
        if (actorId) {
            payload.createdBy = actorId;
            payload.updatedBy = actorId;
        }

        // Create
        const doc = await CustomerBrand.create(payload);
        return NextResponse.json({ success: true, item: doc });
    } catch (err: any) {
        // duplicate slug
        if (err?.code === 11000 && (err?.keyPattern?.slug || err?.keyValue?.slug)) {
            return NextResponse.json({ error: "Slug already exists." }, { status: 409 });
        }

        console.error("[CustomerBrands][POST] error:", err);
        return NextResponse.json({ error: "Failed to create brand." }, { status: 500 });
    }
}
