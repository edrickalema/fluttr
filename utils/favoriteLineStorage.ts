import AsyncStorage from "@react-native-async-storage/async-storage";

// Key for storing the favorite lines in AsyncStorage
const FAVORITE_LINES_KEY = "@pickup_lines_app:favorite_lines";

// Interface for a favorite line item
export interface FavoriteLine {
  id: string; // Unique identifier
  text: string; // The pickup line text
  createdAt: number; // Timestamp when added to favorites
  tags?: string[]; // Optional tags for categorization (e.g., "funny", "romantic")
}

/**
 * Save a pickup line to favorites
 * @param line - The pickup line text to save
 * @param tags - Optional tags for categorization
 * @returns Promise resolving to the saved FavoriteLine object
 */
export const saveFavoriteLine = async (
  line: string,
  tags: string[] = []
): Promise<FavoriteLine> => {
  try {
    // Get existing favorites
    const existingFavorites = await getFavoriteLines();

    // Check if this line already exists in favorites
    const lineExists = existingFavorites.some(
      (favorite) => favorite.text === line
    );
    if (lineExists) {
      throw new Error("This pickup line is already in your favorites");
    }

    // Create new favorite line object
    const newFavoriteLine: FavoriteLine = {
      id: generateUniqueId(),
      text: line,
      createdAt: Date.now(),
      tags,
    };

    // Add to existing favorites and save
    const updatedFavorites = [...existingFavorites, newFavoriteLine];
    await AsyncStorage.setItem(
      FAVORITE_LINES_KEY,
      JSON.stringify(updatedFavorites)
    );

    return newFavoriteLine;
  } catch (error) {
    console.error("Error saving favorite line:", error);
    throw error;
  }
};

/**
 * Get all favorite pickup lines
 * @returns Promise resolving to array of FavoriteLine objects
 */
export const getFavoriteLines = async (): Promise<FavoriteLine[]> => {
  try {
    const favoriteLines = await AsyncStorage.getItem(FAVORITE_LINES_KEY);
    return favoriteLines ? JSON.parse(favoriteLines) : [];
  } catch (error) {
    console.error("Error retrieving favorite lines:", error);
    return [];
  }
};

/**
 * Delete a favorite pickup line by its ID
 * @param id - The ID of the favorite line to delete
 * @returns Promise<boolean> - True if successfully deleted, false otherwise
 */
export const deleteFavoriteLine = async (id: string): Promise<boolean> => {
  try {
    // Get existing favorites
    const existingFavorites = await getFavoriteLines();

    // Filter out the line to delete
    const updatedFavorites = existingFavorites.filter(
      (favorite) => favorite.id !== id
    );

    // Check if the line was found and removed
    if (existingFavorites.length === updatedFavorites.length) {
      return false; // Line with the ID was not found
    }

    // Save the updated list
    await AsyncStorage.setItem(
      FAVORITE_LINES_KEY,
      JSON.stringify(updatedFavorites)
    );

    return true;
  } catch (error) {
    console.error("Error deleting favorite line:", error);
    return false;
  }
};

/**
 * Clear all favorite pickup lines
 * @returns Promise<void>
 */
export const clearAllFavoriteLines = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(FAVORITE_LINES_KEY);
  } catch (error) {
    console.error("Error clearing favorite lines:", error);
    throw error;
  }
};

/**
 * Check if a line exists in favorites
 * @param line - The pickup line text to check
 * @returns Promise<boolean> - True if line exists in favorites
 */
export const isLineInFavorites = async (line: string): Promise<boolean> => {
  try {
    const favorites = await getFavoriteLines();
    return favorites.some((favorite) => favorite.text === line);
  } catch (error) {
    console.error("Error checking if line is in favorites:", error);
    return false;
  }
};

/**
 * Update tags for a favorite line
 * @param id - The ID of the favorite line to update
 * @param tags - New tags array
 * @returns Promise<FavoriteLine | null> - Updated line or null if not found
 */
export const updateFavoriteLineTags = async (
  id: string,
  tags: string[]
): Promise<FavoriteLine | null> => {
  try {
    const favorites = await getFavoriteLines();
    const updatedFavorites = favorites.map((favorite) => {
      if (favorite.id === id) {
        return { ...favorite, tags };
      }
      return favorite;
    });

    const updatedLine = updatedFavorites.find((line) => line.id === id) || null;

    if (updatedLine) {
      await AsyncStorage.setItem(
        FAVORITE_LINES_KEY,
        JSON.stringify(updatedFavorites)
      );
    }

    return updatedLine;
  } catch (error) {
    console.error("Error updating favorite line tags:", error);
    return null;
  }
};

/**
 * Helper function to generate a unique ID
 * @returns string - A unique ID
 */
const generateUniqueId = (): string => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

/**
 * Search favorite lines by text content
 * @param searchTerm - Text to search for in favorite lines
 * @returns Promise<FavoriteLine[]> - Matching favorite lines
 */
export const searchFavoriteLines = async (
  searchTerm: string
): Promise<FavoriteLine[]> => {
  try {
    const favorites = await getFavoriteLines();
    if (!searchTerm.trim()) return favorites;

    const lowerSearchTerm = searchTerm.toLowerCase();
    return favorites.filter(
      (favorite) =>
        favorite.text.toLowerCase().includes(lowerSearchTerm) ||
        favorite.tags?.some((tag) =>
          tag.toLowerCase().includes(lowerSearchTerm)
        )
    );
  } catch (error) {
    console.error("Error searching favorite lines:", error);
    return [];
  }
};
