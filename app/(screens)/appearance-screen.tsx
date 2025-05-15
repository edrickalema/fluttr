import Text from "@/components/main/custom-text";
import { Colors } from "@/constants/colors";
import { useTheme } from "@/context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ChevronLeft, Heart, MessageCircle, Type } from "lucide-react-native";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  FadeIn,
  SlideInRight,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

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

const themeMapping: { [key: string]: string } = {
  Romance: "romance",
  Lavender: "lavender",
  Sunset: "sunset",
  Ocean: "ocean",
};

const fontMapping: { [key: string]: string } = {
  Poppins: "poppins",
  Playfair: "playfair",
  Montserrat: "montserrat",
  Roboto: "roboto",
};

export default function AppearanceScreen() {
  const router = useRouter();

  const { theme, font, themeId, fontId, updateTheme, updateFont } = useTheme();
  console.log(theme, font);

  const [selectedTheme, setSelectedTheme] = useState(() => {
    const themeName =
      Object.keys(themeMapping).find((key) => themeMapping[key] === themeId) ||
      "Romance";
    return themeName;
  });

  const [selectedFont, setSelectedFont] = useState(() => {
    const fontName =
      Object.keys(fontMapping).find((key) => fontMapping[key] === fontId) ||
      "Poppins";
    return fontName;
  });

  const saveAppearanceSettings = async () => {
    try {
      const themeIdToSave = themeMapping[selectedTheme];
      const fontIdToSave = fontMapping[selectedFont];

      await updateTheme(themeIdToSave);
      await updateFont(fontIdToSave);

      alert("Appearance settings saved successfully!");
      router.back();
    } catch (error) {
      console.log("Error saving appearance settings", error);
      alert("Failed to save settings. Please try again.");
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
        },
      ]}
    >
      <Animated.View entering={FadeIn.duration(500)} style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ChevronLeft size={24} color={Colors.darkText} />
        </TouchableOpacity>
        <Text variant='heading' style={styles.title}>
          Appearance
        </Text>
        <Text variant='subheading' style={styles.subtitle}>
          Customize the app's look and feel
        </Text>
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
              isSelected={selectedTheme === theme?.name}
              onSelect={() => setSelectedTheme(theme?.name)}
            />
          ))}
        </View>

        <Text style={styles.sectionTitle}>Font Style</Text>
        <View style={styles.fontGrid}>
          {fontStyles.map((font, index) => (
            <FontStyleCard
              key={index}
              font={font}
              isSelected={selectedFont === font?.name}
              onSelect={() => setSelectedFont(font?.name)}
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
          onPress={saveAppearanceSettings}
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
    color: Colors.darkText,
    marginBottom: 8,
  },
  subtitle: {
    color: Colors.mediumText,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
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
    fontSize: 14,
    color: Colors.darkText,
    marginTop: 8,
  },
  fontPreviewText: {
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
    color: Colors.lightText,
  },
});
