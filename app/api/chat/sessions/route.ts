import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

/** GET /api/chat/sessions — list unique sessions with message counts */
export async function GET(req: Request) {
  try {
    const secret = req.headers.get("x-admin-secret");
    if (secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDb();
    const collection = db.collection("chat_history");

    const sessions = await collection
      .aggregate([
        {
          $group: {
            _id: "$sessionId",
            messageCount: { $sum: 1 },
            lastActivity: { $max: "$createdAt" },
            firstActivity: { $min: "$createdAt" },
          },
        },
        { $sort: { lastActivity: -1 } },
        { $limit: 200 },
      ])
      .toArray();

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error("Sessions API error:", error);
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
