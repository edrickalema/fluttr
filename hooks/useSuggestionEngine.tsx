import { useState } from "react";

interface Suggestion {
  id: string;
  text: string;
  type: "icebreaker" | "response" | "question" | "compliment";
}

const useSuggestionEngine = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateSuggestions = async (transcriptText: string) => {
    setIsLoading(true);

    try {
      // Call your backend API (Groq/GPT)
      const response = await fetch("https://your-backend-api.com/suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transcript: transcriptText,
          context: "romantic_call",
        }),
      });

      const data = await response.json();

      // Process and add new suggestions
      if (data.suggestions && data.suggestions.length > 0) {
        setSuggestions(data.suggestions);
        // Trigger haptic feedback when new suggestions arrive
        triggerHapticFeedback();
      }
    } catch (error) {
      console.error("Failed to generate suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerHapticFeedback = () => {
    // Import and use Haptics from 'expo-haptics' here
    // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return {
    suggestions,
    isLoading,
    generateSuggestions,
  };
};

export default useSuggestionEngine;
