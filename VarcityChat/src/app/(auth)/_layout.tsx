import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* <Stack.Screen name="" options={{ headerShown: false }} /> */}
      {/* <Stack.Screen name="register" options={{ headerShown: false }} /> */}
      {/* <Stack.Screen name="login" options={{ headerShown: false }} /> */}
      {/* <Stack.Screen name="forgot-password" /> */}
      {/* <Stack.Screen name="reset-password" options={{ headerShown: false }} /> */}
      {/* <Stack.Screen name="forgot-password-otp" /> */}
    </Stack>
  );
}
