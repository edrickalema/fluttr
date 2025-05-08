import React from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";


import { Fonts } from "@/constants/fonts";
import { Colors } from "@/constants/colors";

interface AnimatedButtonProps {
  title: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
}

const AnimatedButton = ({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
}: AnimatedButtonProps) => {
  // Animation value
  const scale = useSharedValue(1);

  // Animated style
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withTiming(0.95, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSequence(
      withTiming(1.05, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
  };

  const handlePress = () => {
    if (!disabled) {
      onPress && onPress();
    }
  };

  return (
    <Animated.View style={[animatedStyle]}>
      <TouchableOpacity
        style={[styles.button, style, disabled && styles.disabled]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    backgroundColor: Colors.buttonBackground,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    ...Fonts.button,
    color: Colors.buttonText,
  },
  disabled: {
    backgroundColor: "#CCCCCC",
  },
});

export default AnimatedButton;
