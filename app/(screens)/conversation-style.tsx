import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Animated, {
  FadeIn,
  SlideInRight,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { ChevronLeft } from "lucide-react-native";
import { Colors } from "@/constants/colors";
import { Fonts } from "@/constants/fonts";

type ConversationStyle = "playful" | "romantic" | "bold" | "shy";

interface StyleOption {
  id: ConversationStyle;
  title: string;
  description: string;
  emoji: string;
}

const styleOptions: StyleOption[] = [
  {
    id: "playful",
    title: "Playful & Fun",
    description: "Guess what? I think you're my new favorite distraction 😊",
    emoji: "😊",
  },
  {
    id: "romantic",
    title: "Romantic & Sweet",
    description: "You have the most beautiful smile I've ever seen ❤️",
    emoji: "❤️",
  },
  {
    id: "bold",
    title: "Bold & Confident",
    description: "You're stunning, I had to come over and say hi.",
    emoji: "✨",
  },
  {
    id: "shy",
    title: "Shy & Subtle",
    description: "Mind if I join you? I'm a little shy but working on it",
    emoji: "🌸",
  },
];

export default function ConversationStyleScreen() {
  const router = useRouter();
  const [selectedStyle, setSelectedStyle] =
    useState<ConversationStyle>("playful");

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn.duration(500)} style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ChevronLeft size={24} color={Colors.darkText} />
        </TouchableOpacity>
        <Text style={styles.title}>Conversation Style</Text>
        <Text style={styles.subtitle}>
          Select the tone for flirting suggestions
        </Text>
      </Animated.View>

      <Animated.View
        entering={SlideInRight.delay(200).duration(500)}
        style={styles.content}
      >
        {styleOptions.map((option, index) => (
          <StyleCard
            key={option.id}
            option={option}
            isSelected={selectedStyle === option.id}
            onSelect={() => setSelectedStyle(option.id)}
            delay={index * 100}
          />
        ))}
      </Animated.View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => router.back()}
        >
          <Text style={styles.saveButtonText}>Save Preference</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

interface StyleCardProps {
  option: StyleOption;
  isSelected: boolean;
  onSelect: () => void;
  delay: number;
}

const StyleCard: React.FC<StyleCardProps> = ({
  option,
  isSelected,
  onSelect,
  delay,
}) => {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(isSelected ? 1.02 : 1) }],
  }));

  return (
    <Animated.View
      entering={SlideInRight.delay(delay).duration(500)}
      style={[styles.cardContainer, animatedStyle]}
    >
      <TouchableOpacity
        style={[styles.card, isSelected && styles.selectedCard]}
        onPress={onSelect}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{option.title}</Text>
          <Text style={styles.emoji}>{option.emoji}</Text>
        </View>
        <Text style={styles.cardDescription}>{option.description}</Text>
        <View
          style={[styles.radioButton, isSelected && styles.radioButtonSelected]}
        >
          {isSelected && <View style={styles.radioButtonInner} />}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    marginBottom: 15,
  },
  title: {
    ...Fonts.heading,
    color: Colors.darkText,
    marginBottom: 8,
  },
  subtitle: {
    ...Fonts.body,
    color: Colors.mediumText,
  },
  content: {
    padding: 20,
    gap: 15,
  },
  cardContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  card: {
    backgroundColor: Colors.lightText,
    borderRadius: 15,
    padding: 20,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedCard: {
    borderColor: Colors.flirtyPink,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cardTitle: {
    ...Fonts.subheading,
    fontSize: 18,
    color: Colors.darkText,
  },
  emoji: {
    fontSize: 24,
  },
  cardDescription: {
    ...Fonts.body,
    color: Colors.mediumText,
    marginBottom: 10,
  },
  radioButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.mediumText,
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonSelected: {
    borderColor: Colors.flirtyPink,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.flirtyPink,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
  saveButton: {
    backgroundColor: Colors.flirtyPink,
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    ...Fonts.button,
    color: Colors.lightText,
  },
});
