// components/favorites/SwipeablePickupLine.tsx
import { Colors } from "@/constants/colors";
import { globalStyles } from "@/constants/globalStyles";
import { normalize } from "@/utils/responsive";
import { getRelativeTime } from "@/utils/timeUtils";
import { Copy, Share2, Trash2 } from "lucide-react-native";
import React, { useRef } from "react";
import {
  Dimensions,
  Share,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
} from "react-native-reanimated";
import Text from "./custom-text";

const { width } = Dimensions.get("window");

interface SwipeableCardProps {
  line: {
    id: string;
    text: string;
    category?: string;
    createdAt?: string;
  };
  onDelete: (id: string) => void;
}

export default function SwipeableCard({ line, onDelete }: SwipeableCardProps) {
  const swipeableRef = useRef<Swipeable>(null);

  const handleShare = async () => {
    try {
      await Share.share({
        message: line.text,
      });
      swipeableRef.current?.close();
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleCopy = () => {
    // In a real app, you would use Clipboard.setString(line.text)
    swipeableRef.current?.close();
  };

  const renderRightActions = () => {
    return (
      <View style={globalStyles.actionButton}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            { width: normalize(40), height: normalize(40) },
            { backgroundColor: Colors.shyBlue },
          ]}
          onPress={handleCopy}
        >
          <Copy size={20} color={Colors.lightText} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            { width: normalize(40), height: normalize(40) },
            ,
            { backgroundColor: Colors.wittyGreen },
          ]}
          onPress={handleShare}
        >
          <Share2 size={20} color={Colors.lightText} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            { width: normalize(40), height: normalize(40) },
            { backgroundColor: Colors.flirtyPink },
          ]}
          onPress={() => onDelete(line.id)}
        >
          <Trash2 size={20} color={Colors.lightText} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
    >
      <Swipeable
        ref={swipeableRef}
        renderRightActions={renderRightActions}
        overshootRight={false}
      >
        <Animated.View
          entering={SlideInRight}
          exiting={SlideOutLeft}
          style={styles.container}
        >
          <View style={styles.content}>
            <Text variant='body' style={styles.lineText}>
              {line.text}
            </Text>
            <View style={styles.footer}>
              <View
                style={[
                  styles.categoryTag,
                  {
                    backgroundColor:
                      line.category === "flirty"
                        ? Colors.flirtyPink
                        : line.category === "shy"
                        ? Colors.shyBlue
                        : Colors.wittyGreen,
                  },
                ]}
              >
                <Text variant='small' style={styles.categoryText}>
                  {line.category
                    ? line.category.charAt(0).toUpperCase() +
                      line.category.slice(1)
                    : ""}
                </Text>
              </View>
              <Text variant='body' style={styles.dateText}>
                {getRelativeTime(Number(line?.createdAt))}
              </Text>
            </View>
          </View>
        </Animated.View>
      </Swipeable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.lightText,
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: normalize(5),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 0,
  },
  content: {
    padding: 16,
  },
  lineText: {
    color: Colors.darkText,
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 5,
  },
  categoryText: {
    color: Colors.lightText,
  },
  dateText: {
    color: Colors.mediumText,
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  actionButton: {
    width: 60,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    borderRadius: 12,
  },
  actionText: {
    color: Colors.lightText,
    marginTop: 4,
  },
});
