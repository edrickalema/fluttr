// CallAssistantContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { Audio } from "expo-av";
import * as Speech from "expo-speech";
// Removed: import * as Permissions from "expo-permissions";
import { Vibration } from "react-native";
import * as FileSystem from "expo-file-system";

// Mock AI service for generating suggestions
// In production, this would connect to your Groq/GPT backend
const mockAIService = {
  generateSuggestion: async (transcription: string): Promise<string> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 700));

    // Basic keyword matching for demo purposes
    if (transcription.includes("weekend") || transcription.includes("plans")) {
      return "Maybe suggest a picnic at the park this weekend? The weather should be perfect!";
    } else if (
      transcription.includes("movie") ||
      transcription.includes("film")
    ) {
      return "I've been wanting to see that new romantic comedy everyone's talking about. Would you be interested?";
    } else if (
      transcription.includes("dinner") ||
      transcription.includes("eat")
    ) {
      return "I know this cozy little Italian place with the most amazing pasta. We could go there sometime?";
    } else if (
      transcription.includes("music") ||
      transcription.includes("song")
    ) {
      return "What kind of music do you enjoy listening to? I'd love to make you a playlist sometime.";
    } else if (
      transcription.includes("work") ||
      transcription.includes("job")
    ) {
      return "That sounds challenging! What do you enjoy most about what you do?";
    } else if (
      transcription.includes("hobby") ||
      transcription.includes("free time")
    ) {
      return "I've been getting into photography lately. It's so rewarding to capture beautiful moments.";
    } else if (transcription.toLowerCase().includes("how are you")) {
      return "You might say: I'm doing really well today, especially now that I'm talking to you!";
    } else if (transcription.length < 15) {
      return "Ask them about their passions! What excites them most in life?";
    } else {
      const fallbacks = [
        "Maybe ask about their favorite travel destination?",
        "Try complimenting something specific you noticed about them",
        "Share something that made you smile today",
        "Ask what they're looking forward to this week",
        "Find a common interest you both enjoy",
      ];
      return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }
  },
};

// Types
export type TranscriptionSegment = {
  text: string;
  isSelf: boolean;
  timestamp: number;
};

export type Suggestion = {
  id: string;
  text: string;
  timestamp: number;
  used: boolean;
};

type CallAssistantContextType = {
  isActive: boolean;
  startAssistant: () => Promise<void>;
  stopAssistant: () => void;
  transcriptions: TranscriptionSegment[];
  suggestions: Suggestion[];
  markSuggestionAsUsed: (id: string) => void;
  lastTranscriptionText: string;
  isListening: boolean;
  addManualTranscription: (text: string, isSelf: boolean) => void;
};

const CallAssistantContext = createContext<
  CallAssistantContextType | undefined
>(undefined);

export const CallAssistantProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcriptions, setTranscriptions] = useState<TranscriptionSegment[]>(
    []
  );
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [lastTranscriptionText, setLastTranscriptionText] = useState("");

  const recordingRef = useRef<Audio.Recording | null>(null);
  const recognitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      if (recognitionTimeoutRef.current) {
        clearTimeout(recognitionTimeoutRef.current);
      }
      stopRecording();
    };
  }, []);

  // Start speech recognition
  const startAssistant = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();

      if (status !== "granted") {
        console.error("Microphone permission not granted");
        return;
      }

      setIsActive(true);
      startRecording();

      // Add welcome message
      setSuggestions((prev) => [
        ...prev,
        {
          id: `suggestion-${Date.now()}`,
          text: "I'm here to help with your conversation! I'll listen and suggest replies.",
          timestamp: Date.now(),
          used: false,
        },
      ]);

      // Vibrate to indicate assistant is active
      Vibration.vibrate(100);
    } catch (error) {
      console.error("Error starting assistant:", error);
    }
  };

  const stopAssistant = () => {
    setIsActive(false);
    stopRecording();
    if (recognitionTimeoutRef.current) {
      clearTimeout(recognitionTimeoutRef.current);
    }
  };

  const startRecording = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        // interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        // interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      recording.setOnRecordingStatusUpdate((status) => {
        // Handle recording status updates
        if (status.isRecording && status.durationMillis > 4000) {
          // Process audio every ~4 seconds to simulate continuous recognition
          processCurrentAudio();
        }
      });

      await recording.startAsync();
      recordingRef.current = recording;
      setIsListening(true);

      // Set a timeout to process audio periodically
      recognitionTimeoutRef.current = setTimeout(processCurrentAudio, 3000);
    } catch (error) {
      console.error("Error starting recording:", error);
      setIsListening(false);
    }
  };

  const stopRecording = async () => {
    if (recordingRef.current) {
      try {
        await recordingRef.current.stopAndUnloadAsync();
        setIsListening(false);
      } catch (error) {
        console.error("Error stopping recording:", error);
      }
      recordingRef.current = null;
    }
  };

  // Process audio and get transcription
  // In a real app, you'd send this audio to a speech-to-text service
  const processCurrentAudio = async () => {
    if (!recordingRef.current || !isActive) return;

    try {
      // Stop current recording
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      recordingRef.current = null;

      if (!uri) return;

      // In a real app: Send audio file to speech recognition API
      // For our demo, we'll simulate with random "heard" phrases
      simulateTranscription(uri);

      // Start a new recording session
      startRecording();
    } catch (error) {
      console.error("Error processing audio:", error);
      // Restart recording if there was an error
      startRecording();
    }
  };

  // This simulates what would happen when your STT service returns a result
  const simulateTranscription = async (audioUri: string) => {
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // For demo: generate fake transcriptions
    const mockPhrases = [
      { text: "So what do you like to do on weekends?", isSelf: false },
      {
        text: "I've been thinking about trying that new restaurant downtown",
        isSelf: true,
      },
      { text: "Have you seen any good movies lately?", isSelf: false },
      {
        text: "Tell me more about your job, it sounds interesting",
        isSelf: true,
      },
      { text: "Do you have any upcoming travel plans?", isSelf: false },
      { text: "I've been learning to play guitar recently", isSelf: true },
      { text: "What kind of music are you into?", isSelf: false },
    ];

    // Select a random phrase
    const mockTranscription =
      mockPhrases[Math.floor(Math.random() * mockPhrases.length)];

    // Add to transcriptions
    const newTranscription = {
      text: mockTranscription.text,
      isSelf: mockTranscription.isSelf,
      timestamp: Date.now(),
    };

    setTranscriptions((prev) => [...prev, newTranscription]);
    setLastTranscriptionText(mockTranscription.text);

    // Clean up temp file
    try {
      await FileSystem.deleteAsync(audioUri);
    } catch (error) {
      console.error("Error deleting audio file:", error);
    }

    // Generate suggestion if the transcription is from the other person
    if (!mockTranscription.isSelf) {
      generateSuggestion(mockTranscription.text);
    }
  };

  // For manual input when voice recognition isn't clear
  const addManualTranscription = (text: string, isSelf: boolean) => {
    const newTranscription = {
      text,
      isSelf,
      timestamp: Date.now(),
    };

    setTranscriptions((prev) => [...prev, newTranscription]);
    setLastTranscriptionText(text);

    // Generate suggestion if the transcription is from the other person
    if (!isSelf) {
      generateSuggestion(text);
    }
  };

  // Generate a suggestion based on transcription
  const generateSuggestion = async (transcriptionText: string) => {
    try {
      const suggestionText = await mockAIService.generateSuggestion(
        transcriptionText
      );

      const newSuggestion = {
        id: `suggestion-${Date.now()}`,
        text: suggestionText,
        timestamp: Date.now(),
        used: false,
      };

      setSuggestions((prev) => [...prev, newSuggestion]);

      // Vibrate to notify user of new suggestion
      Vibration.vibrate([0, 100, 50, 100]);
    } catch (error) {
      console.error("Error generating suggestion:", error);
    }
  };

  const markSuggestionAsUsed = (id: string) => {
    setSuggestions((prev) =>
      prev.map((suggestion) =>
        suggestion.id === id ? { ...suggestion, used: true } : suggestion
      )
    );
  };

  return (
    <CallAssistantContext.Provider
      value={{
        isActive,
        startAssistant,
        stopAssistant,
        transcriptions,
        suggestions,
        markSuggestionAsUsed,
        lastTranscriptionText,
        isListening,
        addManualTranscription,
      }}
    >
      {children}
    </CallAssistantContext.Provider>
  );
};

export const useCallAssistant = () => {
  const context = useContext(CallAssistantContext);
  if (context === undefined) {
    throw new Error(
      "useCallAssistant must be used within a CallAssistantProvider"
    );
  }
  return context;
};
