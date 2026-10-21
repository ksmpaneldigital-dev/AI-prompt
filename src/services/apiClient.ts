import { SongAnalysis, SunoPrompt } from '../types/songwriter';

export interface ServerStatus {
  status: string;
  apiKeyConfigured: boolean;
  provider: 'gemini' | 'demo';
  model: string;
  mode: string;
}

export class ApiClient {
  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    if (!res.ok) {
      let errorMessage = `HTTP Error ${res.status}`;
      try {
        const errorData = await res.json();
        if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch {
        // Fallback to status text
      }
      throw new Error(errorMessage);
    }

    return res.json();
  }

  static async getStatus(): Promise<ServerStatus> {
    return this.request<ServerStatus>('/api/status');
  }

  static async analyzePrompt(prompt: string): Promise<{ analysis: SongAnalysis; isDemo: boolean }> {
    return this.request<{ analysis: SongAnalysis; isDemo: boolean }>('/api/analyze-prompt', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });
  }

  static async generateLyrics(
    analysis: SongAnalysis,
    options: {
      customInstructions?: string;
      length?: 'short' | 'standard' | 'extended';
      rhymeDensity?: string;
      emotionalIntensity?: string;
    } = {}
  ): Promise<{ lyrics: string; isDemo: boolean }> {
    return this.request<{ lyrics: string; isDemo: boolean }>('/api/generate-lyrics', {
      method: 'POST',
      body: JSON.stringify({
        analysis,
        customInstructions: options.customInstructions || '',
        length: options.length || 'standard',
        rhymeDensity: options.rhymeDensity || 'High',
        emotionalIntensity: options.emotionalIntensity || 'Very High',
      }),
    });
  }

  static async generateMusicStyle(analysis: SongAnalysis): Promise<{ sunoPrompt: SunoPrompt; isDemo: boolean }> {
    return this.request<{ sunoPrompt: SunoPrompt; isDemo: boolean }>('/api/generate-style', {
      method: 'POST',
      body: JSON.stringify({ analysis }),
    });
  }

  static async generateFullSong(prompt: string): Promise<{
    analysis: SongAnalysis;
    lyrics: string;
    sunoPrompt: SunoPrompt;
    isDemo: boolean;
  }> {
    return this.request<{
      analysis: SongAnalysis;
      lyrics: string;
      sunoPrompt: SunoPrompt;
      isDemo: boolean;
    }>('/api/generate-full', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });
  }

  static async performAiAction<T = any>(action: string, payload: any = {}): Promise<{ result: T; isDemo: boolean }> {
    return this.request<{ result: T; isDemo: boolean }>('/api/ai-action', {
      method: 'POST',
      body: JSON.stringify({ action, payload }),
    });
  }
}
