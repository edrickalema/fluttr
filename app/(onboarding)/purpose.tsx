import { Colors } from "@/constants/colors";
import { Images } from "@/constants/images";
import React, { useEffect } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
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

export default function PurposeScreen() {
  const router = useRouter();

  // Animation values
  const fadeIn = useSharedValue(0);
  const slideIn = useSharedValue(-100);
  const buttonPulse = useSharedValue(1);

  useEffect(() => {
    // Start animations
    fadeIn.value = withTiming(1, { duration: 500 });
    setTimeout(() => {
      slideIn.value = withTiming(0, { duration: 300 });
    }, 200);

    // Pulsing button animation
    buttonPulse.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1, // Infinite repeat
      true // Reverse
    );
  }, []);

  // Animated styles
  const imageStyle = useAnimatedStyle(() => ({
    opacity: fadeIn.value,
  }));

  const textContainerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: slideIn.value }],
    opacity: fadeIn.value,
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonPulse.value }],
  }));

  const handleNext = () => {
    router.push("/(onboarding)/privacy");
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Animated.View style={[styles.imageContainer, imageStyle]}>
          <Image
            source={{ uri: Images.cafe }}
            style={styles.image}
            resizeMode='cover'
          />
        </Animated.View>

        <Animated.View style={[styles.textContainer, textContainerStyle]}>
          <Text variant='heading' style={styles.title}>
            Your Social Copilot for Dates
          </Text>
          <Text variant='body' style={styles.description}>
            Get icebreakers and smart replies to make dates memorable
          </Text>
        </Animated.View>

        <Animated.View style={buttonStyle}>
          <AnimatedButton
            title='Next'
            onPress={handleNext}
            style={styles.button}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
    backgroundColor: Colors.cream,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: normalize(60),
    paddingHorizontal: normalize(20),
  },
  imageContainer: {
    width: "90%",
    height: "40%",
    borderRadius: normalize(20),
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  textContainer: {
    width: "100%",
    paddingHorizontal: normalize(20),
    marginTop: normalize(40),
    marginBottom: normalize(32),
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
  },
});
