import { combineReducers } from 'redux';
import locationReducer from './locationSlice';
import themeReducer from './themeSlice';
import weatherReducer from './weatherSlice';
import userReducer from './userSlice';
import loadingReducer from './loadingSlice';

const rootReducer = combineReducers({
  location: locationReducer,
  theme: themeReducer,
  weather: weatherReducer,
  user: userReducer,
  loading: loadingReducer
});

export default rootReducer;
