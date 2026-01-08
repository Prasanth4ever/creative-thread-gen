export interface DesignFormData {
  theme: string;
  mainIdea: string;
  targetAudience: string;
  mood: string;
  artStyle: string;
  colorPalette: string;
  typography: string;
  tshirtColor: string;
}

export interface ExamplePrompt {
  id: string;
  title: string;
  icon: string;
  data: DesignFormData;
}
