// CallAssistantScreen.tsx
import { AudioWaveform } from "@/components/animation/audio-wave";
import { FloatingActionButton } from "@/components/assistance/call/FloatingActionButton";
import { SuggestionBubble } from "@/components/assistance/call/SuggestionBubble";
import { TranscriptionList } from "@/components/assistance/call/TranscriptionList";
import { Colors } from "@/constants/colors";
import { Fonts } from "@/constants/fonts";
import { useCallAssistant } from "@/context/CallAssitantContext";
import { normalize } from "@/utils/responsive";

import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");
const CallAssistantScreen: React.FC = () => {
  const navigation = useNavigation();
  const {
    isActive,
    startAssistant,
    stopAssistant,
    suggestions,
    transcriptions,
    isListening,
    addManualTranscription,
  } = useCallAssistant();

  const [manualInput, setManualInput] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [speakerType, setSpeakerType] = useState<"self" | "other">("other");

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(height)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    if (isActive) {
      // Animate in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      // Start pulse animation
      startPulseAnimation();
    } else {
      // Animate out
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isActive]);

  useEffect(() => {
    if (isListening && animationRef.current) {
      animationRef.current.play();
    } else if (animationRef.current) {
      animationRef.current.pause();
    }
  }, [isListening]);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const handleManualSubmit = () => {
    if (manualInput.trim()) {
      addManualTranscription(manualInput.trim(), speakerType === "self");
      setManualInput("");
    }
  };

  if (!isActive) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={[Colors.gradientPinkStart, Colors.gradientPinkEnd]}
          style={[styles.gradient, { opacity: 0.98 }]}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              if (navigation?.goBack) {
                navigation.goBack();
              }
            }}
          >
            <Ionicons
              name='chevron-back'
              size={28}
              color={Colors.gradientPinkStart}
            />
          </TouchableOpacity>

          <View style={styles.welcomeContainer}>
            <Text
              style={StyleSheet.compose(styles.welcomeTitle, Fonts.subheading)}
            >
              Fluttr Call Assistant
            </Text>
            <Text style={StyleSheet.compose(styles.welcomeText, Fonts.body)}>
              Get real-time tips and conversation starters during your calls or
              live dates. Fluttr Call Assistant helps you feel confident and
              make every moment count.
            </Text>
            <LottieView
              source={require("../../assets/animations/heart.json")}
              style={styles.welcomeAnimation}
              autoPlay
              loop
            />
            <TouchableOpacity
              style={styles.startButton}
              onPress={startAssistant}
            >
              <LinearGradient
                colors={[Colors.gradientPinkStart, Colors.peach]}
                style={styles.buttonGradient}
              >
                <Text style={styles.startButtonText}>Start Call Assistant</Text>
                <MaterialIcons name='keyboard-voice' size={24} color='white' />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[Colors.gradientPinkStart, Colors.gradientPinkEnd]}
        style={[styles.gradient, { opacity: 0.98 }]}
      >
        <Animated.View
          style={[
            styles.assistantContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={stopAssistant}
            >
              <MaterialIcons name='close' size={24} color='#FF5F6D' />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Call Assistant</Text>
            <View style={styles.listeningIndicator}>
              <Animated.View style={[{ transform: [{ scale: pulseAnim }] }]}>
                <AudioWaveform isActive={true} />
              </Animated.View>
              <Text style={styles.listeningText}>
                {isListening ? "Listening..." : "Paused"}
              </Text>
            </View>
          </View>

          {/* Main Content */}
          <ScrollView
            style={styles.contentContainer}
            contentContainerStyle={styles.contentInner}
          >
            {/* Transcription List */}
            <TranscriptionList transcriptions={transcriptions} />
          </ScrollView>

          {/* Suggestions Container */}
          <View style={styles.suggestionsContainer}>
            <Text style={[styles.suggestionsTitle, Fonts.heading]}>
              Suggestions
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.suggestionsScrollContent}
            >
              {suggestions
                .filter((s: any) => !s.used)
                .slice(-3)
                .map((suggestion: any) => (
                  <SuggestionBubble
                    key={suggestion.id}
                    suggestion={suggestion}
                  />
                ))}
              {suggestions.filter((s: any) => !s.used).length === 0 && (
                <View style={styles.emptySuggestion}>
                  <Text style={styles.emptySuggestionText}>
                    Listening for conversation...
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>

          {/* Manual Input Area */}
          {showInput && (
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.inputContainer}
            >
              <View style={styles.speakerToggle}>
                <TouchableOpacity
                  style={[
                    styles.speakerButton,
                    speakerType === "self" && styles.speakerButtonActive,
                  ]}
                  onPress={() => setSpeakerType("self")}
                >
                  <Text
                    style={[
                      styles.speakerButtonText,
                      speakerType === "self" && styles.speakerButtonTextActive,
                    ]}
                  >
                    Me
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.speakerButton,
                    speakerType === "other" && styles.speakerButtonActive,
                  ]}
                  onPress={() => setSpeakerType("other")}
                >
                  <Text
                    style={[
                      styles.speakerButtonText,
                      speakerType === "other" && styles.speakerButtonTextActive,
                    ]}
                  >
                    Them
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  value={manualInput}
                  onChangeText={setManualInput}
                  placeholder={`Type what ${
                    speakerType === "self" ? "you" : "they"
                  } said...`}
                  returnKeyType='send'
                  onSubmitEditing={handleManualSubmit}
                  blurOnSubmit={false}
                />
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={handleManualSubmit}
                >
                  <Ionicons name='send' size={20} color='white' />
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          )}

          {/* Floating Action Buttons */}
          <FloatingActionButton
            showInput={showInput}
            setShowInput={setShowInput}
            isListening={isListening}
          />
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    top: normalize(35),
    left: normalize(20),
    zIndex: 10,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: normalize(24),
    padding: normalize(8),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },

  welcomeContainer: {
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    padding: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  welcomeTitle: {
    fontWeight: "bold",
    color: Colors.gradientPinkStart,
    marginBottom: 10,
    textAlign: "center",
    ...Fonts.subheading,
  },
  welcomeText: {
    ...Fonts.body,
    color: Colors.darkText,
    textAlign: "center",
    marginBottom: 20,
  },
  welcomeAnimation: {
    width: 200,
    height: 200,
    marginVertical: 20,
  },
  startButton: {
    width: "100%",
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    marginTop: 20,
  },
  buttonGradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  startButtonText: {
    color: Colors.buttonText,
    ...Fonts.button,
    fontWeight: "bold",
    marginRight: 10,
  },
  assistantContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: Colors.white,
    borderRadius: 25,
    overflow: "hidden",
    padding: 0,
  },
  header: {
    width: "100%",
    height: normalize(100),
    backgroundColor: Colors.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: normalize(20),
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
  },
  closeButton: {
    width: normalize(36),
    height: normalize(36),
    borderRadius: 18,
    backgroundColor: Colors.lightGray,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: Colors.gradientPinkStart,
    fontWeight: "bold",
    ...Fonts.body,
  },
  listeningIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },

  listeningAnimation: {
    width: normalize(40),
    height: normalize(40),
  },
  listeningText: {
    color: Colors.mediumText,
    ...Fonts.small,
    marginLeft: 5,
  },
  contentContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: Colors.graywhite,
  },
  contentInner: {
    padding: 15,
    paddingBottom: 100,
  },

  suggestionsContainer: {
    width: "100%",
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: normalize(60), // More space for bottom elements (like call controls)
    position: "absolute",
    bottom: 0,
    left: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
    minHeight: normalize(220), // Enough space for at least 2 suggestion cards and buttons
    maxHeight: "60%", // Avoid taking over the whole screen
  },

  suggestionsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.darkText,
    paddingBottom: normalize(20),
  },
  suggestionsScrollContent: {
    paddingRight: 20,
  },
  emptySuggestion: {
    width: width * 0.8,
    height: normalize(60),
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  emptySuggestionText: {
    color: Colors.mediumText,
    fontStyle: "italic",
  },
  inputContainer: {
    width: "100%",
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15,
    position: "absolute",
    bottom: 0,
    left: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  speakerToggle: {
    flexDirection: "row",
    marginBottom: 10,
    alignSelf: "center",
  },
  speakerButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.lightGray,
    marginHorizontal: 5,
  },
  speakerButtonActive: {
    backgroundColor: Colors.gradientPinkStart,
  },
  speakerButtonText: {
    color: Colors.mediumText,
    fontWeight: "500",
  },
  speakerButtonTextActive: {
    color: Colors.white,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: normalize(50),
    backgroundColor: Colors.lightGray,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  sendButton: {
    width: normalize(45),
    height: normalize(45),
    borderRadius: 22.5,
    backgroundColor: Colors.gradientPinkStart,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CallAssistantScreen;
