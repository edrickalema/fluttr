// components/ManualInputPanel.tsx
import React, { useState, useRef } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ManualInputPanelProps {
  onSubmit: (text: string) => void;
  visible: boolean;
}

const ManualInputPanel: React.FC<ManualInputPanelProps> = ({
  onSubmit,
  visible,
}) => {
  const [inputText, setInputText] = useState("");
  const slideAnim = useRef(new Animated.Value(visible ? 0 : 100)).current;
  const inputRef = useRef<TextInput>(null);

  // Handle visibility changes with animation
  React.useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : 100,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Focus input when visible
    if (visible && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [visible]);

  const handleSubmit = () => {
    if (inputText.trim()) {
      onSubmit(inputText.trim());
      setInputText("");
      Keyboard.dismiss();
    }
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateY: slideAnim }] }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder='What did they say? Type here...'
            placeholderTextColor='rgba(255, 255, 255, 0.4)'
            multiline
            maxLength={100}
            returnKeyType='send'
            blurOnSubmit
            onSubmitEditing={handleSubmit}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !inputText.trim() && styles.disabledButton,
            ]}
            onPress={handleSubmit}
            disabled={!inputText.trim()}
          >
            <Ionicons
              name='send'
              size={20}
              color={inputText.trim() ? "#fff" : "rgba(255, 255, 255, 0.4)"}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(30, 30, 45, 0.95)",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  keyboardAvoid: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#fff",
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FF2D55",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
});

export default ManualInputPanel;
