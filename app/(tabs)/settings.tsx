// app/(tabs)/settings.tsx
import { Colors } from "@/constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import {
  Bell,
  ChevronRight,
  Crown,
  Heart,
  LogOut,
  MessageCircle,
  Palette,
  Sparkles,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";

import Animated, { FadeIn, SlideInRight } from "react-native-reanimated";
// import { getSelectedTone } from "@/utils/storage";
import Text from "@/components/main/custom-text";
import { useAssistant } from "@/context/AssitantContext";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "expo-router";
interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  isPro?: boolean;
  isToggle?: boolean;
  value?: boolean;
  onToggle?: () => void;
  onPress?: () => void;
}

export default function SettingsScreen() {
  const { theme } = useTheme();
  // Router
  const router = useRouter();
  const [selectedTone, setSelectedTone] = useState<string | null>(null);
  const [isPro, setIsPro] = useState(false);

  const { isAssistantEnabled, toggleAssistantEnabled } = useAssistant();

  // Feature toggles
  const [smartAssistant, setSmartAssistant] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [floatingBubble, setFloatingBubble] = useState(true);
  const [realTimeCues, setRealTimeCues] = useState(false);

  useEffect(() => {
    async function loadTone() {
      //
      // const tone = await getSelectedTone();
      // setSelectedTone(tone);
    }
    loadTone();
  }, []);

  const renderProBadge = () => (
    <View style={styles.proBadge}>
      <Crown size={12} color={Colors.lightText} />
      <Text style={styles.proBadgeText}>PRO</Text>
    </View>
  );

  const renderSettingItem = ({
    icon,
    title,
    subtitle,
    isPro = false,
    isToggle = false,
    value = false,
    onToggle,
    onPress,
  }: SettingItemProps) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={isToggle}
    >
      <View style={styles.settingIcon}>{icon}</View>
      <View style={styles.settingContent}>
        <View style={styles.settingHeader}>
          <Text style={styles.settingTitle} variant='subheading'>
            {title}
          </Text>
          {isPro && renderProBadge()}
        </View>
        {subtitle && (
          <Text style={styles.settingSubtitle} variant='body'>
            {subtitle}
          </Text>
        )}
      </View>
      {isToggle ? (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: "#D1D1D1", true: Colors.pink }}
          thumbColor={Colors.lightText}
        />
      ) : (
        <ChevronRight size={20} color={Colors.darkText} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.gradientPinkStart, "transparent"]}
        style={styles.headerGradient}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeIn.duration(500)} style={styles.header}>
          <Text variant='heading' style={styles.headerTitle}>
            Settings
          </Text>
          <Text variant='body' style={styles.headerSubtitle}>
            Customize your romantic experience
          </Text>
        </Animated.View>

        {!isPro && (
          <Animated.View
            entering={SlideInRight.duration(500)}
            style={styles.proCard}
          >
            <LinearGradient
              colors={[Colors.flirtyPink, Colors.shyBlue]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.proGradient}
            >
              <View style={styles.proContent}>
                <Crown size={24} color={Colors.lightText} />
                <Text variant='subheading' style={styles.proTitle}>
                  Upgrade to Pro
                </Text>
                <Text variant='body' style={styles.proDescription}>
                  Get access to advanced AI features and exclusive flirting
                  styles
                </Text>
                <TouchableOpacity style={styles.proButton}>
                  <Text variant='button' style={styles.proButtonText}>
                    Upgrade Now
                  </Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </Animated.View>
        )}

        <View style={styles.section}>
          <Text variant='heading' style={styles.sectionTitle}>
            Smart Features
          </Text>
          {renderSettingItem({
            icon: <Sparkles size={24} color={Colors.pink} />,
            title: "Romantic Assistant",
            subtitle: "Get real-time flirting suggestions",
            isToggle: true,
            value: smartAssistant,
            onToggle: () => setSmartAssistant((prev) => !prev),
          })}
          {renderSettingItem({
            icon: <MessageCircle size={24} color={Colors.shyBlue} />,
            title: "Floating Bubbles",
            subtitle: "Show AI cues on top of chat apps",
            isToggle: true,
            value: floatingBubble,
            onToggle: () => setFloatingBubble((prev) => !prev),
          })}
          {renderSettingItem({
            icon: <Bell size={24} color={Colors.wittyGreen} />,
            title: "Notifications",
            subtitle: "Get timely romantic suggestions",
            isToggle: true,
            value: notifications,
            onToggle: () => setNotifications((prev) => !prev),
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          {renderSettingItem({
            icon: <Heart size={24} color={Colors.flirtyPink} />,
            title: "Conversation Style",
            subtitle: selectedTone
              ? selectedTone.charAt(0).toUpperCase() + selectedTone.slice(1)
              : "Default",
            onPress: () => {
              router.push("/conversation-style");
            },
          })}
          {renderSettingItem({
            icon: <Palette size={24} color={Colors.shyBlue} />,
            title: "Appearance",
            subtitle: "Customize your app theme",
            onPress: () => {
              router.push("/appearance-screen");
            },
          })}
        </View>

        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Data</Text>
          {renderSettingItem({
            icon: <Lock size={24} color={Colors.darkText} />,
            title: "Privacy Settings",
            subtitle: "",
            onToggle: undefined,
            onPress: () => {
              router.push("/(screens)/demo-screen");
            },
          })}
          {renderSettingItem({
            icon: <History size={24} color={Colors.darkText} />,
            title: "Clear History",
            subtitle: "",
            onToggle: undefined,
            onPress: () => {
              router.push("/(screens)/call-assistant");
            },
          })}
        </View> */}

        <TouchableOpacity style={styles.logoutButton}>
          <LogOut size={20} color={Colors.flirtyPink} />
          <Text variant='button' style={styles.logoutText}>
            Log Out
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  headerGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === "web" ? 40 : 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    color: Colors.darkText,
    marginBottom: 8,
  },
  headerSubtitle: {
    color: Colors.mediumText,
  },
  proCard: {
    margin: 20,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  proGradient: {
    padding: 20,
  },
  proContent: {
    alignItems: "center",
  },
  proTitle: {
    color: Colors.white,
    marginTop: 12,
    marginBottom: 8,
  },
  proDescription: {
    color: Colors.white,
    textAlign: "center",
    marginBottom: 16,
  },
  proButton: {
    backgroundColor: Colors.white,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  proButtonText: {
    color: Colors.darkText,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    color: Colors.darkText,
    marginLeft: 20,
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.cream,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingTitle: {
    color: Colors.darkText,
    marginRight: 8,
  },
  settingSubtitle: {
    color: Colors.mediumText,
    marginTop: 4,
  },
  proBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.flirtyPink,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  proBadgeText: {
    color: Colors.white,
    marginLeft: 4,
    fontSize: 10,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    marginBottom: 40,
  },
  logoutText: {
    color: Colors.flirtyPink,
    marginLeft: 8,
  },
});
