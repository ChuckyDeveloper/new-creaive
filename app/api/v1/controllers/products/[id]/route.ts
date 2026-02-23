import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import { Types } from "mongoose";
import ProductContent from "../../../models/ProductContent";
import { requireRole } from "../../../lib/auth";
import { logger } from "../../../lib/logger";
import {
  buildProductContentFromForm,
  buildProductContentFromJson,
} from "../../../services/productContent.service";

export const dynamic = "force-dynamic";

type ImagePayload = {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
};

function sanitizeImageArray(value: unknown): ImagePayload[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const cleaned: ImagePayload[] = [];
  for (const entry of value) {
    if (!entry || typeof entry !== "object") continue;
    const rawUrl = (entry as any).url;
    if (typeof rawUrl !== "string") continue;
    const url = rawUrl.trim();
    if (!url) continue;
    const rawAlt = (entry as any).alt;
    const alt = typeof rawAlt === "string" ? rawAlt.trim() : "";
    const image: ImagePayload = { url };
    if (alt) image.alt = alt;
    const width = (entry as any).width;
    if (typeof width === "number") image.width = width;
    const height = (entry as any).height;
    if (typeof height === "number") image.height = height;
    cleaned.push(image);
  }
  return cleaned;
}

function parseExistingImages(input: FormDataEntryValue | null): ImagePayload[] {
  if (typeof input !== "string") return [];
  try {
    const parsed = JSON.parse(input);
    return sanitizeImageArray(parsed) ?? [];
  } catch {
    return [];
  }
}

const SIMPLE_PATCH_FIELDS = new Set([
  "status",
  "visibility",
  "publishedAt",
  "unpublishedAt",
]);
const VALID_STATUS = new Set(["draft", "scheduled", "published", "archived"]);
const VALID_VISIBILITY = new Set(["public", "private", "roles"]);

function shouldUseFullBuilder(body: any): boolean {
  if (!body || typeof body !== "object") return true;
  return Object.keys(body).some((key) => !SIMPLE_PATCH_FIELDS.has(key));
}

function parsePatchDate(value: unknown) {
  if (value === null) return null;
  if (value === undefined) return undefined;
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) throw new TypeError("Invalid date");
    return value;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    const parsed = new Date(trimmed);
    if (Number.isNaN(parsed.getTime())) throw new TypeError("Invalid date");
    return parsed;
  }
  throw new TypeError("Invalid date");
}

function buildSimplePatch(body: any) {
  if (!body || typeof body !== "object") {
    throw new TypeError("Invalid request body");
  }

  const payload: Record<string, any> = {};

  if (Object.prototype.hasOwnProperty.call(body, "status")) {
    const status =
      typeof body.status === "string" ? body.status.trim() : undefined;
    if (!status || !VALID_STATUS.has(status))
      throw new TypeError("Invalid status");
    payload.status = status;
  }

  if (Object.prototype.hasOwnProperty.call(body, "visibility")) {
    const visibility =
      typeof body.visibility === "string" ? body.visibility.trim() : undefined;
    if (!visibility || !VALID_VISIBILITY.has(visibility))
      throw new TypeError("Invalid visibility");
    payload.visibility = visibility;
  }

  if (Object.prototype.hasOwnProperty.call(body, "publishedAt")) {
    payload.publishedAt = parsePatchDate(body.publishedAt);
  }

  if (Object.prototype.hasOwnProperty.call(body, "unpublishedAt")) {
    payload.unpublishedAt = parsePatchDate(body.unpublishedAt);
  }

  if (Object.keys(payload).length === 0) {
    throw new TypeError("No valid fields provided");
  }

  return payload;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const gate = requireRole(req, ["manager", "admin", "master"]);
  if (!gate.ok)
    return NextResponse.json({ error: gate.error }, { status: gate.status });

  try {
    logger.request(req, "product get", {
      id: params.id,
      actor: gate.claims.sub,
    });
    await connectDB();
    const doc = await ProductContent.findById(params.id).lean();
    if (!doc)
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    logger.response(req, 200, { id: params.id });
    return NextResponse.json(doc);
  } catch (err) {
    logger.failure(req, err, { id: params.id });
    return NextResponse.json(
      { error: "Failed to get product content." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const gate = requireRole(req, ["manager", "admin", "master"]);
  if (!gate.ok)
    return NextResponse.json({ error: gate.error }, { status: gate.status });

  try {
    logger.request(req, "product patch", {
      id: params.id,
      actor: gate.claims.sub,
    });
    await connectDB();

    const contentType = req.headers.get("content-type") || "";
    const actorId = gate.claims.sub;
    const actorObjectId =
      typeof actorId === "string" && Types.ObjectId.isValid(actorId)
        ? new Types.ObjectId(actorId)
        : undefined;
    let payload: Record<string, any>;

    if (contentType.includes("multipart/form-data")) {
      console.log("test 1");
      const form = await req.formData();
      const basePayload = await buildProductContentFromForm(form, actorId);
      const keepImages = parseExistingImages(form.get("existingImages"));
      const uploads = Array.isArray(basePayload.images)
        ? basePayload.images
        : [];
      basePayload.images = [...keepImages, ...uploads];
      if (actorObjectId) {
        basePayload.updatedBy = actorObjectId;
      }
      if ("createdBy" in basePayload) delete basePayload.createdBy;
      payload = basePayload;
    } else {
      console.log("test 2");
      const body = await req.json();

      console.log(body)
      // body.status = 'published'
      // body.visibility = 'public'

      const useFullBuilder = shouldUseFullBuilder(body);
      console.log(useFullBuilder)
      const basePayload = useFullBuilder
        ? buildProductContentFromJson(body, actorId)
        : buildSimplePatch(body);
      if (useFullBuilder) {
        const maybeImages = sanitizeImageArray((body as any)?.images);
        if (maybeImages !== undefined) {
          (basePayload as any).images = maybeImages;
        }
      }
      if (actorObjectId) {
        basePayload.updatedBy = actorObjectId;
      }
      if ("createdBy" in basePayload) delete basePayload.createdBy;
      payload = basePayload;
    }

    const updated = await ProductContent.findByIdAndUpdate(
      params.id,
      { $set: payload },
      { new: true, runValidators: true }
    ).lean();

    console.log(updated);

    if (!updated)
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    logger.response(req, 200, { id: params.id });
    return NextResponse.json({ success: true, item: updated });
  } catch (err) {
    if (err instanceof TypeError) {
      logger.failure(req, err, { id: params.id });
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    logger.failure(req, err, { id: params.id });
    return NextResponse.json(
      { error: "Failed to update product content." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const gate = requireRole(req, ["manager", "admin", "master"]);
  if (!gate.ok)
    return NextResponse.json({ error: gate.error }, { status: gate.status });

  try {
    logger.request(req, "product delete", {
      id: params.id,
      actor: gate.claims.sub,
    });
    await connectDB();
    const res = await ProductContent.findByIdAndDelete(params.id).lean();
    if (!res)
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    logger.response(req, 200, { id: params.id });
    return NextResponse.json({ success: true });
  } catch (err) {
    logger.failure(req, err, { id: params.id });
    return NextResponse.json(
      { error: "Failed to delete product content." },
      { status: 500 }
    );
  }
}
