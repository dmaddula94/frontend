import { createSlice } from '@reduxjs/toolkit';

export const loadingSlice = createSlice({
  name: 'loading',
  initialState: false,
  reducers: {
    startLoader: (state) => true,
    stopLoader: (state) => false,
  },
});

export const { startLoader, stopLoader } = loadingSlice.actions;
export const selectLoading = (state) => state.loading;
export default loadingSlice.reducer;
