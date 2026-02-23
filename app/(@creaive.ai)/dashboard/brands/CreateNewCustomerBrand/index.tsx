"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";

type Brand = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  coverUrl?: string;
  status?: "active" | "archived";
  visibility?: "public" | "private" | "roles";
  publishedAt?: string | null;
  unpublishedAt?: string | null;
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

const joinApiPath = (base: string, path: string) => `${base}${path}`;

function CreateNewCustomerBrand({ onChanged, baseUrl = "" }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [description, setDescription] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

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
      const prefix = normalizedBaseUrl ? normalizedBaseUrl : "";
      return `${prefix}/api/v1/controllers/getImage/uploads/brands/?name=${encodeURIComponent(
        filename
      )}`;
    },
    [normalizedBaseUrl]
  );

  const logoPreview = useMemo(
    () => (logoFile ? URL.createObjectURL(logoFile) : ""),
    [logoFile]
  );

  const coverPreview = useMemo(
    () => (coverFile ? URL.createObjectURL(coverFile) : ""),
    [coverFile]
  );

  useEffect(() => {
    return () => {
      if (logoPreview && logoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  useEffect(() => {
    return () => {
      if (coverPreview && coverPreview.startsWith("blob:")) {
        URL.revokeObjectURL(coverPreview);
      }
    };
  }, [coverPreview]);

  useEffect(() => {
    if (!slugTouched) {
      setSlug(slugify(name));
    }
  }, [name, slugTouched]);

  const resolveApi = useCallback(
    (path: string) => joinApiPath(normalizedBaseUrl, path),
    [normalizedBaseUrl]
  );

  const resetForm = useCallback(() => {
    setName("");
    setSlug("");
    setSlugTouched(false);
    setDescription("");
    setLogoFile(null);
    setCoverFile(null);
  }, []);

  const handleCreate = useCallback(async () => {
    if (busy) return;
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    setBusy(true);
    setError(null);
    setToast(null);

    try {
      const fd = new FormData();
      fd.set("name", name.trim());
      if (slug.trim()) fd.set("slug", slug.trim());
      if (description.trim()) fd.set("description", description.trim());
      if (logoFile) fd.append("logo", logoFile);
      if (coverFile) fd.append("cover", coverFile);

      const res = await fetch(resolveApi("/api/v1/controllers/brands"), {
        method: "POST",
        body: fd,
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || `Create failed (${res.status})`);
      }

      const created = (data?.item ?? data) as Brand;
      onChanged?.(created);
      setToast("Brand created successfully");
      resetForm();
    } catch (err: any) {
      setError(err?.message || "Failed to create brand");
    } finally {
      setBusy(false);
    }
  }, [busy, coverFile, description, logoFile, name, onChanged, resolveApi, resetForm, slug]);

  const handleOpen = useCallback(() => {
    setError(null);
    setToast(null);
    resetForm();
    setOpen(true);
  }, [resetForm]);

  const handleClose = useCallback(() => {
    setOpen(false);
    setError(null);
    setToast(null);
    resetForm();
  }, [resetForm]);

  if (!open) {
    return (
      <div className="mt-2 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] p-4">
        <div className="text-base font-semibold">Create New Brand</div>
        <button
          type="button"
          onClick={handleOpen}
          className="rounded-md border border-white/20 bg-white/5 px-3 py-1.5 text-xs text-slate-200 hover:bg-white/10"
        >
          Open
        </button>
      </div>
    );
  }

  return (
    <div className="mt-2 space-y-4 rounded-xl border border-white/10 bg-white/[0.04] p-4">
      <div className="flex items-center justify-between">
        <div className="text-base font-semibold">Create New Brand</div>
        <button
          type="button"
          onClick={handleClose}
          className="rounded-md border border-white/20 bg-white/5 px-3 py-1.5 text-xs text-slate-200 hover:bg-white/10"
        >
          Close
        </button>
      </div>

      <BrandForm
        mode="create"
        busy={busy}
        name={name}
        setName={setName}
        slug={slug}
        setSlug={(value) => {
          if (value.trim().length === 0) {
            setSlugTouched(false);
            setSlug("");
            return;
          }
          setSlugTouched(true);
          setSlug(value);
        }}
        description={description}
        setDescription={setDescription}
        logoPreview={logoPreview}
        setLogoFile={setLogoFile}
        coverPreview={coverPreview}
        setCoverFile={setCoverFile}
        buildAssetSrc={buildAssetSrc}
      />

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleCreate}
          disabled={busy}
          className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
        >
          {busy ? "Creating..." : "Create"}
        </button>
      </div>

      {error && (
        <div className="rounded border border-red-500/30 bg-red-500/10 p-2 text-sm text-red-200">
          {error}
        </div>
      )}
      {toast && (
        <div className="rounded border border-emerald-500/30 bg-emerald-500/10 p-2 text-sm text-emerald-200">
          {toast}
        </div>
      )}
    </div>
  );
}

type BrandFormProps = {
  mode: "create" | "edit";
  busy: boolean;
  name: string;
  setName: (v: string) => void;
  slug: string;
  setSlug: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  logoPreview: string;
  setLogoFile: (f: File | null) => void;
  coverPreview: string;
  setCoverFile: (f: File | null) => void;
  buildAssetSrc: (preview: string) => string;
};

function BrandForm({
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
  coverPreview,
  setCoverFile,
  buildAssetSrc,
}: BrandFormProps) {
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
      <div className="space-y-4 px-0">
        <h3 className="mb-1 text-sm font-semibold text-white">
          {mode === "create" ? "New Brand" : "Edit Brand"}
        </h3>
        <label className="flex flex-col gap-1">
          <span className="px-3 pb-3 text-xs text-slate-400">Name *</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={busy}
            className="rounded-md border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-fuchsia-500"
            placeholder="Customer brand name"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="px-3 pb-3 text-xs text-slate-400">Slug</span>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            disabled={busy}
            className="rounded-md border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-fuchsia-500"
            placeholder="auto-from-name if empty"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="px-3 pb-3 text-xs text-slate-400">Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            disabled={busy}
            className="rounded-md border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-fuchsia-500 min-h-[200px] max-h-[300px]"
          />
        </label>
      </div>

      <div className="space-y-4">
        <div className="px-0 py-4">
          <h3 className="mb-2 text-sm font-semibold text-white">Logo</h3>
          <div className="flex items-start gap-3">
            <div className="flex h-full w-full min-h-24 items-center overflow-hidden rounded-lg border border-white/10 bg-white/5">
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
          <div className="flex flex-col gap-2 py-2">
            <input
              type="file"
              accept="image/*"
              disabled={busy}
              onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
              className="block text-sm text-white file:mr-2 file:rounded-md file:border file:border-white/20 file:bg-white/10 file:px-3 file:py-1.5 file:text-slate-100 hover:file:bg-white/20"
            />
          </div>
        </div>

        <div className="px-0 py-4">
          <h3 className="mb-2 text-sm font-semibold text-white">Cover</h3>
          <div className="flex items-start gap-3">
            <div className="flex h-full w-full min-h-24 items-center overflow-hidden rounded-lg border border-white/10 bg-white/5">
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
          <div className="flex flex-col gap-2 py-2">
            <input
              type="file"
              accept="image/*"
              disabled={busy}
              onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
              className="block text-sm text-white file:mr-2 file:rounded-md file:border file:border-white/20 file:bg-white/10 file:px-3 file:py-1.5 file:text-slate-100 hover:file:bg-white/20"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateNewCustomerBrand;
