import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AssistantContextType {
  isAssistantEnabled: boolean;
  toggleAssistantEnabled: () => Promise<void>;
  isAssistantVisible: boolean;
  showAssistant: () => void;
  hideAssistant: () => void;
}

const AssistantContext = createContext<AssistantContextType | undefined>(
  undefined
);

export const ASSISTANT_ENABLED_KEY = "fluttr_assistant_enabled";

export const AssistantProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAssistantEnabled, setIsAssistantEnabled] = useState<boolean>(false);
  const [isAssistantVisible, setIsAssistantVisible] = useState<boolean>(false);

  // Load assistant enabled status from AsyncStorage on component mount
  useEffect(() => {
    const loadAssistantStatus = async () => {
      try {
        const storedValue = await AsyncStorage.getItem(ASSISTANT_ENABLED_KEY);
        // Default to enabled if not set
        setIsAssistantEnabled(
          storedValue === null ? true : storedValue === "true"
        );
      } catch (error) {
        console.error("Error loading assistant status:", error);
        // Default to enabled if error occurs
        setIsAssistantEnabled(true);
      }
    };

    loadAssistantStatus();
  }, []);

  const toggleAssistantEnabled = async () => {
    try {
      const newValue = !isAssistantEnabled;
      await AsyncStorage.setItem(ASSISTANT_ENABLED_KEY, newValue.toString());
      setIsAssistantEnabled(newValue);

      // If turning off, also hide the assistant
      if (!newValue) {
        setIsAssistantVisible(false);
      }

      // Removed return statement to match the expected Promise<void> type
    } catch (error) {
      console.error("Error saving assistant status:", error);
      // Ensure no value is returned to match the expected Promise<void> type
    }
  };

  const showAssistant = () => {
    if (isAssistantEnabled) {
      setIsAssistantVisible(true);
    }
  };

  const hideAssistant = () => {
    setIsAssistantVisible(false);
  };

  return (
    <AssistantContext.Provider
      value={{
        isAssistantEnabled,
        toggleAssistantEnabled,
        isAssistantVisible,
        showAssistant,
        hideAssistant,
      }}
    >
      {children}
    </AssistantContext.Provider>
  );
};

export const useAssistant = () => {
  const context = useContext(AssistantContext);
  if (context === undefined) {
    throw new Error("useAssistant must be used within an AssistantProvider");
  }
  return context;
};
