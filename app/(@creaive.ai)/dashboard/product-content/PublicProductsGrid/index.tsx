"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";

import { useAppDispatch } from "@/lib/features";
import { selectSelectedBrandId } from "@/lib/features/forms/productContentForm/brandFilterSelectors";
import {
  setBrandFilter as setGlobalBrandFilter,
  clearBrandFilter as clearGlobalBrandFilter,
} from "@/lib/features/forms/productContentForm/brandFilterSlice";

// ---- Types that match your public API shape
export type ProductDoc = {
  _id: string;
  slug: string;
  title: string;
  subtitle?: string;
  summary?: string;
  link?: string;
  images?: { url: string; alt?: string; width?: number; height?: number }[];
  categories?: string[];
  tags?: string[];
  brandId?: string;
  brand?: string;
  status: "draft" | "scheduled" | "published" | "archived";
  visibility: "public" | "private" | "roles";
  publishedAt?: string | null;
};

export type PublicListResponse = {
  mode: "all" | "paged";
  page: number;
  limit: number;
  total: number;
  pages: number;
  items: ProductDoc[];
};

export type BrandOption = {
  _id: string;
  name: string;
};

// ---- Small helpers
function clsx(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

// ---- Product Card (reusable, client-safe)
export function ProductCard({
  item,
  admin = false,
  onChanged, // ให้กริดรีเฟรชหลังทำแอคชัน
  onOptimistic,
}: {
  item: ProductDoc;
  admin?: boolean;
  onChanged?: () => void;
  onOptimistic: (patch: Partial<ProductDoc>) => void;
}) {
  const [busy, setBusy] = useState<null | "publish" | "unpublish" | "delete">(
    null
  );

  async function patch(body: any) {
    setBusy(body?.status === "published" ? "publish" : "unpublish");
    try {
      const res = await fetch(`/api/v1/controllers/products/${item._id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || `PATCH ${res.status}`);
      }
      onChanged?.();
    } catch (e: any) {
      alert(e?.message || "Failed to update");
    } finally {
      setBusy(null);
    }
  }

  async function publishNow() {
    onOptimistic?.({
      status: "published",
      publishedAt: new Date().toISOString(),
    });
    try {
      await patch({
        status: "published",
        publishedAt: new Date().toISOString(),
        unpublishedAt: null,
      });
      onChanged?.(); // re-fetch to confirm server truth
    } catch (e) {
      // rollback by re-fetching
      onChanged?.();
      alert((e as any)?.message || "Failed to update");
    }
  }

  async function unpublishNow() {
    onOptimistic?.({
      status: "archived",
      publishedAt: item.publishedAt ?? null,
      // optional: you can add a local marker if you show it
    });
    try {
      await patch({
        status: "archived",
        unpublishedAt: new Date().toISOString(),
      });
      onChanged?.();
    } catch (e) {
      onChanged?.();
      alert((e as any)?.message || "Failed to update");
    }
  }

  async function removeItem() {
    if (!confirm(`Delete “${item.title}”? This cannot be undone.`)) return;
    setBusy("delete");
    try {
      const res = await fetch(`/api/v1/controllers/products/${item._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || `DELETE ${res.status}`);
      }
      onChanged?.();
    } catch (e: any) {
      alert(e?.message || "Failed to delete");
    } finally {
      setBusy(null);
    }
  }

  const img = item.images?.[0]?.url || "";
  const alt = item.images?.[0]?.alt || item.title;
  return (
    <div className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-xl backdrop-blur transition hover:border-fuchsia-400/30">
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <div className="absolute top-2 right-4 border-[1px] border-gray-100/20 rounded-xl px-2 p-0">
          {item.brand}
        </div>
        {img ? (
          <img
            src={`/api/v1/controllers/getImage/productcontent?name=${encodeURIComponent(
              img.replace("/productcontent/", "")
            )}`}
            alt={alt}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white/5 text-xs text-slate-500">
            No image
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-white">
              {item.title}
            </h3>
            {item.subtitle && (
              <p className="truncate text-xs text-slate-400">{item.subtitle}</p>
            )}
          </div>
          {item.categories?.length ? (
            <span className="shrink-0 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-2 py-0.5 text-[10px] text-indigo-200">
              {item.categories[0]}
            </span>
          ) : null}
        </div>

        {item.summary && (
          <p className="mt-2 line-clamp-3 text-sm text-slate-300">
            {item.summary}
          </p>
        )}

        <div className="mt-3 flex items-center gap-2">
          {item.link && (
            <Link
              href={`${item.link}`}
              target="_blank"
              rel="noopener noreferrer"
              prefetch={false}
              className={clsx(
                "inline-flex items-center gap-1 rounded-lg bg-fuchsia-600 px-3 py-1.5 text-xs font-medium text-white",
                "transition hover:bg-fuchsia-500",
                "border-white/50 border hover:border-white hover:bg-white/20"
              )}
            >
              View Project
            </Link>
          )}

          {item.tags?.slice(0, 2).map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-slate-300"
            >
              #{t}
            </span>
          ))}

          {/* --- แอดมินแอคชัน --- */}
          {admin && (
            <div className="ml-auto flex items-center gap-2">
              {/* <div className="text-black text-2xl bg-red-50 h-20 w-20">
                {item.status}
              </div> */}
              {item.status === "published" ? (
                <div>
                  <button
                    type="button"
                    onClick={unpublishNow}
                    disabled={busy !== null}
                    className="rounded-md border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-xs text-amber-100 hover:bg-amber-400/20 disabled:opacity-50"
                    title="Unpublish now"
                  >
                    {busy === "unpublish" ? "Unpublishing…" : "Unpublish"}
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    type="button"
                    onClick={publishNow}
                    disabled={busy !== null}
                    className="rounded-md border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-100 hover:bg-emerald-400/20 disabled:opacity-50"
                    title="Publish now"
                  >
                    {busy === "publish" ? "Publishing…" : "Publish"}
                  </button>
                </div>
              )}

              <Link
                href={`/dashboard/product-content/${item._id}/edit`}
                className="rounded-md border border-sky-400/30 bg-sky-400/10 px-3 py-1.5 text-xs text-sky-100 hover:bg-sky-400/20"
                title="Edit"
              >
                Edit
              </Link>

              {/* <span
                                aria-disabled="true"
                                className="rounded-md border border-sky-400/30 bg-sky-400/10 px-3 py-1.5 text-xs text-sky-100 opacity-30 cursor-not-allowed"
                            >
                                Edit
                            </span> */}

              <button
                type="button"
                onClick={removeItem}
                disabled={busy !== null}
                className="rounded-md border border-red-400/40 bg-red-500/10 px-3 py-1.5 text-xs text-red-200 hover:bg-red-500/20 disabled:opacity-50"
                title="Delete"
              >
                {busy === "delete" ? "Deleting…" : "Delete"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
// Client-side skeleton
export function PublicProductsGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
        >
          <div className="aspect-[16/10] bg-white/[0.06]" />
          <div className="space-y-2 p-3">
            <div className="h-3 w-2/3 rounded bg-white/[0.08]" />
            <div className="h-3 w-1/3 rounded bg-white/[0.06]" />
          </div>
        </div>
      ))}
    </div>
  );
}
// ---- Client component: fetches from /api/v1/controllers/products/public on the browser
export default function PublicProductsGrid({
  q,
  category,
  tag,
  page = 1,
  limit = 12,
  all = false,
  sort = "-publishedAt,-createdAt",
  fields,
  className,
  noStore = false,
  refreshIntervalSec,
  baseUrl = "",
}: {
  q?: string;
  category?: string;
  tag?: string;
  page?: number;
  limit?: number | "all";
  all?: boolean;
  sort?: string; // e.g. "-publishedAt,-createdAt"
  fields?: string; // e.g. "title,slug,images,summary"
  className?: string;
  /** If true, sends fetch with cache: 'no-store' */
  noStore?: boolean;
  /** Optional polling in seconds */
  refreshIntervalSec?: number;
  /** Provide an absolute base URL (e.g. https://example.com). If empty, uses relative path. */
  baseUrl?: string;
}) {
  const [data, setData] = useState<PublicListResponse | null>(null);
  const [statusFilter, setStatusFilter] = useState<
    "any" | "draft" | "scheduled" | "published" | "archived"
  >("any");
  const [visibilityFilter, setVisibilityFilter] = useState<
    "any" | "public" | "private" | "roles"
  >("any");
  const [brandOptions, setBrandOptions] = useState<BrandOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const makeFetchOptions = useCallback(
    (signal?: AbortSignal): RequestInit => {
      const opts: RequestInit = { credentials: "include" };
      if (signal) {
        opts.signal = signal;
      }
      if (noStore) {
        opts.cache = "no-store";
      }
      return opts;
    },
    [noStore]
  );
  const selectedBrandId = useSelector(selectSelectedBrandId);

  const normalizedBaseUrl = useMemo(
    () => (baseUrl ?? "").replace(/\/$/, ""),
    [baseUrl]
  );

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    async function loadBrands() {
      try {
        const res = await fetch(
          `${normalizedBaseUrl}/api/v1/controllers/brands/public?all=1&fields=_id,name`,
          { signal: controller.signal }
        );
        if (!res.ok) return;
        const payload = await res.json().catch(() => ({}));
        const items = Array.isArray(payload?.items) ? payload.items : [];
        if (!cancelled) {
          const mapped = items
            .map((item: any) => ({
              _id: item?._id,
              name: item?.name ?? item?.slug ?? "Unnamed brand",
            }))
            .filter((brand: any) => brand._id && brand.name)
            .sort((a: BrandOption, b: BrandOption) =>
              a.name.localeCompare(b.name)
            );
          setBrandOptions(mapped);
        }
      } catch (err) {
        if (!controller.signal.aborted && !cancelled) {
          // ignore load errors, keep existing options
        }
      }
    }

    loadBrands();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [normalizedBaseUrl]);

  const url = useMemo(() => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    if (tag) params.set("tag", tag);
    if (fields) params.set("fields", fields);
    if (sort) params.set("sort", sort);

    params.set("status", statusFilter);
    params.set("visibility", visibilityFilter);
    params.set("when", "any");
    if (selectedBrandId) params.set("brandId", selectedBrandId);

    if (all || limit === "all") {
      params.set("all", "1");
    } else {
      params.set("page", String(page));
      params.set("limit", String(typeof limit === "number" ? limit : 12));
    }

    const basePath = `${normalizedBaseUrl}/api/v1/controllers/products/`;
    return `${basePath}?${params.toString()}`;
  }, [
    q,
    category,
    tag,
    page,
    limit,
    all,
    sort,
    fields,
    statusFilter,
    visibilityFilter,
    selectedBrandId,
    normalizedBaseUrl,
  ]);

  useEffect(() => {
    let timer: any;
    const ac = new AbortController();

    async function run() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(url, makeFetchOptions(ac.signal));
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as PublicListResponse;

        setData(json);
      } catch (e: any) {
        if (e?.name !== "AbortError")
          setError(e?.message || "Failed to load products");
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    }

    run();

    if (refreshIntervalSec && refreshIntervalSec > 0) {
      timer = setInterval(run, refreshIntervalSec * 1000);
    }

    return () => {
      ac.abort();
      if (timer) clearInterval(timer);
    };
  }, [url, refreshIntervalSec, makeFetchOptions]);

  const fetchData = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(url, makeFetchOptions(signal));
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as PublicListResponse;
        setData(json);
      } catch (e: any) {
        if (e?.name !== "AbortError")
          setError(e?.message || "Failed to load products");
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [url, noStore]
  );

  const optimisticPatch = useCallback(
    (id: string, patch: Partial<ProductDoc>) => {
      setData((prev) =>
        prev
          ? {
              ...prev,
              items: prev.items.map((it) =>
                it._id === id ? { ...it, ...patch } : it
              ),
            }
          : prev
      );
    },
    []
  );

  useEffect(() => {
    const ac = new AbortController();
    fetchData(ac.signal);
    let timer: any;
    if (refreshIntervalSec && refreshIntervalSec > 0) {
      timer = setInterval(() => fetchData(), refreshIntervalSec * 1000);
    }
    return () => {
      ac.abort();
      if (timer) clearInterval(timer);
    };
  }, [fetchData, refreshIntervalSec]);

  if (loading) return <PublicProductsGridSkeleton />;

  if (error) {
    return (
      <div
        className={clsx(
          "rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200",
          className
        )}
      >
        {error}
      </div>
    );
  }

  const items = data?.items || [];
  if (!items.length) {
    return (
      <div
        className={clsx(
          "rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center",
          className
        )}
      >
        <div className="mx-auto mb-3 h-14 w-14 rounded-full border border-white/10 bg-white/5" />
        <h3 className="text-lg font-medium text-white">No products</h3>
        <p className="mx-auto mt-1 max-w-md text-sm text-slate-400">
          Try adjusting filters or check back later.
        </p>
      </div>
    );
  }

  return (
    <section className={className}>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Products</h2>
        <span className="text-xs text-slate-400 px-3 pb-3">
          {data?.total ?? items.length} result
          {(data?.total ?? items.length) === 1 ? "" : "s"}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {items
          .filter((it) =>
            selectedBrandId ? it.brandId === selectedBrandId : true
          )
          .map((it) => (
            <ProductCard
              key={it._id}
              item={it}
              admin
              onChanged={() => fetchData()} // revalidate after success
              onOptimistic={(patch) => optimisticPatch(it._id, patch)} // instant UI
            />
          ))}
      </div>
    </section>
  );
}
