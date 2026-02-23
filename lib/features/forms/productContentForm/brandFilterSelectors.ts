import { RootState } from "@/lib/features";

export const selectSelectedBrandId = (state: RootState) => state.brandFilter.selectedId;
export const selectSelectedBrandName = (state: RootState) => state.brandFilter.selectedName;
