import { Stack } from "expo-router";

export default function UniversityLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[id]" />
      <Stack.Screen name="search" />
    </Stack>
  );
}
