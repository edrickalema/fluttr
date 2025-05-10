// app/(tabs)/favorites.tsx
import SwipeableCard from "@/components/main/sweapabale-card";
import { Colors } from "@/constants/colors";
import { Fonts } from "@/constants/fonts";
import { globalStyles } from "@/constants/globalStyles";
import { LinearGradient } from "expo-linear-gradient";
import { Heart } from "lucide-react-native";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated";

const { width } = Dimensions.get("window");

// Placeholder data
const initialLines = [
  {
    id: "1",
    text: "Do you have a map? I keep getting lost in your eyes.",
    category: "flirty",
    createdAt: "2 days ago",
  },
  {
    id: "2",
    text: "Are you a camera? Because every time I look at you, I smile.",
    category: "witty",
    createdAt: "3 days ago",
  },
  {
    id: "3",
    text: "I was wondering if you could recommend a good book? I've been looking for something interesting to read.",
    category: "shy",
    createdAt: "5 days ago",
  },
];

export default function FavoritesScreen() {
  const [lines, setLines] = useState(initialLines);

  const handleDelete = (id: string) => {
    setLines((current) => current.filter((line) => line.id !== id));
  };

  const renderEmptyState = () => (
    <Animated.View
      entering={FadeIn.duration(500)}
      style={styles.emptyContainer}
    >
      <Image
        source={{
          uri: "https://images.pexels.com/photos/7148364/pexels-photo-7148364.jpeg",
        }}
        style={styles.emptyImage}
      />
      <Text style={styles.emptyTitle}>No Favorites Yet</Text>
      <Text style={styles.emptyText}>
        Save your favorite pickup lines here for quick access
      </Text>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.gradientPinkStart, "transparent"]}
        style={globalStyles.headerGradient}
      />

      <Animated.View entering={SlideInDown.duration(500)} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Favorites</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Heart size={20} color={Colors.pink} />
              <Text style={styles.statText}>{lines.length} Lines</Text>
            </View>
          </View>
        </View>
      </Animated.View>

      <FlatList
        data={lines}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SwipeableCard line={item} onDelete={handleDelete} />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },

  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    ...Fonts.heading,
    color: Colors.darkText,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.lightText,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statText: {
    ...Fonts.small,
    color: Colors.darkText,
    marginLeft: 6,
  },
  listContent: {
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: "center",
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  emptyImage: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    marginBottom: 24,
  },
  emptyTitle: {
    ...Fonts.subheading,
    color: Colors.darkText,
    marginBottom: 8,
  },
  emptyText: {
    ...Fonts.body,
    color: Colors.mediumText,
    textAlign: "center",
  },
});
