// TranscriptionList.tsx
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/colors";
import { Fonts } from "@/constants/fonts";
import { TranscriptionSegment } from "@/context/CallAssitantContext";
import { normalize } from "@/utils/responsive";
import { format } from "date-fns";

interface TranscriptionListProps {
  transcriptions: TranscriptionSegment[];
}

export const TranscriptionList: React.FC<TranscriptionListProps> = ({
  transcriptions,
}) => {
  const renderItem = ({ item }: { item: TranscriptionSegment }) => {
    const formattedTime = format(new Date(item.timestamp), "h:mm a");

    return (
      <View
        style={[
          styles.transcriptionItem,
          item.isSelf ? styles.selfTranscription : styles.otherTranscription,
        ]}
      >
        <View style={styles.transcriptionHeader}>
          <Text style={styles.speakerLabel}>
            {item.isSelf ? "You" : "Them"}
          </Text>
          <Text style={styles.timestampText}>{formattedTime}</Text>
        </View>
        <Text style={styles.transcriptionText}>{item.text}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Conversation</Text>
      {transcriptions.length > 0 ? (
        <FlatList
          data={transcriptions}
          renderItem={renderItem}
          keyExtractor={(item) => item.timestamp.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Conversation will appear here as you speak...
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: Colors.graywhite,
  },
  titleText: {
    ...Fonts.subheading,
    color: Colors.darkText,
    marginBottom: normalize(12),
    paddingHorizontal: normalize(16),
  },
  listContent: {
    paddingHorizontal: normalize(16),
    paddingBottom: normalize(100),
  },
  transcriptionItem: {
    borderRadius: 16,
    padding: normalize(14),
    marginBottom: normalize(10),
    maxWidth: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  selfTranscription: {
    backgroundColor: Colors.shyBlue,
    alignSelf: "flex-end",
    borderBottomRightRadius: 0,
  },
  otherTranscription: {
    backgroundColor: Colors.white,
    alignSelf: "flex-start",
    borderBottomLeftRadius: 0,
  },
  transcriptionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: normalize(4),
  },
  speakerLabel: {
    fontSize: normalize(12),
    fontWeight: "600",
    color: Colors.mediumText,
  },
  timestampText: {
    fontSize: normalize(11),
    color: Colors.gray,
  },
  transcriptionText: {
    ...Fonts.body,
    color: Colors.darkText,
    lineHeight: normalize(22),
  },
  emptyContainer: {
    padding: normalize(20),
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: normalize(16),
    marginTop: normalize(40),
  },
  emptyText: {
    ...Fonts.small,
    color: Colors.mediumText,
    fontStyle: "italic",
    textAlign: "center",
  },
});
