import { Colors } from "@/constants/colors";
import { normalize } from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Clipboard,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Text from "../main/custom-text";

type ToneType = "flirty" | "witty" | "sweet";

interface AssistantPanelProps {
  isVisible: boolean;
  onClose: () => void;
}

const AssistantPanel: React.FC<AssistantPanelProps> = ({
  isVisible,
  onClose,
}) => {
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState("");
  const [selectedTone, setSelectedTone] = useState<ToneType>("flirty");
  const [replies, setReplies] = useState<string[]>([]);
  const panelHeight = Dimensions.get("window").height * 0.6;
  const slideAnim = useRef(new Animated.Value(panelHeight)).current;

  // Sample replies for each tone
  const sampleReplies = {
    flirty: [
      "I was just thinking about you... perfect timing! 😏",
      "You always know how to make me smile. Dinner soon?",
      "That message just made my heart skip. What are you up to later? 💋",
    ],
    witty: [
      "If clever messages were currency, you'd be making me rich right now 😎",
      "My phone just got 10x more interesting. Must be your effect!",
      "Are you a magician? Because whenever I get a text from you, everyone else disappears 🪄",
    ],
    sweet: [
      "Your message just brightened my whole day 💖",
      "I can't help but smile whenever I see your name pop up on my screen",
      "You have no idea how happy I am to hear from you right now ✨",
    ],
  };

  useEffect(() => {
    if (isVisible) {
      // Show panel with animation
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Hide panel with animation
      Animated.timing(slideAnim, {
        toValue: panelHeight,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  useEffect(() => {
    // Update replies when tone changes or when message is entered
    if (message.length > 0) {
      setReplies(sampleReplies[selectedTone]);
    } else {
      setReplies([]);
    }
  }, [selectedTone, message]);

  const copyToClipboard = (text: string) => {
    Clipboard.setString(text);

    // Show toast or alert based on platform
    if (Platform.OS === "android") {
      ToastAndroid.show("Copied to clipboard!", ToastAndroid.SHORT);
    } else {
      Alert.alert("Copied!", "Response copied to clipboard");
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
          paddingBottom: insets.bottom || 20,
        },
      ]}
    >
      <View style={styles.header}>
        <Text variant='subheading' style={styles.title}>
          Fluttr Assistant
        </Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name='close' size={24} color='#333' />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text variant='body' style={styles.prompt}>
          Paste the message you received 👇
        </Text>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder='Paste message here...'
          multiline
        />

        <View style={styles.toneSelector}>
          <TouchableOpacity
            style={[
              styles.toneButton,
              selectedTone === "flirty" && styles.selectedTone,
            ]}
            onPress={() => setSelectedTone("flirty")}
          >
            <Text
              variant='small'
              style={[
                styles.toneText,
                selectedTone === "flirty" && styles.selectedToneText,
              ]}
            >
              🥰 Flirty
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toneButton,
              selectedTone === "witty" && styles.selectedTone,
            ]}
            onPress={() => setSelectedTone("witty")}
          >
            <Text
              variant='small'
              style={[
                styles.toneText,
                selectedTone === "witty" && styles.selectedToneText,
              ]}
            >
              😎 Witty
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toneButton,
              selectedTone === "sweet" && styles.selectedTone,
            ]}
            onPress={() => setSelectedTone("sweet")}
          >
            <Text
              variant='small'
              style={[
                styles.toneText,
                selectedTone === "sweet" && styles.selectedToneText,
              ]}
            >
              💖 Sweet
            </Text>
          </TouchableOpacity>
        </View>

        {message.length > 0 ? (
          <ScrollView style={styles.repliesContainer}>
            <Text variant='subheading' style={styles.repliesTitle}>
              Suggested Replies:
            </Text>
            {replies.map((reply, index) => (
              <View key={index} style={styles.replyCard}>
                <Text style={styles.replyText}>{reply}</Text>
                <TouchableOpacity
                  style={styles.copyButton}
                  onPress={() => copyToClipboard(reply)}
                >
                  <Ionicons name='copy-outline' size={20} color='#FF4785' />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyState}>
            <Text variant='body' style={styles.emptyStateText}>
              Enter your crush's message to get suggested replies
            </Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    paddingHorizontal: 20,
    paddingTop: 15,
    height: Dimensions.get("window").height * 0.6,
    zIndex: 1000,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontWeight: "bold",
    color: Colors.pink,
  },
  closeButton: {
    padding: 5,
  },
  content: {
    flex: 1,
  },
  prompt: {
    marginBottom: 10,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 12,
    minHeight: normalize(80),
    marginBottom: 15,
    backgroundColor: "#F8F8F8",
  },
  toneSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  toneButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
  },
  selectedTone: {
    backgroundColor: Colors.pink,
  },
  toneText: {
    fontWeight: "500",
    color: Colors.mediumText,
  },
  selectedToneText: {
    color: Colors.white,
  },
  repliesContainer: {
    flex: 1,
  },
  repliesTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  replyCard: {
    backgroundColor: Colors.graywhite,
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  replyText: {
    flex: 1,
    marginRight: 10,
  },
  copyButton: {
    padding: 5,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    color: Colors.mediumText,
    textAlign: "center",
  },
});

export default AssistantPanel;
