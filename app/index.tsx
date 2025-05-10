import AnimatedButton from "@/components/main/button";
import { Colors } from "@/constants/colors";
import { Fonts } from "@/constants/fonts";
import { globalStyles } from "@/constants/globalStyles";
import { normalize } from "@/utils/responsive";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useEffect } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Images } from "../constants/images"; // Adjusted the path to match the correct relative location

const { width, height } = Dimensions.get("window");

export default function WelcomeScreen() {
  const router = useRouter();

  // Animation values
  const fadeIn = useSharedValue(0);
  const heartScale = useSharedValue(1);
  const buttonSlideUp = useSharedValue(50);

  useEffect(() => {
    // Start animations when component mounts
    fadeIn.value = withTiming(1, { duration: 500 });
    heartScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1, // Infinite repeat
      true // Reverse
    );
    setTimeout(() => {
      buttonSlideUp.value = withTiming(0, { duration: 300 });
    }, 500);
  }, []);

  // Animated styles
  const contentStyle = useAnimatedStyle(() => ({
    opacity: fadeIn.value,
  }));

  const heartContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: buttonSlideUp.value }],
    opacity: fadeIn.value,
  }));

  const handleNext = () => {
    router.push("/(tabs)");
  };

  return (
    <View style={[globalStyles.container, styles.container]}>
      <LottieView
        source={Images.heart}
        autoPlay
        loop
        style={styles.heartAnimation}
      />
      <LinearGradient
        colors={[Colors.gradientPinkStart, Colors.gradientPinkEnd]}
        style={styles.gradient}
      >
        <Animated.View style={[styles.content, contentStyle]}>
          {/* <Animated.View
            style={[styles.heartContainer, heartContainerStyle]}
          ></Animated.View> */}
          <Text style={styles.title}>Welcome to Fluttr</Text>
          <Text style={styles.subtitle}>
            Discover smarter ways to connect and make every conversation count
          </Text>

          <Animated.View style={buttonStyle}>
            <AnimatedButton
              title='Get Started'
              onPress={handleNext}
              style={styles.button}
            />
          </Animated.View>
        </Animated.View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginBottom: normalize(20),
  },
  gradient: {
    padding: 20,
  },
  content: {
    alignItems: "center",
    width: "100%",
  },
  heartContainer: {
    width: 120,
    height: 120,
    marginBottom: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  heartAnimation: {
    width: 120,
    height: 120,
  },
  title: {
    ...Fonts.heading,
    color: Colors.lightText,
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    ...Fonts.body,
    color: Colors.lightText,
    textAlign: "center",
    marginBottom: 40,
  },
  button: {
    backgroundColor: Colors.buttonBackground,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
});
