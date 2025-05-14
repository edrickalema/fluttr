// services/suggestionsApi.ts
import { useState } from "react";

// Define the types for our suggestion system
export interface Suggestion {
  id: string;
  text: string;
  type: "icebreaker" | "response" | "question" | "compliment";
}

interface SuggestionsResponse {
  suggestions: Suggestion[];
}

interface SuggestionsErrorResponse {
  error: string;
}

interface CallContext {
  transcriptHistory: string[];
  dateStage: "first_meeting" | "early_dating" | "established";
  userPreferences: {
    flirtLevel: number; // 1-10 scale
    humor: boolean;
    depth: boolean;
  };
  mood?: string;
}

// API configuration
const API_ENDPOINT = "https://your-backend-api.com/suggestions";
const API_KEY = "YOUR_API_KEY"; // Store securely, e.g., in environment variables

export const generateSuggestions = async (
  transcript: string,
  context: CallContext
): Promise<Suggestion[]> => {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        transcript,
        context,
      }),
    });

    if (!response.ok) {
      const errorData: SuggestionsErrorResponse = await response.json();
      throw new Error(errorData.error || "Failed to generate suggestions");
    }

    const data: SuggestionsResponse = await response.json();
    return data.suggestions;
  } catch (error) {
    console.error("Error generating suggestions:", error);
    return [];
  }
};

// Example payload to send to your LLM backend
export const createPromptPayload = (
  transcript: string,
  context: CallContext
) => {
  return {
    model: "gpt-4-turbo", // or your preferred AI model
    messages: [
      {
        role: "system",
        content: `You are a romantic call assistant for the Fluttr app. Your goal is to help the user 
        maintain a smooth, engaging conversation with their romantic interest.
        
        Based on the call transcript, generate 3-4 helpful suggestions that are:
        1. Natural and conversational (not scripted-sounding)
        2. Appropriate for the dating stage (${context.dateStage})
        3. Match the user's preferred flirt level (${
          context.userPreferences.flirtLevel
        }/10)
        4. Include humor: ${context.userPreferences.humor ? "Yes" : "No"}
        5. Include depth: ${context.userPreferences.depth ? "Yes" : "No"}
        
        Each suggestion should be categorized as one of:
        - icebreaker: To start conversation or change topics
        - response: Direct replies to what was just said
        - question: Thoughtful questions to keep conversation going
        - compliment: Genuine, specific compliments (not generic)`,
      },
      {
        role: "user",
        content: `Current conversation transcript: "${transcript}"`,
      },
    ],
    temperature: 0.7,
    max_tokens: 150,
  };
};

// Custom hook to interface with the suggestion API
export const useSuggestionAPI = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestions = async (transcript: string, context: CallContext) => {
    setIsLoading(true);
    setError(null);

    try {
      const newSuggestions = await generateSuggestions(transcript, context);
      setSuggestions(newSuggestions);
    } catch (err) {
      setError((err as Error).message || "Failed to fetch suggestions");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    suggestions,
    isLoading,
    error,
    fetchSuggestions,
  };
};
