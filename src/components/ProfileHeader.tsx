import { Image } from "expo-image";
import { Text, TouchableOpacity, View } from "react-native";

type ProfileHeaderProps = {
  displayName: string;
  email: string;
  avatarUri: string | null;
  onAvatarPress: () => void;
};

const ProfileHeader = ({
  displayName,
  email,
  avatarUri,
  onAvatarPress,
}: ProfileHeaderProps) => {
  const initial = displayName.trim().charAt(0).toUpperCase() || "?";

  return (
    <View className="items-center mb-6">
      <TouchableOpacity
        onPress={onAvatarPress}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Change profile photo"
      >
        <View className="w-24 h-24 rounded-full bg-dark-100 border-2 border-accent/50 items-center justify-center overflow-hidden">
          {avatarUri ? (
            <Image
              source={{ uri: avatarUri }}
              className="w-full h-full"
              contentFit="cover"
              transition={200}
            />
          ) : (
            <Text className="text-3xl text-white font-bold">{initial}</Text>
          )}
        </View>
      </TouchableOpacity>
      <Text className="text-xl text-white font-bold text-center mt-4">
        {displayName}
      </Text>
      <Text className="text-sm text-light-300 mt-1 text-center">{email}</Text>
    </View>
  );
};

export default ProfileHeader;
