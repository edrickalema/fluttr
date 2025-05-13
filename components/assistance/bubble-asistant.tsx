import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
// import { getSelectedTone } from '@/utils/storage';
import { Heart, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const BUBBLE_SIZE = 60;
const PADDING = 20;

const FloatingAssistant: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTone, setSelectedTone] = useState<string | null>(null);
  
  // Animation values
  const position = useSharedValue({ x: width - BUBBLE_SIZE - PADDING, y: height / 2 });
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  
  useEffect(() => {
    async function loadTone() {
        // Simulate fetching the selected tone from storage
        // const tone = await getSelectedTone();
      const tone = "hello wolrd";
      setSelectedTone(tone);
    }
    
    loadTone();
    
    // Entrance animation
    scale.value = withSpring(1, { damping: 10, stiffness: 100 });
  }, []);
  
  // Animated styles
  const bubbleStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: position.value.x },
        { translateY: position.value.y },
        { scale: scale.value }
      ],
      opacity: opacity.value
    };
  });

  const gestureHandler = {
    onStart: () => {
      scale.value = withTiming(1.1, { duration: 150 });
    },
    onUpdate: (event: any) => {
      position.value = {
        x: position.value.x + event.translationX,
        y: position.value.y + event.translationY
      };
    },
    onEnd: () => {
      // Snap to edge
      const targetX = position.value.x > width / 2 
        ? width - BUBBLE_SIZE - PADDING 
        : PADDING;
        
      position.value = {
        x: withSpring(targetX, { damping: 15, stiffness: 150 }),
        y: position.value.y
      };
      
      scale.value = withTiming(1, { duration: 150 });
    }
  };
  
  const handleOpenModal = () => {
    setIsModalVisible(true);
    opacity.value = withTiming(0, { duration: 300 });
  };
  
  const handleCloseModal = () => {
    setIsModalVisible(false);
    opacity.value = withTiming(1, { duration: 300 });
  };
  
  const getSuggestions = () => {
    switch(selectedTone) {
      case 'flirty':
        return [
          "Ask about their favorite type of music and if they've been to any concerts lately.",
          "Compliment something specific you noticed about them.",
          "Share a funny story about yourself to break the ice."
        ];
      case 'shy':
        return [
          "What's your favorite book or movie? Why do you like it?",
          "Have you traveled anywhere interesting lately?",
          "What do you enjoy doing on weekends?"
        ];
      case 'witty':
        return [
          "I'm trying to understand why coffee dates are popular. Is it because people want that extra shot of espresso, or that extra shot at love?",
          "I've been told I'm quite punny on dates. Lettuce know if my jokes are too corny.",
          "What's your superpower? Mine is remembering movie quotes at completely inappropriate times."
        ];
      default:
        return [
          "What's something you're passionate about?",
          "Any recommendations for good restaurants around here?",
          "What's been the highlight of your week so far?"
        ];
    }
  };
  
  return (
    <>
      <PanGestureHandler
        onGestureEvent={(event: any) => gestureHandler.onUpdate(event)}
        onBegan={gestureHandler.onStart}
        onEnded={gestureHandler.onEnd}
      >
        <Animated.View style={[styles.bubble, bubbleStyle]}>
          <TouchableOpacity 
            style={styles.bubbleButton}
            onPress={handleOpenModal}
          >
            <Heart size={24} color={Colors.lightText} />
          </TouchableOpacity>
        </Animated.View>
      </PanGestureHandler>
      
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>CharmFlow Assistant</Text>
              <TouchableOpacity onPress={handleCloseModal}>
                <X size={24} color={Colors.darkText} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalSubtitle}>
              Here are some suggestions for your conversation
            </Text>
            
            <ScrollView style={styles.suggestionsContainer}>
              {getSuggestions().map((suggestion, index) => (
                <View key={index} style={styles.suggestion}>
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </View>
              ))}
            </ScrollView>
            
            <View style={styles.toneContainer}>
              <Text style={styles.toneLabel}>Current tone:</Text>
              <View style={[
                styles.toneTag, 
                { 
                  backgroundColor: selectedTone === 'flirty' ? Colors.flirtyPink : 
                                selectedTone === 'shy' ? Colors.shyBlue :
                                selectedTone === 'witty' ? Colors.wittyGreen : 
                                Colors.pink 
                }
              ]}>
                <Text style={styles.toneText}>
                  {selectedTone ? selectedTone.charAt(0).toUpperCase() + selectedTone.slice(1) : 'Default'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  bubble: {
    position: 'absolute',
    width: BUBBLE_SIZE,
    height: BUBBLE_SIZE,
    borderRadius: BUBBLE_SIZE / 2,
    backgroundColor: Colors.buttonBackground,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 1000,
  },
  bubbleButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '90%',
    maxHeight: height * 0.7,
    backgroundColor: Colors.lightText,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    ...Fonts.subheading,
    color: Colors.darkText,
  },
  modalSubtitle: {
    ...Fonts.body,
    color: Colors.mediumText,
    marginBottom: 20,
  },
  suggestionsContainer: {
    maxHeight: 250,
  },
  suggestion: {
    backgroundColor: Colors.cream,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  suggestionText: {
    ...Fonts.body,
    color: Colors.darkText,
  },
  toneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  toneLabel: {
    ...Fonts.small,
    color: Colors.mediumText,
    marginRight: 10,
  },
  toneTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
  },
  toneText: {
    ...Fonts.small,
    color: Colors.lightText,
  },
});

export default FloatingAssistant;