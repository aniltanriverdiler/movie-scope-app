import { Text, View } from "react-native";

type ProgressBarProps = {
  current: number;
  goal: number;
  caption?: string;
};

const ProgressBar = ({ current, goal, caption }: ProgressBarProps) => {
  const safeGoal = goal > 0 ? goal : 1;
  const pct = Math.min(100, Math.max(0, (current / safeGoal) * 100));

  return (
    <View className="bg-dark-100 rounded-xl p-4 mb-6">
      {caption ? (
        <Text className="text-xs text-light-200 font-medium uppercase tracking-wide mb-2">
          {caption}
        </Text>
      ) : null}
      <Text className="text-white font-bold text-base mb-3">
        {current} / {goal} movies watched
      </Text>
      <View className="h-2.5 bg-primary rounded-full overflow-hidden">
        <View
          className="h-full bg-accent rounded-full"
          style={{ width: `${pct}%` }}
        />
      </View>
    </View>
  );
};

export default ProgressBar;
