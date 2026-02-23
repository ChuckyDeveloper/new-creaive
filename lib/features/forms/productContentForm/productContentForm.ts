// @/lib/features/productContentForm/index.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  fetchBrands,
  fetchBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
} from "./thunk";

export type Status = "draft" | "scheduled" | "published" | "archived";
export type Visibility = "public" | "private" | "roles";
export type Brand = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  coverUrl?: string;
};
export type BrandState = {
  // UI
  open: boolean;
  tab: "select" | "create";

  // list + selection
  list: Brand[];
  selectedId: string;

  // form
  name: string;
  slug: string;
  slugTouched: boolean;
  description: string;
  logoUrl: string;
  coverUrl: string;

  // loading & status
  loadingList: boolean;
  loadingOne: boolean;
  busy: BrandBusy;

  // feedback
  error: string | null;
  toast: string | null;
};
export type BrandBusy = null | "create" | "update" | "delete";
export type ProductContentFormState = {
  // identity
  title: string;
  slug: string;
  slugTouched: boolean;
  subtitle: string;
  summary: string;
  projectLink: string;
  sku: string;
  body: string;
  videos: {
    url: string;
    provider?: string;
    title?: string;
    duration?: number;
  }[];

  // taxonomy
  categories: string[];
  tags: string[];
  seoKeywords: string[];

  // commerce (optional)
  priceAmount: string;
  priceCurrency: string;
  compareAmount: string;
  compareCurrency: string;
  inStock: boolean;

  // SEO
  seoTitle: string;
  seoDescription: string;
  seoOgImage: string;

  // publishing
  status: Status;
  visibility: Visibility;
  allowedRoles: string[];
  publishedAt: string; // datetime-local string
  unpublishedAt: string; // datetime-local string

  // brand
  brandId: string;
  brand: BrandState;

  // UI
  submitting: boolean;
  open: boolean;

  error: string | null;
  message: string | null;

  softWarnings: string[];
};

const initialBrand: BrandState = {
  open: false,
  tab: "select",

  list: [],
  selectedId: "",

  name: "",
  slug: "",
  slugTouched: false,
  description: "",
  logoUrl: "",
  coverUrl: "",

  loadingList: true,
  loadingOne: false,
  busy: null,

  error: null,
  toast: null,
};

const initialState: ProductContentFormState = {
  title: "",
  slug: "",
  slugTouched: false,
  subtitle: "",
  summary: "",
  projectLink: "",
  sku: "",
  body: "",
  videos: [],
  categories: [],
  tags: [],
  seoKeywords: [],
  priceAmount: "",
  priceCurrency: "THB",
  compareAmount: "",
  compareCurrency: "THB",
  inStock: true,
  seoTitle: "",
  seoDescription: "",
  seoOgImage: "",
  status: "draft",
  visibility: "public",
  allowedRoles: [],
  publishedAt: "",
  unpublishedAt: "",
  brandId: "",

  submitting: false,
  open: false,

  error: null,
  message: null,

  brand: initialBrand,
  softWarnings: [],
};

const slice = createSlice({
  name: "productContentForm",
  initialState,
  reducers: {
    setToggleProductOpen(s) {
      s.open = !s.open;
    },
    setField(
      s,
      a: PayloadAction<{ field: keyof ProductContentFormState; value: any }>
    ) {
      (s as any)[a.payload.field] = a.payload.value;
    },
    setTokens(
      s,
      a: PayloadAction<{
        field: "categories" | "tags" | "seoKeywords";
        values: string[];
      }>
    ) {
      s[a.payload.field] = Array.from(
        new Set(a.payload.values.map((v) => v.trim()).filter(Boolean))
      ) as any;
    },
    addToken(
      s,
      a: PayloadAction<{
        field: "categories" | "tags" | "seoKeywords";
        value: string;
      }>
    ) {
      const arr = (s[a.payload.field] as string[]) || [];
      const v = a.payload.value.trim();
      if (v && !arr.includes(v)) arr.push(v);
    },
    removeToken(
      s,
      a: PayloadAction<{
        field: "categories" | "tags" | "seoKeywords";
        index: number;
      }>
    ) {
      (s[a.payload.field] as string[]).splice(a.payload.index, 1);
    },
    toggleAllowedRole(s, a: PayloadAction<string>) {
      const i = s.allowedRoles.indexOf(a.payload);
      if (i >= 0) s.allowedRoles.splice(i, 1);
      else s.allowedRoles.push(a.payload);
    },
    setSlugTouched(s) {
      s.slugTouched = true;
    },
    clearToast(s) {
      s.message = null;
      s.error = null;
    },
    resetForm() {
      return initialState;
    },

    // ---------- brand reducers ----------
    setBrandField(
      s,
      a: PayloadAction<{
        field: keyof BrandState;
        value: BrandState[keyof BrandState];
      }>
    ) {
      (s.brand as any)[a.payload.field] = a.payload.value as any;
    },
    setBrandOpen(s, a: PayloadAction<boolean>) {
      s.brand.open = a.payload;
    },
    setBrandTab(s, a: PayloadAction<"select" | "create">) {
      s.brand.tab = a.payload;
    },
    setBrandSlugTouched(s) {
      s.brand.slugTouched = true;
    },
    setBrandSelectedId(s, a: PayloadAction<string>) {
      s.brand.selectedId = a.payload;
    },
    clearBrandFeedback(s) {
      s.brand.error = null;
      s.brand.toast = null;
    },
    resetBrandForm(s) {
      s.brand = { ...initialBrand, loadingList: false }; // ไม่ให้กระพริบ loading list
    },
  },
  extraReducers: (b) => {
    // ====== Brands list ======
    b.addCase(fetchBrands.pending, (s) => {
      s.brand.loadingList = true;
      s.brand.error = null;
    });
    b.addCase(fetchBrands.fulfilled, (s, a) => {
      s.brand.loadingList = false;
      s.brand.list = a.payload;
    });
    b.addCase(fetchBrands.rejected, (s, a) => {
      s.brand.loadingList = false;
      s.brand.error = (a.payload as string) || "Failed to load brands";
    });

    // ====== Get one brand by id ======
    b.addCase(fetchBrandById.pending, (s) => {
      s.brand.loadingOne = true;
      s.brand.error = null;
    });
    b.addCase(fetchBrandById.fulfilled, (s, a) => {
      s.brand.loadingOne = false;
      const br = a.payload;
      s.brand.name = br.name || "";
      s.brand.slug = br.slug || "";
      s.brand.slugTouched = true;
      s.brand.description = br.description || "";
      s.brand.logoUrl = br.logoUrl || "";
      s.brand.coverUrl = br.coverUrl || "";
    });
    b.addCase(fetchBrandById.rejected, (s, a) => {
      s.brand.loadingOne = false;
      s.brand.error = (a.payload as string) || "Failed to load brand";
    });

    // ====== Create ======
    b.addCase(createBrand.pending, (s) => {
      s.brand.busy = "create";
      s.brand.error = null;
      s.brand.toast = null;
    });
    b.addCase(createBrand.fulfilled, (s, a) => {
      s.brand.busy = null;
      const br = a.payload;
      s.brand.toast = "Brand created";
      s.brand.list = [br, ...s.brand.list];
      s.brand.selectedId = br._id;
      s.brand.tab = "select";
    });
    b.addCase(createBrand.rejected, (s, a) => {
      s.brand.busy = null;
      s.brand.error = (a.payload as string) || "Create failed";
    });

    // ====== Update ======
    b.addCase(updateBrand.pending, (s) => {
      s.brand.busy = "update";
      s.brand.error = null;
      s.brand.toast = null;
    });
    b.addCase(updateBrand.fulfilled, (s, a) => {
      s.brand.busy = null;
      const br = a.payload;
      s.brand.toast = "Brand updated";
      s.brand.list = s.brand.list.map((x) =>
        x._id === br._id ? { ...x, ...br } : x
      );
    });
    b.addCase(updateBrand.rejected, (s, a) => {
      s.brand.busy = null;
      s.brand.error = (a.payload as string) || "Update failed";
    });

    // ====== Delete ======
    b.addCase(deleteBrand.pending, (s) => {
      s.brand.busy = "delete";
      s.brand.error = null;
      s.brand.toast = null;
    });
    b.addCase(deleteBrand.fulfilled, (s, a) => {
      s.brand.busy = null;
      const id = a.meta.arg.id;
      s.brand.toast = "Brand deleted";
      s.brand.list = s.brand.list.filter((x) => x._id !== id);
      s.brand.selectedId = "";
      s.brand.name = "";
      s.brand.slug = "";
      s.brand.description = "";
      s.brand.logoUrl = "";
      s.brand.coverUrl = "";
      s.brand.slugTouched = false;
    });
    b.addCase(deleteBrand.rejected, (s, a) => {
      s.brand.busy = null;
      s.brand.error = (a.payload as string) || "Delete failed";
    });
  },
});

export const {
  setField,
  setTokens,
  addToken,
  removeToken,
  toggleAllowedRole,
  setSlugTouched,
  clearToast,
  resetForm,
  setBrandField,
  setBrandOpen,
  setBrandTab,
  setBrandSlugTouched,
  setBrandSelectedId,
  clearBrandFeedback,
  resetBrandForm,
  setToggleProductOpen,
} = slice.actions;
export default slice.reducer;
