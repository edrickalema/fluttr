import { useCallback, useEffect, useState } from "react";
import {
  FavoriteLine,
  saveFavoriteLine,
  getFavoriteLines,
  deleteFavoriteLine,
  clearAllFavoriteLines,
  isLineInFavorites,
  updateFavoriteLineTags,
  searchFavoriteLines,
} from "../utils/favoriteLineStorage";

/**
 * Hook to manage favorite pickup lines
 */
export const useFavoriteLines = () => {
  const [favoriteLines, setFavoriteLines] = useState<FavoriteLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load favorite lines from storage when component mounts
  useEffect(() => {
    loadFavoriteLines();
  }, []);

  // Load favorite lines from AsyncStorage
  const loadFavoriteLines = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const lines = await getFavoriteLines();
      setFavoriteLines(lines);
    } catch (err) {
      setError("Failed to load favorite lines");
      console.error("Error loading favorite lines:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a new line to favorites
  const addToFavorites = useCallback(
    async (line: string, tags: string[] = []) => {
      try {
        setError(null);
        // First check if line already exists
        const exists = await isLineInFavorites(line);
        if (exists) {
          setError("This pickup line is already in your favorites");
          return false;
        }

        const newLine = await saveFavoriteLine(line, tags);
        setFavoriteLines((prevLines) => [...prevLines, newLine]);
        return true;
      } catch (err) {
        setError("Failed to add line to favorites");
        console.error("Error adding to favorites:", err);
        return false;
      }
    },
    []
  );

  // Remove a line from favorites
  const removeFromFavorites = useCallback(async (id: string) => {
    try {
      setError(null);
      const success = await deleteFavoriteLine(id);
      if (success) {
        setFavoriteLines((prevLines) =>
          prevLines.filter((line) => line.id !== id)
        );
      }
      return success;
    } catch (err) {
      setError("Failed to remove line from favorites");
      console.error("Error removing from favorites:", err);
      return false;
    }
  }, []);

  // Check if a line text is already in favorites
  const checkIsFavorite = useCallback(async (text: string) => {
    try {
      return await isLineInFavorites(text);
    } catch (err) {
      console.error("Error checking favorite status:", err);
      return false;
    }
  }, []);

  // Update tags for a favorite line
  const updateTags = useCallback(async (id: string, tags: string[]) => {
    try {
      setError(null);
      const updatedLine = await updateFavoriteLineTags(id, tags);
      if (updatedLine) {
        setFavoriteLines((prevLines) =>
          prevLines.map((line) => (line.id === id ? updatedLine : line))
        );
        return true;
      }
      return false;
    } catch (err) {
      setError("Failed to update tags");
      console.error("Error updating tags:", err);
      return false;
    }
  }, []);

  // Clear all favorite lines
  const clearAllFavorites = useCallback(async () => {
    try {
      setError(null);
      await clearAllFavoriteLines();
      setFavoriteLines([]);
      return true;
    } catch (err) {
      setError("Failed to clear favorites");
      console.error("Error clearing favorites:", err);
      return false;
    }
  }, []);

  // Search favorite lines
  const searchFavorites = useCallback(async (searchTerm: string) => {
    try {
      setError(null);
      const results = await searchFavoriteLines(searchTerm);
      return results;
    } catch (err) {
      setError("Failed to search favorites");
      console.error("Error searching favorites:", err);
      return [];
    }
  }, []);

  return {
    favoriteLines,
    loading,
    error,
    addToFavorites,
    removeFromFavorites,
    checkIsFavorite,
    updateTags,
    clearAllFavorites,
    refreshFavorites: loadFavoriteLines,
    searchFavorites,
  };
};

export default useFavoriteLines;
