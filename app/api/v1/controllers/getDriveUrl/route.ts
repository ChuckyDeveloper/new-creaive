import { NextResponse, type NextRequest } from "next/server";
import { getDriveImageUrl, parseSimpleCsv, findActiveItem, persistEventImage } from "../../lib/drive";
import { logger } from "../../lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_ALLOWED_ORIGIN || "*";

function withCORS(res: NextResponse) {
    res.headers.set("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
    res.headers.set("Access-Control-Allow-Methods", "GET,OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (ALLOWED_ORIGIN !== "*" && ALLOWED_ORIGIN) {
        res.headers.set("Access-Control-Allow-Credentials", "true");
    }
    return res;
}

export async function OPTIONS() {
    // Preflight response
    const res = new NextResponse(null, { status: 204 });
    return withCORS(res);
}

export async function GET(req: NextRequest) {
    try {
        const sheetUrl = process.env.NEXT_PUBLIC_SCHEDULE;
        logger.request(req, "getDriveUrl start", { sheetUrl: !!sheetUrl });
        if (!sheetUrl) {
            return withCORS(
                NextResponse.json(
                    {
                        active: false,
                        imageUrl: null,
                        message: "NEXT_PUBLIC_SCHEDULE not configured",
                    },
                    { status: 400 }
                )
            );
        }

        const response = await fetch(sheetUrl, { cache: "no-store" });
        if (!response.ok) {
            return withCORS(
                NextResponse.json(
                    {
                        active: false,
                        imageUrl: null,
                        message: `Failed to fetch Google Sheet: ${response.status}`,
                    },
                    { status: response.status }
                )
            );
        }

        const text = await response.text();
        const data = parseSimpleCsv(text);

        // ?now=2025-08-12T12:00:00 สำหรับทดสอบ
        const { searchParams } = new URL(req.url);
        const nowParam = searchParams.get("now");
        const now = nowParam ? new Date(nowParam) : new Date();

        const active = findActiveItem(data, now);

        if (!active) {
            return withCORS(
                NextResponse.json(
                    { active: false, imageUrl: null, message: "No active event" },
                    { status: 200, headers: { "Cache-Control": "no-store" } }
                )
            );
        }

        // Download the image (Google Drive or direct)
        const driveUrl = getDriveImageUrl(active.link || active.image);
        const imgRes = await fetch(driveUrl, { cache: "no-store" });
        if (!imgRes.ok) {
            return withCORS(
                NextResponse.json(
                    {
                        active: false,
                        imageUrl: null,
                        message: `Failed to fetch image: ${imgRes.status}`,
                    },
                    { status: 502 }
                )
            );
        }

        const buffer = Buffer.from(await imgRes.arrayBuffer());
        const saved = await persistEventImage(buffer, "event.png");
        const imageUrl = `${saved.publicUrl}?ts=${Date.now()}`;

        return withCORS(
            NextResponse.json(
                { active: true, imageUrl },
                { status: 200, headers: { "Cache-Control": "no-store" } }
            )
        );
    } catch (err: any) {
        logger.failure(req, err);
        return withCORS(
            NextResponse.json(
                {
                    active: false,
                    imageUrl: null,
                    message: err?.message || "Unknown error",
                },
                { status: 500 }
            )
        );
    }
}
