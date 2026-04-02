import { configureStore } from "@reduxjs/toolkit";

import { savedMoviesSlice } from "@/store/features/savedMoviesSlice";

export const store = configureStore({
  reducer: {
    savedMovies: savedMoviesSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
