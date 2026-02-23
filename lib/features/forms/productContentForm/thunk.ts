// lib/features/forms/productContentForm/thunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Brand } from "./productContentForm";
import { RootState } from "../..";

const api = (baseUrl = "", p: string) => `${baseUrl.replace(/\/+$/, "")}${p}`;

// ดึงทั้งหมด
export const fetchBrands = createAsyncThunk<
  Brand[],
  { baseUrl?: string },
  { rejectValue: string }
>("brand/fetchAll", async ({ baseUrl }, { rejectWithValue }) => {
  try {
    const res = await fetch(
      api(
        baseUrl,
        `/api/v1/controllers/brands?all=1&fields=_id,name,slug,logoUrl,coverUrl`
      ),
      { credentials: "include" }
    );
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return rejectWithValue(data?.error || "Failed to load brands");
    const items: Brand[] = Array.isArray(data) ? data : data.items ?? [];
    return items;
  } catch (e: any) {
    return rejectWithValue(e?.message || "Failed to load brands");
  }
});

// ดึงรายการเดียว
export const fetchBrandById = createAsyncThunk<
  Brand,
  { id: string; baseUrl?: string },
  { rejectValue: string }
>("brand/fetchById", async ({ id, baseUrl }, { rejectWithValue }) => {
  try {
    const res = await fetch(api(baseUrl, `/api/v1/controllers/brands/${id}`), {
      credentials: "include",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return rejectWithValue(data?.error || "Failed to load brand");
    return data.item ?? data;
  } catch (e: any) {
    return rejectWithValue(e?.message || "Failed to load brand");
  }
});

// สร้างใหม่
export const createBrand = createAsyncThunk<
  Brand,
  {
    baseUrl?: string;
    name: string;
    slug?: string;
    description?: string;
    logoFile?: File | null;
    coverFile?: File | null;
  },
  { rejectValue: string }
>("brand/create", async (payload, { rejectWithValue }) => {
  const { baseUrl, name, slug, description, logoFile, coverFile } = payload;
  try {
    const fd = new FormData();
    fd.set("name", name.trim());
    if (slug?.trim()) fd.set("slug", slug.trim());
    if (description?.trim()) fd.set("description", description.trim());
    if (logoFile) fd.append("logo", logoFile);
    if (coverFile) fd.append("cover", coverFile);

    const res = await fetch(api(baseUrl, `/api/v1/controllers/brands`), {
      method: "POST",
      body: fd,
      credentials: "include",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok)
      return rejectWithValue(data?.error || `Create failed (${res.status})`);
    return data.item ?? data;
  } catch (e: any) {
    return rejectWithValue(e?.message || "Create failed");
  }
});

// อัปเดต
export const updateBrand = createAsyncThunk<
  Brand,
  {
    id: string;
    baseUrl?: string;
    name: string;
    slug: string;
    description?: string;
    logoFile?: File | null;
    coverFile?: File | null;
  },
  { rejectValue: string }
>("brand/update", async (payload, { rejectWithValue }) => {
  const { id, baseUrl, name, slug, description, logoFile, coverFile } = payload;
  try {
    const fd = new FormData();
    fd.set("name", name);
    fd.set("slug", slug);
    fd.set("description", description || "");
    if (logoFile) fd.append("logo", logoFile);
    if (coverFile) fd.append("cover", coverFile);

    const res = await fetch(api(baseUrl, `/api/v1/controllers/brands/${id}`), {
      method: "PATCH",
      body: fd,
      credentials: "include",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok)
      return rejectWithValue(data?.error || `Update failed (${res.status})`);
    return data.item ?? data;
  } catch (e: any) {
    return rejectWithValue(e?.message || "Update failed");
  }
});

// ลบ
export const deleteBrand = createAsyncThunk<
  void,
  { id: string; baseUrl?: string },
  { rejectValue: string }
>("brand/delete", async ({ id, baseUrl }, { rejectWithValue }) => {
  try {
    const res = await fetch(api(baseUrl, `/api/v1/controllers/brands/${id}`), {
      method: "DELETE",
      credentials: "include",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok)
      return rejectWithValue(data?.error || `Delete failed (${res.status})`);
  } catch (e: any) {
    return rejectWithValue(e?.message || "Delete failed");
  }
});

export const createProductContent = createAsyncThunk<
  any,
  { files: File[]; alts: string[]; coverIdx: number },
  { state: RootState; rejectValue: string }
>(
  "productContent/create",
  async ({ files, alts, coverIdx }, { getState, rejectWithValue }) => {
    const s = getState().productContentForm;
    const toISO = (dt: string) => {
      if (!dt) return "";
      const d = new Date(dt);
      return Number.isNaN(d.getTime()) ? "" : d.toISOString();
    };

    const fd = new FormData();
    // identity
    fd.set("title", s.title);
    if (s.slug.trim()) fd.set("slug", s.slug.trim());
    if (s.subtitle.trim()) fd.set("subtitle", s.subtitle);
    if (s.summary.trim()) fd.set("summary", s.summary);
    if (s.projectLink.trim()) fd.set("link", s.projectLink);
    if (s.sku.trim()) fd.set("sku", s.sku);
    if (s.body.trim()) fd.set("body", s.body);

    // taxonomy
    if (s.categories.length) fd.set("categories", s.categories.join(","));
    if (s.tags.length) fd.set("tags", s.tags.join(","));

    // commerce
    if (s.priceAmount) fd.set("priceAmount", s.priceAmount);
    if (s.priceCurrency) fd.set("priceCurrency", s.priceCurrency.toUpperCase());
    if (s.compareAmount) fd.set("compareAmount", s.compareAmount);
    if (s.compareCurrency)
      fd.set("compareCurrency", s.compareCurrency.toUpperCase());
    fd.set("inStock", s.inStock ? "true" : "false");

    // SEO
    if (s.seoTitle.trim()) fd.set("seoTitle", s.seoTitle);
    if (s.seoDescription.trim()) fd.set("seoDescription", s.seoDescription);
    if (s.seoKeywords.length) fd.set("seoKeywords", s.seoKeywords.join(","));
    if (s.seoOgImage.trim()) fd.set("seoOgImage", s.seoOgImage);

    // publishing
    fd.set("status", s.status);
    fd.set("visibility", s.visibility);
    if (s.visibility === "roles" && s.allowedRoles.length)
      fd.set("allowedRoles", s.allowedRoles.join(","));
    if (s.publishedAt) fd.set("publishedAt", toISO(s.publishedAt));
    if (s.unpublishedAt) fd.set("unpublishedAt", toISO(s.unpublishedAt));

    // brand (if your API supports it)
    if (s.brand.selectedId) fd.set("brandId", s.brand.selectedId);
    if (s.brand.name) fd.set("brand", s.brand.name);

    // Videos
    if (Array.isArray(s.videos) && s.videos.length) {
      const vids = s.videos
        .map((v) => ({
          url: (v.url || "").trim(),
          provider: v.provider?.trim() || undefined,
          title: v.title?.trim() || undefined,
          duration: typeof v.duration === "number" ? v.duration : undefined,
        }))
        .filter((v) => !!v.url);
      if (vids.length) fd.set("videos", JSON.stringify(vids));
    }

    // images (put cover first)
    const orderedIdx = files
      .map((_, i) => i)
      .sort((a, b) => (a === coverIdx ? -1 : b === coverIdx ? 1 : 0));
    orderedIdx.forEach((i) => fd.append("images", files[i]));
    orderedIdx.forEach((i) => fd.append("alts", alts[i] || ""));

    // console.log(
    //     Array.from(fd.entries()).map(([k, v]) =>
    //         [k, v instanceof File ? { name: v.name, type: v.type, size: v.size } : v]
    //     )
    // );

    try {
      const res = await fetch("/api/v1/controllers/products", {
        method: "POST",
        body: fd,
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok)
        throw new Error(data?.error || `Upload failed (${res.status})`);
      return data;
    } catch (err: any) {
      return rejectWithValue(
        err?.message || "Failed to create product content"
      );
    }
  }
);
