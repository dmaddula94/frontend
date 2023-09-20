import { combineReducers } from 'redux';
import locationReducer from './locationSlice';
import themeReducer from './themeSlice';

const rootReducer = combineReducers({
  location: locationReducer,
  theme: themeReducer
});

export default rootReducer;
