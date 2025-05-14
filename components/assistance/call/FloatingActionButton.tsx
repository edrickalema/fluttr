// FloatingActionButton.tsx
import { useCallAssistant } from "@/context/CallAssitantContext";
import { normalize } from "@/utils/responsive";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface FloatingActionButtonProps {
  showInput: boolean;
  setShowInput: (show: boolean) => void;
  isListening: boolean;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  showInput,
  setShowInput,
  isListening,
}) => {
  const { stopAssistant } = useCallAssistant();
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: showInput ? 1 : 0,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [showInput]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });

  const handleFABPress = () => {
    setShowInput(!showInput);
  };

  return (
    <View style={styles.fabContainer}>
      <TouchableOpacity
        style={[styles.fabButton, styles.fabSecondary]}
        onPress={stopAssistant}
      >
        <FontAwesome5 name='phone-slash' size={22} color='#FF5F6D' />
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.fabButton,
          styles.fabPrimary,
          isListening ? styles.fabActive : null,
        ]}
        onPress={handleFABPress}
      >
        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
          <MaterialIcons
            name={showInput ? "close" : "keyboard"}
            size={28}
            color='white'
          />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  fabContainer: {
    position: "absolute",
    bottom: 90,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  fabButton: {
    width: normalize(50),
    height: normalize(50),
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  fabPrimary: {
    backgroundColor: "#FF5F6D",
    zIndex: 1,
  },
  fabSecondary: {
    backgroundColor: "white",
    width: normalize(50),
    height: normalize(50),
    borderRadius: 25,
    marginRight: 15,
  },
  fabActive: {
    backgroundColor: "#FF9F7F",
  },
});

