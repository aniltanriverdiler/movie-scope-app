import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { icons } from "@/constants/icons";
import { fetchMovieDetails } from "@/services/api";
import useFetch from "@/services/usefetch";
import {
  addToWatchlist,
  markAsWatched,
  recordRecentlyViewed,
  removeMovie,
  selectSavedMovieById,
  toggleFavorite,
} from "@/store/features/savedMoviesSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { movieDetailsToMovie } from "@/utils/savedMovieFromDetails";

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => {
  return (
    <View className="flex-col items-start justify-center mt-5">
      <Text className="text-light-200 font-normal text-sm">{label}</Text>
      <Text className="text-light-100 font-bold text-sm mt-2">
        {value || "N/A"}
      </Text>
    </View>
  );
};

const MovieDetail = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const dispatch = useAppDispatch();

  const { data: movie, loading } = useFetch(() =>
    fetchMovieDetails(id as string),
  );

  // Get movie ID and payload
  const movieId = movie ? String(movie.id) : "";
  const moviePayload = movie ? movieDetailsToMovie(movie) : null;

  // Saved movie details
  const saved = useAppSelector(selectSavedMovieById(movieId));

  const fav = saved?.status === "favorite";
  const wl = saved?.status === "watchlist";
  const wd = saved?.status === "watched";

  // Record recently viewed movie
  useEffect(() => {
    if (!movie) return;
    dispatch(
      recordRecentlyViewed({
        id: String(movie.id),
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date ?? "",
      }),
    );
  }, [movie?.id, dispatch]);

  if (loading) {
    return (
      <SafeAreaView className="bg-primary flex-1">
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View>
          {/* Poster Image */}
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
            }}
            className="w-full h-[550px] rounded-b-lg"
            resizeMode="stretch"
          />

          {/* Play Button */}
          <TouchableOpacity className="absolute bottom-5 right-5 rounded-full size-14 bg-white flex items-center justify-center">
            <Image
              source={icons.play}
              className="w-6 h-7 ml-1"
              resizeMode="stretch"
            />
          </TouchableOpacity>
        </View>

        {/* Movie Title and Details */}
        <View className="flex-col items-start justify-center mt-5 px-5">
          <Text className="text-white font-bold text-xl ">{movie?.title}</Text>
          <View className="flex-row items-center gap-x-1 mt-2">
            <Text className="text-light-200 text-sm ">
              {movie?.release_date?.split("-")[0]} •
            </Text>
            <Text className="text-light-200 text-sm">{movie?.runtime}m</Text>
          </View>

          {/* Movie Rating */}
          <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
            <Image source={icons.star} className="size-4" />

            <Text className="text-white font-bold text-sm">
              {Math.round(movie?.vote_average ?? 0)}/10
            </Text>

            <Text className="text-light-200 text-sm ">
              {movie?.vote_count} votes
            </Text>
          </View>

          {/* Favorites , Watch list , Watched Films Toggle */}
          <View className="flex-row gap-x-3 mt-4">
            <TouchableOpacity
              className={`px-3 py-2 rounded-lg ${fav ? "bg-accent" : "bg-dark-100"}`}
              disabled={!moviePayload}
              onPress={() =>
                moviePayload && dispatch(toggleFavorite(moviePayload))
              }
            >
              <Text className="text-white font-semibold text-sm">
                {fav ? "Favorited" : "Favorite"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`px-3 py-2 rounded-lg ${wl ? "bg-accent" : "bg-dark-100"}`}
              disabled={!moviePayload}
              onPress={() => {
                if (!moviePayload) return;
                if (wl) dispatch(removeMovie(moviePayload.id));
                else dispatch(addToWatchlist(moviePayload));
              }}
            >
              <Text className="text-white font-semibold text-sm">
                {wl ? "In Watchlist" : "Watchlist"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`px-3 py-2 rounded-lg ${wd ? "bg-accent" : "bg-dark-100"}`}
              disabled={!moviePayload}
              onPress={() => {
                if (!moviePayload) return;
                if (wd) dispatch(removeMovie(moviePayload.id));
                else dispatch(markAsWatched(moviePayload));
              }}
            >
              <Text className="text-white font-semibold text-sm">
                {wd ? "Watched" : "Mark Watched"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Movie Overview */}
          <MovieInfo label="Overview" value={movie?.overview} />
          <MovieInfo
            label="Genres"
            value={movie?.genres?.map((g) => g.name).join(" • ") || "N/A"}
          />

          {/* Movie Budget and Revenue */}
          <View className="flex flex-row justify-between w-1/2">
            <MovieInfo
              label="Budget"
              value={`$${(movie?.budget ?? 0) / 1_000_000} million`}
            />
            <MovieInfo
              label="Revenue"
              value={`$${Math.round(
                (movie?.revenue ?? 0) / 1_000_000,
              )} million`}
            />
          </View>

          {/* Movie Production Companies */}
          <MovieInfo
            label="Production Companies"
            value={
              movie?.production_companies?.map((c) => c.name).join(" • ") ||
              "N/A"
            }
          />
        </View>
      </ScrollView>

      {/* Go Back Button */}
      <TouchableOpacity
        className="absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
        onPress={router.back}
      >
        <Image
          source={icons.arrow}
          className="size-5 mr-1 mt-0.5 rotate-180"
          tintColor="#fff"
        />
        <Text className="text-white font-semibold text-base">Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MovieDetail;
