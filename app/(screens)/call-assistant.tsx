// CallAssistantScreen.tsx
import { AudioWaveform } from "@/components/animation/audio-wave";
import { FloatingActionButton } from "@/components/assistance/call/FloatingActionButton";
import { SuggestionBubble } from "@/components/assistance/call/SuggestionBubble";
import { TranscriptionList } from "@/components/assistance/call/TranscriptionList";
import Text from "@/components/main/custom-text";
import { Colors } from "@/constants/colors";
import { useCallAssistant } from "@/context/CallAssitantContext";
import { normalize } from "@/utils/responsive";

import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
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
              size={24}
              color={Colors.gradientPinkStart}
            />
          </TouchableOpacity>

          <View style={styles.welcomeContainer}>
            <MaterialCommunityIcons
              name='headphones-settings'
              size={32}
              color={Colors.gradientPinkStart}
              style={styles.welcomeIcon}
            />
            <Text variant='heading' style={styles.welcomeTitle}>
              Fluttr Call Assistant
            </Text>
            <Text variant='body' style={styles.welcomeText}>
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
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <MaterialIcons
                  name='keyboard-voice'
                  size={20}
                  color='white'
                  style={styles.buttonIcon}
                />
                <Text style={styles.startButtonText}>Start Call Assistant</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.learnMoreButton}
              onPress={() => {
                /* Handle learn more press */
              }}
            >
              <Text style={styles.learnMoreText}>Learn how it works</Text>
              <Ionicons
                name='chevron-forward'
                size={16}
                color={Colors.gradientPinkStart}
              />
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
              <MaterialIcons name='close' size={20} color='#FF5F6D' />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text variant='body' style={styles.headerTitle}>
                Call Assistant
              </Text>
              <View style={styles.listeningIndicator}>
                <Animated.View style={[{ transform: [{ scale: pulseAnim }] }]}>
                  <AudioWaveform isActive={isListening} />
                </Animated.View>
                <Text
                  variant='small'
                  style={[
                    styles.listeningText,
                    isListening ? styles.listeningTextActive : {},
                  ]}
                >
                  {isListening ? "Listening" : "Paused"}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={[
                styles.listenToggle,
                isListening ? styles.listenToggleActive : {},
              ]}
              onPress={() => {
                /* Toggle listening state */
              }}
            >
              <MaterialIcons
                name={isListening ? "mic" : "mic-off"}
                size={18}
                color={isListening ? Colors.white : Colors.mediumText}
              />
            </TouchableOpacity>
          </View>

          {/* Main Content */}
          <ScrollView
            style={styles.contentContainer}
            contentContainerStyle={styles.contentInner}
            showsVerticalScrollIndicator={false}
          >
            {/* Transcription List */}
            <TranscriptionList transcriptions={transcriptions} />
          </ScrollView>

          {/* Suggestions Container */}
          <View style={styles.suggestionsContainer}>
            <View style={styles.suggestionsTitleContainer}>
              <MaterialIcons
                name='lightbulb-outline'
                size={22}
                color={Colors.gradientPinkStart}
              />
              <Text variant='heading' style={styles.suggestionsTitle}>
                Suggestions
              </Text>
            </View>
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
                  <FontAwesome5
                    name='comments'
                    size={16}
                    color={Colors.mediumText}
                    style={{ marginBottom: 8 }}
                  />
                  <Text variant='body' style={styles.emptySuggestionText}>
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
                  <Ionicons
                    name='person'
                    size={16}
                    color={
                      speakerType === "self" ? Colors.white : Colors.mediumText
                    }
                    style={{ marginRight: 5 }}
                  />
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
                  <Ionicons
                    name='people'
                    size={16}
                    color={
                      speakerType === "other" ? Colors.white : Colors.mediumText
                    }
                    style={{ marginRight: 5 }}
                  />
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
                  placeholderTextColor={Colors.mediumText}
                  returnKeyType='send'
                  onSubmitEditing={handleManualSubmit}
                  blurOnSubmit={false}
                  autoFocus
                />
                <TouchableOpacity
                  style={[
                    styles.sendButton,
                    !manualInput.trim() && styles.sendButtonDisabled,
                  ]}
                  onPress={handleManualSubmit}
                  disabled={!manualInput.trim()}
                >
                  <Ionicons name='send' size={18} color='white' />
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
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: normalize(24),
    padding: normalize(8),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  welcomeContainer: {
    width: "85%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 24,
    padding: normalize(28),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  welcomeIcon: {
    marginBottom: normalize(12),
  },
  welcomeTitle: {
    fontWeight: "bold",
    color: Colors.gradientPinkStart,
    marginBottom: normalize(12),
    textAlign: "center",
  },
  welcomeText: {
    color: Colors.darkText,
    textAlign: "center",
    marginBottom: normalize(16),
    lineHeight: normalize(22),
  },
  welcomeAnimation: {
    width: normalize(180),
    height: normalize(180),
    marginVertical: normalize(16),
  },
  startButton: {
    width: "100%",
    height: normalize(54),
    borderRadius: normalize(27),
    overflow: "hidden",
    marginTop: normalize(16),
    shadowColor: Colors.gradientPinkStart,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonGradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonIcon: {
    marginRight: normalize(10),
  },
  startButtonText: {
    color: Colors.white,
    fontSize: normalize(16),
    fontWeight: "bold",
  },
  learnMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: normalize(16),
    padding: normalize(8),
  },
  learnMoreText: {
    color: Colors.gradientPinkStart,
    fontSize: normalize(14),
    marginRight: normalize(4),
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
    height: normalize(70),
    backgroundColor: Colors.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: normalize(20),
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  closeButton: {
    width: normalize(36),
    height: normalize(36),
    borderRadius: 18,
    backgroundColor: Colors.lightGray,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: Colors.gradientPinkStart,
    fontWeight: "bold",
    fontSize: normalize(16),
    marginBottom: normalize(4),
  },
  listeningIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  listeningText: {
    color: Colors.mediumText,
    marginLeft: 5,
    fontSize: normalize(12),
  },
  listeningTextActive: {
    color: "#4CAF50",
  },
  listenToggle: {
    width: normalize(36),
    height: normalize(36),
    borderRadius: 18,
    backgroundColor: Colors.lightGray,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: normalize(4),
  },
  listenToggleActive: {
    backgroundColor: "#4CAF50",
  },
  contentContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: "rgba(249, 249, 251, 1)",
  },
  contentInner: {
    padding: normalize(16),
    paddingBottom: normalize(200),
  },
  suggestionsContainer: {
    width: "100%",
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: normalize(20),
    paddingTop: normalize(24),
    paddingBottom: normalize(80),
    position: "absolute",
    bottom: 0,
    left: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
    minHeight: normalize(220),
    maxHeight: "60%",
  },
  suggestionsTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: normalize(16),
  },
  suggestionsTitle: {
    fontWeight: "bold",
    color: Colors.darkText,
    marginLeft: normalize(8),
  },
  suggestionsScrollContent: {
    paddingRight: normalize(20),
    paddingBottom: normalize(12),
  },
  emptySuggestion: {
    width: width * 0.8,
    height: normalize(100),
    backgroundColor: Colors.lightGray,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: normalize(12),
    padding: normalize(16),
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  emptySuggestionText: {
    color: Colors.mediumText,
    fontStyle: "italic",
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: normalize(16),
    position: "absolute",
    bottom: 0,
    left: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  speakerToggle: {
    flexDirection: "row",
    marginBottom: normalize(12),
    alignSelf: "center",
  },
  speakerButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(8),
    borderRadius: 20,
    backgroundColor: Colors.lightGray,
    marginHorizontal: normalize(6),
  },
  speakerButtonActive: {
    backgroundColor: Colors.gradientPinkStart,
  },
  speakerButtonText: {
    color: Colors.mediumText,
    fontWeight: "500",
    fontSize: normalize(14),
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
    borderRadius: 25,
    paddingHorizontal: normalize(18),
    marginRight: normalize(12),
    fontSize: normalize(15),
  },
  sendButton: {
    width: normalize(48),
    height: normalize(48),
    borderRadius: 24,
    backgroundColor: Colors.gradientPinkStart,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.gradientPinkStart,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  sendButtonDisabled: {
    backgroundColor: Colors.mediumText,
    opacity: 0.6,
    shadowOpacity: 0,
    elevation: 0,
  },
});

export default CallAssistantScreen;
