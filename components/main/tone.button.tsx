import React, { useEffect } from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
} from "react-native-reanimated";
import { Colors } from "@/constants/colors";
import { Fonts } from "@/constants/fonts";

interface ToneButtonProps {
  emoji: string;
  title: string;
  color: string;
  selected: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

const ToneButton: React.FC<ToneButtonProps> = ({
  emoji,
  title,
  color,
  selected,
  onPress,
  style,
}) => {
  // Animation values
  const scale = useSharedValue(0.8);
  const translateY = useSharedValue(50);

  useEffect(() => {
    // Initial entrance animation
    translateY.value = withTiming(0, { duration: 500 });
    scale.value = withDelay(
      300,
      withSequence(
        withTiming(1.1, { duration: 300 }),
        withTiming(1, { duration: 200 })
      )
    );
  }, []);

  // Animate when selected
  useEffect(() => {
    if (selected) {
      scale.value = withSequence(
        withTiming(1.1, { duration: 200 }),
        withTiming(1, { duration: 200 })
      );
    }
  }, [selected]);

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }, { translateY: translateY.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withTiming(0.95, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 100 });
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: color },
          selected && styles.selected,
          style,
        ]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Text style={styles.emoji}>{emoji}</Text>
        <Text style={styles.title}>{title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 5,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  selected: {
    borderWidth: 2,
    borderColor: Colors.darkText,
  },
  emoji: {
    fontSize: 30,
    marginBottom: 8,
  },
  title: {
    ...Fonts.small,
    color: Colors.lightText,
    fontWeight: "600",
  },
});

export default ToneButton;
