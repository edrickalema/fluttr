import React from "react";
import { Text as RNText } from "react-native";
import { Fonts } from "@/constants/fonts";
import { useTheme } from "@/context/ThemeContext";

/**
 * A custom Text component that automatically applies font styles
 *
 * @param {Object} props - Component props
 * @param {'heading'|'subheading'|'body'|'button'|'small'} [props.variant='body'] - Text style variant
 * @param {string} [props.color] - Optional color override
 * @param {Object} [props.style] - Additional style properties
 * @param {React.ReactNode} props.children - Text content
 */
export default function Text({
  variant = "body",
  color,
  style,
  children,
  ...props
}) {
  const fontStyles = Fonts();
  const { theme } = useTheme();

  // Get the base style for the selected variant
  const baseStyle = fontStyles[variant] || fontStyles.body;

  // Apply text color (use provided color or default text color from theme)
  const textColor = color || theme.colors.text;

  return (
    <RNText style={[baseStyle, { color: textColor }, style]} {...props}>
      {children}
    </RNText>
  );
}

