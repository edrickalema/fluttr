// SuggestionBubble.tsx
import { Colors } from "@/constants/colors";
import { Fonts } from "@/constants/fonts";
import { Suggestion, useCallAssistant } from "@/context/CallAssitantContext";
import { normalize } from "@/utils/responsive";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
// import { useCallAssistant, Suggestion } from "./CallAssistantContext";

interface SuggestionBubbleProps {
  suggestion: Suggestion;
}

export const SuggestionBubble: React.FC<SuggestionBubbleProps> = ({
  suggestion,
}) => {
  const { markSuggestionAsUsed } = useCallAssistant();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entry animation
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();

    // Start pulse animation for newer suggestions
    if (Date.now() - suggestion.timestamp < 5000) {
      startPulseAnimation();
    }
  }, []);

  const startPulseAnimation = () => {
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.05,
        duration: 300,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Repeat a few times
      if (Date.now() - suggestion.timestamp < 5000) {
        startPulseAnimation();
      }
    });
  };

  const handleUse = () => {
    // Exit animation
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      markSuggestionAsUsed(suggestion.id);
    });
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: scaleAnim }, { scale: pulseAnim }],
        },
      ]}
    >
      <LinearGradient
        colors={[Colors.gradientPinkStart, Colors.gradientPeachEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientContainer}
      >
        <Text style={styles.suggestionText}>{suggestion.text}</Text>
        <TouchableOpacity style={styles.useButton} onPress={handleUse}>
          <MaterialIcons name='content-copy' size={18} color='white' />
          <Text style={styles.useButtonText}>Use</Text>
        </TouchableOpacity>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: normalize(280),
    marginRight: 15,
    borderRadius: 16,
    overflow: "hidden",
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 3,
  },
  gradientContainer: {
    padding: 16,
    borderRadius: 16,
  },
  suggestionText: {
    color: Colors.white,
    ...Fonts.body,
    lineHeight: 22,
    marginBottom: 10,
  },
  useButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  useButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 5,
  },
});
