import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  latitude: null,
  longitude: null,
  current: null,
  error: null
};

export const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setLocation: (state, action) => {
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
      state.name = action.payload.name;
    },
    setCurrentLocation: (state, action) => {
      state.current = {
        latitude: action.payload.latitude,
        longitude: action.payload.longitude,
        name: action.payload.name
      }
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { setLocation, setError, setCurrentLocation } = locationSlice.actions;

export default locationSlice.reducer;
