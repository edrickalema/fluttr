import { Colors } from "@/constants/colors";
import { normalize } from "@/utils/responsive";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { Heart, Home, Settings } from "lucide-react-native";

import React from "react";
import { StyleSheet } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.buttonBackground,
        tabBarInactiveTintColor: "#888888",
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarBackground: () => (
          <BlurView
            intensity={80}
            style={StyleSheet.absoluteFill}
            tint="light"
          />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="favourites"
        options={{
          title: "Favourites",
          tabBarIcon: ({ color, size }) => <Heart size={size} color={color} />,
          tabBarLabelStyle: { ...styles.tabBarLabel, fontWeight: "bold" },
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    borderTopWidth: 0,
    elevation: 0,
    height: normalize(70),
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    backgroundColor: "transparent",
  },
  tabBarLabel: {
    fontSize: normalize(12),
    fontFamily: "Poppins_400Regular",
  },
});
