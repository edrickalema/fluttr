// CallAssistantContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { AppState, AppStateStatus } from "react-native";
// import * as Permissions from "expo-permissions";
import { Audio } from "expo-av";

// Define the shape of our context
interface CallAssistantContextProps {
  isActive: boolean;
  hasPermissions: boolean;
  isInForeground: boolean;
  activateAssistant: () => Promise<void>;
  deactivateAssistant: () => void;
  checkPermissions: () => Promise<boolean>;
  requestPermissions: () => Promise<boolean>;
}

// Create the context with a default value
const CallAssistantContext = createContext<CallAssistantContextProps>({
  isActive: false,
  hasPermissions: false,
  isInForeground: true,
  activateAssistant: async () => {},
  deactivateAssistant: () => {},
  checkPermissions: async () => false,
  requestPermissions: async () => false,
});

// Custom hook to use the context
export const useCallAssistantContext = () => useContext(CallAssistantContext);

// Provider component
interface CallAssistantProviderProps {
  children: ReactNode;
}

export const CallAssistantProvider: React.FC<CallAssistantProviderProps> = ({
  children,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [isInForeground, setIsInForeground] = useState(true);

  // Check app state to ensure we're only running when in foreground
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      setIsInForeground(nextAppState === "active");

      // If app goes to background, we need to deactivate the assistant
      if (nextAppState !== "active" && isActive) {
        deactivateAssistant();
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, [isActive]);

  // Check permissions on mount
  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async (): Promise<boolean> => {
    try {
      const { status } = await Audio.getPermissionsAsync();
      const hasPermission = status === "granted";
      setHasPermissions(hasPermission);
      return hasPermission;
    } catch (error) {
      console.error("Failed to check microphone permissions:", error);
      setHasPermissions(false);
      return false;
    }
  };

  const requestPermissions = async (): Promise<boolean> => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      const hasPermission = status === "granted";
      setHasPermissions(hasPermission);
      return hasPermission;
    } catch (error) {
      console.error("Failed to request microphone permissions:", error);
      setHasPermissions(false);
      return false;
    }
  };

  const activateAssistant = async (): Promise<void> => {
    // First ensure we have permissions
    const permissionsGranted = hasPermissions || (await requestPermissions());

    if (!permissionsGranted) {
      console.error(
        "Cannot activate assistant: microphone permissions not granted"
      );
      return;
    }

    // Only activate if app is in foreground
    if (isInForeground) {
      setIsActive(true);
      // Additional setup logic could go here
      console.log("Call Assistant activated");
    } else {
      console.error("Cannot activate assistant: app is not in foreground");
    }
  };

  const deactivateAssistant = (): void => {
    setIsActive(false);
    // Cleanup logic could go here
    console.log("Call Assistant deactivated");
  };

  // Context value to be provided
  const value: CallAssistantContextProps = {
    isActive,
    hasPermissions,
    isInForeground,
    activateAssistant,
    deactivateAssistant,
    checkPermissions,
    requestPermissions,
  };

  return (
    <CallAssistantContext.Provider value={value}>
      {children}
    </CallAssistantContext.Provider>
  );
};
