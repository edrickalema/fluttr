// ThemeContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "@/constants/colors";

// Define theme options


export const themeOptions = {
  romance: {
    id: "romance",
    name: "Romance",
    colors: {
      primary: Colors.flirtyPink,
      secondary: Colors.gradientPeachEnd,
      background: Colors.cream,
      card: Colors.lightBackground,
      text: Colors.darkText,
      border: Colors.borderLight,
      notification: Colors.flirtyPink,
    },
    gradientColors: [Colors.gradientPinkStart, Colors.gradientPinkEnd],
  },
  lavender: {
    id: "lavender",
    name: "Lavender",
    colors: {
      primary: Colors.lavender,
      secondary: Colors.lightPurple,
      background: Colors.graywhite,
      card: Colors.lightBackground,
      text: Colors.darkText,
      border: Colors.borderLight,
      notification: Colors.lavender,
    },
    gradientColors: [Colors.lavender, Colors.lightPurple],
  },
  sunset: {
    id: "sunset",
    name: "Sunset",
    colors: {
      primary: Colors.pink,
      secondary: Colors.peach,
      background: Colors.cream,
      card: Colors.white,
      text: Colors.darkText,
      border: Colors.borderLight,
      notification: Colors.pink,
    },
    gradientColors: [Colors.gradientPeachStart, Colors.gradientPeachEnd],
  },
  ocean: {
    id: "ocean",
    name: "Ocean",
    colors: {
      primary: Colors.shyBlue,
      secondary: "#B3DFF2", // Custom light blue
      background: Colors.graywhite,
      card: Colors.lightBackground,
      text: Colors.darkText,
      border: Colors.borderLight,
      notification: Colors.shyBlue,
    },
    gradientColors: [Colors.shyBlue, "#B3DFF2"],
  },
};


// Define font options
export const fontOptions = {
  poppins: {
    id: "poppins",
    name: "Poppins",
    regular: "Poppins-Regular",
    medium: "Poppins-Medium",
    bold: "Poppins-Bold",
  },
  playfair: {
    id: "playfair",
    name: "Playfair",
    regular: "PlayfairDisplay-Regular",
    medium: "PlayfairDisplay-Medium",
    bold: "PlayfairDisplay-Bold",
  },
  montserrat: {
    id: "montserrat",
    name: "Montserrat",
    regular: "Montserrat-Regular",
    medium: "Montserrat-Medium",
    bold: "Montserrat-Bold",
  },
  roboto: {
    id: "roboto",
    name: "Roboto",
    regular: "Roboto-Regular",
    medium: "Roboto-Medium",
    bold: "Roboto-Bold",
  },
};

// Create the context
const ThemeContext = createContext();

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const [themeId, setThemeId] = useState("romance");
  const [fontId, setFontId] = useState("poppins");
  const [isLoading, setIsLoading] = useState(true);

  // Load saved theme and font preferences
  useEffect(() => {
    const loadSavedAppearance = async () => {
      try {
        const [savedTheme, savedFont] = await Promise.all([
          AsyncStorage.getItem("app-theme"),
          AsyncStorage.getItem("app-font"),
        ]);

        if (savedTheme && themeOptions[savedTheme]) {
          setThemeId(savedTheme);
        }

        if (savedFont && fontOptions[savedFont]) {
          setFontId(savedFont);
        }
      } catch (error) {
        console.error("Failed to load appearance settings", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedAppearance();
  }, []);

  // Get current theme and font objects
  const theme = themeOptions[themeId] || themeOptions.romance;
  const font = fontOptions[fontId] || fontOptions.poppins;

  // Function to update theme
  const updateTheme = async (newThemeId) => {
    if (themeOptions[newThemeId]) {
      setThemeId(newThemeId);
      try {
        await AsyncStorage.setItem("app-theme", newThemeId);
      } catch (error) {
        console.error("Failed to save theme", error);
      }
    }
  };

  // Function to update font
  const updateFont = async (newFontId) => {
    if (fontOptions[newFontId]) {
      setFontId(newFontId);
      try {
        await AsyncStorage.setItem("app-font", newFontId);
      } catch (error) {
        console.error("Failed to save font", error);
      }
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        font,
        themeId,
        fontId,
        updateTheme,
        updateFont,
        isLoading,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
