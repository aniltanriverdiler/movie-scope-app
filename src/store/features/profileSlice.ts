import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "@/store/store";

export type ProfileState = {
  displayName: string;
  email: string;
  avatarUri: string | null;
  theme: "dark" | "light";
  language: string;
  favoriteGenre: string | null;
  watchGoal: number;
};

export const profileInitialState: ProfileState = {
  displayName: "Anil Tanriverdiler",
  email: "tanriverdiler.dev@gmail.com",
  avatarUri: null,
  theme: "dark",
  language: "English",
  favoriteGenre: null,
  watchGoal: 50,
};

export const profileSlice = createSlice({
  name: "profile",
  initialState: profileInitialState,
  reducers: {
    hydrateProfile: (
      state,
      action: PayloadAction<Partial<ProfileState> | undefined>,
    ) => {
      if (!action.payload) return;
      Object.assign(state, action.payload);
    },
    setTheme: (state, action: PayloadAction<"dark" | "light">) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    setFavoriteGenre: (state, action: PayloadAction<string | null>) => {
      state.favoriteGenre = action.payload;
    },
    setDisplayName: (state, action: PayloadAction<string>) => {
      state.displayName = action.payload;
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setAvatarUri: (state, action: PayloadAction<string | null>) => {
      state.avatarUri = action.payload;
    },
  },
});

export const {
  hydrateProfile,
  setTheme,
  setLanguage,
  setFavoriteGenre,
  setDisplayName,
  setEmail,
  setAvatarUri,
} = profileSlice.actions;

export const selectProfile = (state: RootState) => state.profile;
