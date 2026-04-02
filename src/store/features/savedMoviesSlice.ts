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

/** TMDB-aligned shape for reusing MovieCard in “Recently viewed” */
export type RecentlyViewedEntry = {
  id: string;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
  viewedAt: number;
};

export type SavedMoviesState = {
  entities: Record<string, SavedMovie>;
  recentlyViewed: RecentlyViewedEntry[];
};

const MAX_RECENT = 20;

const initialState: SavedMoviesState = {
  entities: {},
  recentlyViewed: [],
};

export const savedMoviesSlice = createSlice({
  name: "savedMovies",
  initialState,
  reducers: {
    hydrate: (state, action: PayloadAction<SavedMoviesState | undefined>) => {
      if (!action.payload) return;
      if (action.payload.entities) {
        state.entities = action.payload.entities;
      }
      if (Array.isArray(action.payload.recentlyViewed)) {
        state.recentlyViewed = action.payload.recentlyViewed;
      }
    },
    recordRecentlyViewed: (
      state,
      action: PayloadAction<Omit<RecentlyViewedEntry, "viewedAt">>,
    ) => {
      const viewedAt = Date.now();
      const next = [
        { ...action.payload, viewedAt },
        ...state.recentlyViewed.filter((x) => x.id !== action.payload.id),
      ];
      state.recentlyViewed = next.slice(0, MAX_RECENT);
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
  recordRecentlyViewed,
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

export const selectFavoritesCount = (state: RootState): number =>
  selectLibraryStats(state).favorites;

export const selectWatchedCount = (state: RootState): number =>
  selectLibraryStats(state).watched;

export const selectWatchlistCount = (state: RootState): number =>
  Object.values(selectSaved(state).entities).filter((m) => m.status === "watchlist")
    .length;

/** Primary genre token from watched movies’ genre strings (split on " • "). */
export const selectMostWatchedGenre = (state: RootState): string | null => {
  const watched = Object.values(selectSaved(state).entities).filter(
    (m) => m.status === "watched",
  );
  if (watched.length === 0) return null;

  const counts = new Map<string, number>();
  for (const m of watched) {
    const parts = m.genre
      .split("•")
      .map((s) => s.trim())
      .filter(Boolean);
    const primary = parts[0] ?? m.genre.trim();
    if (!primary) continue;
    counts.set(primary, (counts.get(primary) ?? 0) + 1);
  }

  const sorted = [...counts.entries()].sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    return a[0].localeCompare(b[0]);
  });
  return sorted[0]?.[0] ?? null;
};

export const selectRecentlyViewed = (state: RootState): RecentlyViewedEntry[] =>
  selectSaved(state).recentlyViewed;
