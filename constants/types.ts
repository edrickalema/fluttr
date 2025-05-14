export type ToneType = "flirty" | "witty" | "sweet";

export interface SuggestedReply {
  id: string;
  text: string;
  tone: ToneType;
}
