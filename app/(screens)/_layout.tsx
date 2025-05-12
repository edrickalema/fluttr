import { Stack } from "expo-router";
import React from "react";

export default function ScreensRootLayout() {
  return (
    <Stack  screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name='(screens)/conversation-style'
        options={{
          title: "Conversation Style",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: "600",
          },
        }}
      />
      <Stack.Screen
        name='(screens)/appearance-screen'
        options={{
          title: "Appearance",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: "600",
          },
        }}
      />

      <Stack.Screen
        name='(screens)/demo-call'
        options={{
          title: "Demo",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: "600",
          },
        }}
      />

      <Stack.Screen
        name='(screens)/demo-screen'
        options={{
          title: "Demo",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: "600",
          },
        }}
      />
    </Stack>
  );
}
