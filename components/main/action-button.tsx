import { globalStyles } from "@/constants/globalStyles";
import React from "react";
import { TouchableOpacity } from "react-native";

interface ActionButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
}
export const ActionButton = ({ children, onPress }: ActionButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={globalStyles.actionButton}>
      {children}
    </TouchableOpacity>
  );
};
