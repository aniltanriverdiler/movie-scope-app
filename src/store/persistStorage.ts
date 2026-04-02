import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Store } from "redux";

import type { SavedMoviesState } from "@/store/features/savedMoviesSlice";

export const SAVED_MOVIES_STORAGE_KEY = "@movie-scope/saved-movies/v1";

export async function loadSavedMoviesState(): Promise<SavedMoviesState | null> {
  try {
    const raw = await AsyncStorage.getItem(SAVED_MOVIES_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedMoviesState;
    if (parsed && typeof parsed.entities === "object") {
      return parsed;
    }
  } catch {
    // ignore corrupt storage
  }
  return null;
}

export function subscribePersistSavedMovies(store: Store): () => void {
  let t: ReturnType<typeof setTimeout> | undefined;
  const save = () => {
    const state = store.getState() as {
      savedMovies: SavedMoviesState;
    };
    void AsyncStorage.setItem(
      SAVED_MOVIES_STORAGE_KEY,
      JSON.stringify(state.savedMovies),
    );
  };

  return store.subscribe(() => {
    if (t) clearTimeout(t);
    t = setTimeout(save, 400);
  });
}
