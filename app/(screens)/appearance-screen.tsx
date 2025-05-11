import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Animated, {
  FadeIn,
  SlideInRight,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { ChevronLeft, Heart, Type, MessageCircle } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/constants/colors";
import { Fonts } from "@/constants/fonts";

const themeColors = [
  { name: "Romance", primary: "#FF9CAD", secondary: "#FFE5E5" },
  { name: "Lavender", primary: "#A5A6F6", secondary: "#F3E5F5" },
  { name: "Sunset", primary: "#FF9A8B", secondary: "#FF6A88" },
  { name: "Ocean", primary: "#91D5FF", secondary: "#E6F7FF" },
];

const fontStyles = [
  { name: "Poppins", preview: "Aa" },
  { name: "Playfair", preview: "Aa" },
  { name: "Montserrat", preview: "Aa" },
  { name: "Roboto", preview: "Aa" },
];

export default function AppearanceScreen() {
  const router = useRouter();
  const [selectedTheme, setSelectedTheme] = useState(0);
  const [selectedFont, setSelectedFont] = useState(0);

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn.duration(500)} style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ChevronLeft size={24} color={Colors.darkText} />
        </TouchableOpacity>
        <Text style={styles.title}>Appearance</Text>
        <Text style={styles.subtitle}>Customize the app's look and feel</Text>
      </Animated.View>

      <Animated.ScrollView
        entering={SlideInRight.delay(200).duration(500)}
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Theme Color</Text>
        <View style={styles.themeGrid}>
          {themeColors.map((theme, index) => (
            <ThemeColorCard
              key={index}
              theme={theme}
              isSelected={selectedTheme === index}
              onSelect={() => setSelectedTheme(index)}
            />
          ))}
        </View>

        <Text style={styles.sectionTitle}>Font Style</Text>
        <View style={styles.fontGrid}>
          {fontStyles.map((font, index) => (
            <FontStyleCard
              key={index}
              font={font}
              isSelected={selectedFont === index}
              onSelect={() => setSelectedFont(index)}
            />
          ))}
        </View>

        <Text style={styles.sectionTitle}>Chat Bubble Style</Text>
        <View style={styles.bubblePreview}>
          <View style={styles.bubbleContainer}>
            <View style={[styles.bubble, styles.receivedBubble]}>
              <Text style={styles.bubbleText}>Hey there! 👋</Text>
            </View>
            <View style={[styles.bubble, styles.sentBubble]}>
              <Text style={[styles.bubbleText, styles.sentBubbleText]}>
                Hi! How are you? 😊
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.bubbleStyleButton}>
            <MessageCircle size={24} color={Colors.darkText} />
            <Text style={styles.bubbleStyleText}>Change Style</Text>
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => router.back()}
        >
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

interface ThemeColorCardProps {
  theme: { name: string; primary: string; secondary: string };
  isSelected: boolean;
  onSelect: () => void;
}

const ThemeColorCard: React.FC<ThemeColorCardProps> = ({
  theme,
  isSelected,
  onSelect,
}) => {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(isSelected ? 1.05 : 1) }],
  }));

  return (
    <Animated.View style={[styles.themeCard, animatedStyle]}>
      <TouchableOpacity onPress={onSelect}>
        <LinearGradient
          colors={[theme.primary, theme.secondary]}
          style={[styles.themePreview, isSelected && styles.selectedTheme]}
        >
          <Heart size={24} color={Colors.lightText} />
        </LinearGradient>
        <Text style={styles.themeName}>{theme.name}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

interface FontStyleCardProps {
  font: { name: string; preview: string };
  isSelected: boolean;
  onSelect: () => void;
}

const FontStyleCard: React.FC<FontStyleCardProps> = ({
  font,
  isSelected,
  onSelect,
}) => {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(isSelected ? 1.05 : 1) }],
  }));

  return (
    <Animated.View style={[styles.fontCard, animatedStyle]}>
      <TouchableOpacity
        onPress={onSelect}
        style={[styles.fontPreview, isSelected && styles.selectedFont]}
      >
        <Type size={24} color={Colors.darkText} />
        <Text style={styles.fontName}>{font.name}</Text>
        <Text style={styles.fontPreviewText}>{font.preview}</Text>
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
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    ...Fonts.subheading,
    fontSize: 18,
    color: Colors.darkText,
    marginBottom: 15,
  },
  themeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
    marginBottom: 30,
  },
  themeCard: {
    width: "47%",
  },
  themePreview: {
    height: 100,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  selectedTheme: {
    borderWidth: 3,
    borderColor: Colors.darkText,
  },
  themeName: {
    ...Fonts.body,
    fontSize: 14,
    color: Colors.darkText,
    textAlign: "center",
  },
  fontGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
    marginBottom: 30,
  },
  fontCard: {
    width: "47%",
  },
  fontPreview: {
    backgroundColor: Colors.lightText,
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedFont: {
    borderWidth: 2,
    borderColor: Colors.flirtyPink,
  },
  fontName: {
    ...Fonts.body,
    fontSize: 14,
    color: Colors.darkText,
    marginTop: 8,
  },
  fontPreviewText: {
    ...Fonts.heading,
    fontSize: 24,
    color: Colors.darkText,
    marginTop: 8,
  },
  bubblePreview: {
    backgroundColor: Colors.lightText,
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
  },
  bubbleContainer: {
    marginBottom: 20,
  },
  bubble: {
    maxWidth: "80%",
    padding: 15,
    borderRadius: 20,
    marginBottom: 10,
  },
  receivedBubble: {
    backgroundColor: Colors.cream,
    alignSelf: "flex-start",
    borderBottomLeftRadius: 5,
  },
  sentBubble: {
    backgroundColor: Colors.flirtyPink,
    alignSelf: "flex-end",
    borderBottomRightRadius: 5,
  },
  bubbleText: {
    ...Fonts.body,
    color: Colors.darkText,
  },
  sentBubbleText: {
    color: Colors.lightText,
  },
  bubbleStyleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: Colors.cream,
  },
  bubbleStyleText: {
    ...Fonts.body,
    color: Colors.darkText,
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
