"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/lib/features";

import {
  selectBrandForm,
  selectBrands,
} from "@/lib/features/forms/productContentForm/selectors";

import {
  setBrandField,
  setBrandOpen,
  setBrandTab,
  setBrandSelectedId,
  setBrandSlugTouched,
  clearBrandFeedback,
} from "@/lib/features/forms/productContentForm/productContentForm";

import {
  fetchBrands,
  fetchBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
} from "@/lib/features/forms/productContentForm/thunk";

type Brand = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  coverUrl?: string;
};

type Props = {
  onChanged?: (brand: Brand | null) => void;
  baseUrl?: string;
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);

export default function CustomerBrandManager({
  onChanged,
  baseUrl = "",
}: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const brand = useSelector(selectBrandForm);
  const brands = useSelector(selectBrands);

  // non-serializable local only
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const logoPreview = useMemo(
    () => (logoFile ? URL.createObjectURL(logoFile) : brand.logoUrl || ""),
    [logoFile, brand.logoUrl]
  );
  const coverPreview = useMemo(
    () => (coverFile ? URL.createObjectURL(coverFile) : brand.coverUrl || ""),
    [coverFile, brand.coverUrl]
  );
  useEffect(
    () => () => {
      if (logoPreview.startsWith("blob:")) URL.revokeObjectURL(logoPreview);
    },
    [logoPreview]
  );
  useEffect(
    () => () => {
      if (coverPreview.startsWith("blob:")) URL.revokeObjectURL(coverPreview);
    },
    [coverPreview]
  );

  const normalizedBaseUrl = useMemo(
    () => (baseUrl ?? "").replace(/\/$/, ""),
    [baseUrl]
  );
  const buildAssetSrc = useCallback(
    (preview: string) => {
      if (!preview) return "";
      if (
        preview.startsWith("blob:") ||
        preview.startsWith("data:") ||
        preview.startsWith("http://") ||
        preview.startsWith("https://")
      ) {
        return preview;
      }

      const withoutBase =
        normalizedBaseUrl && preview.startsWith(normalizedBaseUrl)
          ? preview.slice(normalizedBaseUrl.length)
          : preview;

      if (withoutBase.startsWith("/api/")) {
        return normalizedBaseUrl
          ? `${normalizedBaseUrl}${withoutBase}`
          : withoutBase;
      }

      const filename = withoutBase
        .replace(/^\/?uploads\/brands\/?/, "")
        .replace(/^\/?/, "");
      const prefix = normalizedBaseUrl ? `${normalizedBaseUrl}` : "";
      return `${prefix}/api/v1/controllers/getImage/uploads/brands/?name=${encodeURIComponent(
        filename
      )}`;
    },
    [normalizedBaseUrl]
  );

  // auto-slug
  useEffect(() => {
    if (!brand.slugTouched) {
      dispatch(setBrandField({ field: "slug", value: slugify(brand.name) }));
    }
  }, [brand.name, brand.slugTouched, dispatch]);

  // load list
  useEffect(() => {
    dispatch(fetchBrands({ baseUrl }));
  }, [dispatch, baseUrl]);

  async function onPick(id: string) {
    dispatch(setBrandSelectedId(id));
    const r = await dispatch(fetchBrandById({ id, baseUrl }));
    if (fetchBrandById.fulfilled.match(r)) onChanged?.(r.payload);
  }

  async function onCreateClick() {
    dispatch(clearBrandFeedback());
    const r = await dispatch(
      createBrand({
        baseUrl,
        name: brand.name,
        slug: brand.slug,
        description: brand.description,
        logoFile,
        coverFile,
      })
    );
    if (createBrand.fulfilled.match(r)) {
      onChanged?.(r.payload);
      dispatch(setBrandTab("select"));
      // เคลียร์ไฟล์ local
      setLogoFile(null);
      setCoverFile(null);
      // โหลด list ใหม่ (optional ถ้าอยาก sync กับ server)
      dispatch(fetchBrands({ baseUrl }));
    }
  }

  async function onUpdateClick() {
    if (!brand.selectedId) return;
    dispatch(clearBrandFeedback());
    const r = await dispatch(
      updateBrand({
        id: brand.selectedId,
        baseUrl,
        name: brand.name,
        slug: brand.slug,
        description: brand.description,
        logoFile,
        coverFile,
      })
    );
    if (updateBrand.fulfilled.match(r)) {
      onChanged?.(r.payload);
      setLogoFile(null);
      setCoverFile(null);
      dispatch(fetchBrands({ baseUrl }));
    }
  }

  async function onDeleteClick() {
    if (!brand.selectedId) return;
    if (!confirm("Delete this brand?")) return;
    dispatch(clearBrandFeedback());
    const r = await dispatch(deleteBrand({ id: brand.selectedId, baseUrl }));
    if (deleteBrand.fulfilled.match(r)) {
      onChanged?.(null);
      setLogoFile(null);
      setCoverFile(null);
      dispatch(fetchBrands({ baseUrl }));
    }
  }

  if (!brand.open) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 flex items-center justify-between mt-4">
        <div className="text-base font-semibold">Selected Customer Brand</div>
        <button
          type="button"
          onClick={() => dispatch(setBrandOpen(true))}
          className="rounded-md border border-white/20 bg-white/5 px-3 py-1.5 text-xs text-slate-200 hover:bg-white/10"
        >
          Open
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-xl border border-white/10 bg-white/[0.04] p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-base font-semibold">Selected Customer Brand</div>
        <button
          type="button"
          onClick={() => dispatch(setBrandOpen(false))}
          className="rounded-md border border-white/20 bg-white/5 px-3 py-1.5 text-xs text-slate-200 hover:bg-white/10"
        >
          Close
        </button>
      </div>

      {brand.tab === "select" ? (
        <div className="space-y-4">
          {/* dropdown */}
          <div>
            <label className="text-xs text-slate-400 px-3 pb-3">
              Select brand
            </label>
            <div className="mt-1 flex gap-2">
              <select
                value={brand.selectedId}
                onChange={(e) => onPick(e.target.value)}
                className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              >
                <option value="">
                  {brand.loadingList ? "Loading…" : "— Select —"}
                </option>
                {brands.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => dispatch(fetchBrands({ baseUrl }))}
                className="rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
              >
                Refresh
              </button>
            </div>
          </div>

          {/* edit form */}
          {brand.selectedId ? (
            <BrandForm
              mode="edit"
              busy={
                brand.busy === "update" ||
                brand.busy === "delete" ||
                brand.loadingOne
              }
              name={brand.name}
              setName={(v) =>
                dispatch(setBrandField({ field: "name", value: v }))
              }
              slug={brand.slug}
              setSlug={(v) => {
                dispatch(setBrandSlugTouched());
                dispatch(setBrandField({ field: "slug", value: v }));
              }}
              description={brand.description}
              setDescription={(v) =>
                dispatch(setBrandField({ field: "description", value: v }))
              }
              logoPreview={logoPreview}
              setLogoFile={setLogoFile}
              logoUrl={brand.logoUrl}
              coverPreview={coverPreview}
              setCoverFile={setCoverFile}
              coverUrl={brand.coverUrl}
              buildAssetSrc={buildAssetSrc}
            />
          ) : (
            <div className="text-sm text-slate-400">Pick a brand to edit.</div>
          )}

          {/* actions */}
          {brand.selectedId && (
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onUpdateClick}
                disabled={brand.busy !== null || brand.loadingOne}
                className="rounded-md bg-fuchsia-600 px-4 py-2 text-sm font-semibold text-white hover:bg-fuchsia-500 disabled:opacity-50"
              >
                {brand.busy === "update" ? "Saving…" : "Save"}
              </button>
              <button
                type="button"
                onClick={onDeleteClick}
                disabled={brand.busy !== null || brand.loadingOne}
                className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-200 hover:bg-red-500/20 disabled:opacity-50"
              >
                {brand.busy === "delete" ? "Deleting…" : "Delete"}
              </button>
            </div>
          )}
        </div>
      ) : (
        // create tab
        <div className="space-y-4">
          <BrandForm
            mode="create"
            busy={brand.busy === "create"}
            name={brand.name}
            setName={(v) =>
              dispatch(setBrandField({ field: "name", value: v }))
            }
            slug={brand.slug}
            setSlug={(v) => {
              dispatch(setBrandSlugTouched());
              dispatch(setBrandField({ field: "slug", value: v }));
            }}
            description={brand.description}
            setDescription={(v) =>
              dispatch(setBrandField({ field: "description", value: v }))
            }
            logoPreview={logoPreview}
            setLogoFile={setLogoFile}
            logoUrl={brand.logoUrl}
            coverPreview={coverPreview}
            setCoverFile={setCoverFile}
            coverUrl={brand.coverUrl}
            buildAssetSrc={buildAssetSrc}
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onCreateClick}
              disabled={brand.busy !== null}
              className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
            >
              {brand.busy === "create" ? "Creating…" : "Create"}
            </button>
          </div>
        </div>
      )}

      {brand.error && (
        <div className="rounded border border-red-500/30 bg-red-500/10 p-2 text-sm text-red-200">
          {brand.error}
        </div>
      )}
      {brand.toast && (
        <div className="rounded border border-emerald-500/30 bg-emerald-500/10 p-2 text-sm text-emerald-200">
          {brand.toast}
        </div>
      )}
    </div>
  );
}

// presentational subform (เหมือนเดิม)
function BrandForm(props: {
  mode: "create" | "edit";
  busy: boolean;
  name: string;
  setName: (v: string) => void;
  slug: string;
  setSlug: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  logoPreview: string;
  logoUrl?: string;
  setLogoFile: (f: File | null) => void;
  coverPreview: string;
  coverUrl?: string;
  setCoverFile: (f: File | null) => void;
  buildAssetSrc: (preview: string) => string;
}) {
  const {
    mode,
    busy,
    name,
    setName,
    slug,
    setSlug,
    description,
    setDescription,
    logoPreview,
    setLogoFile,
    logoUrl,
    coverPreview,
    setCoverFile,
    coverUrl,
    buildAssetSrc,
  } = props;

  const logoSrc = useMemo(
    () => buildAssetSrc(logoPreview),
    [buildAssetSrc, logoPreview]
  );
  const coverSrc = useMemo(
    () => buildAssetSrc(coverPreview),
    [buildAssetSrc, coverPreview]
  );

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_1fr]">
      <div className="space-y-4 px-0 flex flex-col relative">
        <h3 className="mb-1 text-sm font-semibold text-white">
          {mode === "create" ? "New Brand" : "Edit Brand"}
        </h3>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-slate-400 px-3 pb-3">Name *</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={busy}
            className="rounded-md border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-fuchsia-500"
            placeholder="Customer brand name"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-slate-400 px-3 pb-3">Slug</span>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            disabled={busy}
            className="rounded-md border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-fuchsia-500"
            placeholder="auto-from-name if empty"
          />
        </label>
        <label className="flex flex-col gap-1 h-full">
          <span className="text-xs text-slate-400 px-3 pb-3">Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={busy}
            className="rounded-md border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-fuchsia-500 min-h-[200px] max-h-[300px]"
          />
        </label>
      </div>

      <div className="space-y-4">
        <div className="px-0 py-4">
          <h3 className="mb-2 text-sm font-semibold text-white">Logo</h3>
          <div className="flex items-start gap-3">
            <div className="w-full min-h-24 overflow-hidden rounded-lg border border-white/10 bg-white/5 flex items-center">
              {logoPreview ? (
                <img
                  src={logoSrc}
                  alt="logo"
                  className="h-40 w-40 object-cover m-auto"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
                  No logo
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2 py-2 ">
            <input
              type="file"
              accept="image/*"
              disabled={busy}
              onChange={(e) => props.setLogoFile(e.target.files?.[0] || null)}
              className="block text-sm text-white file:mr-2 file:rounded-md file:border file:border-white/20 file:bg-white/10 file:px-3 file:py-1.5 file:text-slate-100 hover:file:bg-white/20"
            />
            {logoUrl && !logoPreview.startsWith("blob:") && (
              <span className="text-xs text-slate-400 px-3 pb-3">
                current: <em>{logoUrl}</em>
              </span>
            )}
          </div>
        </div>

        <div className="px-0 py-4">
          <h3 className="mb-2 text-sm font-semibold text-white">Cover</h3>
          <div className="flex items-start gap-3">
            <div className="w-full min-h-24 overflow-hidden rounded-lg border border-white/10 bg-white/5 flex items-center">
              {coverPreview ? (
                <img
                  src={coverSrc}
                  alt="cover"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
                  No cover
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2 py-2 ">
            <input
              type="file"
              accept="image/*"
              disabled={busy}
              onChange={(e) => props.setCoverFile(e.target.files?.[0] || null)}
              className="block text-sm text-white file:mr-2 file:rounded-md file:border file:border-white/20 file:bg-white/10 file:px-3 file:py-1.5 file:text-slate-100 hover:file:bg-white/20"
            />
            {coverUrl && !coverPreview.startsWith("blob:") && (
              <span className="text-xs text-slate-400 px-3 pb-3">
                current: <em>{coverUrl}</em>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
