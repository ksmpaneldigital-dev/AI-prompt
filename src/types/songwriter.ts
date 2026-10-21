export type SongLanguage = 'Khmer' | 'English' | 'Khmer-English Mixed';

export interface SongAnalysis {
  titleKhmer: string;
  titleEnglish: string;
  theme: string;
  story: string;
  language: SongLanguage;
  emotion: string;
  genre: string;
  vocalType: string;
  instruments: string[];
  tempoEnergy: string;
  duration: string;
  targetAudience: string;
  lyricsStructure: string[];
  hasRap: boolean;
  rapTone?: string;
  specialInstructions?: string;
}

export interface SunoPrompt {
  title: string;
  lyrics: string;
  styleOfMusic: string; // Concise, under 120 chars for Suno AI Style box
  extendedStyle: string; // Detailed audio description
  negativeStyle: string; // Exclude styles
  additionalInstructions: string;
}

export interface SongProject {
  id: string;
  title: string;
  titleKhmer: string;
  originalPrompt: string;
  analysis: SongAnalysis;
  lyrics: string;
  sunoPrompt: SunoPrompt;
  createdAt: string;
  updatedAt: string;
  isFavorite?: boolean;
  tags?: string[];
  source?: 'ai' | 'demo';
}

export interface YouTubeMetadata {
  titles: string[];
  description: string;
  hashtags: string[];
  thumbnailPrompt: string;
}

export interface ArrangementGuide {
  tempoBpm: string;
  musicalKeySuggestion: string;
  instrumentLayers: {
    section: string;
    instruments: string;
    dynamics: string;
  }[];
  mixingTips: string[];
}

export interface AlternativeChorus {
  id: string;
  title: string;
  lyrics: string;
  mood: string;
}
