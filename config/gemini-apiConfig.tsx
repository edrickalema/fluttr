// // Create a new file called apiConfig.ts

// // Configuration options for the Gemini API
// export interface GeminiApiConfig {
//   // The model to use (e.g., 'gemini-pro')
//   modelName: string;

//   // Temperature controls randomness (0.0 to 1.0)
//   // Lower values are more deterministic, higher values more random
//   temperature: number;

//   // Maximum number of tokens to generate
//   maxOutputTokens: number;

//   // Stop sequences (array of strings where the model should stop generating)
//   stopSequences: string[];

//   // Top-k value, controls diversity by limiting to top k tokens
//   topK: number;

//   // Top-p value, controls diversity by using nucleus sampling
//   topP: number;
// }

// // Default configuration for pickup line generation
// export const DEFAULT_PICKUP_LINE_CONFIG: GeminiApiConfig = {
//   modelName: "gemini-2.5-pro-preview-05-06",
//   temperature: 0.8, // Slightly creative but not too random
//   maxOutputTokens: 100, // Pickup lines are short
//   stopSequences: [".", "!", "?"], // Stop at the end of a sentence
//   topK: 40,
//   topP: 0.95,
//   responseMimeType: "application/json",
// };

// // More conservative configuration (less creative)
// export const CONSERVATIVE_CONFIG: GeminiApiConfig = {
//   ...DEFAULT_PICKUP_LINE_CONFIG,
//   temperature: 0.3,
//   topK: 20,
//   topP: 0.8,
// };

// // More creative configuration
// export const CREATIVE_CONFIG: GeminiApiConfig = {
//   ...DEFAULT_PICKUP_LINE_CONFIG,
//   temperature: 1.0,
//   topK: 60,
//   topP: 1.0,
// };

// // Export the current active configuration
// // You can change this to use different configurations
// export const ACTIVE_CONFIG = DEFAULT_PICKUP_LINE_CONFIG;

const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_K;

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-pro-preview-03-25",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 65536,
  responseModalities: [],
};

export const chatSession = model.startChat({
  generationConfig,
  history: [],
});
