import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{ headerShown: false }}
      initialRouteName="onboarding-one"
    >
      <Stack.Screen name="onboarding-one" />
      <Stack.Screen name="onboarding-two" />
    </Stack>
  );
}
