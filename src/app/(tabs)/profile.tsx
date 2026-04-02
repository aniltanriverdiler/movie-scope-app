import * as ImagePicker from "expo-image-picker";
import { useCallback } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import MovieCard from "@/components/MovieCard";
import ProfileHeader from "@/components/ProfileHeader";
import ProgressBar from "@/components/ProgressBar";
import SectionHeader from "@/components/SectionHeader";
import StatsCard from "@/components/StatsCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import {
  selectProfile,
  setAvatarUri,
  setFavoriteGenre,
  setLanguage,
  setTheme,
} from "@/store/features/profileSlice";
import {
  selectFavoritesCount,
  selectMostWatchedGenre,
  selectRecentlyViewed,
  selectWatchedCount,
  selectWatchlistCount,
} from "@/store/features/savedMoviesSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const GENRE_CHIPS = ["Action", "Drama", "Comedy", "Sci-Fi", "Horror"] as const;

const Profile = () => {
  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectProfile);
  const watchedCount = useAppSelector(selectWatchedCount);
  const favoritesCount = useAppSelector(selectFavoritesCount);
  const watchlistCount = useAppSelector(selectWatchlistCount);
  const topGenre = useAppSelector(selectMostWatchedGenre);
  const recentlyViewed = useAppSelector(selectRecentlyViewed);

  const isDark = profile.theme === "dark";

  const handleAvatarPress = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      dispatch(setAvatarUri(result.assets[0].uri));
    }
  }, [dispatch]);

  return (
    <View className="flex-1 bg-primary">
      {/* Background Image */}
      <Image
        source={images.bg}
        className="absolute w-full z-0"
        resizeMode="cover"
      />

      {/* ScrollView Content Section */}
      <ScrollView
        className="flex-1 px-5 z-10"
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />

        {/* Profile Header */}
        <ProfileHeader
          displayName={profile.displayName}
          email={profile.email}
          avatarUri={profile.avatarUri}
          onAvatarPress={handleAvatarPress}
        />

        {/* Your Stats */}
        <Text className="text-lg text-white font-bold mb-3">Your stats</Text>
        <View className="flex-row gap-2 mb-2">
          {/* Total watched */}
          <StatsCard label="Total watched" value={watchedCount} />
          {/* Favorites */}
          <StatsCard label="Favorites" value={favoritesCount} />
        </View>
        <View className="flex-row gap-2 mb-6">
          {/* Watchlist */}
          <StatsCard label="Watchlist" value={watchlistCount} />
          <StatsCard label="Top genre" value={topGenre ?? "—"} />
        </View>

        {/* Progress Bar */}
        <ProgressBar
          caption="Your journey"
          current={watchedCount}
          goal={profile.watchGoal}
        />

        <SectionHeader
          title="Recently viewed"
          subtitle="Films you opened recently"
        />
        {recentlyViewed.length === 0 ? (
          <Text className="text-light-300 text-sm mb-6">
            Open a movie to see it here.
          </Text>
        ) : (
          <FlatList
            horizontal
            nestedScrollEnabled
            data={recentlyViewed}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            className="mb-8"
            style={{ maxHeight: 300 }}
            contentContainerStyle={{
              paddingVertical: 4,
              gap: 16,
              paddingRight: 8,
            }}
            renderItem={({ item }) => (
              <View className="w-28">
                <MovieCard
                  {...({
                    id: Number(item.id),
                    title: item.title,
                    poster_path: item.poster_path ?? "",
                    vote_average: item.vote_average,
                    release_date: item.release_date,
                    adult: false,
                    backdrop_path: "",
                    genre_ids: [],
                    original_language: "en",
                    original_title: item.title,
                    overview: "",
                    popularity: 0,
                    video: false,
                    vote_count: 0,
                  } as Movie)}
                  className="w-full"
                />
              </View>
            )}
          />
        )}

        {/* Preferences */}
        <SectionHeader
          title="Preferences"
          subtitle="Customize your experience"
        />

        <View className="bg-dark-100 rounded-xl p-4 mb-4">
          <View className="flex-row items-center justify-between py-2">
            <View className="flex-1 pr-4">
              <Text className="text-white font-semibold text-sm">
                Appearance
              </Text>
              <Text className="text-light-300 text-xs mt-0.5">
                Dark mode (preview in settings)
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={(v) => {
                void dispatch(setTheme(v ? "dark" : "light"));
              }}
              trackColor={{ false: "#2a2740", true: "#AB8BFF" }}
              thumbColor="#f4f4f5"
            />
          </View>

          <View className="h-px bg-white/10 my-2" />

          {/* Language */}
          <View className="py-2">
            <Text className="text-white font-semibold text-sm">Language</Text>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => dispatch(setLanguage("English"))}
              className="mt-2 flex-row items-center justify-between bg-primary/60 rounded-lg px-3 py-2.5"
            >
              <Text className="text-light-100 text-sm">{profile.language}</Text>
              <Text className="text-light-300 text-xs">Language</Text>
            </TouchableOpacity>
          </View>

          <View className="h-px bg-white/10 my-2" />

          {/* Favorite genre */}
          <View className="py-2">
            <Text className="text-white font-semibold text-sm mb-2">
              Favorite genre
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {GENRE_CHIPS.map((g) => {
                const active = profile.favoriteGenre === g;
                return (
                  <TouchableOpacity
                    key={g}
                    onPress={() =>
                      dispatch(setFavoriteGenre(active ? null : g))
                    }
                    className={`px-3 py-1.5 rounded-full ${active ? "bg-accent" : "bg-primary"}`}
                  >
                    <Text className="text-white text-xs font-medium">{g}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* Log out button */}
        <TouchableOpacity
          className="bg-dark-100 border border-white/10 rounded-xl py-3.5 items-center mb-4"
          activeOpacity={0.85}
          onPress={() => console.log("logout")}
        >
          <View className="flex-row items-center">
            <MaterialIcons name="logout" size={18} color="white" />
            <Text className="text-white font-semibold text-base">
              {" "}
              Log out{" "}
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Profile;
