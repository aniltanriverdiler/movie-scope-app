import { Text, View } from "react-native";

type StatsCardProps = {
  label: string;
  value: string | number;
};

const StatsCard = ({ label, value }: StatsCardProps) => {
  return (
    <View className="flex-1 bg-dark-100 rounded-xl py-3 px-2 min-h-[86px] justify-center">
      <Text
        className="text-xl text-white font-bold text-center"
        numberOfLines={2}
        adjustsFontSizeToFit
        minimumFontScale={0.85}
      >
        {value}
      </Text>
      <Text className="text-xs text-light-300 text-center mt-1.5">{label}</Text>
    </View>
  );
};

export default StatsCard;
