import FloatingBubble from "@/components/assistance/floating-bubble";
import ConversationAssistant from "@/components/assistance/realTime-assitance";
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

const App = () => {
  const [activeTab, setActiveTab] = useState<"conversation" | "bubble">(
    "conversation"
  );

  return (
    <SafeAreaProvider>
      <StatusBar barStyle='dark-content' backgroundColor='#fff' />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logo}>Fluttr</Text>
          <Text style={styles.subtitle}>Demo Mode</Text>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "conversation" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("conversation")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "conversation" && styles.activeTabText,
              ]}
            >
              Conversation Assistant
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "bubble" && styles.activeTab]}
            onPress={() => setActiveTab("bubble")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "bubble" && styles.activeTabText,
              ]}
            >
              Chat Bubble Assistant
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content Area */}
        <ScrollView style={styles.content}>
          {activeTab === "conversation" ? (
            <>
              <Text style={styles.instructions}>
                This demo simulates the Smart Assistant during conversations or
                calls.
              </Text>
              <ConversationAssistant />
            </>
          ) : (
            <>
              <Text style={styles.instructions}>
                This demo simulates the Chat Bubble Assistant that appears when
                you receive messages.
              </Text>
              <View style={styles.demoArea}>
                <Text style={styles.demoText}>
                  The floating bubble will appear when you simulate receiving a
                  message. You can drag it around the screen and tap to
                  expand/collapse it.
                </Text>
              </View>
              <FloatingBubble />
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#2196F3",
    padding: 16,
    alignItems: "center",
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: "#fff",
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#2196F3",
  },
  tabText: {
    fontSize: 14,
    color: "#757575",
  },
  activeTabText: {
    color: "#2196F3",
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
  instructions: {
    padding: 16,
    fontSize: 16,
    lineHeight: 22,
  },
  demoArea: {
    margin: 16,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 1,
  },
  demoText: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: "center",
  },
});

export default App;
