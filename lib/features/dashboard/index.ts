import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface dashboardState {
  isLoading: boolean;

}

const initialState: dashboardState = {
  isLoading: true,

};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setIsLoading,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;