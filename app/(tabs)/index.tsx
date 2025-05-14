// import { ActionButton } from "@/components/main/action-button";
// import GenerateLineModal from "@/components/modal/generate-new-line";
// import { Colors } from "@/constants/colors";
import { Fonts } from "@/constants/fonts";
// import { globalStyles } from "@/constants/globalStyles";
// import { useNotificationListener } from "@/hooks/useNotificationListener";
// import { normalize } from "@/utils/responsive";
// import * as Clipboard from "expo-clipboard";
// import { LinearGradient } from "expo-linear-gradient";
import { List, Sparkles } from "lucide-react-native";
// import React, { useState } from "react";
// import {
//   ScrollView,
//   Share,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";

// export default function Home() {
//   const [isModalVisible, setIsModalVisible] = useState(false);

//   const [lines] = useState([
//     {
//       text: "Do you have a map? I keep getting lost in your eyes.",
//       color: Colors.flirtyPink, // Soft pink
//       saved: false,
//     },
//     {
//       text: "Are you a magician? Because whenever I look at you, everyone else disappears.",
//       color: Colors.shyBlue, // Soft blue
//       saved: false,
//     },
//     {
//       text: "Is your name Google? Because you've got everything I've been searching for.",
//       color: Colors.wittyGreen, // Soft green
//       saved: true,
//     },
//   ]);

//   const generateNewPickupLine = () => {
//     // TODO: Implement AI pickup line generation
//     setIsModalVisible(true);
//     console.log("Generating new pickup line...");
//   };

//   const handleGenerateLine = () => {
//     setIsModalVisible(false);
//   };

//   const copyToClipboard = async (text: string) => {
//     await Clipboard.setStringAsync(text);
//     // You could add a toast notification here
//   };

//   const shareLine = async (text: string) => {
//     try {
//       await Share.share({
//         message: text,
//       });
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={globalStyles.container}>
//       <LinearGradient
//         colors={[Colors.gradientPinkStart, "transparent"]}
//         style={globalStyles.headerGradient}
//       />
//       <View style={[styles.homeHeader]}>
//         <View style={{ flex: 1 }}>
//           <Text
//             style={StyleSheet.flatten([
//               Fonts.subheading,
//               styles.alignHeaderText,
//             ])}
//           >
//             Hey!, Alema
//           </Text>

//           <Text
//             style={StyleSheet.flatten([
//               globalStyles.text,
//               styles.alignHeaderText,
//               Fonts.small,
//             ])}
//           >
//             Your crush is waiting!
//           </Text>
//         </View>

//         <TouchableOpacity
//           style={styles.sparkleBox}
//           onPress={generateNewPickupLine}
//           // onPress={requestPermission}
//         >
//           <Sparkles
//             size={normalize(30)}
//             color={Colors.pink}
//             strokeWidth={2.5}
//           />
//         </TouchableOpacity>
//       </View>

//       <Text style={StyleSheet.flatten([styles.sectionTitle, Fonts.heading])}>
//         Today's Picks
//       </Text>

//       {/* Testing */}
//       {/* {notifications.map((notif, index) => (
//         <Text key={index}>
//           {notif.packageName}: {notif.title} - {notif.text}
//         </Text>
//       ))} */}

//       <View style={styles.cardsContainer}>
//         {lines.map((line, index) => (
//           <View
//             key={index}
//             style={[globalStyles.card, { backgroundColor: line.color }]}
//           >
//             <Text style={styles.cardText}>{line.text}</Text>

//             <View style={styles.cardActions}>
//               <ActionButton onPress={() => copyToClipboard(line.text)}>
//                 <Copy size={normalize(20)} color={Colors.darkText} />
//               </ActionButton>

//               <ActionButton onPress={() => shareLine(line.text)}>
//                 <Share2 size={normalize(20)} color={Colors.darkText} />
//               </ActionButton>

//               <ActionButton>
//                 <Heart
//                   size={normalize(20)}
//                   color={Colors.darkText}
//                   fill={line.saved ? Colors.pink : "transparent"}
//                 />
//               </ActionButton>
//             </View>
//           </View>
//         ))}
//       </View>

//       {/* Generate New pickup line modal */}
//       <GenerateLineModal
//         visible={isModalVisible}
//         onClose={() => setIsModalVisible(false)}
//         onGenerate={handleGenerateLine}
//       />
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   homeHeader: {
//     marginTop: normalize(50),
//     display: "flex",
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//   },
//   sparkleBox: {
//     backgroundColor: Colors.cream,
//     borderColor: Colors.pink,
//     width: normalize(50),
//     height: normalize(50),
//     borderRadius: normalize(20),
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: normalize(10),
//     borderWidth: normalize(5),
//     shadowColor: Colors.pink,
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//     borderCurve: "continuous",
//   },
//   alignHeaderText: {
//     color: "#000",
//     textAlign: "left",
//   },
//   sectionTitle: {
//     ...Fonts.subheading,
//     fontSize: normalize(25),
//     color: Colors.darkText,
//     marginTop: normalize(30),
//     marginBottom: normalize(15),
//   },
//   cardsContainer: {
//     gap: normalize(15),
//   },

//   cardText: {
//     ...Fonts.body,
//     fontSize: normalize(16),
//     color: Colors.darkText,
//     marginBottom: normalize(15),
//   },
//   cardActions: {
//     flexDirection: "row",
//     justifyContent: "flex-end",
//     alignItems: "center",
//     gap: normalize(15),
//   },
// });

import FloatingAssistantBubble from "@/components/assistance/FloatAssitantBubble";
import MessagePrompt from "@/components/assistance/MessagePrompt";
import AssistantPanel from "@/components/assistance/SmartAssitantPanel";
import GenerateLineModal from "@/components/modal/generate-new-line";
import { Colors } from "@/constants/colors";
import { globalStyles } from "@/constants/globalStyles";
import { useAssistant } from "@/context/AssitantContext";
import { normalize } from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Sparkle } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const cardWidth = width * 0.85;

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const [firstLaunch, setFirstLaunch] = useState(true);

  const {
    isAssistantEnabled,
    isAssistantVisible,
    showAssistant,
    hideAssistant,
  } = useAssistant();

  // Simulate first launch check
  useEffect(() => {
    // In a real app, this would check if it's the first launch after receiving a notification
    setTimeout(() => {
      setFirstLaunch(false);
    }, 5000);
  }, []);

  const generateNewPickupLine = () => {
    // TODO: Implement AI pickup line generation
    setIsModalVisible(true);
    console.log("Generating new pickup line...");
  };

  const handleGenerateLine = () => {
    setIsModalVisible(false);
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <StatusBar barStyle='dark-content' />
      {/* Show message prompt only on what we consider "first launch" and if assistant is enabled */}
      {firstLaunch && isAssistantEnabled && showPrompt && (
        <MessagePrompt onDismiss={() => setShowPrompt(false)} />
      )}
      {isAssistantEnabled && !isAssistantVisible && (
        <FloatingAssistantBubble onOpenAssistant={showAssistant} />
      )}
      {/* Assistant Panel */}
      <AssistantPanel isVisible={isAssistantVisible} onClose={hideAssistant} />
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>Fluttr</Text>
        </View>
        <TouchableOpacity
          style={styles.sparkleBox}
          onPress={generateNewPickupLine}
        >
          <Sparkles
            size={normalize(30)}
            color={Colors.mediumText}
            strokeWidth={1.5}
          />
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <LinearGradient
            colors={[Colors.gradientPinkStart, "transparent"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Never Be Textless Again</Text>
            <Text style={styles.heroSubtitle}>
              Craft the perfect replies that make your crush smile
            </Text>
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={showAssistant}
          >
            <Ionicons
              name='chatbubble-ellipses'
              size={22}
              color='#FFFFFF'
              style={styles.buttonIcon}
            />
            <Text style={styles.primaryButtonText}>Reply to My Crush</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.featuresSection}>
          <View style={styles.featureCard}>
            <View style={styles.featureImageContainer}>
              <Sparkle />
            </View>
            <Text style={styles.featureTitle}>AI-Powered Suggestions</Text>
            <Text style={styles.featureText}>
              Our smart assistant analyzes messages and creates personalized
              replies tailored to your crush's style.
            </Text>
          </View>

          <View
            style={StyleSheet.compose(globalStyles.card, styles.featureCard)}
          >
            <View style={styles.featureImageContainer}>
              <List />
            </View>
            <Text style={styles.featureTitle}>Choose Your Tone</Text>
            <Text style={styles.featureText}>
              Whether you want to be flirty, sweet, or witty, our assistant
              adapts to your preferred style.
            </Text>
          </View>
        </View>
      </ScrollView>
      {/* Generate New pickup line modal */}
      <GenerateLineModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onGenerate={handleGenerateLine}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    marginTop: normalize(20),
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
  },
  welcomeText: {
    ...Fonts.heading,
  },
  logo: {
    fontWeight: "bold",
    color: Colors.pink,
    ...Fonts.heading,
  },
  heroSection: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 10,
  },
  heroBg: {
    width: cardWidth,
    height: 220,
    marginBottom: 20,
    borderRadius: 20,
    overflow: "hidden",
  },
  heroContent: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  heroImage: {
    width: 100,
    height: 100,
    marginBottom: 15,
    resizeMode: "contain",
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
  heroSubtitle: {
    ...Fonts.body,
    textAlign: "center",
    color: "#666",
    paddingHorizontal: 20,
  },
  primaryButton: {
    backgroundColor: "#FF4785",
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FF4785",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
    marginTop: 5,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
  buttonIcon: {
    marginRight: 10,
  },
  tipsSection: {
    marginBottom: 30,
  },

  tipsScrollContent: {
    paddingRight: 20,
    paddingBottom: 10,
  },

  featuresSection: {
    marginBottom: 40,
  },
  featureCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  featureImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFF0F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  featureImage: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  featureTitle: {
    ...Fonts.subheading,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
    textAlign: "center",
  },
  featureText: {
    ...Fonts.body,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
});

export default HomeScreen;
