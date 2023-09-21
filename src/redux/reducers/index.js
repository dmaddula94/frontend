import { combineReducers } from 'redux';
import locationReducer from './locationSlice';
import themeReducer from './themeSlice';
import weatherReducer from './weatherSlice';
import userReducer from './userSlice';

const rootReducer = combineReducers({
  location: locationReducer,
  theme: themeReducer,
  weather: weatherReducer,
  user: userReducer
});

export default rootReducer;
