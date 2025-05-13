import React, { useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
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

export default function CTAScreen() {
  const router = useRouter();

  // Animation values
  const fadeIn = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  useEffect(() => {
    // Start animations
    fadeIn.value = withTiming(1, { duration: 500 });

    // Button pulsing animation
    buttonScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1, // Infinite repeat
      true // Reverse
    );
  }, []);

  // Animated styles
  const contentStyle = useAnimatedStyle(() => ({
    opacity: fadeIn.value,
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleComplete = async () => {
    // await setOnboardingCompleted();
    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.gradientPeachStart, Colors.gradientPeachEnd]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <Animated.View style={[styles.content, contentStyle]}>
          <View style={styles.confettiContainer}>
            <LottieView
              source={Images.confetti}
              autoPlay
              loop
              style={styles.confettiAnimation}
            />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.title}>Ready to Charm!</Text>
            <Text style={styles.subtitle}>
              Make your next date unforgettable
            </Text>
          </View>

          <Animated.View style={buttonStyle}>
            <AnimatedButton
              title='Start Charming'
              onPress={handleComplete}
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
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 60,
    width: "100%",
  },
  confettiContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  confettiAnimation: {
    width: 300,
    height: 300,
  },
  textContainer: {
    alignItems: "center",
    marginTop: 100,
  },
  title: {
    ...Fonts.subheading,
    color: Colors.darkText,
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
});
