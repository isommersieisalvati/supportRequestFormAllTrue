// store.ts
import { configureStore } from '@reduxjs/toolkit';
import formReducer from './formSlice'; // your reducer

export const store = configureStore({
  reducer: {
    form: formReducer,
  },
});

// Type exports (optional but recommended)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
