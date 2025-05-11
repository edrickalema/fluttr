import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  Modal,
  Alert,
  Button,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Clipboard from "expo-clipboard";

// Mock message data for demo
const DEMO_MESSAGES = [
  {
    app: "Tinder",
    sender: "Alex",
    message: "Hey! I noticed you like hiking too. Any favorite trails?",
  },
  {
    app: "Bumble",
    sender: "Jordan",
    message:
      "Your travel photos look amazing! Where was that beach photo taken?",
  },
  {
    app: "Hinge",
    sender: "Taylor",
    message:
      "I love that restaurant you mentioned in your profile! Have you tried their new menu?",
  },
  {
    app: "WhatsApp",
    sender: "Sam",
    message: "Would you like to grab coffee sometime this week?",
  },
];

// Response suggestions based on message types
const generateSuggestions = (message: string) => {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("hik") || lowerMessage.includes("trail")) {
    return [
      "I love the trails at Redwood National Park! Have you been there?",
      "My favorite is the Eagle Creek Trail - challenging but worth it for the views!",
      "I'm actually planning a hiking trip next weekend. Any interest in joining?",
    ];
  } else if (
    lowerMessage.includes("travel") ||
    lowerMessage.includes("photo") ||
    lowerMessage.includes("beach")
  ) {
    return [
      "That was in Bali last summer! It was absolutely stunning.",
      "Thanks! That was taken in Tulum. Have you ever been to Mexico?",
      "I'd love to tell you the story behind that photo over drinks sometime.",
    ];
  } else if (
    lowerMessage.includes("restaurant") ||
    lowerMessage.includes("menu")
  ) {
    return [
      "Yes! Their new chef is amazing. We should go together sometime!",
      "I haven't tried their new menu yet, but I've been dying to. Would you want to check it out together?",
      "Their pasta dish is my absolute favorite. What do you usually order there?",
    ];
  } else if (
    lowerMessage.includes("coffee") ||
    lowerMessage.includes("drink")
  ) {
    return [
      "I'd love to! How about Wednesday afternoon at that new café downtown?",
      "Coffee sounds perfect! I'm free Friday after 2pm. How about you?",
      "I've been wanting to try that new place on Main Street. Are you free this weekend?",
    ];
  } else {
    return [
      "That sounds interesting! I'd love to hear more about it.",
      "Great question! Let's talk more about that when we meet up.",
      "I've been thinking about that too! How about we discuss over drinks?",
    ];
  }
};

const toneSuggestions = {
  flirty: [
    "I've been thinking about your message all day...",
    "I'm smiling just seeing your name pop up on my screen",
    "So when do I get to see you again? I can't wait much longer...",
  ],
  witty: [
    "If pickup lines were currency, I'd be broke around you",
    "My thumbs got a workout typing and deleting responses to you",
    "Just so you know, I practiced this casual response in the mirror",
  ],
  sweet: [
    "Your message brightened my whole day",
    "I really enjoy our conversations - you're so easy to talk to",
    "I was just thinking about you when your message arrived!",
  ],
};

const { width, height } = Dimensions.get("window");

const FloatingBubble = () => {
  const insets = useSafeAreaInsets();
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showDemoPanel, setShowDemoPanel] = useState(true);
  const [activeTone, setActiveTone] = useState<
    "flirty" | "witty" | "sweet" | null
  >(null);

  // Animated values for bubble position
  const pan = useRef(
    new Animated.ValueXY({ x: width - 80, y: height / 2 })
  ).current;

  // Bubble dragging logic
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (e, gesture) => {
        // Snap to edge
        const newX = gesture.moveX > width / 2 ? width - 60 : 0;
        Animated.spring(pan.x, {
          toValue: newX,
          useNativeDriver: false,
        }).start();

        // Keep y position but ensure bubble stays within screen bounds
        const newY = Math.max(
          insets.top + 20,
          Math.min(gesture.moveY, height - insets.bottom - 60)
        );
        Animated.spring(pan.y, {
          toValue: newY,
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  // Handle message simulation
  const simulateMessage = (index: number) => {
    const message = DEMO_MESSAGES[index];
    setCurrentMessage(message);
    setSuggestions(generateSuggestions(message.message));
    setActiveTone(null);
    setShowDemoPanel(false);
  };

  // Copy suggestion to clipboard
  const copySuggestion = (text: string) => {
    Clipboard.setString(text);
    Alert.alert("Copied", "Response copied to clipboard!");
    setIsExpanded(false);
  };

  // Change tone of suggestions
  const changeTone = (tone: "flirty" | "witty" | "sweet") => {
    setActiveTone(tone);
    setSuggestions(toneSuggestions[tone]);
  };

  // Toggle expanded state
  const toggleExpand = () => {
    if (!isExpanded && currentMessage) {
      setIsExpanded(true);
    } else {
      setIsExpanded(false);
    }
  };

  // Show demo panel again
  const resetDemo = () => {
    setShowDemoPanel(true);
    setIsExpanded(false);
    setCurrentMessage(null);
    setSuggestions([]);
  };

  return (
    <>
      {/* Demo control panel */}
      <Modal visible={showDemoPanel} transparent={true} animationType='slide'>
        <View style={styles.demoModal}>
          <View style={styles.demoContent}>
            <Text style={styles.demoTitle}>Fluttr Chat Assistant Demo</Text>
            <Text style={styles.demoDescription}>
              Simulate receiving messages from dating apps to see how the bubble
              assistant works. Select one message to start:
            </Text>

            {DEMO_MESSAGES.map((msg, index) => (
              <TouchableOpacity
                key={index}
                style={styles.messageButton}
                onPress={() => simulateMessage(index)}
              >
                <Text style={styles.appName}>{msg.app}</Text>
                <Text style={styles.messagePreview}>
                  {msg.sender}: {msg.message}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Reset button */}
      {!showDemoPanel && (
        <TouchableOpacity
          style={[styles.resetButton, { top: insets.top + 10 }]}
          onPress={resetDemo}
        >
          <Text style={styles.resetText}>Reset Demo</Text>
        </TouchableOpacity>
      )}

      {/* Floating bubble */}
      {currentMessage && !showDemoPanel && (
        <Animated.View
          style={[
            styles.bubble,
            { transform: [{ translateX: pan.x }, { translateY: pan.y }] },
          ]}
          {...panResponder.panHandlers}
        >
          {isExpanded ? (
            <View style={styles.expandedBubble}>
              <View style={styles.bubbleHeader}>
                <Text style={styles.bubbleTitle}>
                  Reply to {currentMessage.sender}
                </Text>
                <TouchableOpacity onPress={toggleExpand}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.messageContainer}>
                <Text style={styles.messageApp}>{currentMessage.app}</Text>
                <Text style={styles.messageSender}>
                  {currentMessage.sender}
                </Text>
                <Text style={styles.messageText}>
                  "{currentMessage.message}"
                </Text>
              </View>

              <View style={styles.suggestionsContainer}>
                {suggestions.map((suggestion, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestion}
                    onPress={() => copySuggestion(suggestion)}
                  >
                    <Text style={styles.suggestionText}>{suggestion}</Text>
                    <Text style={styles.copyIcon}>📋</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.toneSelector}>
                <TouchableOpacity
                  style={[
                    styles.toneButton,
                    activeTone === "flirty" && styles.activeTone,
                  ]}
                  onPress={() => changeTone("flirty")}
                >
                  <Text style={styles.toneText}>Flirty</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.toneButton,
                    activeTone === "witty" && styles.activeTone,
                  ]}
                  onPress={() => changeTone("witty")}
                >
                  <Text style={styles.toneText}>Witty</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.toneButton,
                    activeTone === "sweet" && styles.activeTone,
                  ]}
                  onPress={() => changeTone("sweet")}
                >
                  <Text style={styles.toneText}>Sweet</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.collapsedBubble}
              onPress={toggleExpand}
            >
              <Text style={styles.bubbleEmoji}>💬</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  demoModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  demoContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  demoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#2196F3",
  },
  demoDescription: {
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 20,
  },
  messageButton: {
    width: "100%",
    backgroundColor: "#f0f7ff",
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
  },
  appName: {
    fontWeight: "bold",
    color: "#2196F3",
  },
  messagePreview: {
    marginTop: 4,
  },
  resetButton: {
    position: "absolute",
    left: 20,
    backgroundColor: "#e0e0e0",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    zIndex: 100,
  },
  resetText: {
    color: "#757575",
  },
  bubble: {
    position: "absolute",
    zIndex: 1000,
  },
  collapsedBubble: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#2196F3",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  bubbleEmoji: {
    fontSize: 24,
    color: "white",
  },
  expandedBubble: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  bubbleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  bubbleTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2196F3",
  },
  closeButton: {
    fontSize: 20,
    color: "#757575",
    padding: 4,
  },
  messageContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  messageApp: {
    fontSize: 12,
    color: "#2196F3",
    fontWeight: "bold",
  },
  messageSender: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    fontStyle: "italic",
  },
  suggestionsContainer: {
    marginBottom: 12,
  },
  suggestion: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#e3f2fd",
    borderRadius: 8,
    padding: 12,
    marginVertical: 4,
  },
  suggestionText: {
    flex: 1,
    fontSize: 14,
  },
  copyIcon: {
    fontSize: 16,
    marginLeft: 8,
  },
  toneSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  toneButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 16,
    marginHorizontal: 4,
    backgroundColor: "#f0f0f0",
  },
  activeTone: {
    backgroundColor: "#bbdefb",
  },
  toneText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#616161",
  },
});

export default FloatingBubble;
