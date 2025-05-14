import React, { useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
  Easing,
} from "react-native-reanimated";
import LottieView from "lottie-react-native";
import { Colors } from "@/constants/colors";
import { Fonts } from "@/constants/fonts";
import { Images } from "@/constants/images";

import { useRouter } from "expo-router";
import AnimatedButton from "@/components/main/button";

const { width } = Dimensions.get("window");

export default function PrivacyScreen() {
  const router = useRouter();

  // Animation values
  const fadeIn = useSharedValue(0);
  const slideIn = useSharedValue(100);
  const lockGlow = useSharedValue(0.8);

  useEffect(() => {
    // Start animations
    fadeIn.value = withTiming(1, { duration: 500 });
    setTimeout(() => {
      slideIn.value = withTiming(0, { duration: 300 });
    }, 200);

    // Glowing lock animation
    lockGlow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.8, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1, // Infinite repeat
      true // Reverse
    );
  }, []);

  // Animated styles
  const lockContainerStyle = useAnimatedStyle(() => ({
    opacity: lockGlow.value,
  }));

  const textContainerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: slideIn.value }],
    opacity: fadeIn.value,
  }));

  const handleNext = () => {
    router.push("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Animated.View style={[styles.lockContainer, lockContainerStyle]}>
          <LottieView
            source={Images.lock}
            autoPlay
            loop
            style={styles.lockAnimation}
          />
        </Animated.View>

        <Animated.View style={[styles.textContainer, textContainerStyle]}>
          <Text style={styles.title}>Privacy You Can Trust</Text>
          <Text style={styles.description}>
            All suggestions are on-device, no data stored
          </Text>
        </Animated.View>

        <AnimatedButton
          title='Next'
          onPress={handleNext}
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
    backgroundColor: Colors.lightPurple,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  lockContainer: {
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  lockAnimation: {
    width: 150,
    height: 150,
  },
  textContainer: {
    width: "100%",
    paddingHorizontal: 20,
  },
  title: {
    ...Fonts.subheading,
    color: Colors.darkText,
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    ...Fonts.body,
    color: Colors.mediumText,
    textAlign: "center",
  },
  button: {
    backgroundColor: Colors.buttonBackground,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
});
