"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import TagsDropdown, {
  Field,
  Hint,
  Panel,
  Segmented,
  Tag,
  TokenInput,
} from "../utils";

import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/lib/features";

import {
  selectBrandsSelected,
  selectProductForm,
  selectSoftWarnings,
} from "@/lib/features/forms/productContentForm/selectors";

import {
  setField,
  setTokens,
  removeToken,
  toggleAllowedRole,
  resetForm,
  setToggleProductOpen,
} from "@/lib/features/forms/productContentForm/productContentForm";

import { createProductContent } from "@/lib/features/forms/productContentForm/thunk";
import {
  selectSelectedBrandId,
  selectSelectedBrandName,
} from "@/lib/features/forms/productContentForm/brandFilterSelectors";

type Status = "draft" | "scheduled" | "published" | "archived";
type Visibility = "public" | "private" | "roles";

const ROLES = ["user", "manager", "admin", "master"] as const;

export default function ProductContentManager() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const form = useSelector(selectProductForm);
  //   const brand = useSelector(selectBrandsSelected);
  const selectedBrandName = useSelector(selectSelectedBrandName);
  const softWarnings = useSelector(selectSoftWarnings);
  const { submitting, error, message } = form;

  // ---------- local (non-serializable) state only ----------
  const [files, setFiles] = useState<File[]>([]);
  const [alts, setAlts] = useState<string[]>([]);
  const [coverIdx, setCoverIdx] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dropRef = useRef<HTMLDivElement | null>(null);

  const previews = useMemo(
    () => files.map((f) => URL.createObjectURL(f)),
    [files]
  );
  useEffect(
    () => () => previews.forEach((u) => URL.revokeObjectURL(u)),
    [previews]
  );

  // ---------- helpers ----------
  const slugify = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 120);

  // Auto-slugify from title until the user edits slug
  useEffect(() => {
    if (!form.slugTouched) {
      dispatch(setField({ field: "slug", value: slugify(form.title) }));
    }
  }, [form.title, form.slugTouched, dispatch]);

  const addTokensFromString = (
    v: string,
    field: "categories" | "tags" | "seoKeywords"
  ) => {
    const items = v
      .split(/[,\n]/g)
      .map((x) => x.trim())
      .filter(Boolean);
    dispatch(
      setTokens({ field, values: [...(form[field] as string[]), ...items] })
    );
  };

  // ---------- file handlers ----------
  function onPickFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const list = Array.from(e.target.files || []);
    if (!list.length) return;
    setFiles((prev) => [...prev, ...list]);
    setAlts((prev) => [...prev, ...list.map(() => "")]);
    e.currentTarget.value = "";
  }
  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const incoming = Array.from(e.dataTransfer.files || []).filter((f) =>
      f.type.startsWith("image/")
    );
    if (!incoming.length) return;
    setFiles((prev) => [...prev, ...incoming]);
    setAlts((prev) => [...prev, ...incoming.map(() => "")]);
  }
  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
  }
  function removeFile(idx: number) {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
    setAlts((prev) => prev.filter((_, i) => i !== idx));
    if (coverIdx === idx) setCoverIdx(0);
    if (coverIdx > idx) setCoverIdx((v) => v - 1);
  }
  function moveFile(idx: number, dir: -1 | 1) {
    const ni = idx + dir;
    if (ni < 0 || ni >= files.length) return;
    const nf = [...files];
    const na = [...alts];
    [nf[idx], nf[ni]] = [nf[ni], nf[idx]];
    [na[idx], na[ni]] = [na[ni], na[idx]];
    setFiles(nf);
    setAlts(na);
    if (coverIdx === idx) setCoverIdx(ni);
    else if (coverIdx === ni) setCoverIdx(idx);
  }

  // ---------- submit ----------
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      dispatch(setField({ field: "error", value: "Title is required" } as any));
      return;
    }
    const result = await dispatch(
      createProductContent({ files, alts, coverIdx })
    );
    if (createProductContent.fulfilled.match(result)) {
      setTimeout(() => router.push("/dashboard/product-content"), 800);
      dispatch(resetForm());
      setFiles([]);
      setAlts([]);
      setCoverIdx(0);
    }
  }

  if (!form.open) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 flex items-center justify-between my-10">
        <div className="text-base font-semibold">
          Create New Content Usecase.
        </div>

        {selectedBrandName && (
          <div className="text-xl uppercase">- {selectedBrandName} -</div>
        )}

        <button
          type="button"
          onClick={() => dispatch(setToggleProductOpen())}
          className="rounded-md border border-white/20 bg-white/5 px-3 py-1.5 text-xs text-slate-200 hover:bg-white/10"
        >
          Open
        </button>
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-full">
      <header className="rounded-xl border border-white/10 bg-white/[0.04] p-4 flex items-center justify-between my-10">
        <div className="text-base font-semibold">
          Create New Content Usecase.
        </div>
        {selectedBrandName && (
          <div className="text-xl uppercase">- {selectedBrandName} -</div>
        )}
        <button
          type="button"
          onClick={() => dispatch(setToggleProductOpen())}
          className="rounded-md border border-white/20 bg-white/5 px-3 py-1.5 text-xs text-slate-200 hover:bg-white/10"
        >
          close
        </button>
      </header>

      {/* Toasts */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-red-200">
          {error}
        </div>
      )}
      {message && (
        <div className="mb-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-emerald-200">
          {message}
        </div>
      )}
      {softWarnings.length > 0 && (
        <div className="mb-4 rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-amber-200 text-sm">
          {softWarnings.map((w, i) => (
            <div key={i}>• {w}</div>
          ))}
        </div>
      )}

      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr]"
      >
        {/* LEFT */}
        <div className="space-y-6">
          <Panel title="Identity">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Title *">
                <input
                  value={form.title}
                  onChange={(e) =>
                    dispatch(
                      setField({ field: "title", value: e.target.value })
                    )
                  }
                  required
                  className="field-input rounded-md h-10 px-2 border-[1px] border-white/10 bg-black/40 text-white"
                  placeholder="e.g., Hologram Microsite"
                />
              </Field>

              {/* If you want slug visible, uncomment */}
              {/* <Field label="Slug">
                                    <input
                                        value={form.slug}
                                        onChange={(e) => {
                                        dispatch(setField({ field: "slug", value: e.target.value }));
                                        dispatch(setSlugTouched());
                                        }}
                                        placeholder="auto from title if empty"
                                        className="field-input font-mono"
                                    />
                                    </Field>
                                */}

              <Field label="Subtitle">
                <input
                  value={form.subtitle}
                  onChange={(e) =>
                    dispatch(
                      setField({ field: "subtitle", value: e.target.value })
                    )
                  }
                  className="field-input rounded-md h-10 px-2 border-[1px] border-white/10 bg-black/40 text-white"
                />
              </Field>

              <Field label="Summary">
                <textarea
                  value={form.summary}
                  onChange={(e) =>
                    dispatch(
                      setField({ field: "summary", value: e.target.value })
                    )
                  }
                  rows={3}
                  className="field-input rounded-md h-10 px-2 border-[1px] border-white/10 bg-black/40 text-white"
                />
                <Hint>{form.summary.length}/1200</Hint>
              </Field>

              <Field label="Project Link">
                <textarea
                  value={form.projectLink}
                  onChange={(e) =>
                    dispatch(
                      setField({ field: "projectLink", value: e.target.value })
                    )
                  }
                  rows={3}
                  className="field-input rounded-md h-10 px-2 border-[1px] border-white/10 bg-black/40 text-white"
                />
              </Field>

              <Field label="Body (JSON or text)" colSpan>
                <textarea
                  value={form.body}
                  onChange={(e) =>
                    dispatch(setField({ field: "body", value: e.target.value }))
                  }
                  rows={6}
                  placeholder='{"type":"doc","content":[{"type":"p","text":"Hello"}]}'
                  className="field-input rounded-md p-2 border-[1px] border-white/10 bg-black/40 text-white"
                />
              </Field>
            </div>
          </Panel>

          <Panel title="Taxonomy">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <TokenInput
                label="Categories"
                placeholder="showcase, ai"
                tokens={form.categories}
                onAdd={(v) => addTokensFromString(v, "categories")}
                onRemove={(i) =>
                  dispatch(removeToken({ field: "categories", index: i }))
                }
              />
              <TagsDropdown
                className="sm:col-span-1"
                selected={(form.tags as Tag[]) ?? []}
                onChange={(next) =>
                  dispatch(
                    setTokens({ field: "tags", values: next as string[] })
                  )
                }
              />
            </div>
          </Panel>

          <Panel title="SEO">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="SEO Title">
                <input
                  value={form.seoTitle}
                  onChange={(e) =>
                    dispatch(
                      setField({ field: "seoTitle", value: e.target.value })
                    )
                  }
                  className="field-input rounded-md h-10 px-2 border-[1px] border-white/10 bg-black/40 text-white"
                />
              </Field>
              <Field label="SEO Description">
                <input
                  value={form.seoDescription}
                  onChange={(e) =>
                    dispatch(
                      setField({
                        field: "seoDescription",
                        value: e.target.value,
                      })
                    )
                  }
                  className="field-input rounded-md h-10 px-2 border-[1px] border-white/10 bg-black/40 text-white"
                />
              </Field>
              <TokenInput
                label="SEO Keywords"
                placeholder="ai, hologram, showcase"
                tokens={form.seoKeywords}
                onAdd={(v) => addTokensFromString(v, "seoKeywords")}
                onRemove={(i) =>
                  dispatch(removeToken({ field: "seoKeywords", index: i }))
                }
                colSpan
              />
              <Field label="OG Image (URL)" colSpan>
                <input
                  value={form.seoOgImage}
                  onChange={(e) =>
                    dispatch(
                      setField({ field: "seoOgImage", value: e.target.value })
                    )
                  }
                  className="field-input rounded-md h-10 px-2 border-[1px] border-white/10 bg-black/40 text-white"
                />
              </Field>
            </div>
          </Panel>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          <Panel title="Publishing">
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-2 gap-3">
                <Segmented
                  label="Status"
                  value={form.status}
                  options={["draft", "scheduled", "published", "archived"]}
                  onChange={(v) =>
                    dispatch(setField({ field: "status", value: v as Status }))
                  }
                />
                <Segmented
                  label="Visibility"
                  value={form.visibility}
                  options={["public", "private", "roles"]}
                  onChange={(v) =>
                    dispatch(
                      setField({ field: "visibility", value: v as Visibility })
                    )
                  }
                />
              </div>

              {form.visibility === "roles" && (
                <div>
                  <div className="mb-2 text-sm text-slate-300">
                    Allowed Roles
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {ROLES.map((r) => {
                      const active = form.allowedRoles.includes(r);
                      return (
                        <button
                          key={r}
                          type="button"
                          onClick={() => dispatch(toggleAllowedRole(r))}
                          className={[
                            "rounded-full border px-3 py-1 text-sm transition",
                            active
                              ? "border-fuchsia-400/60 bg-fuchsia-500/20 text-fuchsia-200"
                              : "border-white/15 bg-white/5 hover:bg-white/10",
                          ].join(" ")}
                        >
                          {r}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Publish At">
                  <input
                    type="datetime-local"
                    value={form.publishedAt}
                    onChange={(e) =>
                      dispatch(
                        setField({
                          field: "publishedAt",
                          value: e.target.value,
                        })
                      )
                    }
                    className="field-input rounded-md h-10 px-2 border-[1px] border-white/10 bg-black/40 text-white"
                  />
                </Field>
                <Field label="Unpublish At">
                  <input
                    type="datetime-local"
                    value={form.unpublishedAt}
                    onChange={(e) =>
                      dispatch(
                        setField({
                          field: "unpublishedAt",
                          value: e.target.value,
                        })
                      )
                    }
                    className="field-input rounded-md h-10 px-2 border-[1px] border-white/10 bg-black/40 text-white"
                  />
                </Field>
              </div>
            </div>
          </Panel>

          <Panel title="Images">
            <div
              ref={dropRef}
              onDrop={onDrop}
              onDragOver={onDragOver}
              className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/15 bg-black/30 px-4 py-8 text-center transition hover:border-fuchsia-400/40 hover:bg-black/40"
            >
              <div className="text-sm text-slate-300">
                Drag & drop images here, or{" "}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-fuchsia-300 underline"
                >
                  browse
                </button>
              </div>
              <div className="mt-1 text-xs text-slate-500">
                JPEG / PNG / WEBP / AVIF / GIF • up to 10MB each
              </div>
              <input
                ref={fileInputRef}
                onChange={onPickFiles}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
              />
            </div>

            {files.length > 0 && (
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {files.map((f, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-white/10 bg-white/[0.03] p-3"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-white/10">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={previews[i]}
                        alt="preview"
                        className="h-full w-full object-cover"
                      />
                      <img
                        src={`/api/v1/controllers/getImage/productcontent?name=${encodeURIComponent(
                          previews[i].replace("/productcontent/", "")
                        )}`}
                        alt={previews[i]}
                        className="h-full w-full object-cover"
                      />
                      {i === coverIdx && (
                        <span className="absolute left-2 top-2 rounded-full border border-amber-400/50 bg-amber-400/20 px-2 py-0.5 text-[11px] text-amber-100">
                          Cover
                        </span>
                      )}
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCoverIdx(i)}
                        className="rounded-md border border-amber-400/30 bg-amber-400/10 px-2 py-1 text-xs text-amber-100 hover:bg-amber-400/20"
                        title="Set as cover (moves to first on upload)"
                      >
                        Set cover
                      </button>
                      <button
                        type="button"
                        onClick={() => moveFile(i, -1)}
                        disabled={i === 0}
                        className="rounded-md border border-white/20 px-2 py-1 text-xs disabled:opacity-40"
                        title="Move left"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveFile(i, +1)}
                        disabled={i === files.length - 1}
                        className="rounded-md border border-white/20 px-2 py-1 text-xs disabled:opacity-40"
                        title="Move right"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="ml-auto rounded-md border border-red-400/40 bg-red-500/10 px-2 py-1 text-xs text-red-200 hover:bg-red-500/20"
                        title="Remove"
                      >
                        Remove
                      </button>
                    </div>

                    <label className="mt-2 flex flex-col gap-1">
                      <span className="text-xs text-slate-400 px-3 pb-3">
                        Alt text
                      </span>
                      <input
                        value={alts[i] || ""}
                        onChange={(e) =>
                          setAlts((prev) =>
                            Object.assign([...prev], { [i]: e.target.value })
                          )
                        }
                        className="field-input text-sm"
                      />
                    </label>

                    <div className="mt-1 truncate text-[11px] text-slate-500">
                      {f.name} • {(f.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Panel>

          {/* Videos Panel */}
          <Panel title="Videos">
            <div className="space-y-4">
              {(form.videos ?? []).map((v, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-3 space-y-2"
                >
                  <Field label="Video URL *">
                    <input
                      value={v.url || ""}
                      onChange={(e) => {
                        const next = [...(form.videos ?? [])];
                        next[i] = { ...next[i], url: e.target.value };
                        dispatch(setField({ field: "videos", value: next }));
                      }}
                      className="field-input rounded-md h-10 px-2 border-[1px] border-white/10 bg-black/40 text-white"
                      placeholder="https://youtube.com/..."
                      required
                    />
                  </Field>
                  <Field label="Provider">
                    <input
                      value={v.provider || ""}
                      onChange={(e) => {
                        const next = [...(form.videos ?? [])];
                        next[i] = { ...next[i], provider: e.target.value };
                        dispatch(setField({ field: "videos", value: next }));
                      }}
                      className="field-input rounded-md h-10 px-2 border-[1px] border-white/10 bg-black/40 text-white"
                      />
                  </Field>
                  <Field label="Title">
                    <input
                      value={v.title || ""}
                      onChange={(e) => {
                        const next = [...(form.videos ?? [])];
                        next[i] = { ...next[i], title: e.target.value };
                        dispatch(setField({ field: "videos", value: next }));
                      }}
                      className="field-input rounded-md h-10 px-2 border-[1px] border-white/10 bg-black/40 text-white"
                      />
                  </Field>
                  <Field label="Duration (seconds)">
                    <input
                      type="number"
                      value={v.duration || ""}
                      onChange={(e) => {
                        const next = [...(form.videos ?? [])];
                        next[i] = {
                          ...next[i],
                          duration: Number(e.target.value),
                        };
                        dispatch(setField({ field: "videos", value: next }));
                      }}
                      className="field-input rounded-md h-10 px-2 border-[1px] border-white/10 bg-black/40 text-white"
                      />
                  </Field>
                  <button
                    type="button"
                    onClick={() => {
                      const next = (form.videos ?? []).filter(
                        (_, j) => j !== i
                      );
                      dispatch(setField({ field: "videos", value: next }));
                    }}
                    className="rounded-md border border-red-400/40 bg-red-500/10 px-2 py-1 text-xs text-red-200 hover:bg-red-500/20"
                  >
                    Remove Video
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  dispatch(
                    setField({
                      field: "videos",
                      value: [
                        ...(form.videos ?? []),
                        { url: "", provider: "", title: "", duration: 0 },
                      ],
                    })
                  )
                }
                className="rounded-md border border-white/20 bg-white/5 px-3 py-1.5 text-xs text-slate-200 hover:bg-white/10"
              >
                Add Video
              </button>
            </div>
          </Panel>
        </div>

        {/* sticky action bar */}
        <div className="lg:col-span-2 sticky bottom-4 mt-2 flex items-center justify-end gap-3 rounded-xl border border-white/10 bg-white/[0.06] p-3 backdrop-blur">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md border border-white/20 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-fuchsia-600 px-4 py-2 text-sm font-semibold text-white hover:bg-fuchsia-500 disabled:opacity-50"
          >
            {submitting ? "Saving…" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
