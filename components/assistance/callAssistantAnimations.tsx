// components/CallAssistantAnimations.tsx
import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";

interface PulseDotProps {
  delay?: number;
  size?: number;
  color?: string;
}

/**
 * Animated pulsing dot component for the listening indicator
 */
export const PulseDot: React.FC<PulseDotProps> = ({
  delay = 0,
  size = 8,
  color = "#FF2D55",
}) => {
  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const opacityAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Create pulse animation sequence
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
            delay,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.8,
            duration: 800,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
            delay,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 0.6,
            duration: 1000,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.3,
            duration: 800,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    // Start the animation
    pulseAnimation.start();

    // Cleanup animation on unmount
    return () => {
      pulseAnimation.stop();
    };
  }, [delay]);

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    />
  );
};

/**
 * Listening indicator with multiple pulsing dots
 */
export const ListeningIndicator: React.FC = () => {
  return (
    <View style={styles.listeningContainer}>
      <PulseDot delay={0} />
      <PulseDot delay={300} />
      <PulseDot delay={600} />
    </View>
  );
};

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

/**
 * Animated notification badge with pulsing effect
 */
export const SuggestionNotification: React.FC<{ count: number }> = ({
  count,
}) => {
  const scaleAnim = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    if (count > 0) {
      // Pop animation for new suggestions
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.5)),
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Reset to hidden state when count is 0
      Animated.timing(scaleAnim, {
        toValue: 0.6,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [count]);

  if (count === 0) return null;

  return (
    <Animated.View
      style={[
        styles.notificationBadge,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={styles.badgeContent}>
        {count > 0 && <View style={styles.badgeDot} />}
      </View>
    </Animated.View>
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
