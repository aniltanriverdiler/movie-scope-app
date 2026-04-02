import { configureStore } from "@reduxjs/toolkit";

import { profileSlice } from "@/store/features/profileSlice";
import { savedMoviesSlice } from "@/store/features/savedMoviesSlice";

export const store = configureStore({
  reducer: {
    savedMovies: savedMoviesSlice.reducer,
    profile: profileSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
