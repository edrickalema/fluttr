import { AssistantProvider } from "@/context/AssitantContext";
import {
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import { Slot, SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
  // Load fonts
  const [fontsLoaded, fontError] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);
  return (
    <AssistantProvider>
      <GestureHandlerRootView>
        <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
          <Slot />
          <StatusBar style='auto' />
        </Stack>
      </GestureHandlerRootView>
    </AssistantProvider>
  );
}
