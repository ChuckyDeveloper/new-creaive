import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { addMessage, createThread, listMessages, runAssistant } from "../../creaive";
import { connectDB } from "../../lib/db";
import { extractToken } from "../../lib/auth";
import { verifySession, type SessionClaims } from "../../lib/jwt";
import MessagesList from "../../models/MessagesList";

const JSON_HEADERS = { "Content-Type": "application/json" } as const;
const ASSISTANT_NAME = "Assistant";
const TEMP_SESSION_COOKIE = "chat_temp_key";
const TEMP_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

interface UserContext {
    objectId: Types.ObjectId | null;
    userId: string | null;
    authorName: string;
    isAnonymous: boolean;
}

function resolveUserContext(request: NextRequest): UserContext {
    const fallback: UserContext = {
        objectId: null,
        userId: null,
        authorName: "Anonymous",
        isAnonymous: true,
    };

    const token = extractToken(request);
    if (!token) {
        return fallback;
    }

    try {
        const claims = verifySession<SessionClaims & { username?: string }>(token);
        const candidateName = claims.name || claims.username || claims.email || "Anonymous";

        if (claims.sub && Types.ObjectId.isValid(claims.sub)) {
            return {
                objectId: new Types.ObjectId(claims.sub),
                userId: claims.sub,
                authorName: candidateName,
                isAnonymous: false,
            };
        }

        return {
            ...fallback,
            userId: claims.sub ?? null,
            authorName: candidateName,
        };
    } catch {
        return fallback;
    }
}

function buildMessageEntry(context: UserContext, role: "user" | "assistant", content: string, requestId?: string) {
    const timestamp = new Date();
    return {
        user: role === "user" ? context.objectId : null,
        authorName: role === "user" ? context.authorName : ASSISTANT_NAME,
        role,
        content,
        requestId,
        createdAt: timestamp,
        updatedAt: timestamp,
    };
}

function serializeMessages(conversation: any, fallbackAuthor: string) {
    const messages = Array.isArray(conversation?.messages) ? conversation.messages : [];

    return messages
        .map((msg: any) => {
            const createdAtDate = msg?.createdAt ? new Date(msg.createdAt) : null;
            return {
                id: msg?._id ? String(msg._id) : `${conversation?.conversationId ?? "msg"}-${createdAtDate?.getTime() ?? Date.now()}`,
                role: msg?.role ?? "assistant",
                author: msg?.authorName || (msg?.role === "assistant" ? ASSISTANT_NAME : fallbackAuthor),
                content: msg?.content ?? "",
                createdAt: createdAtDate ? createdAtDate.toISOString() : null,
                createdAtMs: createdAtDate?.getTime() ?? 0,
            };
        })
        .sort((a, b) => a.createdAtMs - b.createdAtMs)
        .map(({ createdAtMs, ...rest }) => rest);
}

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const userContext = resolveUserContext(request);
        const existingTempKey = request.cookies.get(TEMP_SESSION_COOKIE)?.value ?? null;

        let conversation = null as any;

        if (!userContext.isAnonymous && userContext.objectId) {
            conversation = await MessagesList.findOne({ user: userContext.objectId }).sort({ updatedAt: -1 }).lean();
        }

        if (!conversation && existingTempKey) {
            conversation = await MessagesList.findOne({ tempKey: existingTempKey }).sort({ updatedAt: -1 }).lean();
        }

        let tempKeyToUse = existingTempKey;
        let threadIdValue: string;

        if (conversation) {
            threadIdValue = conversation.conversationId;

            if (!conversation.tempKey && userContext.isAnonymous && tempKeyToUse) {
                await MessagesList.updateOne({ _id: conversation._id }, { $set: { tempKey: tempKeyToUse } });
                conversation.tempKey = tempKeyToUse;
            }

            if (!conversation.user && userContext.objectId) {
                await MessagesList.updateOne({ _id: conversation._id }, { $set: { user: userContext.objectId } });
                conversation.user = userContext.objectId;
            }

            tempKeyToUse = conversation.tempKey ?? tempKeyToUse;
        } else {
            if (userContext.isAnonymous && !tempKeyToUse) {
                tempKeyToUse = randomUUID();
            }

            const thread = await createThread();
            threadIdValue = thread.id;

            const doc = await MessagesList.create({
                conversationId: threadIdValue,
                user: userContext.objectId ?? null,
                tempKey: userContext.isAnonymous ? tempKeyToUse : null,
            });

            conversation = doc.toObject();
            conversation.messages = [];
        }

        const serializedMessages = serializeMessages(conversation, userContext.authorName);

        const responsePayload = {
            threadId: threadIdValue,
            user: {
                id: userContext.userId,
                name: userContext.authorName,
                isAnonymous: userContext.isAnonymous,
            },
            session: {
                tempKey: userContext.isAnonymous ? tempKeyToUse : null,
            },
            messages: serializedMessages,
        };

        const response = NextResponse.json(responsePayload);

        if (userContext.isAnonymous && tempKeyToUse) {
            response.cookies.set(TEMP_SESSION_COOKIE, tempKeyToUse, {
                maxAge: TEMP_COOKIE_MAX_AGE,
                path: "/",
                httpOnly: false,
                sameSite: "lax",
            });
        }

        return response;
    } catch (error) {
        console.error("Error occurred while processing request:", error);
        return new NextResponse(
            JSON.stringify({ error: "Failed to process message thread. Please try again later." }),
            {
                status: 500,
                headers: JSON_HEADERS,
            }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json().catch(() => null);
        const threadId = body?.threadId;
        const message = body?.message;

        if (!threadId || typeof threadId !== "string") {
            return new NextResponse(
                JSON.stringify({ error: "threadId is required." }),
                {
                    status: 400,
                    headers: JSON_HEADERS,
                }
            );
        }

        if (!message || typeof message !== "string") {
            return new NextResponse(
                JSON.stringify({ error: "message is required." }),
                {
                    status: 400,
                    headers: JSON_HEADERS,
                }
            );
        }

        const userContext = resolveUserContext(request);
        const existingTempKey = request.cookies.get(TEMP_SESSION_COOKIE)?.value ?? null;
        let tempKeyToUse = existingTempKey;

        if (userContext.isAnonymous && !tempKeyToUse) {
            tempKeyToUse = randomUUID();
        }

        const userEntry = buildMessageEntry(userContext, "user", message);

        const messageListUpdate: Record<string, any> = {
            $setOnInsert: {
                conversationId: threadId,
            },
            $set: {
                lastMessageAt: userEntry.createdAt,
            },
            $push: {
                messages: userEntry,
            },
        };

        if (userContext.objectId) {
            messageListUpdate.$set.user = userContext.objectId;
        } else if (tempKeyToUse) {
            messageListUpdate.$set.tempKey = tempKeyToUse;
        }

        await MessagesList.findOneAndUpdate(
            { conversationId: threadId },
            messageListUpdate,
            { upsert: true, setDefaultsOnInsert: true }
        );

        await addMessage(threadId, {
            messages: { role: "user", content: message },
        });

        const run = await runAssistant(threadId);
        const assistantMessage = await listMessages(threadId, run.id);

        if (assistantMessage === null) {
            return new NextResponse(
                JSON.stringify({ error: "Assistant did not return any message.", runId: run.id }),
                {
                    status: 502,
                    headers: JSON_HEADERS,
                }
            );
        }

        const assistantEntry = buildMessageEntry(userContext, "assistant", assistantMessage, run.id);

        const assistantUpdate: Record<string, any> = {
            $set: { lastMessageAt: assistantEntry.createdAt },
            $push: { messages: assistantEntry },
        };

        if (userContext.objectId) {
            assistantUpdate.$set.user = userContext.objectId;
        } else if (tempKeyToUse) {
            assistantUpdate.$set.tempKey = tempKeyToUse;
        }

        await MessagesList.findOneAndUpdate({ conversationId: threadId }, assistantUpdate);

        const responsePayload = {
            threadId,
            runId: run.id,
            reply: assistantMessage,
            user: {
                id: userContext.userId,
                name: userContext.authorName,
                isAnonymous: userContext.isAnonymous,
            },
            session: {
                tempKey: userContext.isAnonymous ? tempKeyToUse : null,
            },
        };

        const response = NextResponse.json(responsePayload);

        if (userContext.isAnonymous && tempKeyToUse) {
            response.cookies.set(TEMP_SESSION_COOKIE, tempKeyToUse, {
                maxAge: TEMP_COOKIE_MAX_AGE,
                path: "/",
                httpOnly: false,
                sameSite: "lax",
            });
        }

        return response;
    } catch (error) {
        console.error("Error occurred while processing POST request:", error);
        return new NextResponse(
            JSON.stringify({ error: "Failed to process message. Please try again later." }),
            {
                status: 500,
                headers: JSON_HEADERS,
            }
        );
    }
}



