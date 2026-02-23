import { NextRequest, NextResponse } from "next/server";
import { FilterQuery, Types } from "mongoose";
import { connectDB } from "../../../lib/db";
import CustomerBrand, { ICustomerBrand } from "../../../models/CustomerBrand";
import { num, truthy } from "../../../lib/helper";

export const dynamic = "force-dynamic";


function splitCSV(v: string | null) {
    return (v ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
}

function parseObjectIds(values: string[]) {
    return values
        .map((v) => (Types.ObjectId.isValid(v) ? new Types.ObjectId(v) : null))
        .filter((v): v is Types.ObjectId => v !== null);
}


function buildPublicFilter(url: URL): FilterQuery<ICustomerBrand> {
    const clauses: FilterQuery<ICustomerBrand>[] = [];
    const q = url.searchParams.get("q")?.trim();

    if (q) {
        const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\$&"), "i");
        clauses.push({ $or: [{ name: rx }, { slug: rx }, { description: rx }] });
    }

    const slugParams = [
        ...url.searchParams.getAll("slug"),
        ...splitCSV(url.searchParams.get("slugs")),
    ].map((s) => s.toLowerCase());
    if (slugParams.length) {
        clauses.push({ slug: { $in: slugParams } });
    }

    const idParams = [
        ...url.searchParams.getAll("id"),
        ...splitCSV(url.searchParams.get("ids")),
    ];
    const objectIds = parseObjectIds(idParams);
    if (objectIds.length) {
        clauses.push({ _id: { $in: objectIds } });
    }

    const visibilityParam = (url.searchParams.get("visibility") || "public").toLowerCase();
    if (visibilityParam === "public") {
        clauses.push({ visibility: "public" });
    } else if (visibilityParam !== "any") {
        clauses.push({ visibility: visibilityParam });
    }

    const now = new Date();
    clauses.push({ status: "active" });
    clauses.push({
        $or: [
            { publishedAt: { $exists: false } },
            { publishedAt: null },
            { publishedAt: { $lte: now } },
        ],
    });
    clauses.push({
        $or: [
            { unpublishedAt: { $exists: false } },
            { unpublishedAt: null },
            { unpublishedAt: { $gt: now } },
        ],
    });

    if (!clauses.length) return {};
    if (clauses.length === 1) return clauses[0];
    return { $and: clauses };
}

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const url = new URL(req.url);

        console.log("test brands api")

        const page = Math.max(1, num(url.searchParams.get("page"), 1));
        const limitParam = url.searchParams.get("limit");
        const wantAll = truthy(url.searchParams.get("all")) || limitParam?.toLowerCase() === "all";
        const limit = wantAll ? Number.MAX_SAFE_INTEGER : Math.min(num(limitParam, 20), 100);
        const sortParam = url.searchParams.get("sort") || "name";
        const fieldsParam = url.searchParams.get("fields");
        const projection = fieldsParam ? fieldsParam.split(",").join(" ") : undefined;

        const filter = buildPublicFilter(url);
        const total = await CustomerBrand.countDocuments(filter);

        let query = CustomerBrand.find(filter, projection).sort(sortParam.split(",").join(" "));
        if (!wantAll) {
            query = query.skip((page - 1) * limit).limit(limit);
        }

        const items = await query.lean().exec();

        return NextResponse.json({
            page: wantAll ? 1 : page,
            limit: wantAll ? items.length : limit,
            total,
            pages: wantAll ? 1 : Math.max(1, Math.ceil(total / limit)),
            mode: wantAll ? "all" : "paged",
            items,
        });
    } catch (err) {
        console.error("[CustomerBrands][PUBLIC][GET] error:", err);
        return NextResponse.json({ error: "Failed to list public brands." }, { status: 500 });
    }
}
