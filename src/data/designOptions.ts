import { ExamplePrompt } from "@/types/design";

export const themes = [
  "motivation",
  "anime",
  "streetwear",
  "sarcasm",
  "fitness",
  "gaming",
  "minimalist",
  "vintage",
  "tech",
  "nature",
];

export const audiences = [
  "college students",
  "gym lovers",
  "programmers",
  "general youth",
  "gamers",
  "artists",
  "entrepreneurs",
];

export const moods = [
  "minimalist",
  "bold",
  "aesthetic",
  "funny",
  "dark",
  "vintage",
  "playful",
  "edgy",
];

export const artStyles = [
  "flat illustration",
  "line art",
  "vector art",
  "cartoon",
  "cyberpunk",
  "retro",
  "abstract",
];

export const colorPalettes = [
  "black & white",
  "pastel",
  "neon",
  "monochrome",
  "earth tones",
  "black, white, red",
  "white and yellow",
  "blue gradient",
];

export const typographyStyles = [
  "handwritten",
  "graffiti",
  "bold sans-serif",
  "retro font",
  "rounded playful",
  "modern minimal",
  "gothic",
];

export const tshirtColors = [
  { value: "black", label: "Black", hex: "#1a1a1a" },
  { value: "white", label: "White", hex: "#ffffff" },
  { value: "navy", label: "Navy", hex: "#1e3a5f" },
  { value: "charcoal", label: "Charcoal", hex: "#36454f" },
  { value: "maroon", label: "Maroon", hex: "#800000" },
];

export const bodySizes = [
  { value: "S", label: "S", description: "Small" },
  { value: "M", label: "M", description: "Medium" },
  { value: "L", label: "L", description: "Large" },
  { value: "XL", label: "XL", description: "Extra Large" },
  { value: "XXL", label: "XXL", description: "2X Large" },
];

export const examplePrompts: ExamplePrompt[] = [
  {
    id: "motivation",
    title: "Motivational",
    icon: "🔥",
    data: {
      theme: "motivation",
      mainIdea: "Discipline Beats Talent",
      targetAudience: "gym lovers",
      mood: "bold",
      artStyle: "vector art",
      colorPalette: "black, white, red",
      typography: "bold sans-serif",
      tshirtColor: "black",
      bodySize: "L",
    },
  },
  {
    id: "funny",
    title: "Funny",
    icon: "😄",
    data: {
      theme: "sarcasm",
      mainIdea: "I Put the Pro in Procrastinate",
      targetAudience: "college students",
      mood: "playful",
      artStyle: "cartoon",
      colorPalette: "white and yellow",
      typography: "rounded playful",
      tshirtColor: "black",
      bodySize: "M",
    },
  },
  {
    id: "streetwear",
    title: "Streetwear",
    icon: "👕",
    data: {
      theme: "streetwear",
      mainIdea: "Urban Confidence",
      targetAudience: "general youth",
      mood: "edgy",
      artStyle: "line art",
      colorPalette: "black & white",
      typography: "graffiti",
      tshirtColor: "black",
      bodySize: "L",
    },
  },
  {
    id: "minimal",
    title: "Text Only",
    icon: "💡",
    data: {
      theme: "minimalist",
      mainIdea: "Stay Weird",
      targetAudience: "general youth",
      mood: "minimalist",
      artStyle: "flat illustration",
      colorPalette: "black & white",
      typography: "modern minimal",
      tshirtColor: "black",
      bodySize: "M",
    },
  },
];
