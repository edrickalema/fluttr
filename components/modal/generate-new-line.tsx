import { Colors } from "@/constants/colors";
import { globalStyles } from "@/constants/globalStyles";
import useFavoriteLines from "@/hooks/useFavoriteLines";
import { usePickupLineGenerator } from "@/hooks/usePickupuplineGenerator";
import { steps } from "@/utils/get-pickup-steps";
import { normalize } from "@/utils/responsive";
import {
  ChevronRight,
  Copy,
  Heart,
  Share,
  X,
  ArrowLeft,
  ArrowRight,
  Loader,
  Sparkles,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Clipboard,
  Dimensions,
  FlatList,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";

import Animated, {
  Easing,
  FadeIn,
  FadeInRight,
  FadeOut,
  FadeOutLeft,
  SlideInRight,
  SlideOutLeft,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

interface GenerateLineModalProps {
  visible: boolean;
  onClose: () => void;
  onGenerate: (data: any) => void;
}

export default function GenerateLineModal({
  visible,
  onClose,
  onGenerate,
}: GenerateLineModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    appearance: "",
    personality: "",
    sharedInterests: "",
    context: "",
    tone: "",
  });
  const { addToFavorites, checkIsFavorite } = useFavoriteLines();
  const [showResults, setShowResults] = useState(false);
  const [pickupLines, setPickupLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  // Animation values
  const rotation = useSharedValue(0);
  const bounce = useSharedValue(0);
  const sparkle = useSharedValue(0);

  const { pickupLine, isLoading, error, generateLine } =
    usePickupLineGenerator();

  useEffect(() => {
    if (pickupLine && !isLoading) {
      try {
        const parsedData =
          typeof pickupLine === "string" ? JSON.parse(pickupLine) : pickupLine;
        if (parsedData.lines && Array.isArray(parsedData.lines)) {
          setPickupLines(parsedData.lines);
          setShowResults(true);
          onGenerate(parsedData);
        }
      } catch (e) {
        console.error("Error parsing pickup line data:", e);
      }
    }
  }, [pickupLine, isLoading]);

  // Check if current line is a favorite
  useEffect(() => {
    if (pickupLines.length > 0) {
      checkIsFavorite(pickupLines[currentLineIndex]).then(setIsFavorite);
    }
  }, [currentLineIndex, pickupLines]);

  // Setup animations when loading
  useEffect(() => {
    if (isLoading) {
      rotation.value = withRepeat(
        withTiming(360, { duration: 2000, easing: Easing.linear }),
        -1
      );
      bounce.value = withRepeat(
        withTiming(1, {
          duration: 1500,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }),
        -1,
        true
      );
      sparkle.value = withRepeat(
        withTiming(1, { duration: 800, easing: Easing.ease }),
        -1,
        true
      );
    } else {
      rotation.value = 0;
      bounce.value = 0;
      sparkle.value = 0;
    }
  }, [isLoading]);

  const pulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: interpolate(bounce.value, [0, 1], [1, 1.15]) }],
    };
  });

  const rotateStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${rotation.value}deg` }],
    };
  });

  const sparkleStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(sparkle.value, [0, 0.5, 1], [0.2, 1, 0.2]),
      transform: [
        { scale: interpolate(sparkle.value, [0, 0.5, 1], [0.8, 1.1, 0.8]) },
      ],
    };
  });

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      generateLine(formData);
    }
  };

  const handleBack = () => {
    if (showResults) {
      setShowResults(false);
      setPickupLines([]);
      setCurrentLineIndex(0);
    } else if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      onClose();
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const copyToClipboard = (text: string) => {
    Clipboard.setString(text);
    if (Platform.OS === "android") {
      ToastAndroid.show("Copied to clipboard!", ToastAndroid.SHORT);
    } else {
      Alert.alert("Copied!", "Text copied to clipboard.");
    }
  };

  const handleShare = (text: string) => {
    // You would implement share functionality here
    // For now we'll just show an alert
    Alert.alert("Share", "Share functionality would go here");
  };

  const handleFavorite = async (text: string) => {
    try {
      // Check if already in favorites
      const isAlreadyFavorite = await checkIsFavorite(text);

      if (isAlreadyFavorite) {
        Alert.alert(
          "Already Saved",
          "This pickup line is already in your favorites."
        );
        return;
      }

      // Save to favorites
      const success = await addToFavorites(text);

      if (success) {
        setIsFavorite(true);
        Alert.alert("Saved!", "Added to favorites successfully.");
      } else {
        Alert.alert("Error", "Unable to add to favorites. Please try again.");
      }
    } catch (error) {
      console.error("Error handling favorite:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  const navigateLines = (direction: "next" | "prev") => {
    if (direction === "next" && currentLineIndex < pickupLines.length - 1) {
      setCurrentLineIndex(currentLineIndex + 1);
    } else if (direction === "prev" && currentLineIndex > 0) {
      setCurrentLineIndex(currentLineIndex - 1);
    }
  };

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const renderLoadingContent = () => (
    <Animated.View entering={FadeIn} style={styles.loadingContainer}>
      <Animated.View style={[styles.loaderCircle, pulseStyle]}>
        <Animated.View style={[styles.loaderInner, rotateStyle]}>
          <Loader size={28} color={Colors.pink} />
        </Animated.View>
      </Animated.View>
      <Text style={styles.loadingText}>
        Crafting the perfect pickup line...
      </Text>
      <Text style={styles.loadingSubtext}>This might take a moment</Text>

      <Animated.View style={[styles.sparkleContainer, sparkleStyle]}>
        <Sparkles size={20} color={Colors.pink} style={styles.sparkleIcon} />
      </Animated.View>
    </Animated.View>
  );

  const renderResultContent = () => (
    <Animated.View
      entering={FadeIn.duration(500)}
      style={styles.resultContainer}
    >
      <View style={styles.resultHeader}>
        <Text style={styles.resultTitle}>Your Pickup Line</Text>
        <View style={styles.resultTagline}>
          <Sparkles size={16} color={Colors.pink} />
          <Text style={styles.resultSubtitle}>Swipe to see alternatives</Text>
        </View>
      </View>

      <View style={styles.lineContainer}>
        <TouchableOpacity
          disabled={currentLineIndex === 0}
          onPress={() => navigateLines("prev")}
          style={[
            styles.navButton,
            currentLineIndex === 0 && styles.navButtonDisabled,
          ]}
        >
          <ArrowLeft
            size={20}
            color={currentLineIndex === 0 ? Colors.mediumText : Colors.pink}
          />
        </TouchableOpacity>

        <Animated.View
          entering={SlideInRight.duration(300)}
          exiting={SlideOutLeft.duration(300)}
          key={`line-${currentLineIndex}`}
          style={styles.pickupLine}
        >
          <Text style={styles.pickupLineText}>
            {pickupLines[currentLineIndex]}
          </Text>
          <View style={styles.pickupLineIndicator}>
            {pickupLines.map((_, index) => (
              <View
                key={`indicator-${index}`}
                style={[
                  styles.pickupLineIndicatorDot,
                  index === currentLineIndex &&
                    styles.pickupLineIndicatorDotActive,
                ]}
              />
            ))}
          </View>
        </Animated.View>

        <TouchableOpacity
          disabled={currentLineIndex === pickupLines.length - 1}
          onPress={() => navigateLines("next")}
          style={[
            styles.navButton,
            currentLineIndex === pickupLines.length - 1 &&
              styles.navButtonDisabled,
          ]}
        >
          <ArrowRight
            size={20}
            color={
              currentLineIndex === pickupLines.length - 1
                ? Colors.mediumText
                : Colors.pink
            }
          />
        </TouchableOpacity>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => copyToClipboard(pickupLines[currentLineIndex])}
        >
          <View style={styles.actionButtonIcon}>
            <Copy size={20} color={Colors.white} />
          </View>
          <Text style={styles.actionButtonText}>Copy</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleShare(pickupLines[currentLineIndex])}
        >
          <View style={styles.actionButtonIcon}>
            <Share size={20} color={Colors.white} />
          </View>
          <Text style={styles.actionButtonText}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleFavorite(pickupLines[currentLineIndex])}
        >
          <View
            style={[
              styles.actionButtonIcon,
              isFavorite && styles.favoriteButtonIcon,
            ]}
          >
            <Heart
              size={20}
              color={Colors.white}
              fill={isFavorite ? Colors.white : "none"}
            />
          </View>
          <Text style={styles.actionButtonText}>
            {isFavorite ? "Favorited" : "Favorite"}
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderExampleChips = (examples: string[]) => (
    <View style={styles.examplesContainer}>
      <Text style={styles.examplesLabel}>Examples</Text>
      <View style={styles.examplesChipsContainer}>
        {examples.map((example, index) => (
          <TouchableOpacity
            key={`example-${index}`}
            style={styles.exampleChip}
            onPress={() => updateField(currentStepData.field, example)}
          >
            <Text style={styles.exampleChipText}>{example}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View style={styles.overlay}>
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          style={styles.modalContainer}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.closeButton}>
              {currentStep === 0 && !isLoading && !showResults ? (
                <X size={24} color={Colors.darkText} />
              ) : (
                <ArrowLeft size={24} color={Colors.darkText} />
              )}
            </TouchableOpacity>
            {!isLoading && !showResults && (
              <View style={styles.progressContainer}>
                {steps.map((step, index) => (
                  <View
                    key={step.id}
                    style={[
                      styles.progressDot,
                      index <= currentStep && styles.progressDotActive,
                    ]}
                  />
                ))}
              </View>
            )}
            <View style={{ width: 24 }} />
          </View>

          {/* Content */}
          {isLoading ? (
            renderLoadingContent()
          ) : showResults ? (
            renderResultContent()
          ) : (
            <ScrollView
              contentContainerStyle={styles.content}
              showsVerticalScrollIndicator={false}
            >
              <Animated.View
                entering={FadeInRight}
                exiting={FadeOutLeft}
                key={currentStep}
                style={styles.stepContainer}
              >
                <View style={styles.iconContainer}>
                  {React.createElement(currentStepData.icon, {
                    size: 32,
                    color: Colors.pink,
                  })}
                </View>

                <Text style={styles.stepTitle}>{currentStepData.title}</Text>
                <Text style={styles.stepDescription}>
                  {currentStepData.description}
                </Text>

                {currentStepData.isInfoOnly ? (
                  <View style={styles.infoCard}>
                    <Text style={styles.infoCardText}>
                      {currentStepData.info}
                    </Text>
                  </View>
                ) : (
                  <>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.input}
                        placeholder={currentStepData.placeholder}
                        placeholderTextColor={Colors.placeholder}
                        multiline
                        value={
                          formData[
                            currentStepData.field as keyof typeof formData
                          ]
                        }
                        onChangeText={(text) =>
                          updateField(currentStepData.field, text)
                        }
                      />
                    </View>

                    {currentStepData.examples &&
                      renderExampleChips(currentStepData.examples)}
                  </>
                )}
              </Animated.View>
            </ScrollView>
          )}

          {/* Footer */}
          {!isLoading && !showResults && (
            <View style={styles.footer}>
              <TouchableOpacity
                style={[
                  globalStyles.button,
                  currentStep === 0
                    ? styles.primaryButton
                    : currentStepData.isInfoOnly === false
                    ? !formData[currentStepData.field as keyof typeof formData]
                      ? styles.buttonDisabled
                      : styles.primaryButton
                    : styles.primaryButton,
                ]}
                onPress={handleNext}
                disabled={
                  currentStep === 0
                    ? false
                    : currentStepData.isInfoOnly === true
                    ? false
                    : !formData[currentStepData.field as keyof typeof formData]
                }
              >
                <Text style={globalStyles.buttonText}>
                  {currentStep === 0
                    ? "Let's start"
                    : isLastStep
                    ? "Get your line"
                    : "Next"}
                </Text>
                {currentStep > 0 && !isLastStep && (
                  <ChevronRight size={20} color={Colors.white} />
                )}
                {isLastStep && <Sparkles size={20} color={Colors.white} />}
              </TouchableOpacity>
            </View>
          )}

          {showResults && (
            <View style={styles.footer}>
              <TouchableOpacity
                style={[globalStyles.button, styles.primaryButton]}
                onPress={() => {
                  setShowResults(false);
                  setCurrentStep(0);
                  setFormData({
                    appearance: "",
                    personality: "",
                    sharedInterests: "",
                    context: "",
                    tone: "",
                  });
                }}
              >
                <Text style={globalStyles.buttonText}>Create New Line</Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    margin: 0,
    height: "100%",
  },

  modalContainer: {
    width: width * 0.9,
    maxWidth: 400,
    backgroundColor: Colors.white,
    borderRadius: normalize(20),
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: normalize(15),
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight || "#F0F0F0",
  },

  closeButton: {
    width: normalize(44),
    height: normalize(44),
    borderRadius: normalize(22),
    backgroundColor: Colors.backgroundMuted || "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },

  progressContainer: {
    flexDirection: "row",
    gap: normalize(6),
    justifyContent: "center",
    alignItems: "center",
  },

  progressDot: {
    width: normalize(8),
    height: normalize(8),
    borderRadius: normalize(4),
    backgroundColor: Colors.placeholder || "#E0E0E0",
  },

  progressDotActive: {
    width: normalize(18),
    backgroundColor: Colors.pink,
  },

  content: {
    paddingBottom: normalize(20),
  },

  stepContainer: {
    padding: normalize(20),
    alignItems: "center",
  },

  iconContainer: {
    width: normalize(70),
    height: normalize(70),
    borderRadius: normalize(35),
    backgroundColor: Colors.cream,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: normalize(20),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  stepTitle: {
    fontSize: normalize(20),
    fontWeight: "600",
    color: Colors.darkText,
    textAlign: "center",
    marginBottom: normalize(10),
  },

  stepDescription: {
    fontSize: normalize(14),
    color: Colors.mediumText,
    textAlign: "center",
    marginBottom: normalize(24),
    lineHeight: normalize(20),
    maxWidth: "90%",
  },

  infoCard: {
    width: "100%",
    backgroundColor: Colors.cream,
    borderRadius: normalize(16),
    padding: normalize(20),
    marginBottom: normalize(20),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },

  infoCardText: {
    fontSize: normalize(14),
    color: Colors.darkText,
    lineHeight: normalize(20),
  },

  inputContainer: {
    width: "100%",
    marginBottom: normalize(16),
  },

  input: {
    width: "100%",
    minHeight: normalize(120),
    backgroundColor: Colors.inputBackground || "#F5F5F5",
    borderRadius: normalize(16),
    padding: normalize(16),
    paddingTop: normalize(16),
    color: Colors.darkText,
    textAlignVertical: "top",
    fontSize: normalize(14),
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },

  examplesContainer: {
    width: "100%",
    marginTop: normalize(8),
  },

  examplesLabel: {
    fontSize: normalize(12),
    fontWeight: "500",
    color: Colors.darkText,
    marginBottom: normalize(8),
    marginLeft: normalize(4),
  },

  examplesChipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: normalize(8),
  },

  exampleChip: {
    backgroundColor: Colors.cream,
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(6),
    borderRadius: normalize(12),
    marginBottom: normalize(4),
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },

  exampleChipText: {
    fontSize: normalize(12),
    color: Colors.darkText,
  },

  footer: {
    padding: normalize(20),
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight || "#F0F0F0",
  },

  primaryButton: {
    backgroundColor: Colors.pink,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: normalize(8),
  },

  buttonDisabled: {
    backgroundColor: Colors.disabled || "#CCCCCC",
  },

  // Loading screen styles
  loadingContainer: {
    minHeight: normalize(300),
    justifyContent: "center",
    alignItems: "center",
    padding: normalize(20),
  },

  loaderCircle: {
    width: normalize(90),
    height: normalize(90),
    borderRadius: normalize(45),
    backgroundColor: Colors.cream,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: normalize(24),
  },

  loaderInner: {
    width: normalize(70),
    height: normalize(70),
    borderRadius: normalize(35),
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  loadingText: {
    fontSize: normalize(18),
    fontWeight: "600",
    color: Colors.darkText,
    marginBottom: normalize(8),
  },

  loadingSubtext: {
    fontSize: normalize(14),
    color: Colors.mediumText,
  },

  sparkleContainer: {
    position: "absolute",
    top: normalize(40),
    right: normalize(100),
  },

  sparkleIcon: {
    transform: [{ rotate: "15deg" }],
  },

  // Results styles
  resultContainer: {
    padding: normalize(20),
    minHeight: normalize(300),
  },

  resultHeader: {
    alignItems: "center",
    marginBottom: normalize(24),
  },

  resultTitle: {
    fontSize: normalize(22),
    fontWeight: "600",
    color: Colors.darkText,
    marginBottom: normalize(8),
  },

  resultTagline: {
    flexDirection: "row",
    alignItems: "center",
    gap: normalize(6),
  },

  resultSubtitle: {
    fontSize: normalize(14),
    color: Colors.mediumText,
  },

  lineContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: normalize(24),
  },

  navButton: {
    width: normalize(44),
    height: normalize(44),
    borderRadius: normalize(22),
    backgroundColor: Colors.backgroundMuted || "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },

  navButtonDisabled: {
    backgroundColor: Colors.backgroundMuted || "#F5F5F5",
    opacity: 0.5,
  },

  pickupLine: {
    flex: 1,
    backgroundColor: Colors.cream,
    borderRadius: normalize(16),
    padding: normalize(20),
    marginHorizontal: normalize(12),
    minHeight: normalize(160),
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  pickupLineText: {
    color: Colors.darkText,
    fontSize: normalize(16),
    lineHeight: normalize(24),
    textAlign: "center",
    fontWeight: "500",
  },

  pickupLineIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: normalize(16),
    gap: normalize(6),
  },

  pickupLineIndicatorDot: {
    width: normalize(6),
    height: normalize(6),
    borderRadius: normalize(3),
    backgroundColor: "rgba(0,0,0,0.2)",
  },

  pickupLineIndicatorDotActive: {
    width: normalize(16),
    backgroundColor: Colors.pink,
  },

  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: normalize(16),
  },

  actionButton: {
    alignItems: "center",
    padding: normalize(10),
  },

  actionButtonIcon: {
    width: normalize(44),
    height: normalize(44),
    borderRadius: normalize(22),
    backgroundColor: Colors.pink,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: normalize(8),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },

  favoriteButtonIcon: {
    backgroundColor: Colors.darkText,
  },

  actionButtonText: {
    color: Colors.darkText,
    fontSize: normalize(12),
    fontWeight: "500",
  },
});
