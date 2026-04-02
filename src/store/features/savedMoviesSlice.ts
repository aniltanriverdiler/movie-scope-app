import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "@/store/store";

export type MovieStatus = "favorite" | "watchlist" | "watched";

export type Movie = {
  id: string;
  title: string;
  poster: string;
  rating: number;
  genre: string;
};

export type SavedMovie = Movie & {
  status: MovieStatus;
  createdAt: number;
};

export type SavedMoviesState = {
  entities: Record<string, SavedMovie>;
};

const initialState: SavedMoviesState = {
  entities: {},
};

export const savedMoviesSlice = createSlice({
  name: "savedMovies",
  initialState,
  reducers: {
    hydrate: (state, action: PayloadAction<SavedMoviesState | undefined>) => {
      if (action.payload?.entities) {
        state.entities = action.payload.entities;
      }
    },
    addToFavorites: (state, action: PayloadAction<Movie>) => {
      const id = action.payload.id;
      const existing = state.entities[id];
      state.entities[id] = {
        ...action.payload,
        status: "favorite",
        createdAt: existing?.createdAt ?? Date.now(),
      };
    },
    addToWatchlist: (state, action: PayloadAction<Movie>) => {
      const id = action.payload.id;
      const existing = state.entities[id];
      state.entities[id] = {
        ...action.payload,
        status: "watchlist",
        createdAt: existing?.createdAt ?? Date.now(),
      };
    },
    markAsWatched: (state, action: PayloadAction<Movie>) => {
      const id = action.payload.id;
      const existing = state.entities[id];
      state.entities[id] = {
        ...action.payload,
        status: "watched",
        createdAt: existing?.createdAt ?? Date.now(),
      };
    },
    removeMovie: (state, action: PayloadAction<string>) => {
      delete state.entities[action.payload];
    },
    toggleFavorite: (state, action: PayloadAction<Movie>) => {
      const id = action.payload.id;
      const existing = state.entities[id];
      if (existing?.status === "favorite") {
        delete state.entities[id];
      } else {
        state.entities[id] = {
          ...action.payload,
          status: "favorite",
          createdAt: existing?.createdAt ?? Date.now(),
        };
      }
    },
  },
});

export const {
  hydrate,
  addToFavorites,
  addToWatchlist,
  markAsWatched,
  removeMovie,
  toggleFavorite,
} = savedMoviesSlice.actions;

const selectSaved = (state: RootState) => state.savedMovies;

export const selectMoviesByStatus =
  (status: MovieStatus) =>
  (state: RootState): SavedMovie[] => {
    return Object.values(selectSaved(state).entities).filter(
      (m) => m.status === status,
    );
  };

export const selectSavedMovieById =
  (id: string) =>
  (state: RootState): SavedMovie | undefined =>
    selectSaved(state).entities[id];

export const selectLibraryStats = (state: RootState) => {
  const movies = Object.values(selectSaved(state).entities);
  return {
    total: movies.length,
    favorites: movies.filter((m) => m.status === "favorite").length,
    watched: movies.filter((m) => m.status === "watched").length,
  };
};
