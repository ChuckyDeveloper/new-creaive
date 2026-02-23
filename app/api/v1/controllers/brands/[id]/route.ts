// app/api/v1/controllers/brands/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { requireRole, type Claims } from "../../../lib/auth";
import { connectDB } from "../../../lib/db";
import CustomerBrand, { BrandStatus, BrandVisibility } from "../../../models/CustomerBrand";
import { slugify } from "../../../lib/helper";
import { saveUpload } from "../../../lib/saveUpload";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ADMIN_ROLES: Claims["role"][] = ["manager", "admin", "master"];

const STATUS_VALUES = new Set<BrandStatus>(["active", "archived"]);
const VISIBILITY_VALUES = new Set<BrandVisibility>(["public", "private", "roles"]);

type BrandFilter = { _id: string } | { slug: string };

function projectionFrom(fieldsParam: string | null) {
    return fieldsParam
        ? fieldsParam.split(",").join(" ")
        : "_id name slug description logoUrl coverUrl status visibility publishedAt unpublishedAt createdAt updatedAt";
}

function buildFilter(raw: string | undefined): BrandFilter | null {
    const idOrSlug = (raw || "").trim();
    if (!idOrSlug) return null;
    return Types.ObjectId.isValid(idOrSlug)
        ? { _id: idOrSlug }
        : { slug: idOrSlug.toLowerCase() };
}

async function loadBrandDocument(filter: BrandFilter) {
    return CustomerBrand.findOne(filter).exec();
}

// GET /api/v1/controllers/brands/:id
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB();

        const filter = buildFilter(params.id);
        if (!filter) {
            return NextResponse.json({ error: "Missing id or slug." }, { status: 400 });
        }

        const url = new URL(req.url);
        const projection = projectionFrom(url.searchParams.get("fields"));

        const brand = await CustomerBrand.findOne(filter, projection).lean();
        if (!brand) {
            return NextResponse.json({ error: "Brand not found." }, { status: 404 });
        }

        const res = NextResponse.json(
            {
                page: "brand",
                item: brand,
            },
            { status: 200 }
        );
        res.headers.set("Cache-Control", "public, max-age=60");
        return res;
    } catch (err) {
        console.error("[CustomerBrands][GET:one] error:", err);
        return NextResponse.json({ error: "Failed to load brand." }, { status: 500 });
    }
}

// PATCH /api/v1/controllers/brands/:id
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    const gate = requireRole(req, ADMIN_ROLES);
    if (!gate.ok) {
        return NextResponse.json({ error: gate.error }, { status: gate.status });
    }

    try {
        await connectDB();

        const filter = buildFilter(params.id);
        if (!filter) {
            return NextResponse.json({ error: "Missing id or slug." }, { status: 400 });
        }

        const brandDoc = await loadBrandDocument(filter);
        if (!brandDoc) {
            return NextResponse.json({ error: "Brand not found." }, { status: 404 });
        }

        const ct = req.headers.get("content-type") || "";

        let nextName = brandDoc.name;
        let nextSlug = brandDoc.slug;
        let nextDescription = brandDoc.description || "";
        let nextLogo = brandDoc.logoUrl;
        let nextCover = brandDoc.coverUrl;
        let nextStatus: BrandStatus = (brandDoc.status as BrandStatus) || "active";
        let nextVisibility: BrandVisibility = (brandDoc.visibility as BrandVisibility) || "public";
        let nextAllowedRoles: string[] | undefined = Array.isArray(brandDoc.allowedRoles) ? [...brandDoc.allowedRoles] : undefined;
        let nextPublishedAt: Date | null = brandDoc.publishedAt ?? null;
        let nextUnpublishedAt: Date | null = brandDoc.unpublishedAt ?? null;

        const parseDate = (value: unknown) => {
            if (value === null) return null;
            if (value instanceof Date) {
                return Number.isNaN(value.getTime()) ? undefined : value;
            }
            if (typeof value === "number") {
                const dt = new Date(value);
                return Number.isNaN(dt.getTime()) ? undefined : dt;
            }
            if (typeof value !== "string") return undefined;
            const trimmed = value.trim();
            if (!trimmed) return null;
            const dt = new Date(trimmed);
            return Number.isNaN(dt.getTime()) ? undefined : dt;
        };


        const normalizeRoles = (value: unknown): string[] | undefined => {
            if (!value) return undefined;
            const parts: string[] = [];
            if (Array.isArray(value)) {
                for (const entry of value) {
                    if (typeof entry === "string") {
                        const trimmed = entry.trim();
                        if (trimmed) parts.push(trimmed);
                    }
                }
            } else if (typeof value === "string") {
                try {
                    const parsed = JSON.parse(value);
                    if (Array.isArray(parsed)) {
                        return normalizeRoles(parsed);
                    }
                } catch (err) {
                    // not json, ignore
                }
                value.split(',').forEach((part) => {
                    const trimmed = part.trim();
                    if (trimmed) parts.push(trimmed);
                });
            }
            return parts.length ? Array.from(new Set(parts)) : undefined;
        };
        const applyCommonFields = (get: (key: string) => unknown) => {
            const nameField = get("name");
            if (typeof nameField === "string") nextName = nameField.trim();

            const slugField = get("slug");
            if (typeof slugField === "string") {
                const trimmed = slugField.trim();
                nextSlug = trimmed ? trimmed : nextName;
            }

            const descriptionField = get("description");
            if (typeof descriptionField === "string") nextDescription = descriptionField.trim();

            const statusField = get("status");
            if (typeof statusField === "string" && STATUS_VALUES.has(statusField as BrandStatus)) {
                nextStatus = statusField as BrandStatus;
            }

            const visibilityField = get("visibility");
            if (typeof visibilityField === "string" && VISIBILITY_VALUES.has(visibilityField as BrandVisibility)) {
                nextVisibility = visibilityField as BrandVisibility;
            }

            const rolesField = get("allowedRoles");
            const normalizedRoles = normalizeRoles(rolesField);
            if (normalizedRoles !== undefined) {
                nextAllowedRoles = normalizedRoles;
            }

            const publishedField = get("publishedAt");
            const publishedParsed = parseDate(publishedField);
            if (publishedParsed !== undefined) nextPublishedAt = publishedParsed;

            const unpublishedField = get("unpublishedAt");
            const unpublishedParsed = parseDate(unpublishedField);
            if (unpublishedParsed !== undefined) nextUnpublishedAt = unpublishedParsed;
        };

        if (ct.includes("multipart/form-data")) {
            const form = await req.formData();
            applyCommonFields((key) => form.get(key));

            const logo = form.get("logo");
            if (logo instanceof File && logo.size) {
                const saved = await saveUpload(logo, "brands");
                if (saved) nextLogo = saved;
            }

            const cover = form.get("cover");
            if (cover instanceof File && cover.size) {
                const saved = await saveUpload(cover, "brands");
                if (saved) nextCover = saved;
            }
        } else {
            const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
            applyCommonFields((key) => body[key]);

            if (typeof body.logoUrl === "string") {
                nextLogo = body.logoUrl || undefined;
            }
            if (typeof body.coverUrl === "string") {
                nextCover = body.coverUrl || undefined;
            }
        }

        nextName = nextName.trim();
        if (!nextName) {
            return NextResponse.json({ error: "Name is required." }, { status: 400 });
        }

        nextSlug = slugify(nextSlug || nextName);
        if (!nextSlug) {
            return NextResponse.json({ error: "Slug is required." }, { status: 400 });
        }

        if (nextSlug !== brandDoc.slug) {
            const exists = await CustomerBrand.findOne({ _id: { $ne: brandDoc._id }, slug: nextSlug }).lean();
            if (exists) {
                return NextResponse.json({ error: "Slug already exists." }, { status: 409 });
            }
        }

        brandDoc.name = nextName;
        brandDoc.slug = nextSlug;
        brandDoc.description = nextDescription || "";
        brandDoc.logoUrl = nextLogo || undefined;
        brandDoc.coverUrl = nextCover || undefined;
        brandDoc.status = nextStatus;
        brandDoc.visibility = nextVisibility;
        brandDoc.allowedRoles = nextVisibility === "roles" ? nextAllowedRoles : undefined;
        brandDoc.publishedAt = nextPublishedAt ?? null;
        brandDoc.unpublishedAt = nextUnpublishedAt ?? null;

        const actorId = gate.claims?.sub;
        if (actorId) {
            brandDoc.updatedBy = actorId as any;
        }

        try {
            await brandDoc.save();
        } catch (err: any) {
            if (err?.code === 11000 && (err?.keyPattern?.slug || err?.keyValue?.slug)) {
                return NextResponse.json({ error: "Slug already exists." }, { status: 409 });
            }
            throw err;
        }

        
        const plain = brandDoc.toObject({ virtuals: false });
        console.log(plain)
        return NextResponse.json({ success: true, item: plain });
    } catch (err) {
        console.error("[CustomerBrands][PATCH] error:", err);
        return NextResponse.json({ error: "Failed to update brand." }, { status: 500 });
    }
}

// DELETE /api/v1/controllers/brands/:id
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const gate = requireRole(req, ADMIN_ROLES);
    if (!gate.ok) {
        return NextResponse.json({ error: gate.error }, { status: gate.status });
    }

    try {
        await connectDB();

        const filter = buildFilter(params.id);
        if (!filter) {
            return NextResponse.json({ error: "Missing id or slug." }, { status: 400 });
        }

        const brandDoc = await loadBrandDocument(filter);
        if (!brandDoc) {
            return NextResponse.json({ error: "Brand not found." }, { status: 404 });
        }

        await brandDoc.deleteOne();

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("[CustomerBrands][DELETE] error:", err);
        return NextResponse.json({ error: "Failed to delete brand." }, { status: 500 });
    }
}



