import { chatSession } from "@/config/gemini-apiConfig";

export const generatePickupLine = async (personDetails: any) => {
  try {
    const prompt = `
    You are a creative dating coach who crafts personalized pickup lines. Based on these details:
    - Appearance: "${personDetails.appearance}"
    - Location: "${personDetails.context}"
    - Personality: "${personDetails.personality}"
    - Shared interests: "${personDetails.sharedInterests}"
    - Tone: "${personDetails.tone}"
    
    Generate THREE distinct pickup lines that:
    - Sound natural and conversational
    - Match the requested tone exactly
    - Subtly don not incoporate the provided details but the line should be geared towards them
    - Are 1 sentences maximum
    - Avoid clichés and artificial-sounding language
    - Should not be too wordy and too pushy
    - Try to be causal
    - Add emojis where necessary
    
    Then select the BEST of these three lines.
    
    Return your response as a JSON object in the following format:

    {
      "lines": [
        "First pickup line",
        "Second pickup line",
        "Third pickup line"
      ],
      "recommended": "Your chosen best line"
    }

    Respond only with a valid JSON object matching this format, and no other text or explanation.
    `;

    const results = await chatSession.sendMessage(prompt);
    const response = await results.response;
    const text = await response.text();

    if (!text || text.trim() === "") {
      throw new Error("Empty response from Gemini");
    }

    // Try to extract JSON even if it's wrapped in other text
    const match = text.match(/\{[\s\S]*\}/); // matches the first JSON object
    if (!match) {
      throw new Error("No valid JSON object found in response");
    }

    const json = JSON.parse(match[0]);
    return json;
  } catch (error) {
    console.error("Error generating pickup lines:", error);
    return {
      lines: [],
      recommended: "Failed to generate pickup lines. Please try again.",
    };
  }
};
