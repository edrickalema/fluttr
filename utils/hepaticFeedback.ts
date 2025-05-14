// utils/hapticFeedback.ts
import { Platform, Vibration } from "react-native";
import * as Haptics from "expo-haptics";

/**
 * Utility to provide consistent haptic feedback across the app
 */
export const HapticFeedback = {
  /**
   * Light impact feedback - use for subtle interactions
   */
  light: async () => {
    if (Platform.OS === "ios") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      // Android vibration pattern (milliseconds)
      Vibration.vibrate(10);
    }
  },

  /**
   * Medium impact feedback - use for standard interactions
   */
  medium: async () => {
    if (Platform.OS === "ios") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      Vibration.vibrate(20);
    }
  },

  /**
   * Heavy impact feedback - use for significant interactions
   */
  heavy: async () => {
    if (Platform.OS === "ios") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } else {
      Vibration.vibrate(30);
    }
  },

  /**
   * Success feedback - use for positive confirmations
   */
  success: async () => {
    if (Platform.OS === "ios") {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Vibration.vibrate([0, 50, 30, 50]);
    }
  },

  /**
   * Error feedback - use for errors or invalid operations
   */
  error: async () => {
    if (Platform.OS === "ios") {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } else {
      Vibration.vibrate([0, 50, 30, 100, 30, 50]);
    }
  },

  /**
   * Warning feedback - use for warnings or alerts
   */
  warning: async () => {
    if (Platform.OS === "ios") {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } else {
      Vibration.vibrate([0, 50, 30, 50, 30]);
    }
  },

  /**
   * Notification feedback - use for new suggestions or messages
   */
  suggestion: async () => {
    if (Platform.OS === "ios") {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      // A subtle pattern for new suggestions
      Vibration.vibrate([0, 40, 20, 40]);
    }
  },

  /**
   * Selection feedback - use for selections or toggling
   */
  selection: async () => {
    if (Platform.OS === "ios") {
      await Haptics.selectionAsync();
    } else {
      Vibration.vibrate(15);
    }
  },
};

export default HapticFeedback;
