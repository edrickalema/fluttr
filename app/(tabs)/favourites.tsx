// app/(tabs)/favorites.tsx
import Text from "@/components/main/custom-text";
import SwipeableCard from "@/components/main/sweapabale-card";
import { Colors } from "@/constants/colors";
import { globalStyles } from "@/constants/globalStyles";
import useFavoriteLines from "@/hooks/useFavoriteLines";
import { normalize } from "@/utils/responsive";
import { LinearGradient } from "expo-linear-gradient";
import { Heart, Bookmark, List, RefreshCw, Trash } from "lucide-react-native";
import React from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import Animated, {
  FadeIn,
  SlideInDown,
  FadeInUp,
} from "react-native-reanimated";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

const { width } = Dimensions.get("window");

export default function FavoritesScreen() {
  const {
    favoriteLines,
    loading,
    error,
    removeFromFavorites,
    refreshFavorites,
  } = useFavoriteLines();

  useFocusEffect(
    useCallback(() => {
      refreshFavorites();
    }, [refreshFavorites])
  );

  const renderEmptyState = () => (
    <Animated.View
      entering={FadeInUp.duration(700).delay(300)}
      style={styles.emptyContainer}
    >
      <View style={styles.emptyImageContainer}>
        <Image
          source={{
            uri: "https://images.pexels.com/photos/7148364/pexels-photo-7148364.jpeg",
          }}
          style={styles.emptyImage}
        />
        <View style={styles.emptyIconOverlay}>
          <Bookmark size={normalize(36)} color={Colors.cream} />
        </View>
      </View>
      <Text style={styles.emptyTitle}>No Favorites Yet</Text>
      <Text style={styles.emptyText}>
        Save your favorite pickup lines here for quick access
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        activeOpacity={0.8}
        onPress={() => {
          /* Navigation to browse lines could be added here */
        }}
      >
        <List size={normalize(16)} color={Colors.cream} />
        <Text style={styles.emptyButtonText}>Browse Lines</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderHeader = () => (
    <>
      <LinearGradient
        colors={[Colors.gradientPinkStart, "transparent"]}
        style={globalStyles.headerGradient}
      />

      <Animated.View entering={SlideInDown.duration(500)} style={styles.header}>
        <View style={styles.headerTop}>
          <Text variant='heading' style={styles.headerTitle}>
            Favorites
          </Text>
          {favoriteLines.length > 0 && (
            <TouchableOpacity
              style={styles.refreshButton}
              activeOpacity={0.7}
              onPress={refreshFavorites}
            >
              <RefreshCw size={normalize(18)} color={Colors.pink} />
            </TouchableOpacity>
          )}
        </View>

        {favoriteLines.length > 0 && (
          <Animated.View
            entering={FadeIn.duration(800).delay(300)}
            style={styles.statsContainer}
          >
            <View style={styles.statItem}>
              <Heart size={normalize(18)} color={Colors.pink} />
              <Text variant='body' style={styles.statText}>
                {favoriteLines.length}{" "}
                {favoriteLines.length === 1 ? "Line" : "Lines"}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Trash size={normalize(16)} color={Colors.mediumText} />
              <Text variant='body' style={styles.statText}>
                Swipe to remove
              </Text>
            </View>
          </Animated.View>
        )}
      </Animated.View>
    </>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}

      <FlatList
        data={favoriteLines}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInUp.duration(400).delay(index * 100)}>
            <SwipeableCard
              line={{
                ...item,
                createdAt: item.createdAt?.toString(),
              }}
              onDelete={removeFromFavorites}
            />
          </Animated.View>
        )}
        contentContainerStyle={[
          styles.listContent,
          favoriteLines.length === 0 && styles.emptyListContent,
        ]}
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
    paddingBottom: normalize(16),
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    color: Colors.darkText,
    fontSize: normalize(28),
  },
  refreshButton: {
    padding: normalize(8),
    backgroundColor: Colors.lightText,
    borderRadius: normalize(20),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: normalize(16),
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.lightText,
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(8),
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
    fontSize: normalize(14),
  },
  listContent: {
    paddingHorizontal: normalize(16),
    paddingBottom: normalize(100),
  },
  emptyListContent: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: normalize(40),
  },
  emptyImageContainer: {
    position: "relative",
    marginBottom: normalize(28),
  },
  emptyImage: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: (width * 0.6) / 2,
    borderWidth: normalize(4),
    borderColor: Colors.lightText,
  },
  emptyIconOverlay: {
    position: "absolute",
    bottom: normalize(-15),
    right: normalize(-5),
    backgroundColor: Colors.pink,
    borderRadius: normalize(30),
    width: normalize(60),
    height: normalize(60),
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  emptyTitle: {
    fontSize: normalize(22),
    fontWeight: "600",
    color: Colors.darkText,
    marginBottom: normalize(12),
  },
  emptyText: {
    color: Colors.mediumText,
    textAlign: "center",
    lineHeight: normalize(22),
    marginBottom: normalize(24),
    fontSize: normalize(16),
  },
  emptyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.pink,
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(12),
    borderRadius: normalize(25),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  emptyButtonText: {
    color: Colors.cream,
    marginLeft: normalize(8),
    fontWeight: "600",
    fontSize: normalize(16),
  },
});
