import { Colors } from "@/constants/colors";
import { Images } from "@/constants/images";
import LottieView from "lottie-react-native";
import React, { useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import AnimatedButton from "@/components/main/button";
import Text from "@/components/main/custom-text";
import { normalize } from "@/utils/responsive";
import { useRouter } from "expo-router";

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
          <Text variant='heading' style={styles.title}>
            Privacy You Can Trust
          </Text>
          <Text variant='body' style={styles.description}>
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
    paddingVertical: normalize(60),
    paddingHorizontal: normalize(20),
  },
  lockContainer: {
    width: normalize(150),
    height: normalize(150),
    justifyContent: "center",
    alignItems: "center",
    marginTop: normalize(40),
  },
  lockAnimation: {
    width: normalize(150),
    height: normalize(150),
  },
  textContainer: {
    width: "100%",
    paddingHorizontal: normalize(20),
    marginVertical: normalize(32),
  },
  title: {
    lineHeight: normalize(30),
    color: Colors.darkText,
    textAlign: "center",
    marginBottom: normalize(16),
  },
  description: {
    lineHeight: normalize(24),
    color: Colors.mediumText,
    textAlign: "center",
  },
  button: {
    backgroundColor: Colors.pink,
    paddingVertical: normalize(16),
    paddingHorizontal: normalize(40),
    borderRadius: normalize(30),
    shadowColor: Colors.pink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    width: "90%",
    alignItems: "center",
    alignSelf: "center",
  },
});
