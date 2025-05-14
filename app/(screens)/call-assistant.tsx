// CallAssistantScreen.tsx
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import * as Speech from "expo-speech";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
// import useCallAssistant from "../hooks/useCallAssistant";
import ManualInputPanel from "@/components/assistance/manulInputPanel";
import { Fonts } from "@/constants/fonts";
import useCallAssistant from "@/hooks/useCallAssistant";
import useSuggestionEngine from "@/hooks/useSuggestionEngine";
import { Keyboard, Mic } from "lucide-react-native";

interface SuggestionProps {
  text: string;
  type: "icebreaker" | "response" | "question" | "compliment";
  onPress: () => void;
}

// Animated suggestion bubble that appears with a subtle animation
const SuggestionBubble: React.FC<SuggestionProps> = ({
  text,
  type,
  onPress,
}) => {
  const scaleAnim = React.useRef(new Animated.Value(0.5)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Get icon and color based on suggestion type
  const getTypeDetails = () => {
    switch (type) {
      case "icebreaker":
        return { icon: "snowflake-outline", color: "#007AFF" };
      case "response":
        return { icon: "chatbubble-outline", color: "#FF2D55" };
      case "question":
        return { icon: "help-circle-outline", color: "#5856D6" };
      case "compliment":
        return { icon: "heart-outline", color: "#FF9500" };
      default:
        return { icon: "bulb-outline", color: "#34C759" };
    }
  };

  const { icon, color } = getTypeDetails();

  return (
    <Animated.View
      style={[
        styles.suggestionContainer,
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <TouchableOpacity
        style={[styles.suggestionBubble, { borderColor: color }]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Ionicons
          // @ts-ignore
          name={icon}
          size={16}
          color={color}
          style={styles.suggestionIcon}
        />
        <Text style={styles.suggestionText}>{text}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Floating transcription display that shows what's being said
const TranscriptionDisplay: React.FC<{ text: string; partialText: string }> = ({
  text,
  partialText,
}) => {
  return (
    <View style={styles.transcriptionContainer}>
      <ScrollView
        style={styles.transcriptionScroll}
        contentContainerStyle={styles.transcriptionContent}
        showsVerticalScrollIndicator={false}
      >
        {text ? <Text style={styles.transcriptionText}>{text}</Text> : null}
        {partialText ? (
          <Text style={styles.partialTranscriptionText}>{partialText}</Text>
        ) : null}
      </ScrollView>
    </View>
  );
};

const CallAssistantScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [showTranscript, setShowTranscript] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  const [manualInputMode, setManualInputMode] = useState(false);

  // Hook into our custom speech recognition and suggestion systems
  const {
    isListening,
    transcript,
    partialTranscript,
    startListening,
    stopListening,
  } = useCallAssistant();

  const { suggestions, isLoading, generateSuggestions } = useSuggestionEngine();

  // When new suggestions arrive, trigger haptic feedback
  useEffect(() => {
    if (suggestions.length > 0) {
      if (Platform.OS === "ios") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        // Android vibration pattern
        Vibration.vibrate([0, 50, 30, 50]);
      }
    }
  }, [suggestions]);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSuggestionPress = (text: string) => {
    // Copy to clipboard or speak it out loud softly
    Speech.speak(text, {
      rate: 0.8,
      pitch: 1.0,
      volume: 0.5,
    });

    // Could add additional handling here
  };

  const toggleTranscriptView = () => {
    setShowTranscript(!showTranscript);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={["rgba(20, 20, 30, 0.95)", "rgba(30, 30, 45, 0.9)"]}
        style={styles.background}
      />

      {/* Header with control buttons */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => setShowHelp(!showHelp)}
        >
          <Ionicons name='help-circle-outline' size={24} color='#fff' />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Call Assistant</Text>

        <TouchableOpacity
          style={styles.headerButton}
          onPress={toggleTranscriptView}
        >
          <Ionicons
            name={showTranscript ? "eye-outline" : "eye-off-outline"}
            size={24}
            color='#fff'
          />
        </TouchableOpacity>
      </View>

      {/* Help overlay - conditionally rendered */}
      {showHelp && (
        <View style={styles.helpOverlay}>
          <View style={styles.helpContainer}>
            <Text style={styles.helpTitle}>How to use Call Assistant</Text>
            <Text style={styles.helpText}>
              • Place your phone on speaker while talking to your date
            </Text>
            <Text style={styles.helpText}>
              • I'll listen and give you smooth conversation suggestions
            </Text>
            <Text style={styles.helpText}>
              • Tap any suggestion to have it softly whispered to you
            </Text>
            <Text style={styles.helpText}>
              • Tap the mic button to start/stop listening
            </Text>
            <TouchableOpacity
              style={styles.helpCloseButton}
              onPress={() => setShowHelp(false)}
            >
              <Text style={styles.helpCloseButtonText}>Got it</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Main content area */}
      <View style={styles.content}>
        {/* Transcription area */}
        {showTranscript && (
          <TranscriptionDisplay
            text={transcript}
            partialText={partialTranscript}
          />
        )}

        {/* Suggestions area */}
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>
            {isLoading === true ? "Thinking..." : "Suggestions"}
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestionsScroll}
          >
            <SuggestionBubble
              text={""}
              type={"icebreaker"}
              onPress={function (): void {
                throw new Error("Function not implemented.");
              }}
            />
            {suggestions.length > 0 ? (
              suggestions.map((suggestion: any) => (
                <SuggestionBubble
                  key={suggestion.id}
                  text={suggestion.text}
                  type={suggestion.type}
                  onPress={() => handleSuggestionPress(suggestion.text)}
                />
              ))
            ) : (
              <View style={styles.emptySuggestions}>
                <Text style={styles.emptySuggestionsText}>
                  {isListening
                    ? "I'm listening... Suggestions will appear here."
                    : "Tap the mic to start getting suggestions"}
                </Text>
              </View>
            )}
          </ScrollView>
        </View>

        {manualInputMode && (
          <ManualInputPanel
            onSubmit={function (text: string): void {
              throw new Error("Function not implemented.");
            }}
            visible={false}
          />
        )}
      </View>

      {/* Control bar at bottom */}
      <View style={[styles.controlBar, { paddingBottom: insets.bottom + 10 }]}>
        <TouchableOpacity
          style={styles.secondaryControlButton}
          onPress={() => setManualInputMode(!manualInputMode)}
        >
          {manualInputMode ? (
            <Mic size={24} color='#fff' />
          ) : (
            <Keyboard size={24} color='#fff' />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.mainControlButton,
            isListening && styles.activeControlButton,
          ]}
          onPress={toggleListening}
        >
          <Ionicons
            name={isListening ? "mic" : "mic-outline"}
            size={32}
            color='#fff'
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryControlButton}>
          <MaterialIcons name='speed' size={24} color='#fff' />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  transcriptionContainer: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
  },
  transcriptionScroll: {
    flex: 1,
  },
  transcriptionContent: {
    paddingBottom: 16,
  },
  transcriptionText: {
    fontSize: 16,
    color: "#fff",
    lineHeight: 22,
  },
  partialTranscriptionText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.6)",
    fontStyle: "italic",
    lineHeight: 22,
  },
  suggestionsContainer: {
    marginBottom: 16,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: 8,
  },
  suggestionsScroll: {
    paddingBottom: 8,
    paddingRight: 16,
  },
  suggestionContainer: {
    marginRight: 8,
    marginBottom: 8,
  },
  suggestionBubble: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    maxWidth: 280,
  },
  suggestionIcon: {
    marginRight: 8,
  },
  suggestionText: {
    fontSize: 15,
    color: "#fff",
    flexShrink: 1,
  },
  emptySuggestions: {
    height: 54,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  emptySuggestionsText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.4)",
    fontStyle: "italic",
  },
  controlBar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
  },
  mainControlButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FF2D55",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 24,
  },
  activeControlButton: {
    backgroundColor: "#34C759",
  },
  secondaryControlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  helpOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    zIndex: 100,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  helpContainer: {
    backgroundColor: "rgba(30, 30, 45, 0.95)",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 350,
    alignItems: "flex-start",
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 16,
  },
  helpText: {
    ...Fonts.body,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 12,
    lineHeight: 20,
  },
  helpCloseButton: {
    backgroundColor: "#FF2D55",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    alignSelf: "center",
    marginTop: 16,
  },
  helpCloseButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default CallAssistantScreen;
