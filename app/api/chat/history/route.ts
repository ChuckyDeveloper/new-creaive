import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // Simple auth check
    const secret = req.headers.get("x-admin-secret");
    if (secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const search = searchParams.get("search") || "";
    const sessionId = searchParams.get("sessionId") || "";

    const db = await getDb();
    const collection = db.collection("chat_history");

    // Build filter
    const filter: Record<string, unknown> = {};

    if (search) {
      filter.$or = [
        { userMessage: { $regex: search, $options: "i" } },
        { assistantMessage: { $regex: search, $options: "i" } },
      ];
    }

    if (sessionId) {
      filter.sessionId = sessionId;
    }

    const total = await collection.countDocuments(filter);
    const chats = await collection
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      chats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Chat history API error:", error);
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** Delete a specific chat record */
export async function DELETE(req: NextRequest) {
  try {
    const secret = req.headers.get("x-admin-secret");
    if (secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json(
        { error: "Chat id is required" },
        { status: 400 },
      );
    }

    const { ObjectId } = await import("mongodb");
    const db = await getDb();
    const result = await db
      .collection("chat_history")
      .deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ deleted: result.deletedCount });
  } catch (error) {
    console.error("Delete chat error:", error);
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
