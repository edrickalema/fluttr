// hooks/useSpeechRecognition.ts
import { useState, useEffect, useCallback, useRef } from "react";
import { AppState, AppStateStatus, Platform } from "react-native";
import * as Speech from "expo-speech-recognition";
import { Audio } from "expo-av";

interface UseSpeechRecognitionOptions {
  onTextResult?: (text: string) => void;
  onPartialResult?: (text: string) => void;
  onError?: (error: any) => void;
  autoRestart?: boolean;
  continuous?: boolean;
  timeSlice?: number; // milliseconds between recognition attempts
}

interface UseSpeechRecognitionReturn {
  isListening: boolean;
  transcript: string;
  partialTranscript: string;
  startListening: () => Promise<void>;
  stopListening: () => Promise<void>;
  resetTranscript: () => void;
  error: string | null;
  hasPermission: boolean;
  requestPermission: () => Promise<boolean>;
}

/**
 * Hook for speech recognition functionality that works within Expo limits
 */
const useSpeechRecognition = ({
  onTextResult,
  onPartialResult,
  onError,
  autoRestart = true,
  continuous = true,
  timeSlice = 5000, // 5 seconds default
}: UseSpeechRecognitionOptions = {}): UseSpeechRecognitionReturn => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [partialTranscript, setPartialTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  // Reference to store the recognition instance
  const recognitionRef = useRef<any>(null);

  // Timeout reference for continuous mode
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Track if component is mounted
  const isMountedRef = useRef(true);

  // App state tracking
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    // Check initial permissions
    checkPermission();

    // Set up app state listener
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === "active" &&
        isListening
      ) {
        // App has come back to foreground, restart listening if it was active
        restartListening();
      } else if (
        appStateRef.current === "active" &&
        nextAppState.match(/inactive|background/) &&
        isListening
      ) {
        // App is going to background, stop listening
        internalStopListening();
      }

      appStateRef.current = nextAppState;
    });

    // Cleanup function
    return () => {
      isMountedRef.current = false;
      subscription.remove();

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (recognitionRef.current) {
        Speech.stopSpeechRecognitionAsync();
      }
    };
  }, []);

  // Check for permission
  const checkPermission = async () => {
    try {
      const { status } = await Audio.getPermissionsAsync();
      const hasAudioPermission = status === "granted";

      if (isMountedRef.current) {
        setHasPermission(hasAudioPermission);
      }

      return hasAudioPermission;
    } catch (err) {
      if (isMountedRef.current) {
        setError("Failed to check microphone permission");
        setHasPermission(false);
      }
      return false;
    }
  };

  // Request permission
  const requestPermission = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      const granted = status === "granted";

      if (isMountedRef.current) {
        setHasPermission(granted);
      }

      return granted;
    } catch (err) {
      if (isMountedRef.current) {
        setError("Failed to request microphone permission");
        setHasPermission(false);
      }
      return false;
    }
  };

  // Start listening
  const startListening = async () => {
    if (!hasPermission) {
      const granted = await requestPermission();
      if (!granted) {
        setError("Microphone permission is required");
        return;
      }
    }

    try {
      setError(null);
      await Speech.stopSpeechRecognitionAsync(); // Ensure no other instance is running

      recognitionRef.current = await Speech.startSpeechRecognitionAsync({
        language: "en-US",
        onPartialResults: (results:any) => {
          const partialText = results.value[0] || "";
          if (isMountedRef.current) {
            setPartialTranscript(partialText);
            if (onPartialResult) onPartialResult(partialText);
          }
        },
        onResults: (results:any) => {
          const finalText = results.value[0] || "";
          if (isMountedRef.current) {
            setPartialTranscript("");
            if (finalText.trim()) {
              setTranscript((prev) => {
                const newTranscript = prev ? `${prev} ${finalText}` : finalText;
                if (onTextResult) onTextResult(newTranscript);
                return newTranscript;
              });
            }

            // If continuous mode, restart listening after a brief pause
            if (continuous && isMountedRef.current) {
              timeoutRef.current = setTimeout(() => {
                if (isMountedRef.current && isListening) {
                  startListening();
                }
              }, 300); // Small delay before restarting
            }
          }
        },
        onError: (err:any) => {
          if (isMountedRef.current) {
            console.error("Speech recognition error:", err);
            setError(`Recognition error: ${err.message || "Unknown error"}`);
            if (onError) onError(err);

            // Restart if set to auto-restart
            if (autoRestart && isMountedRef.current && isListening) {
              timeoutRef.current = setTimeout(() => {
                if (isMountedRef.current && isListening) {
                  startListening();
                }
              }, 1000); // Wait a second before retrying
            }
          }
        },
      });

      if (isMountedRef.current) {
        setIsListening(true);
      }
    } catch (err) {
      if (isMountedRef.current) {
        console.error("Failed to start speech recognition:", err);
        setError(
          `Failed to start recognition: ${
            (err as Error).message || "Unknown error"
          }`
        );
        setIsListening(false);
        if (onError) onError(err);
      }
    }
  };

  // Internal stop function (doesn't update state)
  const internalStopListening = async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        await Speech.stopSpeechRecognitionAsync();
        recognitionRef.current = null;
      } catch (err) {
        console.error("Error stopping speech recognition:", err);
      }
    }
  };

  // Public stop function (updates state)
  const stopListening = async () => {
    await internalStopListening();

    if (isMountedRef.current) {
      setIsListening(false);
      setPartialTranscript("");
    }
  };

  // Reset transcript
  const resetTranscript = () => {
    setTranscript("");
    setPartialTranscript("");
  };

  // Restart listening (used when app comes back to foreground)
  const restartListening = async () => {
    await internalStopListening();
    if (isMountedRef.current) {
      startListening();
    }
  };

  return {
    isListening,
    transcript,
    partialTranscript,
    startListening,
    stopListening,
    resetTranscript,
    error,
    hasPermission,
    requestPermission,
  };
};

export default useSpeechRecognition;
