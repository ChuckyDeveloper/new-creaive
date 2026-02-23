import { Schema, Types, model, models, type Model } from "mongoose";
import type { Role } from "./User"; // reuse your Role type

// ---- Types
export const TAGS = [
  "ai-microsites",
  "ai-humans",
  "ai-chatbots",
  "ai-lab",
  "holovue",
  "platforms",
] as const;

export type Visibility = "public" | "private" | "roles";
export type PublishStatus = "draft" | "scheduled" | "published" | "archived";
export type Tag = (typeof TAGS)[number];

export interface IProductContent {
  // identity
  slug: string; // unique route key
  title: string;
  subtitle?: string;
  sku?: string;

  // content
  summary?: string;
  link?: string;
  body?: any; // rich JSON (e.g. blocks/MDX AST)
  images?: { url: string; alt?: string; width?: number; height?: number }[];
  videos?: {
    url: string;
    provider?: string;
    title?: string;
    duration?: number;
  }[];

  // taxonomy
  categories?: string[];
  tags?: Tag[];

  // commerce (optional)
  price?: { amount: number; currency: string };
  compareAtPrice?: { amount: number; currency: string };
  inStock?: boolean;

  // SEO
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: string;
  };

  // publishing
  status: PublishStatus; // draft/scheduled/published/archived
  visibility: Visibility; // who can see if published window is valid
  allowedRoles?: Role[]; // for visibility=roles
  publishedAt?: Date | null; // go-live time
  unpublishedAt?: Date | null; // optional end time (take down)

  // audit
  createdBy?: Types.ObjectId; // ref: "User"
  updatedBy?: Types.ObjectId; // ref: "User"

  // customer's Brand
  brandId: Types.ObjectId;
  brand: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface IProductContentMethods {
  isPublishedNow(at?: Date): boolean;
}

export interface IProductContentStatics {
  findCurrentlyPublished(at?: Date): Promise<IProductContentDoc[]>;
  findPublicPublished(at?: Date): Promise<IProductContentDoc[]>;
}

export type IProductContentDoc = IProductContent & Document;
export type ProductContentModel = Model<
  IProductContent,
  {},
  IProductContentMethods
> &
  IProductContentStatics;

const ProductContentSchema = new Schema<
  IProductContent,
  ProductContentModel,
  IProductContentMethods
>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
      maxlength: 140,
    },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    subtitle: { type: String, trim: true, maxlength: 300 },
    sku: { type: String, trim: true, index: true },

    summary: { type: String, trim: true, maxlength: 1200 },
    link: { type: String },
    body: { type: Schema.Types.Mixed }, // flexible content
    images: [
      {
        url: { type: String, required: true, trim: true },
        alt: { type: String, trim: true },
        width: Number,
        height: Number,
      },
    ],
    videos: [
      {
        url: { type: String, required: true, trim: true },
        provider: { type: String, trim: true },
        title: { type: String, trim: true },
        duration: Number,
      },
    ],

    categories: [{ type: String, trim: true, index: true }],
    tags: [
      {
        type: String,
        enum: {
          values: TAGS,
          message: "Invalid tag: {VALUE}",
        },
        trim: true,
        lowercase: true,
        index: true,
        set: (v: string) =>
          typeof v === "string" ? v.trim().toLowerCase() : v,
      },
    ],

    price: {
      amount: { type: Number, min: 0 },
      currency: { type: String, trim: true, uppercase: true, default: "THB" },
    },
    compareAtPrice: {
      amount: { type: Number, min: 0 },
      currency: { type: String, trim: true, uppercase: true, default: "THB" },
    },
    inStock: { type: Boolean, default: true },

    seo: {
      title: { type: String, trim: true, maxlength: 200 },
      description: { type: String, trim: true, maxlength: 300 },
      keywords: [{ type: String, trim: true }],
      ogImage: { type: String, trim: true },
    },

    status: {
      type: String,
      enum: ["draft", "scheduled", "published", "archived"],
      default: "draft",
      index: true,
    },
    visibility: {
      type: String,
      enum: ["public", "private", "roles"],
      default: "public",
      index: true,
    },
    allowedRoles: [
      { type: String, enum: ["user", "manager", "admin", "master"] },
    ],

    publishedAt: { type: Date, index: true },
    unpublishedAt: { type: Date, index: true },

    brandId: {
      type: Schema.Types.ObjectId,
      ref: "CustomerBrand",
      required: true,
      index: true,
    },
    brand: { type: String },

    createdBy: { type: Schema.Types.ObjectId, ref: "User", index: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", index: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ProductContentSchema.set("toJSON", {
  virtuals: true,
  transform(_doc, ret) {
    if (ret.brandId && ret.brandId._id) {
      ret.brand = ret.brandId;
      ret.brandId = ret.brandId._id;
    }
    return ret;
  },
});

const ProductContent =
  (models.ProductContent as ProductContentModel) ||
  model<IProductContent, ProductContentModel>(
    "ProductContent",
    ProductContentSchema
  );

export default ProductContent;
