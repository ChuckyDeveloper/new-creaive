import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  isLoading: boolean;

}

const initialState: SettingsState = {
  isLoading: true,
  
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setIsLoading,
} = settingsSlice.actions;

export default settingsSlice.reducer;