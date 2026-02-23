// app/api/v1/services/productContent.service.ts
import type { Role } from "@/app/api/v1/models/User";
import { ROLES } from "@/app/api/v1/models/User";
import type { IProductContent, Tag } from "@/app/api/v1/models/ProductContent";
import { TAGS } from "@/app/api/v1/models/ProductContent";
import { asString, asStringArray, asNumber, asBool, asDate, asJsonOrString } from "../lib/form";
import { DEFAULT_ALLOWED, saveFilesField } from "../lib/saveUpload";
import { Types } from "mongoose";

const toOid = (id?: string) => id && Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : undefined;

const TAG_SET = new Set<string>(TAGS as readonly string[]);
const ROLE_SET = new Set<Role>(ROLES);

function sanitizeTags(input: string[]): Tag[] {
    return input.filter((tag): tag is Tag => TAG_SET.has(tag));
}

function sanitizeRoles(input: string[]): Role[] {
    return input.filter((role): role is Role => ROLE_SET.has(role as Role));
}

export async function buildProductContentFromForm(form: FormData, actorId: string) {
    const title = asString(form.get("title"))!;
    const slug = asString(form.get("slug"));
    const subtitle = asString(form.get("subtitle"));
    const summary = asString(form.get("summary"));
    const link = asString(form.get("link"))
    const sku = asString(form.get("sku"));

    const body = asJsonOrString(form.get("body"));

    const categories = asStringArray(form.get("categories"));
    const tags = sanitizeTags(asStringArray(form.get("tags")));

    const priceAmount = asNumber(form.get("priceAmount"));
    const priceCurrency = (asString(form.get("priceCurrency")) || "THB").toUpperCase();
    const price = priceAmount != null ? { amount: priceAmount, currency: priceCurrency } : undefined;

    const compareAmount = asNumber(form.get("compareAmount"));
    const compareCurrency = (asString(form.get("compareCurrency")) || "THB").toUpperCase();
    const compareAtPrice = compareAmount != null ? { amount: compareAmount, currency: compareCurrency } : undefined;

    const inStock = asBool(form.get("inStock"));

    const seoTitle = asString(form.get("seoTitle"));
    const seoDescription = asString(form.get("seoDescription"));
    const seoKeywords = asStringArray(form.get("seoKeywords"));
    const seoOgImage = asString(form.get("seoOgImage"));
    const seo = (seoTitle || seoDescription || seoKeywords.length || seoOgImage)
        ? { title: seoTitle, description: seoDescription, keywords: seoKeywords, ogImage: seoOgImage }
        : undefined;

    const status = (asString(form.get("status")) || "draft") as IProductContent["status"];
    const visibility = (asString(form.get("visibility")) || "public") as IProductContent["visibility"];
    const allowedRoles = sanitizeRoles(asStringArray(form.get("allowedRoles")));

    const brandId = toOid(asString(form.get("brandId")));
    const brand = asString(form.get("brand"));

    const publishedAt = asDate(form.get("publishedAt"));
    const unpublishedAt = asDate(form.get("unpublishedAt"));

    // Save images to /public/productcontent
    const images = await saveFilesField(form, "images", {
        subdir: "productcontent",
        altsField: "alts",
        allowed: DEFAULT_ALLOWED,
        maxBytes: 10 * 1024 * 1024,
        detectMeta: true,
    });

    const videos = asJsonOrString(form.get("videos"));

    const created = toOid(actorId);
    const payload: Partial<IProductContent> = {
        slug: slug || undefined,
        title,
        subtitle,
        sku,
        summary,
        link,
        body,
        images: images.length ? images : undefined,
        videos: Array.isArray(videos) && videos.length ? videos : undefined,
        categories,
        tags: tags.length ? tags : undefined,
        price,
        compareAtPrice,
        inStock,
        seo,
        status,
        visibility,
        allowedRoles: allowedRoles.length ? allowedRoles : undefined,
        brandId: brandId,
        brand: brand,
        publishedAt,
        unpublishedAt,
        createdBy: created,
        updatedBy: created,
    };

    return payload;
}

/** JSON body to payload (no files) */
export function buildProductContentFromJson(body: any, actorId: string) {
    if (!body || typeof body !== "object") {
        throw new TypeError("Invalid request body");
    }

    const stringField = (value: unknown) => {
        if (typeof value !== "string") return undefined;
        const trimmed = value.trim();
        return trimmed.length ? trimmed : undefined;
    };

    const priceField = (value: any) => {
        if (!value || typeof value !== "object") return undefined;
        const amount = typeof value.amount === "number" && Number.isFinite(value.amount) ? value.amount : undefined;
        if (amount == null) return undefined;
        const currency = (stringField(value.currency) || "THB").toUpperCase();
        return { amount, currency } as NonNullable<IProductContent["price"]>;
    };

    const boolField = (value: unknown) => {
        if (typeof value === "boolean") return value;
        return undefined;
    };

    const stringArray = (value: unknown) => {
        if (!Array.isArray(value)) return [] as string[];
        return value.map((item) => stringField(item) ?? "").filter(Boolean) as string[];
    };

    const maybeDate = (value: unknown) => {
        if (typeof value !== "string" && !(value instanceof Date)) return undefined;
        const date = value instanceof Date ? value : new Date(value);
        return Number.isNaN(date.getTime()) ? undefined : date;
    };

    const tags = sanitizeTags(stringArray(body.tags));
    const allowedRoles = sanitizeRoles(stringArray(body.allowedRoles));

    const status = stringField(body.status) as IProductContent["status"] | undefined;
    const visibility = stringField(body.visibility) as IProductContent["visibility"] | undefined;

    const validStatus: Set<IProductContent["status"]> = new Set<IProductContent["status"]>(
        ["draft", "scheduled", "published", "archived"] as IProductContent["status"][]
    );
    const validVisibility: Set<IProductContent["visibility"]> = new Set<IProductContent["visibility"]>(
        ["public", "private", "roles"] as IProductContent["visibility"][]
    );

    const created = toOid(actorId);
    const title = stringField(body.title);
    if (!title) {
        throw new TypeError("Title is required");
    }

    const payload: Partial<IProductContent> = {
        title,
        slug: stringField(body.slug),
        subtitle: stringField(body.subtitle),
        sku: stringField(body.sku),
        summary: stringField(body.summary),
        link: stringField(body.link),
        body: body.body,
        videos: Array.isArray(body.videos) && body.videos.length ? body.videos.map((v: any) => ({
            url: stringField(v.url)!,
            provider: stringField(v.provider),
            title: stringField(v.title),
            duration: typeof v.duration === "number" ? v.duration : undefined,
        })).filter(v => v.url) : undefined,
        categories: stringArray(body.categories),
        tags: tags.length ? tags : undefined,
        price: priceField(body.price),
        compareAtPrice: priceField(body.compareAtPrice),
        inStock: boolField(body.inStock),
        seo: (() => {
            const seoTitle = stringField(body.seo?.title);
            const seoDescription = stringField(body.seo?.description);
            const seoKeywords = stringArray(body.seo?.keywords);
            const seoOgImage = stringField(body.seo?.ogImage);
            if (!seoTitle && !seoDescription && !seoKeywords.length && !seoOgImage) return undefined;
            return {
                title: seoTitle,
                description: seoDescription,
                keywords: seoKeywords,
                ogImage: seoOgImage,
            };
        })(),
        status: status && validStatus.has(status) ? status : undefined,
        visibility: visibility && validVisibility.has(visibility) ? visibility : undefined,
        allowedRoles: allowedRoles.length ? allowedRoles : undefined,
        brandId: toOid(stringField(body.brandId)),
        brand: stringField(body.brand),
        publishedAt: maybeDate(body.publishedAt),
        unpublishedAt: maybeDate(body.unpublishedAt),
        createdBy: created,
        updatedBy: created,
    };

    return payload;
}

import { num, truthy } from "../lib/helper";
import ProductContent from "../models/ProductContent";

export async function getProductContent(url: URL) {
    const q = url.searchParams.get("q");
    const category = url.searchParams.get("category");
    const tag = url.searchParams.get("tag");

    const statusParam = (url.searchParams.get("status") || "any").toLowerCase(); // any|draft|scheduled|published|archived
    const visibilityParam = (url.searchParams.get("visibility") || "any").toLowerCase(); // any|public|private|roles
    const whenParam = (url.searchParams.get("when") || "any").toLowerCase(); // any|live|upcoming|expired

    const page = num(url.searchParams.get("page"), 1);
    const limitParam = url.searchParams.get("limit");
    const wantAll = truthy(url.searchParams.get("all")) || limitParam?.toLowerCase() === "all";
    const limit = wantAll ? Number.MAX_SAFE_INTEGER : Math.min(num(limitParam, 20), 100);

    const sortParam = url.searchParams.get("sort") || "-createdAt";
    const fieldsParam = url.searchParams.get("fields"); // e.g. "title,slug,images"
    const projection = fieldsParam ? fieldsParam.split(",").join(" ") : undefined;
    

    const now = new Date();

    const filter: any = {};
    if (q) filter.$text = { $search: q };
    if (category) filter.categories = category;
    if (tag) filter.tags = tag;

    if (statusParam !== "any") filter.status = statusParam;
    if (visibilityParam !== "any") filter.visibility = visibilityParam;

    if (whenParam === "live") {
        filter.$and = [
            { $or: [{ publishedAt: { $exists: false } }, { publishedAt: { $lte: now } }] },
            { $or: [{ unpublishedAt: { $exists: false } }, { unpublishedAt: { $gt: now } }] },
        ];
    } else if (whenParam === "upcoming") {
        filter.publishedAt = { $gt: now };
    } else if (whenParam === "expired") {
        filter.unpublishedAt = { $lte: now };
    }

    let query = ProductContent.find(filter, projection).sort(sortParam.split(",").join(" "));
    const total = await ProductContent.countDocuments(filter);

    if (!wantAll) {
        query = query.skip((page - 1) * limit).limit(limit);
    }
    const items = await query.lean();

    return {
        scope: "admin",
        when: whenParam,
        mode: wantAll ? "all" : "paged",
        page: wantAll ? 1 : page,
        limit: wantAll ? items.length : limit,
        total,
        pages: wantAll ? 1 : Math.max(1, Math.ceil(total / limit)),
        items,
    };
}

export async function createProductContent(payload: Partial<IProductContent>) {
    const doc = await ProductContent.create(payload);
    return doc;
}
