import { RootState } from "../..";

export const selectProductForm = (s: RootState) => s.productContentForm; // ของเดิมคุณใช้ตรงนี้
export const selectSoftWarnings = (s: RootState) => s.productContentForm.softWarnings; // ถ้ามี

// ✅ brand selectors
export const selectBrandForm = (s: RootState) => s.productContentForm.brand;
export const selectBrands = (s: RootState) => s.productContentForm.brand.list;
export const selectBrandsSelected = (s: RootState) => s.productContentForm.brand.name

