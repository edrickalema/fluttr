import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { Colors } from "@/constants/colors";
import { Fonts } from "@/constants/fonts";

import { useRouter } from "expo-router";
// import { saveSelectedTone, ToneType } from "@/utils/storage";
import ToneButton from "@/components/main/tone.button";
import AnimatedButton from "@/components/main/button";

const { width } = Dimensions.get("window");

export default function ToneScreen() {
  const router = useRouter();
  const [selectedTone, setSelectedTone] = useState(null);

  // Animation values
  const fadeIn = useSharedValue(0);
  const buttonY = useSharedValue(10);
  const toneButtonsY = useSharedValue(50);

  useEffect(() => {
    // Start animations
    fadeIn.value = withTiming(1, { duration: 500 });
    toneButtonsY.value = withDelay(200, withTiming(0, { duration: 500 }));
  }, []);

  useEffect(() => {
    if (selectedTone) {
      buttonY.value = withDelay(
        300,
        withSequence(
          withTiming(-5, { duration: 150, easing: Easing.bounce }),
          withTiming(0, { duration: 150, easing: Easing.bounce })
        )
      );
    }
  }, [selectedTone]);

  // Animated styles
  const contentStyle = useAnimatedStyle(() => ({
    opacity: fadeIn.value,
  }));

  const toneButtonsStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: toneButtonsY.value }],
    opacity: fadeIn.value,
  }));

  const nextButtonStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: buttonY.value }],
    opacity: selectedTone ? 1 : 0.5,
  }));

  const handleSelectTone = async (
    tone: "flirty" | "shy" | "witty"
  ) => {
    setSelectedTone(null);
    // await saveSelectedTone(tone);
  };

  const handleNext = () => {
    // if (!selectedTone) {
      router.push("/(onboarding)/cta");
    
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Animated.View style={[styles.headerContainer, contentStyle]}>
          <Text style={styles.title}>Pick Your Vibe</Text>
          <Text style={styles.description}>
            Choose a tone for personalized suggestions
          </Text>
        </Animated.View>

        <Animated.View style={[styles.tonesContainer, toneButtonsStyle]}>
          <ToneButton
            emoji='😘'
            title='Flirty'
            color={Colors.flirtyPink}
            selected={selectedTone === "flirty"}
            onPress={() => handleSelectTone("flirty")}
          />

          <ToneButton
            emoji='😊'
            title='Shy'
            color={Colors.shyBlue}
            selected={selectedTone === "shy"}
            onPress={() => handleSelectTone("shy")}
          />

          <ToneButton
            emoji='😏'
            title='Witty'
            color={Colors.wittyGreen}
            selected={selectedTone === "witty"}
            onPress={() => handleSelectTone("witty")}
          />
        </Animated.View>

        <Animated.View style={[styles.buttonContainer, nextButtonStyle]}>
          <AnimatedButton
            title='Next'
            onPress={handleNext}
            style={[
              styles.button,
              selectedTone ? styles.buttonEnabled : styles.buttonDisabled,
            ]}
            // disabled={!selectedTone}
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
    backgroundColor: Colors.peach,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  headerContainer: {
    alignItems: "center",
    marginTop: 40,
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
  tonesContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 40,
  },
  buttonContainer: {
    marginBottom: 30,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonEnabled: {
    backgroundColor: Colors.buttonBackground,
  },
  buttonDisabled: {
    backgroundColor: "#CCCCCC",
  },
});
