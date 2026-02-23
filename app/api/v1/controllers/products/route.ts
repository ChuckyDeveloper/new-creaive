// app/api/v1/product-contents/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../lib/db";
import { logger } from "../../lib/logger";
import { requireRole } from "../../lib/auth";
import {
    buildProductContentFromForm,
    buildProductContentFromJson,
    createProductContent,
    getProductContent,
} from "../../services/productContent.service";

export const runtime = "nodejs";        // need FS
export const dynamic = "force-dynamic";

/**
 * @swagger
 * /api/v1/controllers/products:
 *   get:
 *     summary: Retrieve a list of products
 *     description: Retrieve a list of products.
 *     responses:
 *       200:
 *         description: A list of products.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 */
export async function GET(req: NextRequest) {
    const gate = requireRole(req, ["manager", "admin", "master"]);
    if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });

    try {
        logger.request(req, "products list start", { actor: gate.claims.sub });
        await connectDB();
        const url = new URL(req.url);
        const data = await getProductContent(url);

        logger.response(req, 200, { count: data.items?.length, mode: data.mode });
        return NextResponse.json(data);
    } catch (err) {
        logger.failure(req, err);
        return NextResponse.json({ error: "Failed to list products." }, { status: 500 });
    }
}

/**
 * @swagger
 * /api/v1/controllers/products:
 *   post:
 *     summary: Create a new product
 *     description: Create a new product.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: The created product.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
export async function POST(req: NextRequest) {
    const gate = requireRole(req, ["manager", "admin", "master"]);
    if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });

    try {
        logger.request(req, "products create start", { actor: gate.claims.sub });
        await connectDB();
        const ct = req.headers.get("content-type") || "";
        const actorId = gate.claims.sub;

        let payload: any;
        if (ct.includes("multipart/form-data")) {
            const form = await req.formData();


            payload = await buildProductContentFromForm(form, actorId);
        } else {
            const body = await req.json();
            payload = buildProductContentFromJson(body, actorId);
        }

        const doc = await createProductContent(payload);
        logger.response(req, 200, { id: doc._id });
        return NextResponse.json({ success: true, item: doc });
    } catch (err: any) {
        if (err?.code === 11000 && err?.keyPattern?.slug) {
            return NextResponse.json({ error: "Slug already exists." }, { status: 409 });
        }
        if (err instanceof TypeError) {
            return NextResponse.json({ error: err.message }, { status: 400 });
        }
        logger.failure(req, err);
        return NextResponse.json({ error: "Failed to create product content." }, { status: 500 });
    }
}

