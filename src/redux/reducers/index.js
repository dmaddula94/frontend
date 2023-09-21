import { combineReducers } from 'redux';
import locationReducer from './locationSlice';
import themeReducer from './themeSlice';
import weatherReducer from './weatherSlice';

const rootReducer = combineReducers({
  location: locationReducer,
  theme: themeReducer,
  weather: weatherReducer
});

export default rootReducer;
