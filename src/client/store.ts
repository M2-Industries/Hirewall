import { configureStore } from '@reduxjs/toolkit';
import hwSlice from './slice';
import type { HireWallState } from './slice';
const store = configureStore({
  reducer: hwSlice,
});

export default store;

export type HWState = {
  hw: HireWallState;
};
