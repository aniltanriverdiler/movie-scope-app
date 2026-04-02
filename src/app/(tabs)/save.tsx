import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";

import LibraryMovieCard from "@/components/LibraryMovieCard";
import StatsBar from "@/components/StatsBar";
import TabButton from "@/components/TabButton";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import type {
  MovieStatus,
  SavedMovie,
} from "@/store/features/savedMoviesSlice";
import {
  selectLibraryStats,
  selectMoviesByStatus,
} from "@/store/features/savedMoviesSlice";
import { useAppSelector } from "@/store/hooks";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type SortKey = "newest" | "rating" | "az";

// Sort movies by newest, rating, or alphabetically
function sortMovies(list: SavedMovie[], key: SortKey): SavedMovie[] {
  const copy = [...list];
  if (key === "newest") {
    copy.sort((a, b) => b.createdAt - a.createdAt);
  } else if (key === "rating") {
    copy.sort((a, b) => b.rating - a.rating);
  } else {
    copy.sort((a, b) => a.title.localeCompare(b.title));
  }
  return copy;
}

// Define tab labels for each status
const TAB_LABEL: Record<MovieStatus, string> = {
  favorite: "Favorites",
  watchlist: "Watchlist",
  watched: "Watched",
};

const Save = () => {
  const router = useRouter();
  const [tab, setTab] = useState<MovieStatus>("watchlist");
  const [sort, setSort] = useState<SortKey>("newest");

  const stats = useAppSelector(selectLibraryStats);
  const raw = useAppSelector(selectMoviesByStatus(tab));

  const data = useMemo(() => sortMovies(raw, sort), [raw, sort]);

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="absolute w-full z-0"
        resizeMode="cover"
      />

      <FlatList
        className="flex-1 z-10"
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <LibraryMovieCard item={item} />}
        contentContainerStyle={{
          paddingBottom: 110,
          paddingHorizontal: 20,
          flexGrow: 1,
        }}
        ListHeaderComponent={
          <View>
            <Image
              source={icons.logo}
              className="w-12 h-10 mt-20 mb-5 mx-auto"
            />

            <Text className="text-xl text-white font-bold mb-1 text-center">
              My Library
            </Text>
            <Text className="text-sm text-light-300 text-center mb-5">
              Saved Movies
            </Text>

            <StatsBar
              total={stats.total}
              favorites={stats.favorites}
              watched={stats.watched}
            />

            {/* Tab buttons for each status */}
            <View className="flex-row gap-x-2 mb-5">
              <TabButton
                emoji={
                  <MaterialIcons name="favorite" size={20} color="white" />
                }
                label="Favorites"
                active={tab === "favorite"}
                onPress={() => setTab("favorite")}
              />
              <TabButton
                emoji={
                  <MaterialCommunityIcons
                    name="playlist-play"
                    size={20}
                    color="white"
                  />
                }
                label="Watchlist"
                active={tab === "watchlist"}
                onPress={() => setTab("watchlist")}
              />
              <TabButton
                emoji={<Feather name="check" size={20} color="white" />}
                label="Watched"
                active={tab === "watched"}
                onPress={() => setTab("watched")}
              />
            </View>

            {/* Sort by button for newest, rating, or alphabetically */}
            <Text className="text-xs text-light-200 font-medium mb-2 uppercase tracking-wide">
              Sort by
            </Text>
            <View className="flex-row gap-x-2 mb-5">
              {(
                [
                  ["newest", "Newest"],
                  ["rating", "Rating"],
                  ["az", "A-Z"],
                ] as const
              ).map(([key, label]) => (
                <TouchableOpacity
                  key={key}
                  className={`flex-1 py-2 rounded-full ${sort === key ? "bg-accent" : "bg-dark-100"}`}
                  onPress={() => setSort(key)}
                  activeOpacity={0.85}
                >
                  <Text className="text-center text-white font-semibold text-xs">
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text className="text-lg text-white font-bold mb-3">
              {TAB_LABEL[tab]}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View className="items-center py-12 px-4">
            <Text className="text-light-200 text-center text-base mb-5">
              No movies found
            </Text>
            <TouchableOpacity
              className="bg-accent px-8 py-3.5 rounded-full"
              onPress={() => router.push("/search")}
              activeOpacity={0.9}
            >
              <Text className="text-white font-semibold text-base">
                Explore Movies
              </Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

export default Save;
