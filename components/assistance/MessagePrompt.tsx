import { useAssistant } from "@/context/AssitantContext";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import { Heart, X, MessageCircle } from "lucide-react-native"; // Importing icons

interface MessagePromptProps {
  onDismiss: () => void;
}

const MessagePrompt: React.FC<MessagePromptProps> = ({ onDismiss }) => {
  const { showAssistant } = useAssistant();
  const [isVisible, setIsVisible] = useState(true);
  const slideAnim = useRef(new Animated.Value(-200)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current; // For fade-in effect

  useEffect(() => {
    // Fade in and slide in animation
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-dismiss after 10 seconds if no action is taken
    const timer = setTimeout(() => {
      dismiss();
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -200,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsVisible(false);
      onDismiss();
    });
  };

  const handleYesPress = () => {
    showAssistant();
    dismiss();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
          opacity: fadeAnim,
        },
      ]}
    >
      <View style={styles.promptContainer}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={dismiss}
          hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
        >
          <X stroke='#999' width={18} height={18} />
        </TouchableOpacity>

        <View style={styles.iconContainer}>
          <MessageCircle stroke='#FF4785' width={32} height={32} fill='none' />
        </View>

        <Text style={styles.promptTitle}>New Message Alert</Text>
        <Text style={styles.promptText}>
          Did you just get a message from your crush?
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.noButton]}
            onPress={dismiss}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>No, thanks</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.yesButton]}
            onPress={handleYesPress}
            activeOpacity={0.7}
          >
            <View style={styles.yesButtonContent}>
              <Text style={styles.yesButtonText}>Yes, help me!</Text>
              <Heart
                stroke='#FFF'
                width={16}
                height={16}
                fill='#FFF'
                style={styles.heartIcon}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    alignItems: "center",
    paddingTop: 20,
  },
  promptContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    width: Dimensions.get("window").width * 0.9,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 7,
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 14,
    right: 14,
    padding: 4,
  },
  iconContainer: {
    backgroundColor: "rgba(255, 71, 133, 0.1)",
    borderRadius: 40,
    width: 64,
    height: 64,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  promptTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  promptText: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 24,
    color: "#555",
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginHorizontal: 6,
    justifyContent: "center",
  },
  noButton: {
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  yesButton: {
    backgroundColor: "#FF4785",
    shadowColor: "#FF4785",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#777",
  },
  yesButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  yesButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginRight: 6,
  },
  heartIcon: {
    marginLeft: 4,
  },
});

export default MessagePrompt;
