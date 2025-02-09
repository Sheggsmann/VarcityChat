import Realm from "realm";
import { ReactNode, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { SplashScreen, Stack, useRouter } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useThemeConfig } from "@/core/use-theme-config";
import { ThemeProvider } from "@react-navigation/native";
import { MenuProvider } from "react-native-popup-menu";
import {
  PlusJakartaSans_200ExtraLight,
  PlusJakartaSans_200ExtraLight_Italic,
  PlusJakartaSans_300Light,
  PlusJakartaSans_300Light_Italic,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_400Regular_Italic,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_500Medium_Italic,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_600SemiBold_Italic,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_700Bold_Italic,
  PlusJakartaSans_800ExtraBold,
  PlusJakartaSans_800ExtraBold_Italic,
  useFonts,
} from "@expo-google-fonts/plus-jakarta-sans";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { RealmProvider, useRealm } from "@realm/react";
import { persistor, store, useAppDispatch } from "@/core/store/store";
import { useAuth } from "@/core/hooks/use-auth";
import { authStorage } from "@/core/storage";
import { setAuth } from "@/core/auth/auth-slice";
import Toast from "react-native-toast-message";

export { ErrorBoundary } from "expo-router";

import "../../global.css";
import { SocketProvider } from "@/context/SocketContext";
import { MessageSchema } from "@/core/models/message-model";
import { MessageService } from "@/core/services/chat-service";

// export const unstable_settings = {
//   initialRouteName: "(auth)",
// };

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
  }, []);

  const [fontsLoaded] = useFonts({
    PlusJakartaSans_200ExtraLight,
    PlusJakartaSans_300Light,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
    PlusJakartaSans_200ExtraLight_Italic,
    PlusJakartaSans_300Light_Italic,
    PlusJakartaSans_400Regular_Italic,
    PlusJakartaSans_500Medium_Italic,
    PlusJakartaSans_600SemiBold_Italic,
    PlusJakartaSans_700Bold_Italic,
    PlusJakartaSans_800ExtraBold_Italic,
  });

  if (!fontsLoaded) return null;

  return (
    <Providers>
      <RootLayoutNav fontsLoaded={fontsLoaded} />
      <Toast />
    </Providers>
  );
}

function RootLayoutNav({ fontsLoaded }: { fontsLoaded: boolean }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAuth();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const handleInitialize = async () => {
      try {
        const authData = await authStorage.getAuthData();
        if (authData) {
          dispatch(setAuth({ ...authData, isAuthenticated: true }));
        } else {
          dispatch(setAuth({ token: "", isAuthenticated: false }));
        }
      } finally {
        setIsAuthChecked(true);
      }
    };
    handleInitialize();
  }, []);

  useEffect(() => {
    if (isAuthChecked && fontsLoaded) {
      SplashScreen.hideAsync();
      if (isAuthenticated) {
        router.replace("/(tabs)/discover");
      } else {
        router.replace("/onboarding/onboarding-one");
      }
    }
  }, [isAuthenticated, isAuthChecked]);

  if (!isAuthChecked || !fontsLoaded) return null;

  return <Stack screenOptions={{ headerShown: false }}></Stack>;
}

function Providers({ children }: { children: ReactNode }) {
  const theme = useThemeConfig();

  const migration = (oldRealm: Realm, newRealm: Realm) => {
    if (oldRealm.schemaVersion < 1) {
      const oldObjects = oldRealm.objects("Message");
      const newObjects = newRealm.objects("Message");

      for (let i = 0; i < oldObjects.length; i++) {
        const oldObject = oldObjects[i];
        const newObject = newObjects[i];
        newObject.content = oldObject.content;
        newObject.createdAt = oldObject.createdAt;
        newObject.senderId = oldObject.senderId;
        newObject.receiverId = oldObject.receiverId;
        newObject.conversationId = oldObject.conversationId;
        newObject.isRead = oldObject.isRead;
        newObject.isDelivered = oldObject.isDelivered;
        newObject.isEdited = oldObject.isEdited;
        newObject.isDeleted = oldObject.isDeleted;
        newObject.isSeen = oldObject.isSeen;
        newObject.isSent = oldObject.isSent;
        newObject.isFailed = oldObject.isFailed;
        newObject.isPending = oldObject.isPending;
        newObject.isFailed = oldObject.isFailed;
        newObject.isPending = oldObject.isPending;
      }
    }
  };

  return (
    <RealmProvider
      schema={[MessageSchema]}
      schemaVersion={7}
      onMigration={migration}
    >
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <GestureHandlerRootView
            style={styles.container}
            className={theme.dark ? "dark" : undefined}
          >
            <ThemeProvider value={theme}>
              <SocketProvider>
                <MenuProvider>
                  <BottomSheetModalProvider>
                    {children}
                  </BottomSheetModalProvider>
                </MenuProvider>
              </SocketProvider>
            </ThemeProvider>
          </GestureHandlerRootView>
        </PersistGate>
      </Provider>
    </RealmProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
