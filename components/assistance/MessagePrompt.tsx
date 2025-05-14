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


interface MessagePromptProps {
  onDismiss: () => void;
}

const MessagePrompt: React.FC<MessagePromptProps> = ({ onDismiss }) => {
  const { showAssistant } = useAssistant();
  const [isVisible, setIsVisible] = useState(true);
  const slideAnim = useRef(new Animated.Value(-200)).current;

  useEffect(() => {
    // Slide in animation
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Auto-dismiss after 10 seconds if no action is taken
    const timer = setTimeout(() => {
      dismiss();
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    Animated.timing(slideAnim, {
      toValue: -200,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
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
      style={[styles.container, { transform: [{ translateY: slideAnim }] }]}
    >
      <View style={styles.promptContainer}>
        <Text style={styles.promptText}>
          Did you just get a message from your crush? 💌
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.noButton]}
            onPress={dismiss}
          >
            <Text style={styles.buttonText}>No</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.yesButton]}
            onPress={handleYesPress}
          >
            <Text style={[styles.buttonText, styles.yesButtonText]}>Yes</Text>
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
    paddingTop: 10,
  },
  promptContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    width: Dimensions.get("window").width * 0.9,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  promptText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 16,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    marginHorizontal: 8,
  },
  noButton: {
    backgroundColor: "#F0F0F0",
  },
  yesButton: {
    backgroundColor: "#FF4785",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  yesButtonText: {
    color: "#FFFFFF",
  },
});

export default MessagePrompt;
