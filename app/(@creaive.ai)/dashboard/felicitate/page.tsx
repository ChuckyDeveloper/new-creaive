"use client";

import { join } from "path";
import { useEffect, useMemo, useRef, useState } from "react";

type Banner = {
  _id: string;
  title?: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
};

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const dropRef = useRef<HTMLLabelElement>(null);

  const load = async () => {
    setIsLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/v1/controllers/felicitate/banner", {
        cache: "no-store",
        credentials: "include",
      });
      const data = await res.json();
      setBanners(data);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setErr(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      if (title) fd.append("title", title);

      const res = await fetch("/api/v1/controllers/felicitate/banner", {
        method: "POST",
        body: fd,
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Upload failed (${res.status})`);
      setFile(null);
      setTitle("");
      await load();
    } catch (e: any) {
      setErr(e?.message ?? "Upload error");
    } finally {
      setIsUploading(false);
    }
  };

  const toggle = async (id: string) => {
    setBanners((prev) =>
      prev.map((b) => (b._id === id ? { ...b, isActive: !b.isActive } : b))
    );
    try {
      const res = await fetch(
        `/api/v1/controllers/felicitate/banner/${id}/toggle`,
        { method: "PATCH", credentials: "include" }
      );
      if (!res.ok) throw new Error("Toggle failed");
    } catch (e: any) {
      // rollback
      setBanners((prev) =>
        prev.map((b) => (b._id === id ? { ...b, isActive: !b.isActive } : b))
      );
      setErr(e?.message ?? "Toggle error");
    }
  };

  const activate = async (id: string) => {
    setBanners((prev) => prev.map((b) => ({ ...b, isActive: b._id === id })));

    try {
      const res = await fetch(
        `/api/v1/controllers/felicitate/banner/${id}/activate`,
        { method: "PATCH", credentials: "include" }
      );
      if (!res.ok) throw new Error("Activate failed");
    } catch (e: any) {
      // rollback (reload from server)
      await load();
      setErr(e?.message ?? "Activate error");
    }
  };

  const deactivateAll = async () => {
    // optimistic UI
    setBanners((prev) => prev.map((b) => ({ ...b, isActive: false })));
    try {
      const res = await fetch(
        "/api/v1/controllers/felicitate/banner/deactivate-all",
        { method: "PATCH", credentials: "include" }
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || "Deactivate-all failed");
      }
    } catch (e: any) {
      await load(); // rollback
      setErr(e?.message ?? "Deactivate-all error");
    }
  };

  const removeBanner = async (id: string) => {
    const snapshot = banners;
    setBanners((prev) => prev.filter((b) => b._id !== id));
    setErr(null);

    try {
      const res = await fetch(
        `/api/v1/controllers/felicitate/banner/${id}/delete`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({} as any));
        throw new Error(body?.error || `Delete failed (${res.status})`);
      }
    } catch (e: any) {
      // rollback
      setBanners(snapshot);
      setErr(e?.message ?? "Delete error");
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.startsWith("image/")) setFile(f);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const stats = useMemo(() => {
    const total = banners.length;
    const active = banners.filter((b) => b.isActive).length;
    return { total, active };
  }, [banners]);

  return (
    <div className="mx-auto max-w-full space-y-8 text-slate-100 text-white">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Banners</h1>
          <p className="mt-1 text-sm text-slate-400">
            Upload, manage visibility, and reorder your homepage visuals.
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-3">
          <StatPill label="Total" value={stats.total} />
          <StatPill label="Active" value={stats.active} tone="emerald" />
          <button
            onClick={deactivateAll}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200 hover:bg-white/10"
            title="Turn off all banners"
          >
            Deactivate all
          </button>
        </div>
      </div>

      <form
        onSubmit={onUpload}
        className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-xl backdrop-blur"
      >
        <div className="grid gap-5 sm:grid-cols-[1fr_minmax(320px,580px)] md:grid-cols-[1fr_minmax(220px,350px)]">
          <div className="flex flex-col gap-3">
            <label className="block text-sm text-slate-300">
              Title (optional)
            </label>
            <input
              type="text"
              placeholder="e.g., Summer Sale, Hero Banner"
              className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 outline-none ring-0 placeholder:text-slate-500 focus:border-indigo-400/40"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <label
              ref={dropRef}
              onDrop={onDrop}
              onDragOver={onDragOver}
              htmlFor="file-upload"
              className={[
                "flex-1 flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed px-4 py-10 text-center transition",
                "border-white/15 bg-black/20 hover:border-indigo-400/50 hover:bg-black/30",
              ].join(" ")}
            >
              <div>
                <div className="text-sm text-slate-300">
                  Drag & drop image here, or{" "}
                  <span className="text-indigo-300 underline">browse</span>
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  PNG / JPG / WEBP — up to 10MB
                </div>
              </div>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  const selectedFile = e.target.files?.[0] ?? null;
                  setFile(selectedFile);
                  e.target.value = "";
                }}
              />
            </label>
          </div>

          {/* Preview */}
          <div className="rounded-xl border border-white/10 bg-black/30 p-3 mt-8">
            <div className="text-xs text-slate-400 px-3 pb-3">Preview</div>
            <div className="mt-2 aspect-video overflow-hidden rounded-lg border border-white/10 bg-white/5">
              {file ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-slate-500">
                  No file selected
                </div>
              )}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setFile(null)}
                className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 hover:bg-white/5 disabled:opacity-50"
                disabled={!file || isUploading}
              >
                Clear
              </button>
              <button
                type="submit"
                disabled={!file || isUploading}
                className={[
                  "rounded-lg px-4 py-2 text-sm font-medium transition",
                  "bg-indigo-500/90 text-white hover:bg-indigo-500 disabled:opacity-50",
                ].join(" ")}
              >
                {isUploading ? "Uploading…" : "Upload"}
              </button>
            </div>
          </div>
        </div>

        {/* {err && (
                    <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                        {err}
                    </div>
                )} */}
      </form>

      {/* List / Grid */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Gallery</h2>
          <span className="text-xs text-slate-500">
            Newest first • Click the switch to enable/disable
          </span>
        </div>

        {isLoading ? (
          <SkeletonGrid />
        ) : banners.length === 0 ? (
          <EmptyState
            onAction={() =>
              dropRef.current?.scrollIntoView({ behavior: "smooth" })
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {banners.map((b) => (
              <BannerCard
                key={b._id}
                banner={b}
                onToggle={() =>
                  b.isActive ? deactivateAll() : activate(b._id)
                }
                onDelete={() => removeBanner(b._id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/* ------------------ subcomponents ------------------ */

function StatPill({
  label,
  value,
  tone = "indigo",
}: {
  label: string;
  value: number | string;
  tone?: "indigo" | "emerald" | "sky";
}) {
  const toneMap: Record<string, string> = {
    indigo: "bg-indigo-500/15 text-indigo-200 border-indigo-400/20",
    emerald: "bg-emerald-500/15 text-emerald-200 border-emerald-400/20",
    sky: "bg-sky-500/15 text-sky-200 border-sky-400/20",
  };
  return (
    <div
      className={[
        "rounded-full border px-3 py-1.5 text-xs",
        toneMap[tone] ?? toneMap.indigo,
      ].join(" ")}
    >
      <span className="font-medium">{label}</span>{" "}
      <span className="ml-1 opacity-90">{value}</span>
    </div>
  );
}

function BannerCard({
  banner,
  onToggle,
  onDelete,
}: {
  banner: Banner;
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-xl backdrop-blur transition hover:border-indigo-400/30">
      {/* {`/api/v1/controllers/felicitate/banner/getImageBanner?name=${encodeURIComponent(
        banner.imageUrl.replace("/uploads/banners/", "")
      )}`} */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {banner.imageUrl ? (
          <div>
            <img
              src={`/api/v1/controllers/felicitate/banner/getImageBanner?name=${encodeURIComponent(
                banner.imageUrl.replace("/uploads/banners/", "")
              )}`}
              alt={banner.title ?? "Banner image"}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
            />
          </div>
        ) : (
          <div className="h-full w-full bg-gray-800 flex items-center justify-center text-white text-center">
            No image available
          </div>
        )}

        {/* Active badge */}
        <div className="absolute left-3 top-3">
          <span
            className={[
              "rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-wide",
              banner.isActive
                ? "border-emerald-500/90 bg-emerald-500/15 text-emerald-200 bg-green-600 text-black border-black"
                : "border-slate-400/20 bg-slate-500/10 text-slate-300 bg-white text-black border-black",
            ].join(" ")}
          >
            {banner.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 p-3">
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-slate-100">
            {banner.title || "(no title)"}
          </div>
          <div className="truncate text-xs text-slate-500">
            {new Date(banner.createdAt).toLocaleString()}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (confirm("Delete this banner? This cannot be undone."))
                onDelete();
            }}
            className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs text-red-200 hover:bg-red-500/20"
            title="Delete image"
          >
            Delete
          </button>
          <Switch checked={banner.isActive} onChange={onToggle} />
        </div>
      </div>
    </div>
  );
}

function Switch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div
      className={[
        "border rounded-2xl h-7 w-[56px] flex items-center justify-center m-auto",
        checked ? "border-green-600" : "border-white",
      ].join(" ")}
    >
      <button
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={[
          "relative inline-flex h-7 w-12 items-center rounded-full transition ",
          checked ? "bg-emerald-500/70" : "bg-slate-600",
        ].join(" ")}
      >
        <span
          className={[
            "absolute left-0 h-5 w-5 transform rounded-full  transition",
            checked
              ? "translate-x-[27px] bg-green-600"
              : "translate-x-0 bg-white",
          ].join(" ")}
        />
      </button>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
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

function EmptyState({ onAction }: { onAction?: () => void }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
      <div className="mx-auto mb-3 h-14 w-14 rounded-full border border-white/10 bg-white/[0.04]" />
      <h3 className="text-lg font-medium">No banners yet</h3>
      <p className="mx-auto mt-1 max-w-md text-sm text-slate-400">
        Upload your first image to display on the homepage. You can enable or
        disable visibility anytime.
      </p>
      <button
        onClick={onAction}
        className="mt-5 rounded-lg bg-indigo-500/90 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
      >
        Upload now
      </button>
    </div>
  );
}
