import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  current: null,
  background: 'sunny'
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
    }
  }
});

export const { setWeather, setBackground } = weatherSlice.actions;

export default weatherSlice.reducer;
