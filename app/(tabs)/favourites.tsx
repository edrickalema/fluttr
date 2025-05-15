// app/(tabs)/favorites.tsx
import Text from "@/components/main/custom-text";
import SwipeableCard from "@/components/main/sweapabale-card";
import { Colors } from "@/constants/colors";
import { globalStyles } from "@/constants/globalStyles";
import { normalize } from "@/utils/responsive";
import { LinearGradient } from "expo-linear-gradient";
import { Heart } from "lucide-react-native";
import React, { useState } from "react";
import { Dimensions, FlatList, Image, StyleSheet, View } from "react-native";
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
          <Text variant='heading' style={styles.headerTitle}>
            Favorites
          </Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Heart size={20} color={Colors.pink} />
              <Text variant='body' style={styles.statText}>
                {lines.length} Lines
              </Text>
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
    paddingTop: normalize(60),
    paddingHorizontal: normalize(20),
    paddingBottom: normalize(20),
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    color: Colors.darkText,
  },

  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: normalize(12),
    marginTop: normalize(12),
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.lightText,
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(6),
    borderRadius: normalize(20),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  statText: {
    color: Colors.darkText,
    marginLeft: normalize(6),
  },

  listContent: {
    paddingBottom: normalize(100),
  },

  emptyContainer: {
    alignItems: "center",
    paddingHorizontal: normalize(40),
    paddingTop: normalize(60),
  },
  emptyImage: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: (width * 0.6) / 2,
    marginBottom: normalize(24),
  },
  emptyTitle: {
    fontSize: normalize(20),
    color: Colors.darkText,
    marginBottom: normalize(8),
  },
  emptyText: {
    color: Colors.mediumText,
    textAlign: "center",

    lineHeight: normalize(22),
  },
});
