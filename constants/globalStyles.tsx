import { Colors } from "@/constants/colors";
import { normalize } from "@/utils/responsive";
import { StyleSheet } from "react-native";
import { Fonts } from "./fonts";

export const globalStyles = StyleSheet.create({
  // General container for the app
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
    paddingHorizontal: normalize(16),
    paddingTop: normalize(20),
  },
  headerGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 200,
  },

  // Title Style
  title: {
    fontSize: normalize(24),
    fontWeight: "bold",
    color: Colors.darkText,
    textAlign: "center",
    marginBottom: normalize(5),
  },

  // Button style
  button: {
    backgroundColor: Colors.buttonBackground,
    alignItems: "center",
    paddingVertical: normalize(15),
    borderRadius: normalize(12),
  },
  actionButton: {
    width: normalize(40),
    height: normalize(40),
    borderRadius: normalize(20),
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: Colors.buttonText,
    fontWeight: "600",
    ...Fonts.button,
  },

  // Header style
  header: {
    fontSize: normalize(22),
    fontWeight: "700",
    color: Colors.darkText,
    textAlign: "center",
    marginVertical: normalize(15),
  },

  // Text input style
  textInput: {
    height: normalize(40),
    borderColor: Colors.mediumText,
    borderWidth: 1,
    borderRadius: normalize(8),
    paddingLeft: normalize(12),
    marginVertical: normalize(10),
    fontSize: normalize(16),
    color: Colors.darkText,
  },

  // Footer style
  footer: {
    marginTop: "auto",
    backgroundColor: Colors.lavender,
    paddingVertical: normalize(12),
    alignItems: "center",
  },

  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.cream,
    paddingHorizontal: normalize(20),
  },

  // Text Styles
  text: {
    fontSize: normalize(14),
    color: Colors.mediumText,
    fontWeight: "400",
    textAlign: "center",
  },

  // Card Style
  card: {
    backgroundColor: Colors.cream,
    borderRadius: normalize(15),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
    marginBottom: normalize(15),
    padding: normalize(20),
  },

  // Pagination Style
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: normalize(15),
  },

  paginationButton: {
    width: normalize(10),
    height: normalize(10),
    margin: normalize(5),
    borderRadius: normalize(5),
    backgroundColor: Colors.paginationInactive,
  },

  paginationActiveButton: {
    backgroundColor: Colors.paginationActive,
  },
});
