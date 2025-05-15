// Create a new file called hooks/usePickupLineGenerator.js
import { generatePickupLine } from "@/api/gemini";
import { useState } from "react";

// Define the type for personDetails
interface PersonDetails {
  appearance: string;
  context: string;
  personality: string;
  sharedInterests: string;
  tone: string;
}

export const usePickupLineGenerator = () => {
  const [pickupLine, setPickupLine] = useState<any>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateLine = async (personDetails: PersonDetails) => {
    console.log(personDetails);
    try {
      setIsLoading(true);
      setError(null);

      // Validate input data
      if (
        !personDetails.appearance ||
        !personDetails.context ||
        !personDetails.personality ||
        !personDetails.sharedInterests ||
        !personDetails.tone
      ) {
        throw new Error("All fields are required");
      }

      // Call the Gemini API
      const generatedLine = await generatePickupLine(personDetails);

      console.log("Generated pickup lines:", generatedLine);

      setPickupLine(generatedLine);
      return generatedLine;
    } catch (err: any) {
      setError(err.message || "Failed to generate pickup line");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    pickupLine,
    isLoading,
    error,
    generateLine,
  };
};
