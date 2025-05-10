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
    description: "Start your journey to crafting the perfect romantic line.",
    info: "Share a little about your special someone, and we'll guide you in creating a heartfelt and unforgettable opener.",
    field: "intro",
    isInfoOnly: true,
    icon: Info, // Information icon for introduction
  },
  {
    id: 2,
    title: "Meeting Context",
    description: "Where did your paths cross, or where will this line be used?",
    placeholder: "E.g., A cozy café, a dating app, during a class, at work...",
    field: "context",
    examples: [
      "At a charming bookstore",
      "First message on Bumble",
      "We work together",
    ],
    icon: MapPin, // Location pin icon for meeting context
    isInfoOnly: false,
  },
  {
    id: 3,
    title: "Their Appearance",
    description: "What physical features make your heart skip a beat?",
    placeholder: "E.g., Mesmerizing eyes, radiant smile, impeccable style...",
    field: "appearance",
    examples: [
      "Their sparkling green eyes are enchanting",
      "Their radiant smile lights up the room",
    ],
    icon: UserRound, // User icon for appearance
    isInfoOnly: false,
  },
  {
    id: 4,
    title: "Their Personality",
    description: "What about their personality or passions captivates you?",
    placeholder: "E.g., Warm-hearted, adventurous spirit, love for art...",
    field: "personality",
    examples: [
      "They have a heart of gold",
      "They're passionate about painting",
    ],
    icon: Heart, // Heart icon for personality traits
    isInfoOnly: false,
  },
  {
    id: 5,
    title: "Shared Connections",
    description: "What magical things do you both share in common?",
    placeholder:
      "E.g., A love for jazz, both adore dogs, shared travel dreams...",
    field: "sharedInterests",
    examples: [
      "We both adore the same indie band",
      "We share a passion for photography",
    ],
    icon: Puzzle, // Puzzle piece icon for connections/things that fit together
  },
  {
    id: 6,
    title: "Tone Preference",
    description: "What vibe should your romantic line carry?",
    field: "tone",
    placeholder: "E.g., Playful, Sweet, Witty, Cheesy, Passionate...",
    examples: ["Playful", "Sweet", "Witty", "Cheesy", "Passionate"],
    default: "Witty",
    icon: MessageSquareText, // Message icon for tone of the pickup line
  },
];
