import { Fonts } from "@/constants/fonts";

import { Flower, Phone, Sparkle, Sparkles } from "lucide-react-native";

import FloatingAssistantBubble from "@/components/assistance/FloatAssitantBubble";
import MessagePrompt from "@/components/assistance/MessagePrompt";
import AssistantPanel from "@/components/assistance/SmartAssitantPanel";
import GenerateLineModal from "@/components/modal/generate-new-line";
import { Colors } from "@/constants/colors";
import { globalStyles } from "@/constants/globalStyles";
import { useAssistant } from "@/context/AssitantContext";
import { normalize } from "@/utils/responsive";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const cardWidth = width * 0.85;

interface HomeScreenProps {
  navigation: any;
}

/**
 * HomeScreen component serves as the main landing page for the app's tab navigation.
 *
 * @component
 * @param {HomeScreenProps} props - The props for the HomeScreen component.
 * @param {object} props.navigation - Navigation prop for navigating between screens.
 *
 * @description
 * - Displays the app's branding, hero section, and feature highlights.
 * - Integrates an AI-powered assistant with a floating bubble and panel.
 * - Shows a message prompt on first launch if the assistant is enabled.
 * - Allows users to generate new AI-powered pickup lines via a modal.
 * - Provides a button to call the assistant for crafting replies.
 *
 * @returns {JSX.Element} The rendered HomeScreen component.
 */
const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const [firstLaunch, setFirstLaunch] = useState(true);

  const {
    isAssistantEnabled,
    isAssistantVisible,
    showAssistant,
    hideAssistant,
  } = useAssistant();

  // Simulate first launch check
  useEffect(() => {
    // In a real app, this would check if it's the first launch after receiving a notification
    setTimeout(() => {
      setFirstLaunch(false);
    }, 5000);
  }, []);

  const router = useRouter();

  const generateNewPickupLine = () => {
    // TODO: Implement AI pickup line generation
    setIsModalVisible(true);
    console.log("Generating new pickup line...");
  };

  const handleGenerateLine = () => {
    setIsModalVisible(false);
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <StatusBar barStyle='dark-content' />
      {/* Show message prompt only on what we consider "first launch" and if assistant is enabled */}
      {firstLaunch && isAssistantEnabled && showPrompt && (
        <MessagePrompt onDismiss={() => setShowPrompt(false)} />
      )}
      {isAssistantEnabled && !isAssistantVisible && (
        <FloatingAssistantBubble onOpenAssistant={showAssistant} />
      )}
      {/* Assistant Panel */}
      <AssistantPanel isVisible={isAssistantVisible} onClose={hideAssistant} />
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>Fluttr</Text>
        </View>
        <TouchableOpacity
          style={styles.sparkleBox}
          onPress={generateNewPickupLine}
        >
          <Flower
            style={{
              shadowColor: Colors.pink,
              shadowOpacity: 0.8,
              shadowRadius: 5,
            }}
            size={normalize(30)}
            color={Colors.pink}
          />
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <LinearGradient
            colors={[Colors.gradientPinkStart, "transparent"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>
              Never Be{" "}
              <Text style={{ color: Colors.pink, fontWeight: "bold" }}>
                Textless
              </Text>
              {" & "}
              <Text style={{ color: Colors.pink, fontWeight: "bold" }}>
                Speechless
              </Text>
              {" Again"}
            </Text>
            <Text style={styles.heroSubtitle}>
              Craft the perfect replies that make your crush smile 😍
            </Text>
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push("/(screens)/call-assistant")}
          >
            <Phone size={22} color={Colors.white} style={styles.buttonIcon} />
            <Text style={styles.primaryButtonText}>Call Assistant</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.featuresSection}>
          <View style={styles.featureCard}>
            <View style={styles.featureImageContainer}>
              <Sparkles size={normalize(30)} color={Colors.pink} />
            </View>
            <Text style={styles.featureTitle}>AI-Powered Suggestions</Text>
            <Text style={styles.featureText}>
              Our smart assistant analyzes messages and creates personalized
              replies tailored to your your style.
            </Text>
          </View>

          <View
            style={StyleSheet.compose(globalStyles.card, styles.featureCard)}
          >
            <View style={styles.featureImageContainer}>
              <Sparkle size={normalize(34)} color={Colors.pink} />
            </View>
            <Text style={styles.featureTitle}> Call & Date Assistance</Text>
            <Text style={styles.featureText}>
              Use our assistant during live calls or dates to generate quick,
              thoughtful responses , ensuring smooth and engaging conversations.
            </Text>
          </View>
        </View>
      </ScrollView>
      {/* Generate New pickup line modal */}
      <GenerateLineModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onGenerate={handleGenerateLine}
      />
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: normalize(20),
    paddingHorizontal: normalize(20),
  },

  logo: {
    ...Fonts.heading,
    fontWeight: "bold",
    color: Colors.pink,
  },

  sparkleBox: {
    backgroundColor: Colors.cream,
    borderColor: Colors.pink,
    width: normalize(50),
    height: normalize(50),
    borderRadius: normalize(20),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: normalize(5),
    marginTop: normalize(10),
    shadowColor: Colors.pink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },

  heroSection: {
    alignItems: "center",
    marginVertical: normalize(20),
  },

  heroContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: normalize(24),
  },

  heroImage: {
    width: normalize(100),
    height: normalize(100),
    marginBottom: normalize(15),
    resizeMode: "contain",
  },

  heroTitle: {
    ...Fonts.subheading,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: normalize(10),
    color: Colors.darkText || "#333",
  },

  heroSubtitle: {
    ...Fonts.body,
    textAlign: "center",
    color: Colors.mediumText || "#666",
    paddingHorizontal: normalize(20),
  },

  primaryButton: {
    backgroundColor: Colors.gradientPinkStart || "#FF4785",
    borderRadius: normalize(30),
    paddingVertical: normalize(14),
    paddingHorizontal: normalize(28),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.gradientPinkStart || "#FF4785",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
    marginTop: normalize(8),
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: normalize(16),
    fontWeight: "600",
  },

  buttonIcon: {
    marginRight: normalize(10),
  },

  tipsSection: {
    marginBottom: normalize(30),
  },

  tipsScrollContent: {
    paddingRight: normalize(20),
    paddingBottom: normalize(10),
  },

  featuresSection: {
    marginBottom: normalize(40),
    paddingHorizontal: normalize(20),
  },

  featureCard: {
    backgroundColor: Colors.white,
    borderRadius: normalize(16),
    padding: normalize(20),
    marginBottom: normalize(15),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },

  featureImageContainer: {
    width: normalize(80),
    height: normalize(80),
    borderRadius: normalize(40),
    backgroundColor: "#FFF0F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: normalize(15),
  },

  featureImage: {
    width: normalize(40),
    height: normalize(40),
    resizeMode: "contain",
  },

  featureTitle: {
    ...Fonts.subheading,
    fontWeight: "600",
    marginBottom: normalize(8),
    color: Colors.darkText || "#333",
    textAlign: "center",
  },

  featureText: {
    ...Fonts.body,
    color: Colors.mediumText || "#666",
    textAlign: "center",
    lineHeight: normalize(20),
  },
});

export default HomeScreen;
