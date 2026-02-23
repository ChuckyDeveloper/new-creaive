import { headers } from "next/headers";

export const revalidate = 0; // per-request SSR for this page

export function getBaseUrl() {
    const h = headers();
    const proto = h?.get("x-forwarded-proto") ?? "http";
    const host = h?.get("x-forwarded-host") ?? h?.get("host") ?? "localhost:3000";
    return `${proto}://${host}`;
}

export async function fetchProducts(query: string) {
    const base = getBaseUrl();
    const url = `${base}/api/v1/controllers/products/public?${query}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to load products (${res.status})`);
    return res.json() as Promise<{ items: any[]; total: number }>;
}
