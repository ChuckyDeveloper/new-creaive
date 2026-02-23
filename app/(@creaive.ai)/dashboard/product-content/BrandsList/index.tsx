"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { useAppDispatch } from "@/lib/features";
import {
  setBrandFilter as setGlobalBrandFilter,
  clearBrandFilter as clearGlobalBrandFilter,
} from "@/lib/features/forms/productContentForm/brandFilterSlice";
import { selectSelectedBrandId } from "@/lib/features/forms/productContentForm/brandFilterSelectors";
import { setBrandSelectedId } from "@/lib/features/forms/productContentForm/productContentForm";

export type BrandDoc = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  coverUrl?: string;
  status: "active" | "archived";
  visibility: "public" | "private" | "roles";
  publishedAt?: string | null;
  unpublishedAt?: string | null;
};

export type BrandsResponse = {
  scope: string;
  mode: "all" | "paged";
  page: number;
  limit: number;
  total: number;
  pages: number;
  items: BrandDoc[];
};

type Props = {
  className?: string;
  title?: string;
  apiPath?: string;
};

const DEFAULT_API =
  "/api/v1/controllers/brands?all=1&fields=_id,name,slug,description,logoUrl,coverUrl,status,visibility,publishedAt,unpublishedAt";

function normalizeBrand(
  input: Partial<BrandDoc> & { _id: string; name: string; slug: string }
): BrandDoc {
  return {
    _id: input._id,
    name: input.name,
    slug: input.slug,
    description: input.description,
    logoUrl: input.logoUrl,
    coverUrl: input.coverUrl,
    status: (input.status ?? "active") as BrandDoc["status"],
    visibility: (input.visibility ?? "public") as BrandDoc["visibility"],
    publishedAt: input.publishedAt ?? null,
    unpublishedAt: input.unpublishedAt ?? null,
  };
}

const STATUS_LABEL: Record<BrandDoc["status"], string> = {
  active: "Published",
  archived: "Unpublished",
};

const STATUS_STYLE: Record<BrandDoc["status"], string> = {
  active: "bg-emerald-500/15 text-emerald-200 border border-emerald-500/40",
  archived: "bg-slate-500/15 text-slate-200 border border-slate-500/30",
};

const VISIBILITY_LABEL: Record<BrandDoc["visibility"], string> = {
  public: "Public",
  private: "Private",
  roles: "Roles",
};

type BrandCardProps = {
  brand: BrandDoc;
  busy: boolean;
  selected: boolean;
  onPublish: () => Promise<void> | void;
  onUnpublish: () => Promise<void> | void;
  onSelect: (brand: BrandDoc) => void;
};

function BrandCard({
  brand,
  busy,
  selected,
  onPublish,
  onUnpublish,
  onSelect,
}: BrandCardProps) {
  const imageSrc = brand.logoUrl
    ? `/api/v1/controllers/getImage/uploads/brands/?name=${encodeURIComponent(
        brand.logoUrl.replace("/uploads/brands/", "")
      )}`
    : null;

  const cardClasses = [
    "min-w-[200px] shrink-0 rounded-2xl border bg-white/[0.05] p-4 text-white shadow-sm transition hover:brightness-110",
    selected
      ? "border-fuchsia-400/60 ring-2 ring-fuchsia-500/30"
      : "border-white/10",
    busy ? "opacity-75" : "",
  ].join(" ");

  return (
    <div className={cardClasses}>
      <button
        type="button"
        disabled={busy}
        className="block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500/60 disabled:cursor-not-allowed"
        onClick={() => {
          onSelect(brand);
        }}
      >
        <div className="mb-4 aspect-[4/3] w-full overflow-hidden rounded-xl border border-white/10 bg-black/40">
          {imageSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageSrc}
              alt={brand.name}
              className="h-[290px] w-[290px] object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
              No image
            </div>
          )}
        </div>
        <h3 className="truncate text-base font-semibold">{brand.name}</h3>
        <p className="truncate text-xs text-slate-400">{brand.slug}</p>
      </button>

      <div className="mt-3 flex items-center gap-2 text-xs">
        <span
          className={`rounded-full px-2 py-1 ${STATUS_STYLE[brand.status]}`}
        >
          {STATUS_LABEL[brand.status]}
        </span>
        <span className="rounded-full border border-white/10 px-2 py-1 text-slate-200/80">
          {VISIBILITY_LABEL[brand.visibility]}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={onPublish}
          disabled={busy || brand.status === "active"}
          className="flex-1 rounded-md border border-emerald-500/50 bg-emerald-500/10 px-3 py-1.5 text-sm text-emerald-200 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Publish
        </button>
        <button
          type="button"
          onClick={onUnpublish}
          disabled={busy || brand.status === "archived"}
          className="flex-1 rounded-md border border-amber-500/50 bg-amber-500/10 px-3 py-1.5 text-sm text-amber-200 transition hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Unpublish
        </button>
      </div>
    </div>
  );
}

export default function BrandsList({
  className = "",
  title = "Brands",
  apiPath = DEFAULT_API,
}: Props) {
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();
  const selectedBrandId = useSelector(selectSelectedBrandId);
  const [error, setError] = useState<string | null>(null);
  const [brands, setBrands] = useState<BrandDoc[]>([]);
  const [busy, setBusy] = useState<Record<string, boolean>>({});

  const fetchBrands = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(apiPath, { credentials: "include", signal });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(
            data?.error || `Failed to fetch brands (${res.status})`
          );
        }
        const data = (await res.json()) as BrandsResponse;
        const normalized = (data.items || []).map((item) =>
          normalizeBrand(item)
        );
        setBrands(normalized);
      } catch (e: any) {
        if (e?.name === "AbortError") return;
        setError(e?.message || "Failed to fetch brands");
      } finally {
        setLoading(false);
      }
    },
    [apiPath]
  );

  useEffect(() => {
    const ac = new AbortController();
    fetchBrands(ac.signal);
    return () => ac.abort();
  }, [fetchBrands]);

  const setBrandPatch = useCallback((id: string, patch: Partial<BrandDoc>) => {
    setBrands((prev) =>
      prev.map((brand) => {
        if (brand._id !== id) return brand;
        return normalizeBrand({ ...brand, ...patch });
      })
    );
  }, []);

  const handleSelectBrand = useCallback(
    (brand: BrandDoc) => {
      dispatch(setGlobalBrandFilter({ id: brand._id, name: brand.name }));
      dispatch(setBrandSelectedId(brand._id));
    },
    [dispatch]
  );

  // dispatch(setBrandSelectedId(selectedBrandId))

  const handleClearBrand = useCallback(() => {
    dispatch(clearGlobalBrandFilter());
  }, [dispatch]);

  const handlePublish = useCallback(
    async (brand: BrandDoc) => {
      if (busy[brand._id]) return;
      setBusy((prev) => ({ ...prev, [brand._id]: true }));
      const optimistic = {
        status: "active" as BrandDoc["status"],
        publishedAt: new Date().toISOString(),
        unpublishedAt: null,
      };
      setBrandPatch(brand._id, optimistic);
      try {
        const res = await fetch(`/api/v1/controllers/brands/${brand._id}`, {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "active",
            publishedAt: new Date().toISOString(),
            unpublishedAt: null,
          }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data?.error || `Failed to publish (${res.status})`);
        }
        const data = await res.json().catch(() => ({}));
        if (data?.item) {
          setBrandPatch(brand._id, data.item as Partial<BrandDoc>);
        } else {
          fetchBrands();
        }
      } catch (e: any) {
        setError(e?.message || "Failed to publish brand");
        fetchBrands();
      } finally {
        setBusy((prev) => ({ ...prev, [brand._id]: false }));
      }
    },
    [busy, fetchBrands, setBrandPatch]
  );

  const handleUnpublish = useCallback(
    async (brand: BrandDoc) => {
      if (busy[brand._id]) return;
      setBusy((prev) => ({ ...prev, [brand._id]: true }));
      const optimistic = {
        status: "archived" as BrandDoc["status"],
        unpublishedAt: new Date().toISOString(),
      };
      setBrandPatch(brand._id, optimistic);
      try {
        const res = await fetch(`/api/v1/controllers/brands/${brand._id}`, {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "archived",
            unpublishedAt: new Date().toISOString(),
          }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data?.error || `Failed to unpublish (${res.status})`);
        }
        const data = await res.json().catch(() => ({}));
        if (data?.item) {
          setBrandPatch(brand._id, data.item as Partial<BrandDoc>);
        } else {
          fetchBrands();
        }
      } catch (e: any) {
        setError(e?.message || "Failed to unpublish brand");
        fetchBrands();
      } finally {
        setBusy((prev) => ({ ...prev, [brand._id]: false }));
      }
    },
    [busy, fetchBrands, setBrandPatch]
  );

  const busyMap = busy;

  if (loading) {
    return (
      <section className={className}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">{title}</h2>
          <span className="text-xs text-slate-400">Loading</span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="min-w-[260px] shrink-0 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03] p-4"
            />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={className}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">{title}</h2>
          <button
            type="button"
            onClick={() => fetchBrands()}
            className="rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-slate-200 hover:bg-white/10"
          >
            Retry
          </button>
        </div>
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </div>
      </section>
    );
  }

  if (!brands.length) {
    return (
      <section className={className}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">{title}</h2>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-center text-slate-400">
          No brands found.
        </div>
      </section>
    );
  }

  const totalLabel = `${brands.length} brand${brands.length === 1 ? "" : "s"}`;

  return (
    <section className={className}>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">{title}</h2>
        <span className="text-xs text-slate-400">{totalLabel}</span>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        <button
          type="button"
          onClick={() => {
            handleClearBrand();
          }}
          className={`min-w-[200px] shrink-0 rounded-2xl border bg-white/[0.05] p-4 text-white shadow-sm transition hover:brightness-110 ${
            selectedBrandId
              ? "border-white/10"
              : "border-fuchsia-400/60 ring-2 ring-fuchsia-500/30"
          }`}
        >
          <div className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500/60">
            <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black/40">
              All Usecases.
            </div>
          </div>
        </button>
        {brands.map((brand) => (
          <BrandCard
            key={brand._id}
            brand={brand}
            busy={Boolean(busyMap[brand._id])}
            selected={brand._id === selectedBrandId}
            onPublish={() => handlePublish(brand)}
            onUnpublish={() => handleUnpublish(brand)}
            onSelect={handleSelectBrand}
          />
        ))}
      </div>
    </section>
  );
}
