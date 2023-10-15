import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  current: null,
  background: 'default',
  favoriteLocationsList: []
};

export const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setWeather: (state, action) => {
      state.current = action.payload.current;
    },
    setBackground: (state, action) => {
      state.background = action.payload.background
    },
    setFavoriteLocationsList: (state, action) => {
      state.favoriteLocationsList = [...state.favoriteLocationsList, action.payload.favoriteLocationsList]
    }
  }
});

export const { setWeather, setBackground, setFavoriteLocationsList } = weatherSlice.actions;

export default weatherSlice.reducer;
