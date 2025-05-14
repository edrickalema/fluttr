import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

/**
 * Wave animation for audio visualization
 */
export const AudioWaveform: React.FC<{ isActive: boolean }> = ({
  isActive,
}) => {
  // Array of animated values for each bar in the waveform
  const bars = Array.from({ length: 5 }, (_, i) => ({
    height: useRef(new Animated.Value(1)).current,
  }));

  useEffect(() => {
    if (isActive) {
      // Animate each bar with random heights when active
      const animations = bars.map((bar, index) => {
        return Animated.loop(
          Animated.sequence([
            Animated.timing(bar.height, {
              toValue: Math.random() * 20 + 5,
              duration: 700 + Math.random() * 300,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: false,
            }),
            Animated.timing(bar.height, {
              toValue: Math.random() * 10 + 2,
              duration: 700 + Math.random() * 300,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: false,
            }),
          ])
        );
      });

      // Start all animations
      animations.forEach((anim) => anim.start());

      // Clean up animations on unmount or when inactive
      return () => {
        animations.forEach((anim) => anim.stop());
      };
    } else {
      // Reset all bars to minimal height when inactive
      bars.forEach((bar) => {
        Animated.timing(bar.height, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }).start();
      });
    }
  }, [isActive]);

  return (
    <View style={styles.waveformContainer}>
      {bars.map((bar, index) => (
        <Animated.View
          key={`wave-bar-${index}`}
          style={[
            styles.waveBar,
            {
              height: bar.height,
              backgroundColor: isActive
                ? "#34C759"
                : "rgba(255, 255, 255, 0.3)",
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  dot: {
    marginHorizontal: 4,
  },
  listeningContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 20,
  },
  waveformContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    height: 30,
    width: 35,
  },
  waveBar: {
    width: 3,
    borderRadius: 1.5,
    marginHorizontal: 2,
    minHeight: 1,
  },
  notificationBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#FF2D55",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  badgeContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#fff",
  },
});
