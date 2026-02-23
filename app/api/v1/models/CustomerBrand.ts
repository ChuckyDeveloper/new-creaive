// models/CustomerBrand.ts
import { Schema, model, models, Types } from "mongoose";

export type BrandStatus = "active" | "archived";
export type BrandVisibility = "public" | "private" | "roles";

export interface ICustomerBrand {
    name: string;
    slug: string;                // unique
    description?: string;
    logoUrl?: string;
    coverUrl?: string;
    status: BrandStatus;
    visibility: BrandVisibility;
    allowedRoles?: string[];
    publishedAt?: Date | null;
    unpublishedAt?: Date | null;

    createdBy?: Types.ObjectId;
    updatedBy?: Types.ObjectId;

    createdAt: Date;
    updatedAt: Date;
}

const CustomerBrandSchema = new Schema<ICustomerBrand>(
    {
        name: { type: String, required: true, trim: true, maxlength: 200 },
        slug: { type: String, required: true, unique: true, index: true, trim: true, lowercase: true },
        description: { type: String, trim: true, maxlength: 2000 },

        logoUrl: { type: String, trim: true },
        coverUrl: { type: String, trim: true },
        status: { type: String, enum: ["active", "archived"], default: "active", index: true },
        visibility: { type: String, enum: ["public", "private", "roles"], default: "public", index: true },
        allowedRoles: { type: [String], default: undefined },
        publishedAt: { type: Date, default: null },
        unpublishedAt: { type: Date, default: null },

        createdBy: { type: Schema.Types.ObjectId, ref: "User", index: true },
        updatedBy: { type: Schema.Types.ObjectId, ref: "User", index: true },
    },
    { timestamps: true }
);

const CustomerBrand = models.CustomerBrand || model<ICustomerBrand>("CustomerBrand", CustomerBrandSchema);
export default CustomerBrand;

