import { Text, TouchableOpacity } from "react-native";

type TabButtonProps = {
  label: string;
  emoji: React.ReactNode;
  active: boolean;
  onPress: () => void;
};

const TabButton = ({ label, emoji, active, onPress }: TabButtonProps) => {
  return (
    <TouchableOpacity
      className={`flex-1 flex-row items-center justify-center py-3 rounded-full gap-x-1 ${active ? "bg-accent" : "bg-dark-100"}`}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text className="text-base">{emoji}</Text>
      <Text className="text-center text-white font-semibold text-xs">
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default TabButton;
