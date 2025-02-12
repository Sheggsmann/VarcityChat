import { View } from "@/ui";
import { Stack } from "expo-router";

export default function DiscoverScreenLayout() {
  return (
    <View className="flex flex-1">
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
}
