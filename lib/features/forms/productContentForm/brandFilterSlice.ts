import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type BrandFilterState = {
    selectedId: string;
    selectedName: string;
};

const initialState: BrandFilterState = {
    selectedId: "",
    selectedName: "",
};

const brandFilterSlice = createSlice({
    name: "brandFilter",
    initialState,
    reducers: {
        setBrandFilter(state, action: PayloadAction<{ id: string; name?: string }>) {
            state.selectedId = action.payload.id;
            state.selectedName = action.payload.name ?? "";
        },
        clearBrandFilter(state) {
            state.selectedId = "";
            state.selectedName = "";
        },
    },
});

export const { setBrandFilter, clearBrandFilter } = brandFilterSlice.actions;
export default brandFilterSlice.reducer;
