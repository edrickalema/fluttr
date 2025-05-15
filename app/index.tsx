import AnimatedButton from "@/components/main/button";
import Text from "@/components/main/custom-text";
import { Colors } from "@/constants/colors";

import { useTheme } from "@/context/ThemeContext";
import { normalize } from "@/utils/responsive";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { MessageCircle } from "lucide-react-native";
import React, { useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

export default function WelcomeScreen() {
  const router = useRouter();

  const { theme } = useTheme();

  // Animation values
  const fadeIn = useSharedValue(0);
  const slideUp = useSharedValue(50);
  const iconScale = useSharedValue(0.8);

  useEffect(() => {
    // Start animations when component mounts
    fadeIn.value = withTiming(1, { duration: 800 });
    slideUp.value = withTiming(0, { duration: 800 });
    iconScale.value = withDelay(
      400,
      withSequence(
        withTiming(1.2, { duration: 400 }),
        withTiming(1, { duration: 200 })
      )
    );
  }, []);

  // Animated styles
  const contentStyle = useAnimatedStyle(() => ({
    opacity: fadeIn.value,
    transform: [{ translateY: slideUp.value }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const handleNext = () => {
    router.push("/(onboarding)/purpose");
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme?.gradientColors[0], theme?.gradientColors[1]]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Animated.View style={[styles.iconContainer, iconStyle]}>
            <MessageCircle size={48} color={Colors.flirtyPink} />
          </Animated.View>

          <Animated.View style={[styles.textContainer, contentStyle]}>
            <Text variant='heading' style={styles.title}>
              Less Awkward Texts,{"\n"}
              <Text variant='heading' style={styles.highlightText}>
                More{"\n"}Romance!
              </Text>
            </Text>

            <Text variant='subheading' style={styles.subtitle}>
              Discover meaningful connections{"\n"}
              with Fluttr, where romance begins.
            </Text>

            <View style={styles.codeContainer}>
              <Text variant='body' style={styles.codeText}>
                Your journey starts here!
              </Text>
            </View>
          </Animated.View>

          <View style={styles.buttonContainer}>
            <AnimatedButton
              title='Get Started'
              onPress={handleNext}
              style={styles.continueButton}
            />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightText,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: normalize(60),
    alignItems: "flex-start",
  },
  iconContainer: {
    width: normalize(64),
    height: normalize(64),
    borderRadius: normalize(20),
    backgroundColor: Colors.cream,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: normalize(36),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  textContainer: {
    alignSelf: "stretch",
    marginBottom: normalize(48),
  },
  title: {
    lineHeight: normalize(46),
    color: Colors.darkText,
    marginBottom: normalize(20),
  },
  highlightText: {
    color: Colors.flirtyPink,
  },
  subtitle: {
    color: Colors.mediumText,
  },
  codeContainer: {
    backgroundColor: Colors.cream,
    paddingVertical: normalize(16),
    paddingHorizontal: normalize(20),
    borderRadius: normalize(12),
    marginTop: normalize(12),
  },
  codeText: {
    letterSpacing: 1,
    color: Colors.darkText,
  },
  buttonContainer: {
    position: "absolute",
    bottom: normalize(40),
    left: 24,
    right: 24,
    alignItems: "center",
  },
  continueButton: {
    width: "100%",
    backgroundColor: Colors.pink,
    paddingVertical: normalize(16),
    borderRadius: normalize(30),
    marginBottom: normalize(12),
    shadowColor: Colors.pink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  waitlistButton: {
    width: "100%",
    backgroundColor: Colors.cream,
    paddingVertical: normalize(16),
    borderRadius: normalize(30),
    borderWidth: 1,
    borderColor: Colors.mediumText,
    marginBottom: normalize(20),
  },
  waitlistButtonText: {
    color: Colors.darkText,

    fontWeight: "600",
  },
  memberText: {
    color: Colors.mediumText,
    textDecorationLine: "underline",
    marginTop: normalize(12),
  },
});
