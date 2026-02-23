import { headers } from "next/headers";

export const revalidate = 120; // cache SSR result for 2 minutes

export type PaginatedResponse<T> = {
    mode: "all" | "paged";
    page: number;
    limit: number;
    total: number;
    pages: number;
    items: T[];
};

export type PublicBrand = {
    _id: string;
    name: string;
    slug?: string;
    description?: string;
    logoUrl?: string;
    coverUrl?: string;
    createdAt?: string;
    updatedAt?: string;
};


export type PublicProduct = {
    _id: string;
    title: string;
    slug: string;
    subtitle?: string;
    summary?: string;
    images?: { url: string; alt?: string }[];
    tags: string[];
};

export function getBaseUrl() {
    const h = headers();
    const proto = h?.get("x-forwarded-proto") ?? "http";
    const host = h?.get("x-forwarded-host") ?? h?.get("host") ?? "localhost:3000";
    return `${proto}://${host}`;
}

async function fetchFromApi<T>(
    path: string,
    label: "brands" | "products" = "products",
    fallback?: () => T,
) {
    const base = getBaseUrl();
    const url = `${base}${path}`;
    const res = await fetch(url, {
        next: { revalidate },
    });
    if (!res.ok) {
        if (fallback) {
            return fallback();
        }
        throw new Error(`Failed to load ${label} (${res.status})`);
    }
    return res.json() as Promise<T>;
}

function normaliseQuery(query: string) {
    if (!query) return "";
    return query.startsWith("?") ? query : `?${query}`;
}

export async function fetchProducts(query: string) {
    const qs = normaliseQuery(query);
    return fetchFromApi<PaginatedResponse<PublicProduct>>(
        `/api/v1/controllers/products/public${qs}`,
        "products",
        () => ({ mode: "paged", page: 1, limit: 0, total: 0, pages: 1, items: [] }),
    );
}

export async function fetchBrands(query: string) {
    const qs = normaliseQuery(query);
    return fetchFromApi<PaginatedResponse<PublicBrand>>(
        `/api/v1/controllers/brands/public${qs}`,
        "brands",
        () => ({ mode: "paged", page: 1, limit: 0, total: 0, pages: 1, items: [] }),
    );
}

export async function fetchBrand(idOrSlug: string, fields?: string) {
    const suffix = fields ? `?fields=${encodeURIComponent(fields)}` : "";
    return fetchFromApi<{ item: PublicBrand }>(
        `/api/v1/controllers/brands/public/${encodeURIComponent(idOrSlug)}${suffix}`,
        "brands",
    );
}
