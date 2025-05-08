import { Tabs } from "expo-router";
import React from "react";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name='index'
        options={{
          title: "Home",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name='favourites'
        options={{
          title: "Favourites",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name='settings'
        options={{
          title: "Settings",
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
