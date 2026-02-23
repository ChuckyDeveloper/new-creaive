// models/Massage.ts
import { Schema, type Types } from "mongoose";

export type ChatRole = "system" | "user" | "assistant" | "tool";

export interface IMassage {
    user?: Types.ObjectId | null;
    authorName: string;
    role: ChatRole;
    content: string;
    requestId?: string;
    metadata?: {
        model?: string;
        promptTokens?: number;
        completionTokens?: number;
        totalTokens?: number;
    };
    createdAt: Date;
    updatedAt: Date;
}

export const MassageSchema = new Schema<IMassage>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        authorName: {
            type: String,
            trim: true,
            default: "Anonymous",
            maxlength: 120,
        },
        role: {
            type: String,
            enum: ["system", "user", "assistant", "tool"],
            required: true,
            default: "user",
        },
        content: {
            type: String,
            required: true,
            trim: true,
        },
        requestId: {
            type: String,
            trim: true,
        },
        metadata: {
            model: { type: String, trim: true },
            promptTokens: { type: Number, min: 0 },
            completionTokens: { type: Number, min: 0 },
            totalTokens: { type: Number, min: 0 },
        },
    },
    {
        _id: true,
        timestamps: true,
    }
);
