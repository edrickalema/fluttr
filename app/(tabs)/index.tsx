import FloatingAssistantBubble from "@/components/assistance/FloatAssitantBubble";
import MessagePrompt from "@/components/assistance/MessagePrompt";
import AssistantPanel from "@/components/assistance/SmartAssitantPanel";
import Text from "@/components/main/custom-text";
import GenerateLineModal from "@/components/modal/generate-new-line";
import { Colors } from "@/constants/colors";
import { useAssistant } from "@/context/AssitantContext";
import { useTheme } from "@/context/ThemeContext";
import { normalize } from "@/utils/responsive";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Heart, PhoneCall, Sparkle } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const cardWidth = width * 0.9;

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const [firstLaunch, setFirstLaunch] = useState(true);
  const [scrollY] = useState(new Animated.Value(0));

  const { theme } = useTheme();

  const {
    isAssistantEnabled,
    isAssistantVisible,
    showAssistant,
    hideAssistant,
  } = useAssistant();

  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      setFirstLaunch(false);
    }, 5000);
  }, []);

  const generateNewPickupLine = () => {
    setIsModalVisible(true);
  };

  const handleGenerateLine = () => {
    setIsModalVisible(false);
  };

  // Enhanced header animations
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const headerElevation = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [0, 6],
    extrapolate: "clamp",
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='dark-content' />

      {firstLaunch && isAssistantEnabled && showPrompt && (
        <MessagePrompt onDismiss={() => setShowPrompt(false)} />
      )}

      {isAssistantEnabled && !isAssistantVisible && (
        <FloatingAssistantBubble onOpenAssistant={showAssistant} />
      )}

      <AssistantPanel isVisible={isAssistantVisible} onClose={hideAssistant} />

      {/* Enhanced header with better animation */}
      <Animated.View
        style={[
          styles.headerBackground,
          {
            opacity: headerOpacity,
            shadowOpacity: headerOpacity,
            elevation: headerElevation,
          },
        ]}
      />

      <View style={styles.header}>
        <View>
          <Text variant='heading' style={styles.logo}>
            Fluttr
          </Text>
          <Text variant='body' style={styles.subtitle}>
            Your AI Romance Assistant
          </Text>
        </View>
        <TouchableOpacity
          style={styles.sparkleButton}
          activeOpacity={0.8}
          onPress={generateNewPickupLine}
        >
          <Heart size={24} color={Colors.pink} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Improved hero section with rounded corners and better spacing */}
        <View style={styles.heroContainer}>
          <LinearGradient
            colors={[Colors.gradientPinkStart, Colors.gradientPinkEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            {/* Subtle pattern overlay instead of empty image */}
            <View style={styles.patternOverlay}>
              <View style={styles.dotPattern} />
            </View>

            <View style={styles.heroContent}>
              <Text variant='heading' style={styles.heroTitle}>
                Perfect Replies, Every Time
              </Text>
              <Text variant='body' style={styles.heroDescription}>
                Let's help you craft the perfect messages for your special
                someone
              </Text>
              <TouchableOpacity
                style={styles.callButton}
                activeOpacity={0.85}
                onPress={() => router.push("/(screens)/call-assistant")}
              >
                <PhoneCall
                  size={22}
                  color={Colors.lightText}
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText} variant='button'>
                  Call Assistant
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* Refined features section with improved spacing and visual hierarchy */}
        <View style={styles.featuresSection}>
          <Text variant='subheading' style={styles.sectionTitle}>
            Smart Features
          </Text>

          {/* Enhanced feature cards with consistent spacing */}
          <TouchableOpacity activeOpacity={0.92} style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <Sparkle size={28} color={Colors.pink} />
            </View>
            <View style={styles.featureContent}>
              <Text variant='subheading' style={styles.featureTitle}>
                AI-Powered Suggestions
              </Text>
              <Text variant='body' style={styles.featureDescription}>
                Get personalized message suggestions based on your conversation
                style
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.92} style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <Heart size={28} color={Colors.pink} />
            </View>
            <View style={styles.featureContent}>
              <Text variant='subheading' style={styles.featureTitle}>
                Romance Assistant
              </Text>
              <Text variant='body' style={styles.featureDescription}>
                Your personal guide to meaningful conversations and connections
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <GenerateLineModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onGenerate={() => {}}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  headerBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 110,
    backgroundColor: Colors.cream,
    zIndex: 1,
    shadowColor: Colors.pink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0,
    shadowRadius: 6,
    elevation: 0,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    zIndex: 2,
    marginTop: normalize(50),
  },
  logo: {
    color: Colors.pink,
    marginBottom: 6,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    color: Colors.mediumText,
  },
  sparkleButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.lightText,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.pink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  heroContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: Colors.pink,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  heroGradient: {
    paddingVertical: normalize(30),
    borderRadius: 24,
    overflow: "hidden",
  },
  patternOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0.07,
  },
  dotPattern: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
    backgroundSize: "10px 10px",
    backgroundImage: `radial-gradient(white 1px, transparent 0),
                     radial-gradient(white 1px, transparent 0)`,
    backgroundPosition: "0 0, 15px 15px",
  },
  heroContent: {
    padding: 30,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  heroTitle: {
    color: Colors.lightText,
    textAlign: "center",
    marginBottom: 16,
    fontSize: 30,
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.15)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  heroDescription: {
    color: Colors.lightText,
    textAlign: "center",
    marginBottom: 28,
    opacity: 0.9,
    fontSize: 16,
    lineHeight: 22,
    maxWidth: "85%",
  },
  callButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: Colors.lightText,
    shadowColor: "rgba(0,0,0,0.2)",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: Colors.lightText,
    fontSize: 16,
    fontWeight: "600",
  },
  featuresSection: {
    padding: 20,
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 24,
    color: Colors.darkText,
    marginBottom: 20,
    fontWeight: "600",
    paddingLeft: 5,
  },
  featureCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.lightText,
    padding: 24,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: Colors.pink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.02)",
  },
  featureIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.cream,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
    shadowColor: Colors.pink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    color: Colors.darkText,
    marginBottom: 8,
    fontWeight: "600",
  },
  featureDescription: {
    fontSize: 14,
    color: Colors.mediumText,
    lineHeight: 22,
  },
});

export default HomeScreen;
