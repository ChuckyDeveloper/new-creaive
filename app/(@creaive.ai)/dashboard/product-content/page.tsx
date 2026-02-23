"use client";

import React from "react";
import PublicProductsGrid from "./PublicProductsGrid";
import CustomerBrandManager from "./CustomerBrandManager";
import ProductContentManager from "./ProductContentManager";
import BrandsList from "./BrandsList";

export default function NewProductContentPage() {

    return (
        <div className="min-h-screen text-white pb-60">
            <div
                aria-hidden
                className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(59,130,246,0.08),transparent_35%),radial-gradient(circle_at_88%_20%,rgba(168,85,247,0.08),transparent_35%),radial-gradient(circle_at_50%_80%,rgba(16,185,129,0.08),transparent_30%)]"
            />

            <BrandsList />

            {/* <CustomerBrandManager /> */}

            <ProductContentManager />

            <style jsx global>{`
                .panel {
                border-radius: 1rem;
                border: 1px solid rgba(255, 255, 255, 0.08);
                background: linear-gradient(180deg, rgba(255,255,255,0.04), rgba(0,0,0,0.25));
                box-shadow: 0 10px 40px rgba(0,0,0,0.25);
                }
                .panel-title { font-weight: 600; letter-spacing: 0.02em; }
                .field-input { @apply rounded-md border border-white/10 bg-black/40 px-3 py-2 outline-none focus:ring-2 focus:ring-fuchsia-500; }
            `}</style>

            <PublicProductsGrid
                all
                className="mt-[10px]"
                fields="title,slug,summary,images,categories,tags,status,visibility,publishedAt,unpublishedAt,brandId,brand"
            />
        </div>
    );
}
