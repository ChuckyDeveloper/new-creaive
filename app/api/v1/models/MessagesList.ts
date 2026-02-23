// models/MessagesList.ts
import { Schema, model, models, type Model, type Types } from "mongoose";
import { MassageSchema, type IMassage } from "./Massage";

export interface IMessagesList {
    user?: Types.ObjectId | null;
    tempKey?: string | null;
    conversationId: string;
    messages: IMassage[];
    lastMessageAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export type MessagesListModel = Model<IMessagesList>;

const MessagesListSchema = new Schema<IMessagesList>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
            index: true,
        },
        tempKey: {
            type: String,
            trim: true,
            index: true,
            sparse: true,
            default: null,
        },
        conversationId: {
            type: String,
            required: true,
            index: true,
            trim: true,
        },
        messages: {
            type: [MassageSchema],
            default: [],
        },
        lastMessageAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

MessagesListSchema.index({ conversationId: 1 }, { unique: true });
MessagesListSchema.index({ user: 1, updatedAt: -1 });
MessagesListSchema.index({ tempKey: 1 }, { unique: true, sparse: true });

MessagesListSchema.pre("save", function (next) {
    if (this.messages?.length) {
        const recent = this.messages[this.messages.length - 1]?.createdAt;
        if (recent) {
            this.lastMessageAt = recent;
        }
    }
    next();
});

const MessagesList =
    (models.MessagesList as MessagesListModel) || model<IMessagesList, MessagesListModel>("MessagesList", MessagesListSchema);

export default MessagesList;
