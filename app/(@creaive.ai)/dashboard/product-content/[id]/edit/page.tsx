// app/dashboard/product-content/[id]/edit/page.tsx
"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import TagsDropdown, { Tag, TAGS } from "../../utils";

type Status = "draft" | "scheduled" | "published" | "archived";
type Visibility = "public" | "private" | "roles";

type ProductDoc = {
    _id: string;
    slug: string;
    title: string;
    subtitle?: string;
    summary?: string;
    link?: string;
    images?: { url: string; alt?: string; width?: number; height?: number }[];
    videos?: { url: string; provider?: string; title?: string; duration?: number }[];
    categories?: string[];
    tags?: string[];
    status: Status;
    visibility: Visibility;
    allowedRoles?: string[];
    publishedAt?: string | null;
    unpublishedAt?: string | null;
    createdAt?: string;
    updatedAt?: string;
};

const isTag = (x: string): x is Tag => (TAGS as readonly string[]).includes(x);

export default function EditProductContentPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [busy, setBusy] = useState<null | "publish" | "unpublish" | "delete">(null);
    const [error, setError] = useState<string | null>(null);
    const [msg, setMsg] = useState<string | null>(null);

    const [doc, setDoc] = useState<ProductDoc | null>(null);
    const [existingImages, setExistingImages] = useState<Array<{ url: string; alt?: string; width?: number; height?: number }>>([]);

    // editable fields
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [summary, setSummary] = useState("");
    const [link, setLink] = useState("");
    const [categories, setCategories] = useState<string>("");
    const [tags, setTags] = useState<Tag[]>([]);
    const [status, setStatus] = useState<Status>("draft");
    const [visibility, setVisibility] = useState<Visibility>("public");
    const [allowedRoles, setAllowedRoles] = useState<string[]>([]);
    const [publishedAt, setPublishedAt] = useState<string>("");
    const [unpublishedAt, setUnpublishedAt] = useState<string>("");


    const [newFiles, setNewFiles] = useState<File[]>([]);
    const [newAlts, setNewAlts] = useState<string[]>([]);
    const [videos, setVideos] = useState<{ url: string; provider?: string; title?: string; duration?: number }[]>([]);

    const toLocalDT = (iso?: string | null) =>
        iso ? new Date(iso).toISOString().slice(0, 16) : "";

    const toISO = (dt: string) => {
        if (!dt) return undefined;
        const d = new Date(dt);
        return isNaN(d.getTime()) ? undefined : d.toISOString();
    };

    const newPreviews = useMemo(
        () => newFiles.map((f) => URL.createObjectURL(f)),
        [newFiles]
    );

    useEffect(() => {
        return () => newPreviews.forEach((u) => URL.revokeObjectURL(u));
    }, [newPreviews])

    function onPickFiles(e: React.ChangeEvent<HTMLInputElement>) {
        const list = Array.from(e.target.files || []);
        if (!list.length) return;
        setNewFiles((prev) => [...prev, ...list]);
        setNewAlts((prev) => [...prev, ...list.map(() => "")]);
        e.currentTarget.value = ""; // allow re-pick same file
    }

    function removeNew(idx: number) {
        setNewFiles((prev) => prev.filter((_, i) => i !== idx));
        setNewAlts((prev) => prev.filter((_, i) => i !== idx));
    }

    function moveNew(idx: number, dir: -1 | 1) {
        const ni = idx + dir;
        if (ni < 0 || ni >= newFiles.length) return;
        const nf = [...newFiles];
        const na = [...newAlts];
        [nf[idx], nf[ni]] = [nf[ni], nf[idx]];
        [na[idx], na[ni]] = [na[ni], na[idx]];
        setNewFiles(nf);
        setNewAlts(na);
    }

    function updateExistingAlt(idx: number, value: string) {
        setExistingImages((prev) => prev.map((img, i) => (i === idx ? { ...img, alt: value } : img)));
    }

    function removeExisting(idx: number) {
        setExistingImages((prev) => prev.filter((_, i) => i !== idx));
    }

    function moveExisting(idx: number, dir: -1 | 1) {
        setExistingImages((prev) => {
            const ni = idx + dir;
            if (ni < 0 || ni >= prev.length) return prev;
            const next = [...prev];
            [next[idx], next[ni]] = [next[ni], next[idx]];
            return next;
        });
    }


    const fetchDoc = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/v1/controllers/products/${id}`, { credentials: "include", cache: "no-store" });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = (await res.json()) as ProductDoc;
            setDoc(data);
            setExistingImages(data.images ?? []);
            setVideos(data.videos ?? []);

            // hydrate form
            setTitle(data.title ?? "");
            setSubtitle(data.subtitle ?? "");
            setSummary(data.summary ?? "");
            setLink(data.link ?? "");
            setCategories((data.categories ?? []).join(", "));
            setTags(((data.tags ?? []).filter(isTag)));
            setStatus(data.status ?? "draft");
            setVisibility(data.visibility ?? "public");
            setAllowedRoles(data.allowedRoles ?? []);
            setPublishedAt(toLocalDT(data.publishedAt ?? null));
            setUnpublishedAt(toLocalDT(data.unpublishedAt ?? null));
        } catch (e: any) {
            setError(e?.message || "Failed to load");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchDoc();
    }, [fetchDoc]);



    async function save() {
        if (!id) return;
        setSaving(true);
        setError(null);
        setMsg(null);
        try {
            const categoriesArray = categories
                .split(",")
                .map((x) => x.trim())
                .filter(Boolean);
            const imagesPayload = existingImages.map((img) => {
                const alt = img.alt?.trim() || undefined;
                const entry: { url: string; alt?: string; width?: number; height?: number } = { url: img.url };
                if (alt) entry.alt = alt;
                if (typeof img.width === "number") entry.width = img.width;
                if (typeof img.height === "number") entry.height = img.height;
                return entry;
            });
            const payload = {
                title: title?.trim(),
                subtitle: subtitle?.trim() || undefined,
                summary: summary?.trim() || undefined,
                link: link?.trim() || undefined,
                categories: categoriesArray,
                tags,
                status,
                visibility,
                allowedRoles: visibility === "roles" ? allowedRoles : [],
                publishedAt: toISO(publishedAt),
                unpublishedAt: toISO(unpublishedAt),
                images: imagesPayload,
                videos: videos.length ? videos : undefined,
            };
            const hasNewUploads = newFiles.length > 0;
            let res: Response;
            if (hasNewUploads) {
                if (!payload.title) {
                    throw new Error("Title is required.");
                }
                const fd = new FormData();
                fd.set("title", payload.title);
                if (payload.subtitle) fd.set("subtitle", payload.subtitle);
                if (payload.summary) fd.set("summary", payload.summary);
                if (payload.link) fd.set("link", payload.link);
                fd.set("categories", JSON.stringify(payload.categories));
                fd.set("tags", JSON.stringify(payload.tags ?? []));
                fd.set("status", payload.status);
                fd.set("visibility", payload.visibility);
                fd.set("allowedRoles", JSON.stringify(payload.visibility === "roles" ? payload.allowedRoles : []));
                if (payload.publishedAt) fd.set("publishedAt", payload.publishedAt);
                if (payload.unpublishedAt) fd.set("unpublishedAt", payload.unpublishedAt);
                fd.set("existingImages", JSON.stringify(imagesPayload));
                if (payload.videos) fd.set("videos", JSON.stringify(payload.videos));
                newFiles.forEach((file, idx) => {
                    fd.append("images", file);
                    fd.append("alts", newAlts[idx] ?? "");
                });
                res = await fetch(`/api/v1/controllers/products/${id}`, {
                    method: "PATCH",
                    credentials: "include",
                    body: fd,
                });
            } else {
                res = await fetch(`/api/v1/controllers/products/${id}`, {
                    method: "PATCH",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
            }
            if (!res.ok) {
                const j = await res.json().catch(() => ({}));
                throw new Error(j?.error || `Save failed (${res.status})`);
            }
            setMsg("Saved.");
            setNewFiles([]);
            setNewAlts([]);
            await fetchDoc();
        } catch (e: any) {
            setError(e?.message || "Save error");
        } finally {
            setSaving(false);
        }
    }

    async function publishNow() {
        if (!id) return;
        setBusy("publish");
        setError(null);
        setMsg(null);
        try {
            const res = await fetch(`/api/v1/controllers/products/${id}`, {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    status: "published",
                    publishedAt: new Date().toISOString(),
                    unpublishedAt: null,
                }),
            });
            if (!res.ok) throw new Error(`Publish failed (${res.status})`);
            await fetchDoc();
            setMsg("Published ✓");
        } catch (e: any) {
            setError(e?.message || "Publish error");
        } finally {
            setBusy(null);
        }
    }

    async function unpublishNow() {
        if (!id) return;
        setBusy("unpublish");
        setError(null);
        setMsg(null);
        try {
            const res = await fetch(`/api/v1/controllers/products/${id}`, {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    status: "archived",
                    unpublishedAt: new Date().toISOString(),
                }),
            });
            if (!res.ok) throw new Error(`Unpublish failed (${res.status})`);
            await fetchDoc();
            setMsg("Unpublished ✓");
        } catch (e: any) {
            setError(e?.message || "Unpublish error");
        } finally {
            setBusy(null);
        }
    }

    async function removeItem() {
        if (!id) return;
        if (!confirm(`Delete “${title || doc?.title || "this item"}”? This cannot be undone.`)) return;
        setBusy("delete");
        setError(null);
        setMsg(null);
        try {
            const res = await fetch(`/api/v1/controllers/products/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (!res.ok) throw new Error(`Delete failed (${res.status})`);
            router.replace("/dashboard/product-content");
        } catch (e: any) {
            setError(e?.message || "Delete error");
        } finally {
            setBusy(null);
        }
    }

    const roleToggle = (r: string) =>
        setAllowedRoles((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]));

    if (loading) {
        return (
            <div className="p-6">
                <div className="mb-4 h-8 w-56 animate-pulse rounded bg-white/10" />
                <div className="grid gap-4 sm:grid-cols-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-16 animate-pulse rounded bg-white/5" />
                    ))}
                </div>
            </div>
        );
    }

    if (!doc) {
        return (
            <div className="p-6 text-red-200">
                {error || "Not found"}
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-full px-4 py-6 text-white">
            <header className="mb-5 flex items-end justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Edit: {doc.title}</h1>
                    <p className="text-xs text-slate-400 px-3 pb-3">ID: {doc._id} • Slug: {doc.slug}</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="rounded-full border border-white/10 px-2 py-1 text-xs text-slate-300">
                        Status: <b className="ml-1">{doc.status}</b>
                    </span>
                    <span className="rounded-full border border-white/10 px-2 py-1 text-xs text-slate-300">
                        Visibility: <b className="ml-1">{doc.visibility}</b>
                    </span>
                </div>
            </header>

            {error && (
                <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-red-200">{error}</div>
            )}
            {msg && (
                <div className="mb-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-emerald-200">{msg}</div>
            )}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr]">
                {/* LEFT */}
                <section className="rounded-xl border border-white/10 bg-white/[0.05] p-4">
                    <h2 className="mb-3 text-lg font-semibold">Images</h2>

                    {/* Picker */}
                    <div className="flex items-center gap-3">
                        <label className="rounded-md border border-white/20 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 cursor-pointer">
                            Select images
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                className="hidden"
                                onChange={onPickFiles}
                            />
                        </label>
                        <span className="text-xs text-slate-400 px-3 pb-3">
                            JPEG/PNG/WebP/AVIF/GIF • up to 10MB each
                        </span>
                    </div>

                    {/* Existing images from DB */}
                    {existingImages.length > 0 ? (
                        <>
                            <div className="mt-4 text-xs text-slate-400">Existing</div>
                            <div className="mt-2 grid grid-cols-1 xl:grid-cols-2 gap-3 sm:grid-cols-1">
                                {existingImages.map((img, i) => (
                                    <div key={`${img.url}-${i}`} className="rounded-lg border border-white/10 bg-black/30 p-3">
                                        <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-white/10">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={img.url.startsWith("http") || img.url.startsWith("/api/")
                                                    ? img.url
                                                    : `/api/v1/controllers/getImage/productcontent?name=${encodeURIComponent(img.url.replace("/productcontent/", ""))}`}
                                                alt={img.alt || doc?.title || ""}
                                                className="h-full w-full object-cover"
                                            />
                                            <span className="absolute left-2 top-2 rounded-full border border-emerald-400/40 bg-emerald-400/15 px-2 py-0.5 text-[11px] text-emerald-100">
                                                Existing
                                            </span>
                                        </div>

                                        <div className="mt-2 flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => moveExisting(i, -1)}
                                                disabled={i === 0}
                                                className="rounded-md border border-white/20 px-2 py-1 text-xs disabled:opacity-40"
                                                title="Move left"
                                            >
                                                {"<"}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => moveExisting(i, +1)}
                                                disabled={i === existingImages.length - 1}
                                                className="rounded-md border border-white/20 px-2 py-1 text-xs disabled:opacity-40"
                                                title="Move right"
                                            >
                                                {">"}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => removeExisting(i)}
                                                className="ml-auto rounded-md border border-red-400/40 bg-red-500/10 px-2 py-1 text-xs text-red-200 hover:bg-red-500/20"
                                                title="Remove"
                                            >
                                                Remove
                                            </button>
                                        </div>

                                        <label className="mt-2 flex flex-col gap-1">
                                            <span className="text-xs text-slate-400 px-3 pb-3">Alt text</span>
                                            <input
                                                value={img.alt || ""}
                                                onChange={(e) => updateExistingAlt(i, e.target.value)}
                                                className="rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-fuchsia-500"
                                            />
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : null}

                    {/* New (local) previews */}
                    {newFiles.length > 0 && (
                        <>
                            <div className="mt-5 text-xs text-slate-400">New (unsaved)</div>
                            <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {newFiles.map((f, i) => (
                                    <div key={i} className="rounded-lg border border-white/10 bg-black/30 p-3">
                                        <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-white/10">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={newPreviews[i]}
                                                alt={newAlts[i] || f.name}
                                                className="h-full w-full object-cover"
                                            />
                                            <span className="absolute left-2 top-2 rounded-full border border-amber-400/40 bg-amber-400/15 px-2 py-0.5 text-[11px] text-amber-100">
                                                New
                                            </span>
                                        </div>

                                        <div className="mt-2 flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => moveNew(i, -1)}
                                                disabled={i === 0}
                                                className="rounded-md border border-white/20 px-2 py-1 text-xs disabled:opacity-40"
                                                title="Move left"
                                            >
                                                {"<"}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => moveNew(i, +1)}
                                                disabled={i === newFiles.length - 1}
                                                className="rounded-md border border-white/20 px-2 py-1 text-xs disabled:opacity-40"
                                                title="Move right"
                                            >
                                                {">"}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => removeNew(i)}
                                                className="ml-auto rounded-md border border-red-400/40 bg-red-500/10 px-2 py-1 text-xs text-red-200 hover:bg-red-500/20"
                                                title="Remove"
                                            >
                                                Remove
                                            </button>
                                        </div>

                                        <label className="mt-2 flex flex-col gap-1">
                                            <span className="text-xs text-slate-400 px-3 pb-3">Alt text</span>
                                            <input
                                                value={newAlts[i] || ""}
                                                onChange={(e) =>
                                                    setNewAlts((prev) => {
                                                        const next = [...prev];
                                                        next[i] = e.target.value;
                                                        return next;
                                                    })
                                                }
                                                className="rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-fuchsia-500"
                                            />
                                        </label>

                                        <div className="mt-1 truncate text-[11px] text-slate-500">
                                            {f.name} • {(f.size / 1024 / 1024).toFixed(2)} MB
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </section>


                <section className="rounded-xl border border-white/10 bg-white/[0.05] p-4">
                    <h2 className="mb-3 text-lg font-semibold">Content</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <label className="flex flex-col gap-1">
                            <span className="text-sm text-slate-300">Title</span>
                            <input value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-md border border-white/10 bg-black/40 px-3 py-2" />
                        </label>
                        <label className="flex flex-col gap-1">
                            <span className="text-sm text-slate-300">Subtitle</span>
                            <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="rounded-md border border-white/10 bg-black/40 px-3 py-2" />
                        </label>
                        <label className="flex flex-col gap-1 sm:col-span-2">
                            <span className="text-sm text-slate-300">Summary</span>
                            <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={4} className="rounded-md border border-white/10 bg-black/40 px-3 py-2" />
                        </label>
                        <label className="flex flex-col gap-1 sm:col-span-2">
                            <span className="text-sm text-slate-300">Project Link (optional)</span>
                            <input value={link} onChange={(e) => setLink(e.target.value)} className="rounded-md border border-white/10 bg-black/40 px-3 py-2" />
                        </label>
                    </div>
                </section>

                <div className="rounded-xl border border-white/10 bg-white/[0.05] p-4">
                    <h2 className="mb-3 text-lg font-semibold">Videos</h2>
                    <div className="space-y-4">
                      {videos.map((v, i) => (
                        <div key={i} className="rounded-xl border border-white/10 bg-white/[0.03] p-3 space-y-2">
                          <label className="flex flex-col gap-1">
                            <span className="text-sm text-slate-300">Video URL *</span>
                            <input
                              value={v.url}
                              onChange={(e) => {
                                const next = [...videos];
                                next[i] = { ...next[i], url: e.target.value };
                                setVideos(next);
                              }}
                              className="rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm"
                              placeholder="https://youtube.com/..."
                              required
                            />
                          </label>
                          <label className="flex flex-col gap-1">
                            <span className="text-sm text-slate-300">Provider</span>
                            <input
                              value={v.provider || ""}
                              onChange={(e) => {
                                const next = [...videos];
                                next[i] = { ...next[i], provider: e.target.value };
                                setVideos(next);
                              }}
                              className="rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm"
                            />
                          </label>
                          <label className="flex flex-col gap-1">
                            <span className="text-sm text-slate-300">Title</span>
                            <input
                              value={v.title || ""}
                              onChange={(e) => {
                                const next = [...videos];
                                next[i] = { ...next[i], title: e.target.value };
                                setVideos(next);
                              }}
                              className="rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm"
                            />
                          </label>
                          <label className="flex flex-col gap-1">
                            <span className="text-sm text-slate-300">Duration (seconds)</span>
                            <input
                              type="number"
                              value={v.duration || ""}
                              onChange={(e) => {
                                const next = [...videos];
                                next[i] = { ...next[i], duration: Number(e.target.value) };
                                setVideos(next);
                              }}
                              className="rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => setVideos(videos.filter((_, j) => j !== i))}
                            className="rounded-md border border-red-400/40 bg-red-500/10 px-2 py-1 text-xs text-red-200 hover:bg-red-500/20"
                          >
                            Remove Video
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => setVideos([...videos, { url: "", provider: "", title: "", duration: 0 }])}
                        className="rounded-md border border-white/20 bg-white/5 px-3 py-1.5 text-xs text-slate-200 hover:bg-white/10"
                      >
                        Add Video
                      </button>
                    </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.05] p-4">
                    <h2 className="mb-3 text-lg font-semibold">Publishing</h2>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="grid grid-cols-2 gap-3">
                            <label className="flex flex-col gap-1">
                                <span className="text-sm text-slate-300">Status</span>
                                <select value={status} onChange={(e) => setStatus(e.target.value as Status)} className="rounded-md border border-white/10 bg-black/40 px-3 py-2">
                                    <option value="draft">draft</option>
                                    <option value="scheduled">scheduled</option>
                                    <option value="published">published</option>
                                    <option value="archived">archived</option>
                                </select>
                            </label>
                            <label className="flex flex-col gap-1">
                                <span className="text-sm text-slate-300">Visibility</span>
                                <select value={visibility} onChange={(e) => setVisibility(e.target.value as Visibility)} className="rounded-md border border-white/10 bg-black/40 px-3 py-2">
                                    <option value="public">public</option>
                                    <option value="private">private</option>
                                    <option value="roles">roles</option>
                                </select>
                            </label>
                        </div>

                        {visibility === "roles" && (
                            <div>
                                <div className="mb-2 text-sm text-slate-300">Allowed Roles</div>
                                <div className="flex flex-wrap gap-2">
                                    {["user", "manager", "admin", "master"].map((r) => {
                                        const active = allowedRoles.includes(r);
                                        return (
                                            <button
                                                key={r}
                                                type="button"
                                                onClick={() => roleToggle(r)}
                                                className={[
                                                    "rounded-full border px-3 py-1 text-sm transition",
                                                    active ? "border-fuchsia-400/60 bg-fuchsia-500/20 text-fuchsia-200" : "border-white/15 bg-white/5 hover:bg-white/10",
                                                ].join(" ")}
                                            >
                                                {r}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <label className="flex flex-col gap-1">
                                <span className="text-sm text-slate-300">Publish At</span>
                                <input type="datetime-local" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} className="rounded-md border border-white/10 bg-black/40 px-3 py-2" />
                            </label>
                            <label className="flex flex-col gap-1">
                                <span className="text-sm text-slate-300">Unpublish At</span>
                                <input type="datetime-local" value={unpublishedAt} onChange={(e) => setUnpublishedAt(e.target.value)} className="rounded-md border border-white/10 bg-black/40 px-3 py-2" />
                            </label>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                            {doc.status === "published" ? (
                                <button
                                    type="button"
                                    onClick={unpublishNow}
                                    disabled={busy !== null}
                                    className="rounded-md border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-sm text-amber-100 hover:bg-amber-400/20 disabled:opacity-50"
                                >
                                    {busy === "unpublish" ? "Unpublishing…" : "Unpublish now"}
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={publishNow}
                                    disabled={busy !== null}
                                    className="rounded-md border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-100 hover:bg-emerald-400/20 disabled:opacity-50"
                                >
                                    {busy === "publish" ? "Publishing…" : "Publish now"}
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={removeItem}
                                disabled={busy !== null}
                                className="ml-auto rounded-md border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-200 hover:bg-red-500/20 disabled:opacity-50"
                            >
                                {busy === "delete" ? "Deleting…" : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* RIGHT */}
                <div className="rounded-xl border border-white/10 bg-white/[0.05] p-4">
                    <h2 className="mb-3 text-lg font-semibold">Taxonomy</h2>
                    <div className="grid grid-cols-1 gap-4">
                        <label className="flex flex-col gap-1">
                            <span className="text-sm text-slate-300">Categories (CSV)</span>
                            <input
                                value={categories}
                                onChange={(e) => setCategories(e.target.value)}
                                className="rounded-md border border-white/10 bg-black/40 px-3 py-2"
                            />
                        </label>

                        {/* CHANGED: fixed-list multi-select for tags */}
                        <TagsDropdown
                            selected={tags}
                            onChange={(next) =>
                                setTags(next.filter((v, i, arr) => arr.indexOf(v) === i))
                            }
                            label="Tags"
                        />
                    </div>
                </div>
            </div>

            {/* sticky footer */}
            <div className="sticky bottom-4 mt-6 flex items-center justify-end gap-3 rounded-xl border border-white/10 bg-white/[0.06] p-3 backdrop-blur">
                <button onClick={() => router.back()} className="rounded-md border border-white/20 bg-white/5 px-4 py-2 text-sm hover:bg-white/10">
                    Cancel
                </button>
                <button
                    onClick={save}
                    disabled={saving}
                    className="rounded-md bg-fuchsia-600 px-4 py-2 text-sm font-semibold text-white hover:bg-fuchsia-500 disabled:opacity-50"
                >
                    {saving ? "Saving…" : "Save changes"}
                </button>
            </div>
        </div>
    );
}
