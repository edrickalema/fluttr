import { chatSession } from "@/config/gemini-apiConfig";
import { Colors } from "@/constants/colors";
import useFavoriteLines from "@/hooks/useFavoriteLines";
import { normalize } from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
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

const generateAIReplies = async (
  message: string,
  tone: ToneType
): Promise<string[]> => {
  try {
    // Generate prompts based on the tone selected
    const toneDescriptions = {
      flirty: "flirty, playful, and slightly romantic",
      witty: "masculine, feminine, clever, and humorous",
      sweet: "sweet, warm, and affectionate",
    };

    const promptInstructions = `
  I received this message: "${message}"
  
  Please generate 3 different ${toneDescriptions[tone]} responses that I could send back.
  
  Instructions:
  - Each response should be 1-3 sentences maximum
  - Include relevant emojis where appropriate
  - Be conversational and natural
  - Match the ${toneDescriptions[tone]} tone perfectly
  - Respond directly to the content of the message
  - Format as a simple list with no numbering
  - Do not include titles, just be direct to the replies
  - It should be not be by more than 3 words of the original message
  - Should not sound needy and push
  `;

    const result = await chatSession.sendMessage(promptInstructions);
    const responseText = await result.response.text();

    // This is a simple parsing approach - might need to be adjusted based on actual Gemini output format
    let replies = responseText
      .split("\n")
      .filter((line: any) => line.trim() !== "")
      .filter(
        (line: string | string[]) =>
          !line.includes("1.") && !line.includes("2.") && !line.includes("3.")
      )
      .map((line: string) => line.replace(/^[-*•]/, "").trim())
      .filter((line: string | any[]) => line.length > 0)
      .slice(1, 3); // Ensure we only have up to 3 replies

    // If parsing failed or returned less than expected replies, use fallbacks
    if (replies.length < 3) {
      const fallbackReplies = {
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

      // Fill in any missing replies with fallbacks
      while (replies.length < 3) {
        replies.push(fallbackReplies[tone][replies.length]);
      }
    }

    return replies;
  } catch (error) {
    console.error("Error generating replies with Gemini:", error);

    // Fallback responses in case the API fails
    const fallbackReplies = {
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

    return fallbackReplies[tone];
  }
};

const AssistantPanel: React.FC<AssistantPanelProps> = ({
  isVisible,
  onClose,
}) => {
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState("");
  const [selectedTone, setSelectedTone] = useState<ToneType>("flirty");
  const [replies, setReplies] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const panelHeight = Dimensions.get("window").height * 0.6;
  const slideAnim = useRef(new Animated.Value(panelHeight)).current;
  const { addToFavorites } = useFavoriteLines();

  const handlePasteFromClipboard = async () => {
    try {
      const clipboardContent = await Clipboard.getString();
      if (clipboardContent) {
        setMessage(clipboardContent);
        // Feedback to user
        if (Platform.OS === "android") {
          ToastAndroid.show("Message pasted! ✓", ToastAndroid.SHORT);
        }
      }
    } catch (error) {
      console.error("Failed to paste from clipboard:", error);
    }
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
    const fetchReplies = async () => {
      if (message.length > 0) {
        setIsLoading(true);
        try {
          const aiReplies = await generateAIReplies(message, selectedTone);
          setReplies(aiReplies);
        } catch (error) {
          console.error("Error generating replies:", error);
          Alert.alert("Error", "Failed to generate replies. Please try again.");
        } finally {
          setIsLoading(false);
        }
      } else {
        setReplies([]);
      }
    };

    // Add a slight delay to avoid too many API calls when user is actively typing
    const debounceTimer = setTimeout(() => {
      fetchReplies();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [selectedTone, message]);

  const copyToClipboard = (text: string) => {
    Clipboard.setString(text);

    // Show toast or alert based on platform
    if (Platform.OS === "android") {
      ToastAndroid.show("Copied to clipboard! ✓", ToastAndroid.SHORT);
    } else {
      Alert.alert("Copied! ✓", "Response copied to clipboard");
    }
  };

  const handleMessageChange = (text: string) => {
    setMessage(text);
    // Clear replies when user clears input
    if (text.length === 0) {
      setReplies([]);
    }
  };

  const handleToneSelect = (tone: ToneType) => {
    setSelectedTone(tone);

    // If we have a message, this will trigger the useEffect to regenerate replies
    if (message.length > 0) {
      // Feedback to user that we're changing the tone
      if (Platform.OS === "android") {
        ToastAndroid.show(
          `Generating ${tone} replies... ✨`,
          ToastAndroid.SHORT
        );
      }
    }
  };

  const getToneEmoji = (tone: ToneType) => {
    switch (tone) {
      case "flirty":
        return "😏";
      case "witty":
        return "😎";
      case "sweet":
        return "💖";
    }
  };

  const toneLabels = {
    flirty: "Flirty",
    witty: "Witty",
    sweet: "Sweet",
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
      {/* Enhanced header with gradient and animation */}
      <View style={styles.headerContainer}>
        <View style={styles.headerGradient}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Ionicons
                name='sparkles'
                size={20}
                color={Colors.pink}
                style={styles.titleIcon}
              />
              <Text variant='subheading' style={styles.title}>
                Fluttr Assistant
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name='close-circle' size={26} color={Colors.darkText} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.headerUnderline} />
      </View>

      <View style={styles.content}>
        <Text variant='body' style={styles.prompt}>
          ✉️ Paste the message you received
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={handleMessageChange}
            placeholder='Paste message here...'
            placeholderTextColor='#AAAAAA'
            multiline
          />
          <TouchableOpacity
            style={styles.pasteButton}
            onPress={handlePasteFromClipboard}
          >
            <Ionicons name='clipboard-outline' size={22} color={Colors.pink} />
          </TouchableOpacity>
        </View>

        <Text variant='body' style={styles.tonePrompt}>
          🎭 Choose your reply tone
        </Text>

        <View style={styles.toneSelector}>
          {(["flirty", "witty", "sweet"] as ToneType[]).map((tone) => (
            <TouchableOpacity
              key={tone}
              style={[
                styles.toneButton,
                selectedTone === tone && styles.selectedTone,
              ]}
              activeOpacity={0.7}
              onPress={() => handleToneSelect(tone)}
            >
              <Text
                variant='small'
                style={[
                  styles.toneText,
                  selectedTone === tone && styles.selectedToneText,
                ]}
              >
                {getToneEmoji(tone)} {toneLabels[tone]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {message.length > 0 ? (
          <ScrollView
            style={styles.repliesContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.repliesTitleContainer}>
              <Ionicons
                name='chatbubble-ellipses'
                size={18}
                color={Colors.pink}
                style={styles.repliesIcon}
              />
              <Text variant='subheading' style={styles.repliesTitle}>
                Suggested Replies
              </Text>
            </View>

            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size='large' color={Colors.pink} />
                <Text style={styles.loadingText}>
                  ✨ Creating the perfect replies...
                </Text>
              </View>
            ) : (
              replies.map((reply, index) => (
                <View key={index} style={styles.replyCard}>
                  <Text style={styles.replyText}>{reply}</Text>

                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => copyToClipboard(reply)}
                    >
                      <View style={styles.actionButtonInner}>
                        <Ionicons
                          name='copy-outline'
                          size={20}
                          color={Colors.pink}
                        />
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionButton, styles.sendActionButton]}
                      onPress={() => {
                        copyToClipboard(reply);
                        onClose(); // Close panel after sending
                        if (Platform.OS === "android") {
                          ToastAndroid.show(
                            "Reply copied and ready to send! ✓",
                            ToastAndroid.SHORT
                          );
                        } else {
                          Alert.alert(
                            "Ready to send! ✓",
                            "Response copied to clipboard"
                          );
                        }
                      }}
                    >
                      <View style={styles.sendButtonInner}>
                        <Ionicons name='send' size={18} color='#FFFFFF' />
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => {
                        addToFavorites(reply);
                        if (Platform.OS === "android") {
                          ToastAndroid.show(
                            "Added to favorites! ❤️",
                            ToastAndroid.SHORT
                          );
                        }
                      }}
                    >
                      <View style={styles.actionButtonInner}>
                        <Ionicons name='heart' size={20} color={Colors.pink} />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons
              name='chatbubbles'
              size={60}
              color='#E8E8E8'
              style={styles.emptyStateIcon}
            />
            <Text variant='body' style={styles.emptyStateText}>
              Paste your crush's message above to get thoughtful reply
              suggestions
            </Text>
            <Text variant='small' style={styles.emptyStateTip}>
              ✨ We'll help you craft the perfect response
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
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
    paddingTop: 0,
    height: Dimensions.get("window").height * 0.6,
    zIndex: 1000,
  },
  headerContainer: {
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    overflow: "hidden",
  },
  headerGradient: {
    backgroundColor: Colors.cream,
    paddingTop: 15,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  headerUnderline: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.05)",
    marginBottom: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  titleIcon: {
    marginRight: 8,
  },
  title: {
    fontWeight: "bold",
    color: Colors.pink,
    fontSize: 18,
  },
  closeButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  prompt: {
    marginBottom: 8,
    color: Colors.darkText,
    fontWeight: "500",
    fontSize: 15,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    position: "relative",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 16,
    padding: 16,
    paddingRight: 44,
    minHeight: normalize(80),
    backgroundColor: "#F8F8F8",
    fontSize: 15,
    color: Colors.darkText,
  },
  pasteButton: {
    position: "absolute",
    right: 12,
    top: 12,
    padding: 5,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  tonePrompt: {
    marginBottom: 8,
    color: Colors.darkText,
    fontWeight: "500",
    fontSize: 15,
  },
  toneSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  toneButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "transparent",
  },
  selectedTone: {
    backgroundColor: Colors.pink,
    borderColor: "#FF3370",
    shadowColor: Colors.pink,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  },
  toneText: {
    fontWeight: "600",
    color: Colors.mediumText,
    fontSize: 14,
  },
  selectedToneText: {
    color: Colors.white,
  },
  repliesContainer: {
    flex: 1,
    paddingRight: 4,
  },
  repliesTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  repliesIcon: {
    marginRight: 6,
  },
  repliesTitle: {
    fontWeight: "600",
    color: Colors.darkText,
    fontSize: 16,
  },
  replyCard: {
    backgroundColor: Colors.graywhite,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
    shadowColor: Colors.pink,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  replyText: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.darkText,
    marginBottom: 10,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
    paddingTop: 12,
    marginTop: 2,
  },
  actionButton: {
    marginLeft: 10,
  },
  actionButtonInner: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 18,
    backgroundColor: "rgba(255,71,133,0.08)",
  },
  sendActionButton: {
    marginLeft: 14,
    marginRight: 4,
  },
  sendButtonInner: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: Colors.pink,
    shadowColor: Colors.pink,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyStateIcon: {
    marginBottom: 16,
  },
  emptyStateText: {
    color: Colors.mediumText,
    textAlign: "center",
    marginBottom: 8,
    fontSize: 16,
  },
  emptyStateTip: {
    color: Colors.pink,
    textAlign: "center",
    fontSize: 14,
  },
  loadingContainer: {
    paddingVertical: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    color: Colors.mediumText,
    fontSize: 15,
  },
});

export default AssistantPanel;
