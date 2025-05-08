import {
  Heart,
  Info,
  MapPin,
  MessageSquareText,
  Puzzle,
  UserRound,
} from "lucide-react-native";

export const steps = [
  {
    id: 1,
    title: "Introduction",
    description: "Create personalized pickup lines in just a few steps!",
    info: "Share a few details about the person you're interested in, and we'll help you craft the perfect opener.",
    field: "intro",
    isInfoOnly: true,
    icon: Info, // Information icon for introduction
  },
  {
    id: 2,
    title: "Meeting Context",
    description: "Where did you meet or where will you use this line?",
    placeholder: "E.g., Coffee shop, dating app, class, work...",
    field: "context",
    examples: ["At a bookstore", "First message on Tinder", "We work together"],
    icon: MapPin,
    isInfoOnly: false, // Location pin icon for meeting context
  },
  {
    id: 3,
    title: "Their Appearance",
    description: "What physical features stand out to you?",
    placeholder: "E.g., Beautiful eyes, great smile, stylish outfit...",
    field: "appearance",
    examples: [
      "They have captivating blue eyes",
      "Their curly hair is gorgeous",
    ],
    icon: UserRound, // User icon for appearance
    isInfoOnly: false,
  },
  {
    id: 4,
    title: "Their Personality",
    description: "What have you noticed about their personality or interests?",
    placeholder: "E.g., Kind-hearted, loves hiking, passionate about music...",
    field: "personality",
    examples: ["They're very compassionate", "They love true crime podcasts"],
    icon: Heart, // Heart icon for personality traits
    isInfoOnly: false,
  },
  {
    id: 5,
    title: "Shared Connections",
    description: "What do you both have in common?",
    placeholder: "E.g., Both love the same band, both dog owners...",
    field: "sharedInterests",
    examples: [
      "We both love the same obscure band",
      "We're both into photography",
    ],
    icon: Puzzle, // Puzzle piece icon for connections/things that fit together
    isInfoOnly: false,
  },
  {
    id: 6,
    title: "Tone Preference",
    description: "What kind of tone would you like the pickup line to have?",
    field: "tone",
    placeholder: ' "Funny", "Sweet", "Clever", "Cheesy", "Romantic" ...',
    default: "Clever",
    icon: MessageSquareText, // Message icon for tone of the pickup line
    isInfoOnly: false,
  },
];
