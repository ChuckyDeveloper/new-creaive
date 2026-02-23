// models/Banner.ts
import { Schema, model, models } from "mongoose";
import type { Role } from "./User";

const BannerSchema = new Schema({
    title: { type: String },
    imageUrl: { type: String, required: true },
    isActive: { type: Boolean, default: false }, // default to false for uploads
    uploadedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    uploadedRole: {
        type: String,
        enum: ["user", "manager", "admin", "master"],
        required: true,
    },
    notes: {
        type: String,
        trim: true,
        maxlength: 500,
    },
}, { timestamps: true });

// ✅ Allow only one active banner in the whole collection
BannerSchema.index(
    { isActive: 1 },
    { unique: true, partialFilterExpression: { isActive: true } }
);

export default models.Banner || model("Banner", BannerSchema);
