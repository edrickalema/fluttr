import { ActionButton } from "@/components/main/action-button";
import GenerateLineModal from "@/components/modal/generate-new-line";
import { Colors } from "@/constants/colors";
import { Fonts } from "@/constants/fonts";
import { globalStyles } from "@/constants/globalStyles";
import { useNotificationListener } from "@/hooks/useNotificationListener";
import { normalize } from "@/utils/responsive";
import * as Clipboard from "expo-clipboard";
import { LinearGradient } from "expo-linear-gradient";
import { Copy, Heart, Share2, Sparkles } from "lucide-react-native";
import React, { useState } from "react";
import {
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Home() {
  const [isModalVisible, setIsModalVisible] = useState(false);


  const [lines] = useState([
    {
      text: "Do you have a map? I keep getting lost in your eyes.",
      color: Colors.flirtyPink, // Soft pink
      saved: false,
    },
    {
      text: "Are you a magician? Because whenever I look at you, everyone else disappears.",
      color: Colors.shyBlue, // Soft blue
      saved: false,
    },
    {
      text: "Is your name Google? Because you've got everything I've been searching for.",
      color: Colors.wittyGreen, // Soft green
      saved: true,
    },
  ]);

  const generateNewPickupLine = () => {
    // TODO: Implement AI pickup line generation
    setIsModalVisible(true);
    console.log("Generating new pickup line...");
  };

  const handleGenerateLine = () => {
    setIsModalVisible(false);
  };

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
    // You could add a toast notification here
  };

  const shareLine = async (text: string) => {
    try {
      await Share.share({
        message: text,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={globalStyles.container}>
      <LinearGradient
        colors={[Colors.gradientPinkStart, "transparent"]}
        style={globalStyles.headerGradient}
      />
      <View style={[styles.homeHeader]}>
        <View style={{ flex: 1 }}>
          <Text
            style={StyleSheet.flatten([
              Fonts.subheading,
              styles.alignHeaderText,
            ])}
          >
            Hey!, Alema
          </Text>

          <Text
            style={StyleSheet.flatten([
              globalStyles.text,
              styles.alignHeaderText,
              Fonts.small,
            ])}
          >
            Your crush is waiting!
          </Text>
        </View>

        <TouchableOpacity
          style={styles.sparkleBox}
          onPress={generateNewPickupLine}
          // onPress={requestPermission}
        >
          <Sparkles
            size={normalize(30)}
            color={Colors.pink}
            strokeWidth={2.5}
          />
        </TouchableOpacity>
      </View>

      <Text style={StyleSheet.flatten([styles.sectionTitle, Fonts.heading])}>
        Today's Picks
      </Text>

      {/* Testing */}
      {/* {notifications.map((notif, index) => (
        <Text key={index}>
          {notif.packageName}: {notif.title} - {notif.text}
        </Text>
      ))} */}

      <View style={styles.cardsContainer}>
        {lines.map((line, index) => (
          <View
            key={index}
            style={[globalStyles.card, { backgroundColor: line.color }]}
          >
            <Text style={styles.cardText}>{line.text}</Text>

            <View style={styles.cardActions}>
              <ActionButton onPress={() => copyToClipboard(line.text)}>
                <Copy size={normalize(20)} color={Colors.darkText} />
              </ActionButton>

              <ActionButton onPress={() => shareLine(line.text)}>
                <Share2 size={normalize(20)} color={Colors.darkText} />
              </ActionButton>

              <ActionButton>
                <Heart
                  size={normalize(20)}
                  color={Colors.darkText}
                  fill={line.saved ? Colors.pink : "transparent"}
                />
              </ActionButton>
            </View>
          </View>
        ))}
      </View>

      {/* Generate New pickup line modal */}
      <GenerateLineModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onGenerate={handleGenerateLine}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  homeHeader: {
    marginTop: normalize(50),
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  sparkleBox: {
    backgroundColor: Colors.cream,
    borderColor: Colors.pink,
    width: normalize(50),
    height: normalize(50),
    borderRadius: normalize(20),
    justifyContent: "center",
    alignItems: "center",
    marginTop: normalize(10),
    borderWidth: normalize(5),
    shadowColor: Colors.pink,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderCurve: "continuous",
  },
  alignHeaderText: {
    color: "#000",
    textAlign: "left",
  },
  sectionTitle: {
    ...Fonts.subheading,
    fontSize: normalize(25),
    color: Colors.darkText,
    marginTop: normalize(30),
    marginBottom: normalize(15),
  },
  cardsContainer: {
    gap: normalize(15),
  },

  cardText: {
    ...Fonts.body,
    fontSize: normalize(16),
    color: Colors.darkText,
    marginBottom: normalize(15),
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: normalize(15),
  },
});
