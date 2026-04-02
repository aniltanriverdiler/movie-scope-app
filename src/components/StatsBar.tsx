import { Text, View } from "react-native";

type StatsBarProps = {
  total: number;
  favorites: number;
  watched: number;
};

const StatsBar = ({ total, favorites, watched }: StatsBarProps) => {
  return (
    <View className="flex-row gap-x-2 mb-5">
      <View className="flex-1 bg-dark-100 rounded-xl py-3 px-2 items-center">
        <Text className="text-2xl text-white font-bold">{total}</Text>
        <Text className="text-xs text-light-300 mt-1 text-center">
          Total saved
        </Text>
      </View>
      <View className="flex-1 bg-dark-100 rounded-xl py-3 px-2 items-center">
        <Text className="text-2xl text-accent font-bold">{favorites}</Text>
        <Text className="text-xs text-light-300 mt-1 text-center">
          Favorites
        </Text>
      </View>
      <View className="flex-1 bg-dark-100 rounded-xl py-3 px-2 items-center">
        <Text className="text-2xl text-white font-bold">{watched}</Text>
        <Text className="text-xs text-light-300 mt-1 text-center">Watched</Text>
      </View>
    </View>
  );
};

export default StatsBar;
