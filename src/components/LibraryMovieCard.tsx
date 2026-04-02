import { Link } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

import { icons } from "@/constants/icons";
import {
  addToWatchlist,
  markAsWatched,
  removeMovie,
  toggleFavorite,
  type Movie,
  type SavedMovie,
} from "@/store/features/savedMoviesSlice";
import { useAppDispatch } from "@/store/hooks";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type LibraryMovieCardProps = {
  item: SavedMovie;
};

const toPayload = (m: SavedMovie): Movie => ({
  id: m.id,
  title: m.title,
  poster: m.poster,
  rating: m.rating,
  genre: m.genre,
});

const LibraryMovieCard = ({ item }: LibraryMovieCardProps) => {
  const dispatch = useAppDispatch();
  const payload = toPayload(item);

  return (
    <View className="flex-row bg-dark-100/80 rounded-xl overflow-hidden mb-3 border border-white/5">
      {/* Movie Poster */}
      <Link href={`/movie/${item.id}`} asChild>
        <TouchableOpacity className="w-[92px]">
          <Image
            source={{ uri: item.poster }}
            className="w-full h-36 rounded-l-xl"
            resizeMode="cover"
          />
        </TouchableOpacity>
      </Link>

      {/* Movie Title and Details */}
      <View className="flex-1 py-2 pr-2 pl-3 justify-between">
        <Link href={`/movie/${item.id}`} asChild>
          <TouchableOpacity activeOpacity={0.85}>
            <Text
              numberOfLines={2}
              className="text-sm font-bold text-white leading-tight"
            >
              {item.title}
            </Text>
            <View className="flex-row items-center gap-x-1 mt-1">
              <Image source={icons.star} className="size-4" />
              <Text className="text-xs text-white font-bold uppercase">
                {Math.round(item.rating / 2)}
              </Text>
            </View>
            <Text
              numberOfLines={2}
              className="text-xs text-light-300 font-medium mt-1"
            >
              {item.genre}
            </Text>
          </TouchableOpacity>
        </Link>

        {/* Movie Status Buttons */}
        <View className="flex-row gap-x-2 mt-2">
          {/* Favorite Button */}
          <TouchableOpacity
            className={`flex-1 py-1.5 rounded-lg items-center ${item.status === "favorite" ? "bg-accent" : "bg-primary"}`}
            onPress={() => dispatch(toggleFavorite(payload))}
          >
            <Text className="text-xs">
              <MaterialIcons name="favorite" size={16} color="white" />
            </Text>
          </TouchableOpacity>
          {/* Watch List Button */}
          <TouchableOpacity
            className={`flex-1 py-1.5 rounded-lg items-center ${item.status === "watchlist" ? "bg-accent" : "bg-primary"}`}
            onPress={() =>
              item.status === "watchlist"
                ? dispatch(removeMovie(item.id))
                : dispatch(addToWatchlist(payload))
            }
          >
            <Text className="text-xs">
              <MaterialCommunityIcons
                name="playlist-play"
                size={16}
                color="white"
              />
            </Text>
          </TouchableOpacity>
          {/* Watched Button */}
          <TouchableOpacity
            className={`flex-1 py-1.5 rounded-lg items-center ${item.status === "watched" ? "bg-accent" : "bg-primary"}`}
            onPress={() =>
              item.status === "watched"
                ? dispatch(removeMovie(item.id))
                : dispatch(markAsWatched(payload))
            }
          >
            <Text className="text-xs">
              <Feather name="check" size={16} color="white" />
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LibraryMovieCard;
