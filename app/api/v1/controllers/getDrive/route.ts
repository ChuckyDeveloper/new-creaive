import { NextResponse, type NextRequest } from "next/server";
import { withCORS } from "../../lib/cors";
import { getDriveImageUrl, parseSimpleCsv, findActiveItem, persistEventImage } from "../../lib/drive";
import { logger } from "../../lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        const sheetUrl = process.env.NEXT_PUBLIC_SCHEDULE;
        logger.request(req, "getDrive start", { sheetUrl: !!sheetUrl });
        if (!sheetUrl) {
            return withCORS(NextResponse.json(
                { error: "NEXT_PUBLIC_SCHEDULE not configured" },
                { status: 400 }
            ));
        }

        const response = await fetch(sheetUrl, { cache: "no-store" });
        if (!response.ok) {
            return withCORS(NextResponse.json(
                { error: `Failed to fetch Google Sheet: ${response.status}` },
                { status: response.status }
            ));
        }

        const text = await response.text();
        const data = parseSimpleCsv(text);
        const now = new Date();
        const active = findActiveItem(data, now);

        if (!active) {
            return withCORS(NextResponse.json({ message: "No active event" }, { status: 200 }));
        }

        const driveUrl = getDriveImageUrl(active.link);
        const imgRes = await fetch(driveUrl, { cache: "no-store" });
        if (!imgRes.ok) {
            throw new Error(`Failed to fetch image: ${imgRes.status}`);
        }

        const buffer = Buffer.from(await imgRes.arrayBuffer());
        const saved = await persistEventImage(buffer, "event.png");
        logger.response(req, 200, { imageUrl: saved.publicUrl });

        return withCORS(NextResponse.json({
            message: "Event image saved",
            event: active,
            imageUrl: saved.publicUrl,
        }));
    } catch (err: any) {
        logger.failure(req, err);
        return withCORS(NextResponse.json(
            { error: err.message || "Unknown error" },
            { status: 500 }
        ));
    }
}
