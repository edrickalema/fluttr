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
  User,
  Info,
  HelpCircle,
  Shield,
  Trash,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
  Image,
} from "react-native";

import Animated, {
  FadeIn,
  SlideInRight,
  FadeInDown,
} from "react-native-reanimated";
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
  delay?: number;
}

export default function SettingsScreen() {
  const { theme } = useTheme();
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
    delay = 0,
  }: SettingItemProps) => (
    <Animated.View entering={FadeInDown.delay(delay).duration(300)}>
      <TouchableOpacity
        style={[
          styles.settingItem,
          {
            backgroundColor:
              theme === "dark" ? '' : Colors.white,
          },
        ]}
        onPress={onPress}
        disabled={isToggle}
      >
        <View
          style={[
            styles.settingIcon,
            {
              backgroundColor:
                theme === "dark" ? '': Colors.cream,
            },
          ]}
        >
          {icon}
        </View>
        <View style={styles.settingContent}>
          <View style={styles.settingHeader}>
            <Text
              style={[
                styles.settingTitle,
                {
                  color: theme === "dark" ? Colors.lightText : Colors.darkText,
                },
              ]}
              variant='subheading'
            >
              {title}
            </Text>
            {isPro && renderProBadge()}
          </View>
          {subtitle && (
            <Text
              style={[
                styles.settingSubtitle,
                {
                  color:
                    theme === "dark" ? Colors.mediumText : Colors.mediumText,
                },
              ]}
              variant='body'
            >
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
            style={styles.toggle}
          />
        ) : (
          <ChevronRight
            size={18}
            color={theme === "dark" ? Colors.mediumText : Colors.darkText}
          />
        )}
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            theme === "dark" ? Colors.darkBackground : Colors.cream,
        },
      ]}
    >
      <LinearGradient
        colors={[Colors.gradientPinkStart, "transparent"]}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.userSection}>
          <Animated.View
            entering={FadeIn.duration(500)}
            style={styles.profileContainer}
          >
            <View style={styles.profileImageContainer}>
              <Image
                source={{ uri: "https://via.placeholder.com/150" }}
                style={styles.profileImage}
              />
              <View style={styles.editProfileBadge}>
                <User size={14} color={Colors.lightText} />
              </View>
            </View>
            <View style={styles.profileInfo}>
              <Text variant='heading' style={styles.profileName}>
                Jessica
              </Text>
              <Text variant='body' style={styles.profileEmail}>
                jessica@example.com
              </Text>
            </View>
          </Animated.View>
        </View>

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
                <View style={styles.proIconContainer}>
                  <Crown size={28} color={Colors.lightText} />
                </View>
                <View style={styles.proTextContainer}>
                  <Text variant='subheading' style={styles.proTitle}>
                    Upgrade to Pro
                  </Text>
                  <Text variant='body' style={styles.proDescription}>
                    Get access to advanced AI features and exclusive flirting
                    styles
                  </Text>
                </View>
                <TouchableOpacity style={styles.proButton}>
                  <Text variant='button' style={styles.proButtonText}>
                    Upgrade
                  </Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </Animated.View>
        )}

        <View style={styles.section}>
          <Text
            variant='heading'
            style={[
              styles.sectionTitle,
              { color: theme === "dark" ? Colors.lightText : Colors.darkText },
            ]}
          >
            Smart Features
          </Text>
          {renderSettingItem({
            icon: <Sparkles size={22} color={Colors.pink} />,
            title: "Romantic Assistant",
            subtitle: "Get real-time flirting suggestions",
            isToggle: true,
            value: smartAssistant,
            onToggle: () => setSmartAssistant((prev) => !prev),
            delay: 100,
          })}
          {renderSettingItem({
            icon: <MessageCircle size={22} color={Colors.shyBlue} />,
            title: "Floating Bubbles",
            subtitle: "Show AI cues on top of chat apps",
            isToggle: true,
            value: floatingBubble,
            onToggle: () => setFloatingBubble((prev) => !prev),
            delay: 150,
          })}
          {renderSettingItem({
            icon: <Bell size={22} color={Colors.wittyGreen} />,
            title: "Notifications",
            subtitle: "Get timely romantic suggestions",
            isToggle: true,
            value: notifications,
            onToggle: () => setNotifications((prev) => !prev),
            delay: 200,
          })}
        </View>

        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: theme === "dark" ? Colors.lightText : Colors.darkText },
            ]}
          >
            Personalization
          </Text>
          {renderSettingItem({
            icon: <Heart size={22} color={Colors.flirtyPink} />,
            title: "Conversation Style",
            subtitle: selectedTone
              ? selectedTone.charAt(0).toUpperCase() + selectedTone.slice(1)
              : "Default",
            onPress: () => {
              router.push("/conversation-style");
            },
            delay: 250,
          })}
          {renderSettingItem({
            icon: <Palette size={22} color={Colors.shyBlue} />,
            title: "Appearance",
            subtitle: "Customize your app theme",
            onPress: () => {
              router.push("/appearance-screen");
            },
            delay: 300,
          })}
        </View>

     
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
    height: 180,
    opacity: 0.7,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  userSection: {
    paddingTop: Platform.OS === "web" ? 40 : 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profileImageContainer: {
    position: "relative",
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: Colors.white,
  },
  editProfileBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Colors.flirtyPink,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.white,
  },
  profileInfo: {
    marginLeft: 15,
  },
  profileName: {
    color: Colors.darkText,
    fontSize: 22,
  },
  profileEmail: {
    color: Colors.mediumText,
    fontSize: 14,
  },
  proCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  proGradient: {
    padding: 0,
  },
  proContent: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  proIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  proTextContainer: {
    flex: 1,
    marginLeft: 16,
    marginRight: 8,
  },
  proTitle: {
    color: Colors.white,
    marginBottom: 4,
    fontSize: 16,
  },
  proDescription: {
    color: Colors.white,
    fontSize: 12,
    opacity: 0.9,
  },
  proButton: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  proButtonText: {
    color: Colors.darkText,
    fontSize: 14,
    fontWeight: "600",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.darkText,
    marginLeft: 20,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 1,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
    fontWeight: "500",
  },
  settingSubtitle: {
    color: Colors.mediumText,
    marginTop: 2,
    fontSize: 13,
  },
  toggle: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  proBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.flirtyPink,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
  },
  proBadgeText: {
    color: Colors.white,
    marginLeft: 2,
    fontSize: 9,
    fontWeight: "bold",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    marginTop: 12,
    marginBottom: 20,
  },
  logoutText: {
    color: Colors.flirtyPink,
    marginLeft: 8,
    fontWeight: "500",
  },
});
