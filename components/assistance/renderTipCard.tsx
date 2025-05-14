import { Fonts } from "@/constants/fonts";
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions, StyleSheet, Text, View } from "react-native";

const { width } = Dimensions.get("window");
const cardWidth = width * 0.85;

export const renderTipCard = (
  icon: string,
  title: string,
  text: string,
  bgColor: string
) => (
  <LinearGradient
    colors={[bgColor, "#FFFFFF"]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.tipCard}
  >
    <View style={styles.tipIconContainer}>
      {/* <Ionicons name={icon as keyof typeof Ionicons.glyphMap} /> */}
    </View>
    <View style={styles.tipContent}>
      <Text style={styles.tipTitle}>{title}</Text>
      <Text style={styles.tipText}>{text}</Text>
    </View>
  </LinearGradient>
);

const styles = StyleSheet.create({
  tipCard: {
    width: cardWidth * 0.8,
    borderRadius: 16,
    padding: 18,
    marginRight: 15,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
  tipIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    ...Fonts.body,
    fontWeight: "600",
    marginBottom: 6,
    color: "#333",
  },
  tipText: {
    ...Fonts.small,
    color: "#666",
    lineHeight: 20,
  },
});
