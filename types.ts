
export type ProfessionalStyle = {
  id: string;
  name: string;
  description: string;
  prompt: string;
  previewUrl: string;
};

export type AppState = 'IDLE' | 'SELECTING_STYLE' | 'GENERATING' | 'EDITING' | 'DONE';

export interface GeneratedImage {
  url: string;
  promptUsed: string;
}

export interface GenerationHistory {
  originalImage: string;
  results: GeneratedImage[];
}
