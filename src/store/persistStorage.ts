import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Store } from "redux";

import {
  type ProfileState,
  profileInitialState,
} from "@/store/features/profileSlice";
import type { SavedMoviesState } from "@/store/features/savedMoviesSlice";

export const SAVED_MOVIES_STORAGE_KEY = "@movie-scope/saved-movies/v1";
export const PROFILE_STORAGE_KEY = "@movie-scope/profile/v1";

export async function loadSavedMoviesState(): Promise<SavedMoviesState | null> {
  try {
    const raw = await AsyncStorage.getItem(SAVED_MOVIES_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedMoviesState;
    if (parsed && typeof parsed.entities === "object") {
      if (!Array.isArray(parsed.recentlyViewed)) {
        parsed.recentlyViewed = [];
      }
      return parsed;
    }
  } catch {
    // ignore corrupt storage
  }
  return null;
}

export async function loadProfileState(): Promise<ProfileState | null> {
  try {
    const raw = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ProfileState>;
    return { ...profileInitialState, ...parsed };
  } catch {
    // ignore
  }
  return null;
}

export function subscribePersistSavedMovies(store: Store): () => void {
  let t: ReturnType<typeof setTimeout> | undefined;
  const save = () => {
    const state = store.getState() as {
      savedMovies: SavedMoviesState;
      profile: ProfileState;
    };
    void AsyncStorage.setItem(
      SAVED_MOVIES_STORAGE_KEY,
      JSON.stringify(state.savedMovies),
    );
    void AsyncStorage.setItem(
      PROFILE_STORAGE_KEY,
      JSON.stringify(state.profile),
    );
  };

  return store.subscribe(() => {
    if (t) clearTimeout(t);
    t = setTimeout(save, 400);
  });
}
