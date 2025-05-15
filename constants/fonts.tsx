// font.js
import { useTheme } from "@/context/ThemeContext";
import { normalize } from "@/utils/responsive";
import { useMemo } from "react";

export const useFontsConfig = () => {
  const themeContext = useTheme();

  // Prevent crashing if theme is not available yet
  if (!themeContext) {
    return {
      heading: {},
      subheading: {},
      body: {},
      button: {},
      small: {},
    };
  }

  const { font } = themeContext;

  return useMemo(
    () => ({
      heading: {
        fontFamily: font?.bold || "Poppins-Bold",
        fontSize: normalize(34),
        lineHeight: normalize(34),
      },
      subheading: {
        fontFamily: font?.medium || "Poppins-Medium",
        fontSize: normalize(24),
        lineHeight: normalize(29),
      },
      body: {
        fontFamily: font?.regular || "Poppins-Regular",
        fontSize: normalize(16),
        lineHeight: normalize(24),
      },
      button: {
        fontFamily: font?.medium || "Poppins-Medium",
        fontSize: normalize(18),
        lineHeight: normalize(22),
      },
      small: {
        fontFamily: font?.regular || "Poppins-Regular",
        fontSize: normalize(14),
        lineHeight: normalize(21),
      },
    }),
    [font]
  );
};

export { useFontsConfig as Fonts };
