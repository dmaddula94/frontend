import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  darkMode: window.matchMedia("(prefers-color-scheme: dark)").matches
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setDarkMode: (state, action) => {
      state.darkMode = action.payload.darkMode
    }
  }
});

export const { setDarkMode } = themeSlice.actions;

export default themeSlice.reducer;
