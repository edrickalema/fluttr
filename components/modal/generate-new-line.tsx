// components/home/GenerateLineModal.tsx
import { Colors } from "@/constants/colors";
import { globalStyles } from "@/constants/globalStyles";
import { usePickupLineGenerator } from "@/hooks/usePickupuplineGenerator";
import { steps } from "@/utils/get-pickup-steps";
import { normalize } from "@/utils/responsive";
import { ChevronRight, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import Animated, {
  FadeIn,
  FadeInRight,
  FadeOut,
  FadeOutLeft,
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

  const { pickupLine, isLoading, error, generateLine } =
    usePickupLineGenerator();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      generateLine(formData);
      console.log(formData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
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

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  
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
              {currentStep === 0 ? (
                <X size={24} color={Colors.darkText} />
              ) : (
                <ChevronRight
                  size={24}
                  color={Colors.darkText}
                  style={{ transform: [{ rotate: "180deg" }] }}
                />
              )}
            </TouchableOpacity>
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
            <View style={{ width: 24 }} />
          </View>

          {/* Content */}
          <ScrollView contentContainerStyle={styles.content}>
            <Animated.View
              entering={FadeInRight}
              exiting={FadeOutLeft}
              key={currentStep}
              style={styles.stepContainer}
            >
              <View style={styles.iconContainer}>
                <currentStepData.icon size={32} color={Colors.pink} />
              </View>

              <Text style={styles.stepTitle}>{currentStepData.title}</Text>
              <Text style={styles.stepDescription}>
                {currentStepData.description}
              </Text>

              {currentStepData.isInfoOnly && (
                <Text
                  style={StyleSheet.flatten([
                    globalStyles.text,
                    globalStyles.card,
                  ])}
                >
                  {currentStepData.info}
                </Text>
              )}

              {currentStepData.isInfoOnly ? (
                ""
              ) : (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder={currentStepData.placeholder}
                    placeholderTextColor='#999'
                    multiline
                    value={
                      formData[currentStepData.field as keyof typeof formData]
                    }
                    onChangeText={(text) =>
                      updateField(currentStepData.field, text)
                    }
                  />
                  <View
                    style={{
                      width: "100%",
                      padding: normalize(10),

                      borderRadius: normalize(15),
                      marginTop: normalize(10),
                      flexDirection: "row",
                      gap: normalize(10),
                    }}
                  >
                    {currentStepData.examples && (
                      <View
                        style={{
                          maxHeight: normalize(150),
                          marginVertical: normalize(8),
                        }}
                      >
                        <Text
                          style={[
                            globalStyles.text,
                            {
                              color: Colors.darkText,
                              fontSize: normalize(12),
                              marginBottom: normalize(5),
                              textAlign: "left",
                            },
                          ]}
                        >
                          Examples
                        </Text>
                        <FlatList
                          data={currentStepData.examples}
                          keyExtractor={(_, index) => `example-${index}`}
                          horizontal={true}
                          scrollEnabled={true}
                          nestedScrollEnabled={true}
                          showsHorizontalScrollIndicator={false}
                          contentContainerStyle={{
                            paddingBottom: normalize(5),
                          }}
                          renderItem={({ item }) => (
                            <Text
                              style={[
                                {
                                  color: Colors.mediumText,
                                  marginTop: normalize(5),
                                  fontSize: normalize(10),
                                  backgroundColor: Colors.cream,
                                  padding: normalize(7),
                                  borderRadius: normalize(4),
                                  marginHorizontal: normalize(5),
                                },
                              ]}
                            >
                              {item}
                            </Text>
                          )}
                        />
                      </View>
                    )}
                  </View>
                </>
              )}
            </Animated.View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                globalStyles.button,
                currentStep === 0
                  ? undefined
                  : currentStepData.isInfoOnly == false
                  ? !formData[currentStepData.field as keyof typeof formData]
                    ? styles.buttonDisabled
                    : undefined
                  : undefined,
              ]}
              onPress={handleNext}
              disabled={
                currentStep === 0
                  ? false
                  : currentStepData.isInfoOnly == true
                  ? false
                  : !formData[currentStepData.field as keyof typeof formData]
              }
            >
              <Text style={globalStyles.buttonText}>
                {currentStep === 0 ? (
                  "Let's start"
                ) : isLastStep ? (
                  isLoading ? (
                    "Get your Line"
                  ) : (
                    <ActivityIndicator />
                  )
                ) : (
                  "Next"
                )}
              </Text>
            </TouchableOpacity>
          </View>
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
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
    width: normalize(40),
    height: normalize(40),
    borderRadius: normalize(20),
    backgroundColor: Colors.backgroundMuted || "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },

  progressContainer: {
    flexDirection: "row",
    gap: normalize(8),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: normalize(10),
  },

  progressDot: {
    width: normalize(8),
    height: normalize(8),
    borderRadius: normalize(4),
    backgroundColor: Colors.placeholder || "#E0E0E0",
  },

  progressDotActive: {
    width: normalize(16),
    backgroundColor: Colors.pink,
  },

  content: {
    minHeight: normalize(200),
  },

  stepContainer: {
    padding: normalize(20),
    alignItems: "center",
  },

  iconContainer: {
    width: normalize(60),
    height: normalize(60),
    borderRadius: normalize(30),
    backgroundColor: Colors.cream,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: normalize(20),
  },

  stepTitle: {
    color: Colors.darkText,
    textAlign: "center",
    marginBottom: normalize(10),
  },

  stepDescription: {
    color: Colors.mediumText,
    textAlign: "center",
    marginBottom: normalize(20),
  },

  input: {
    width: "100%",
    minHeight: normalize(100),
    backgroundColor: Colors.inputBackground || "#F5F5F5",
    borderRadius: normalize(15),
    padding: normalize(15),

    color: Colors.textPrimary,
    textAlignVertical: "top",
  },

  footer: {
    padding: normalize(20),
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight || "#F0F0F0",
  },

  buttonDisabled: {
    backgroundColor: Colors.disabled || "#CCCCCC",
  },
});
