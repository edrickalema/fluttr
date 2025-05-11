// This is a mock AI service for generating message suggestions
// In a production app, you would integrate with an actual AI service like OpenAI API

export type SuggestionTone = "flirty" | "witty" | "sweet" | "casual";

export interface SuggestionOptions {
  messageContext?: string;
  tone?: SuggestionTone;
  count?: number;
}

class AIAssistantService {
  // Predefined responses based on message context and tone
  private flirtySuggestions = [
    "You've been on my mind all day. When can I see you again?",
    "That outfit in your profile pic is amazing. Your style is 👌",
    "Is it just me or did the room get warmer when you messaged?",
    "I was just thinking about you before you messaged. Coincidence?",
    "Every time you message me, you make my day a little brighter.",
    "So... coffee date this weekend? I promise I'm only slightly addictive.",
  ];

  private wittySuggestions = [
    "I was going to come up with a chemistry joke, but all the good ones argon.",
    "I'd tell you a time travel joke, but you didn't like it.",
    "If we were in a sitcom, this would be the part where I say something clever. *insert clever thing here*",
    "I'm reading a book on anti-gravity. It's impossible to put down!",
    "Life is short. Smile while you still have teeth.",
    "I don't always have witty responses, but when I do... wait, no, that's not right.",
  ];

  private sweetSuggestions = [
    "I really enjoy our conversations. You have such interesting perspectives!",
    "Hope you're having a wonderful day! Anything exciting happening?",
    "I appreciate you taking the time to chat with me. How are you feeling today?",
    "You have such a thoughtful way of expressing yourself. It's refreshing.",
    "Just wanted to say that talking to you always brightens my day.",
    "I was just thinking about what you said earlier. It really resonated with me.",
  ];

  private casualSuggestions = [
    "Cool! What else have you been up to lately?",
    "Nice! Hey, did you see that new movie everyone's talking about?",
    "That's awesome. So what's your plan for the weekend?",
    "Interesting! Speaking of which, have you tried that new place downtown?",
    "Oh, that reminds me - did you ever figure out that thing you mentioned last time?",
    "Sounds good! By the way, are you going to that event next week?",
  ];

  private contextualResponses: Record<string, string[]> = {
    weekend: [
      "I've been thinking about trying something new this weekend. Any suggestions?",
      "My weekend is wide open. Want to make plans together?",
      "Weekends are my favorite. What do you usually do to unwind?",
    ],
    coffee: [
      "I know a great coffee place we could check out together!",
      "Coffee sounds perfect. When works for you?",
      "I've been waiting for someone to ask me for coffee. When and where?",
    ],
    movie: [
      "I've been wanting to see that movie too! When are you free?",
      "Movies are my weakness. Would you want to go together sometime?",
      "I heard great things about it. We should definitely watch it together!",
    ],
    dinner: [
      "Dinner sounds wonderful! Do you have a favorite cuisine?",
      "I've been wanting to try that new restaurant downtown. Join me?",
      "I'm always up for good food and better company. When works for you?",
    ],
  };

  // Generate suggestions based on the message context and desired tone
  public generateSuggestions(options: SuggestionOptions = {}): string[] {
    const { messageContext = "", tone = "casual", count = 3 } = options;

    // In a real implementation, you would send this to an AI service
    // For this demo, we'll use our predefined suggestions and basic context matching

    // Check if any of our contextual keywords are in the message
    for (const [keyword, responses] of Object.entries(
      this.contextualResponses
    )) {
      if (messageContext.toLowerCase().includes(keyword)) {
        // Return context-specific responses if available
        return responses.slice(0, count);
      }
    }

    // If no context match, fall back to tone-based responses
    let suggestions: string[];

    switch (tone) {
      case "flirty":
        suggestions = this.flirtySuggestions;
        break;
      case "witty":
        suggestions = this.wittySuggestions;
        break;
      case "sweet":
        suggestions = this.sweetSuggestions;
        break;
      case "casual":
      default:
        suggestions = this.casualSuggestions;
    }

    // Randomly select 'count' suggestions
    const shuffled = [...suggestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  // Analyze conversation to determine the best tone
  public analyzeTone(messageContext: string): SuggestionTone {
    // This would be much more sophisticated with actual AI
    // For now, we'll use simple heuristics

    const text = messageContext.toLowerCase();

    if (
      text.includes("miss you") ||
      text.includes("cute") ||
      text.includes("date") ||
      (text.includes("weekend") && text.includes("plans"))
    ) {
      return "flirty";
    }

    if (
      text.includes("joke") ||
      text.includes("funny") ||
      text.includes("lol") ||
      text.includes("haha")
    ) {
      return "witty";
    }

    if (
      text.includes("feeling") ||
      text.includes("sad") ||
      text.includes("happy") ||
      text.includes("thanks")
    ) {
      return "sweet";
    }

    return "casual";
  }
}

// Export as singleton
export const aiAssistantService = new AIAssistantService();
export default aiAssistantService;
