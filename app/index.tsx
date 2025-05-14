import AnimatedButton from "@/components/main/button";
import { Colors } from "@/constants/colors";
import { Fonts } from "@/constants/fonts";
import { normalize } from "@/utils/responsive";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { MessageCircle } from "lucide-react-native";
import React, { useEffect } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
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
        colors={[Colors.gradientPinkStart, Colors.gradientPinkEnd]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Animated.View style={[styles.iconContainer, iconStyle]}>
            <MessageCircle size={48} color={Colors.flirtyPink} />
          </Animated.View>

          <Animated.View style={[styles.textContainer, contentStyle]}>
            <Text style={styles.title}>
              Less Awkward Texts,{"\n"}
              <Text style={styles.highlightText}>More{"\n"}Romance!</Text>
            </Text>

            <Text style={styles.subtitle}>
              Discover meaningful connections{"\n"}
              with Fluttr, where romance begins.
            </Text>

            <View style={styles.codeContainer}>
              <Text style={styles.codeText}>Your journey starts here!</Text>
            </View>
          </Animated.View>

          <View style={styles.buttonContainer}>
            <AnimatedButton
              title='Get Started'
              onPress={handleNext}
              style={styles.continueButton}
            />

            {/* <AnimatedButton
              title='Join waitlist'
              onPress={() => {}}
              style={styles.waitlistButton}
              textStyle={styles.waitlistButtonText}
            />

            <Text style={styles.memberText}>I'm already a member</Text> */}
          </View>
        </View>
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
    backgroundColor: Colors.lightText,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    alignItems: "flex-start",
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: Colors.cream,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  textContainer: {
    alignSelf: "stretch",
    marginBottom: 40,
  },
  title: {
    ...Fonts.heading,
    fontSize: normalize(40),
    lineHeight: 48,
    color: Colors.darkText,
    marginBottom: 24,
  },
  highlightText: {
    color: Colors.flirtyPink,
  },
  subtitle: {
    ...Fonts.body,
    fontSize: normalize(18),
    color: Colors.mediumText,
    marginBottom: 24,
  },
  codeContainer: {
    backgroundColor: Colors.cream,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 8,
  },
  codeText: {
    ...Fonts.heading,
    fontSize: 20,
    color: Colors.darkText,
    letterSpacing: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 50,
    left: 24,
    right: 24,
    alignItems: "center",
  },
  continueButton: {
    width: "100%",
    backgroundColor: Colors.pink,
    marginBottom: 12,
  },
  waitlistButton: {
    width: "100%",
    backgroundColor: Colors.cream,
    marginBottom: 20,
  },
  waitlistButtonText: {
    color: Colors.darkText,
  },
  memberText: {
    ...Fonts.body,
    color: Colors.mediumText,
    textDecorationLine: "underline",
  },
});
