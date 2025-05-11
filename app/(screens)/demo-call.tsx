import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  StyleSheet,
  Vibration,
  Button,
} from "react-native";

// Demo phrases for the conversation assistant
const DEMO_CONVERSATION_TRIGGERS = [
  {
    keywords: ["hobby", "interest", "enjoy", "like"],
    suggestions: [
      "What got you interested in that?",
      "I find that fascinating. Tell me more about it.",
      "That's impressive! How long have you been doing that?",
    ],
  },
  {
    keywords: ["job", "work", "career", "profession"],
    suggestions: [
      "What's your favorite part about your job?",
      "That sounds challenging. What's the most rewarding aspect?",
      "Where do you see yourself in your career in the next few years?",
    ],
  },
  {
    keywords: ["travel", "trip", "visit", "country", "city"],
    suggestions: [
      "That sounds amazing! What was your favorite part?",
      "I've always wanted to go there. What would you recommend seeing?",
      "Would you go back there again? I'd love to hear more about it.",
    ],
  },
  {
    keywords: ["food", "restaurant", "eat", "dinner", "lunch"],
    suggestions: [
      "What's your favorite cuisine?",
      "We should try that place together sometime.",
      "I love discovering new restaurants. Any recommendations?",
    ],
  },
];

// Simulate a conversation for demo purposes
const DEMO_CONVERSATION = [
  "So what do you do for work?",
  "I love traveling whenever I get a chance.",
  "Have you been to any interesting restaurants lately?",
  "What are your hobbies outside of work?",
];

const ConversationAssistant = () => {
  const [isAssistantActive, setIsAssistantActive] = useState(false);
  const [currentSuggestions, setCurrentSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [conversationIndex, setConversationIndex] = useState(0);
  const [currentConversation, setCurrentConversation] = useState("");

  // Generate suggestions based on conversation context
  const generateSuggestions = (text: string) => {
    const lowercaseText = text.toLowerCase();

    // Find matching triggers
    for (const trigger of DEMO_CONVERSATION_TRIGGERS) {
      if (trigger.keywords.some((keyword) => lowercaseText.includes(keyword))) {
        return trigger.suggestions;
      }
    }

    // Default suggestions if no keywords match
    return [
      "Tell me more about that.",
      "That's interesting! How did you get into it?",
      "I'd love to hear more about your perspective on that.",
    ];
  };

  // Simulate conversation partner speaking
  const simulateConversation = () => {
    if (conversationIndex < DEMO_CONVERSATION.length) {
      const text = DEMO_CONVERSATION[conversationIndex];
      setCurrentConversation(text);

      if (isAssistantActive) {
        // Generate suggestions based on what was "heard"
        const suggestions = generateSuggestions(text);
        setCurrentSuggestions(suggestions);

        // Vibrate to notify user of suggestions
        Vibration.vibrate(200);
        setShowSuggestions(true);
      }

      setConversationIndex((prevIndex) => prevIndex + 1);
    } else {
      // Reset for demo loop
      setConversationIndex(0);
      setCurrentConversation("");
      setShowSuggestions(false);
    }
  };

  // Copy suggestion (in real app, this might use clipboard)
  const useSuggestion = (suggestion: string) => {
    alert(`You selected: "${suggestion}"`);
    setShowSuggestions(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Conversation Assistant</Text>
        <View style={styles.switchContainer}>
          <Text>Assistant: {isAssistantActive ? "ON" : "OFF"}</Text>
          <Switch
            value={isAssistantActive}
            onValueChange={setIsAssistantActive}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isAssistantActive ? "#2196F3" : "#f4f3f4"}
          />
        </View>
      </View>

      <View style={styles.demoBox}>
        <Text style={styles.demoTitle}>Demo Mode</Text>
        <Text style={styles.demoInstructions}>
          Press the button below to simulate your date speaking. The assistant
          will provide suggestions based on what it "hears".
        </Text>

        <Button title='Simulate Date Speaking' onPress={simulateConversation} />

        {currentConversation ? (
          <View style={styles.conversationBubble}>
            <Text style={styles.dateText}>
              Date says: "{currentConversation}"
            </Text>
          </View>
        ) : null}
      </View>

      {/* Suggestions popup */}
      {showSuggestions && isAssistantActive && (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>Suggested Responses:</Text>
          {currentSuggestions.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionItem}
              onPress={() => useSuggestion(suggestion)}
            >
              <Text style={styles.suggestionText}>{suggestion}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.dismissButton}
            onPress={() => setShowSuggestions(false)}
          >
            <Text style={styles.dismissText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  demoBox: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  demoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  demoInstructions: {
    marginBottom: 16,
    lineHeight: 20,
  },
  conversationBubble: {
    backgroundColor: "#e1f5fe",
    borderRadius: 16,
    padding: 12,
    marginTop: 16,
    marginLeft: 8,
    maxWidth: "80%",
    alignSelf: "flex-start",
  },
  dateText: {
    fontSize: 16,
  },
  suggestionsContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: "80%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#2196F3",
  },
  suggestionItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  suggestionText: {
    fontSize: 16,
  },
  dismissButton: {
    marginTop: 12,
    alignSelf: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 16,
  },
  dismissText: {
    color: "#757575",
  },
});

export default ConversationAssistant;
