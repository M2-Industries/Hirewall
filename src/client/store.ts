import { configureStore } from '@reduxjs/toolkit';
import hwSlice from './slice';
const store = configureStore({
  reducer: hwSlice,
});

export default store;
