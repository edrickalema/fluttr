import { AssistantProvider } from "@/context/AssitantContext";
import { CallAssistantProvider } from "@/context/CallAssitantContext";
import { ThemeProvider } from "@/context/ThemeContext";
import {
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_700Bold,
  useFonts as useMontserrat,
} from "@expo-google-fonts/montserrat";
import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_500Medium,
  PlayfairDisplay_700Bold,
  useFonts as usePlayfair,
} from "@expo-google-fonts/playfair-display";
import {
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts as usePoppins,
} from "@expo-google-fonts/poppins";
import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
  useFonts as useRoboto,
} from "@expo-google-fonts/roboto";

import { Slot, SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [poppinsLoaded] = usePoppins({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [playfairLoaded] = usePlayfair({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_500Medium,
    PlayfairDisplay_700Bold,
  });

  const [montserratLoaded] = useMontserrat({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_700Bold,
  });

  const [robotoLoaded, fontError] = useRoboto({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  });

  const allFontsLoaded =
    poppinsLoaded && playfairLoaded && montserratLoaded && robotoLoaded;

  useEffect(() => {
    if (allFontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [allFontsLoaded, fontError]);

  if (!allFontsLoaded && !fontError) return null;

  return (
    <ThemeProvider>
      <CallAssistantProvider>
        <AssistantProvider>
          <GestureHandlerRootView>
            <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
              <Slot />
              <StatusBar style='auto' />
            </Stack>
          </GestureHandlerRootView>
        </AssistantProvider>
      </CallAssistantProvider>
    </ThemeProvider>
  );
}
