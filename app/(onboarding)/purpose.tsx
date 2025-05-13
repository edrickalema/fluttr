import React, { useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
  Easing,
} from "react-native-reanimated";
import { Colors } from "@/constants/colors";
import { Fonts } from "@/constants/fonts";
import { Images } from "@/constants/images";

import { useRouter } from "expo-router";
import AnimatedButton from "@/components/main/button";

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
          <Text style={styles.title}>Your Social Copilot for Dates</Text>
          <Text style={styles.description}>
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
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  imageContainer: {
    width: "90%",
    height: "40%",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    width: "100%",
    paddingHorizontal: 20,
    marginVertical: 40,
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
