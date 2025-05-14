import LottieView from "lottie-react-native";
import { MessageCircleCode } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  PanResponder,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface FloatingAssistantBubbleProps {
  onOpenAssistant: () => void;
}

const FloatingAssistantBubble: React.FC<FloatingAssistantBubbleProps> = ({
  onOpenAssistant,
}) => {
  const insets = useSafeAreaInsets();
  const [bubblePosition, setBubblePosition] = useState({
    x: Dimensions.get("window").width - 80,
    y: Dimensions.get("window").height / 2,
  });

  // Animation for pulsing effect
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Create pulsing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Create pan responder for the draggable bubble
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        setBubblePosition({
          x: bubblePosition.x + gestureState.dx,
          y: bubblePosition.y + gestureState.dy,
        });
      },
      onPanResponderRelease: (_, gestureState) => {
        // Snap to edges
        let newX = bubblePosition.x + gestureState.dx;

        // Snap to left or right edge, depending on which is closer
        if (newX < Dimensions.get("window").width / 2) {
          newX = 20;
        } else {
          newX = Dimensions.get("window").width - 80;
        }

        // Make sure bubble is within screen boundaries
        let newY = bubblePosition.y + gestureState.dy;
        newY = Math.max(insets.top + 20, newY);
        newY = Math.min(
          Dimensions.get("window").height - insets.bottom - 80,
          newY
        );

        setBubblePosition({ x: newX, y: newY });
      },
    })
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.bubble,
        {
          left: bubblePosition.x,
          top: bubblePosition.y,
          transform: [{ scale: pulseAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.bubbleButton}
        onPress={onOpenAssistant}
        activeOpacity={0.8}
      >
        <MessageCircleCode size={32} color='#FFFFFF' />
        <LottieView
          source={require("../../assets/animations/heart.json")}
          autoPlay
          loop
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bubble: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FF4785",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 999,
  },
  bubbleButton: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  bubbleIcon: {
    width: 32,
    height: 32,
    tintColor: "#FFFFFF",
  },
});

export default FloatingAssistantBubble;
