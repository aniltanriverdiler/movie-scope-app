import { Text, View } from "react-native";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
};

const SectionHeader = ({ title, subtitle }: SectionHeaderProps) => {
  return (
    <View className="mb-3 mt-1">
      <Text className="text-lg text-white font-bold">{title}</Text>
      {subtitle ? (
        <Text className="text-xs text-light-300 mt-1">{subtitle}</Text>
      ) : null}
    </View>
  );
};

export default SectionHeader;
