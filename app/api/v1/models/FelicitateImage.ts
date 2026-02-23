// models/FelicitateModal.ts
import { Schema, model, models } from "mongoose";

const FelicitateImage = new Schema(
  {
    slug: { type: String, unique: true, required: true, index: true }, // CMS handle
    enabled: { type: Boolean, default: false, index: true },           // open/close
    // Optional time window (leave null to always-on when enabled)
    startsAt: { type: Date, default: null },
    endsAt: { type: Date, default: null },

    // Content
    title: { type: String, default: "" },
    body: { type: String, default: "" },
    imageUrl: { type: String, required: true },
    imageAlt: { type: String, default: "" },

    // CTA
    ctaLabel: { type: String, default: "" },
    ctaHref: { type: String, default: "" },

    // UX
    dismissible: { type: Boolean, default: true },
    priority: { type: Number, default: 100, index: true }, // higher wins if multiple
  },
  { timestamps: true }
);

// Fast lookup for “what should show now?”
FelicitateImage.index({ enabled: 1, startsAt: 1, endsAt: 1, priority: -1 });

export default models.FelicitateImage || model("FelicitateImage", FelicitateImage);
