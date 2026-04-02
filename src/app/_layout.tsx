import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StatusBar, View } from "react-native";
import { Provider } from "react-redux";

import "../global.css";
import { hydrateProfile } from "@/store/features/profileSlice";
import { hydrate } from "@/store/features/savedMoviesSlice";
import {
  loadProfileState,
  loadSavedMoviesState,
  subscribePersistSavedMovies,
} from "@/store/persistStorage";
import { store } from "@/store/store";

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let unsub: (() => void) | undefined;
    (async () => {
      const saved = await loadSavedMoviesState();
      const profile = await loadProfileState();
      if (saved) {
        store.dispatch(hydrate(saved));
      }
      if (profile) {
        store.dispatch(hydrateProfile(profile));
      }
      setReady(true);
      unsub = subscribePersistSavedMovies(store);
    })();
    return () => unsub?.();
  }, []);

  return (
    <Provider store={store}>
      {!ready ? (
        <View className="flex-1 bg-primary items-center justify-center">
          <ActivityIndicator />
        </View>
      ) : (
        <>
          <StatusBar barStyle="light-content" />
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="movie/[id]" options={{ headerShown: false }} />
          </Stack>
        </>
      )}
    </Provider>
  );
}
