// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from './reducers';

//slices
// import loadingSlice from './reducers/loadingSlice';

const persistConfig = {
  key: 'root',
  storage,
  // whitelist: ['someSlice'] // if you want to persist only some slices
  blacklist: ['loading', 'weather'] // if you don't want to persist some slices
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer
});

export const persistor = persistStore(store);
