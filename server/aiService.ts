import { GoogleGenAI } from '@google/genai';
import { SongAnalysis, SunoPrompt, YouTubeMetadata, ArrangementGuide, AlternativeChorus } from '../src/types/songwriter';

// System prompt grounding the model in authentic Khmer songwriting and Suno AI formatting
const KHMER_LYRICIST_SYSTEM_INSTRUCTION = `You are "AI Khmer Songwriter Pro" (ស្ទូឌីយោតែងទំនុកច្រៀងខ្មែរ AI), an elite Cambodian master songwriter, lyricist, and music producer who writes authentic Khmer poetry, modern hits, and Suno AI prompts.

Key Competencies:
1. Authentic Khmer Poetic Meters & Rhymes (ចុងចួន, ព្យាង្គរណ្តំ, កាព្យពាក្យ៧/ពាក្យ៨):
   - Rhymes must connect naturally from line to line (e.g. ព្យាង្គចុងនៃឃ្លាទី១ ចួននឹងព្យាង្គទី៤ ឬ ទី៧ នៃឃ្លាទី២).
   - Melodic phrasing that is natural to sing, emotionally captivating, and culturally resonant.
   - Use beautiful, evocative Khmer words (e.g., រងា, ឯកា, កតញ្ញូ, ដង្ហើម, ស្រមោល, ទឹកភ្នែក, ស្នាមញញឹម).
2. Song Structure with Standard Tags:
   - Use brackets for structure: [Intro], [Verse 1], [Pre-Chorus], [Chorus], [Verse 2], [Rap Verse], [Bridge], [Final Chorus], [Outro].
   - If Rap is requested, write rhythmic Khmer rap lines with fast, hard-hitting emotional punch and flow.
3. Suno AI Optimization:
   - Style of Music: Concise, comma-separated descriptors under 120 characters ideal for Suno AI (e.g., "Sad Khmer acoustic ballad, emotional male vocal, piano, acoustic guitar, cello, 68 bpm").
   - Negative Style: Excluded genres/instruments (e.g., "EDM, dance, harsh synth, autotune, screaming").
   - Additional arrangement cues included in brackets.`;

export class AiSongwriterService {
  private ai: GoogleGenAI | null = null;
  private hasApiKey: boolean = false;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      try {
        this.ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });
        this.hasApiKey = true;
      } catch (err) {
        console.warn('Failed to initialize GoogleGenAI client:', err);
        this.hasApiKey = false;
      }
    } else {
      this.hasApiKey = false;
    }
  }

  public isConfigured(): boolean {
    return this.hasApiKey && this.ai !== null;
  }

  /**
   * Helper to execute Gemini calls with automatic retry on transient 503/429
   */
  private async executeWithRetry<T>(fn: () => Promise<T>, maxRetries = 2): Promise<T> {
    let lastError: any;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (err: any) {
        lastError = err;
        const isTransient = err?.status === 503 || err?.status === 429 || err?.message?.includes('503');
        if (isTransient && attempt < maxRetries) {
          const delay = (attempt + 1) * 800;
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }
        throw err;
      }
    }
    throw lastError;
  }

  /**
   * Automatically analyze a user's prompt
   */
  async analyzePrompt(prompt: string): Promise<{ analysis: SongAnalysis; isDemo: boolean }> {
    if (!this.ai || !this.hasApiKey) {
      return { analysis: this.demoAnalyzePrompt(prompt), isDemo: true };
    }

    try {
      const response = await this.executeWithRetry(() =>
        this.ai!.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Analyze the following songwriting prompt and return a valid JSON object matching this schema:
Prompt: "${prompt}"

Return ONLY valid JSON in this exact structure:
{
  "titleKhmer": "Khmer title with English translation in parentheses",
  "titleEnglish": "English title",
  "theme": "Theme description",
  "story": "Storyline summary",
  "language": "Khmer" | "English" | "Khmer-English Mixed",
  "emotion": "Dominant emotion and mood",
  "genre": "Music genre (e.g., Sad Acoustic Ballad, Khmer Pop Ballad, Emotional Khmer Rap, Cinematic OST, Modern Khmer Pop, etc.)",
  "vocalType": "Vocal type (e.g., Emotional Male Solo, Soft Female Solo, Duet, Male & Rap)",
  "instruments": ["list", "of", "instruments"],
  "tempoEnergy": "Tempo and energy (e.g., Slow & Melancholic (68 BPM), Mid-tempo Ballad)",
  "duration": "Estimated duration (e.g., 3-4 minutes)",
  "targetAudience": "Target audience",
  "lyricsStructure": ["[Intro]", "[Verse 1]", "[Pre-Chorus]", "[Chorus]", "[Verse 2]", "[Rap Verse]", "[Bridge]", "[Final Chorus]", "[Outro]"],
  "hasRap": boolean,
  "rapTone": "Tone of rap if present",
  "specialInstructions": "Special production or lyrical instructions"
}`,
          config: {
            systemInstruction: KHMER_LYRICIST_SYSTEM_INSTRUCTION,
            responseMimeType: 'application/json',
            temperature: 0.7,
          },
        })
      );

      const text = response.text || '';
      const parsed = JSON.parse(text);
      return { analysis: parsed, isDemo: false };
    } catch (error) {
      console.error('Gemini analyzePrompt failed, falling back to demo analyzer:', error);
      return { analysis: this.demoAnalyzePrompt(prompt), isDemo: true };
    }
  }

  /**
   * Generate complete lyrics based on analysis and settings
   */
  async generateLyrics(
    analysis: SongAnalysis,
    customInstructions: string = '',
    length: 'short' | 'standard' | 'extended' = 'standard',
    rhymeDensity: string = 'High',
    emotionalIntensity: string = 'Very High'
  ): Promise<{ lyrics: string; isDemo: boolean }> {
    if (!this.ai || !this.hasApiKey) {
      return { lyrics: this.demoGenerateLyrics(analysis), isDemo: true };
    }

    try {
      const promptText = `Compose original, deeply touching Khmer song lyrics based on this specification:
Song Title: ${analysis.titleKhmer} (${analysis.titleEnglish})
Genre: ${analysis.genre}
Theme: ${analysis.theme}
Story: ${analysis.story}
Language: ${analysis.language}
Emotion & Mood: ${analysis.emotion} (Intensity: ${emotionalIntensity})
Vocal Delivery: ${analysis.vocalType}
Song Length: ${length}
Rhyme Density: ${rhymeDensity} (Ensure genuine Khmer rhymes ចុងចួន and smooth singable phrasing)
Has Rap: ${analysis.hasRap ? `Yes, include a dedicated [Rap Verse] with tone: ${analysis.rapTone || 'Emotional'}` : 'No rap'}
Custom Instructions: ${customInstructions || 'None'}

Structure to follow:
${analysis.lyricsStructure.join(', ')}

Requirements:
- Write mostly in Khmer script with standard Suno section tags: [Intro], [Verse 1], [Pre-Chorus], [Chorus], [Verse 2], etc.
- If language is Khmer-English Mixed, include tasteful bilingual lines in Verse or Rap.
- Ensure the Chorus is extraordinarily catchy and emotionally unforgettable.
- Include parenthetical musical cues where appropriate (e.g. (សំឡេងព្យាណូស្រទន់), (Strings swell)).
- Do not add markdown backticks around the whole song, just output the lyrics text directly.`;

      const response = await this.executeWithRetry(() =>
        this.ai!.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: promptText,
          config: {
            systemInstruction: KHMER_LYRICIST_SYSTEM_INSTRUCTION,
            temperature: 0.8,
          },
        })
      );

      const lyrics = response.text || '';
      return { lyrics, isDemo: false };
    } catch (error) {
      console.error('Gemini generateLyrics failed:', error);
      return { lyrics: this.demoGenerateLyrics(analysis), isDemo: true };
    }
  }

  /**
   * Generate Suno AI Music Style prompt
   */
  async generateMusicStyle(analysis: SongAnalysis): Promise<{ sunoPrompt: SunoPrompt; isDemo: boolean }> {
    if (!this.ai || !this.hasApiKey) {
      return { sunoPrompt: this.demoGenerateStyle(analysis), isDemo: true };
    }

    try {
      const promptText = `Generate Suno AI music style prompts and parameters for this song:
Title: ${analysis.titleKhmer} (${analysis.titleEnglish})
Genre: ${analysis.genre}
Vocal Type: ${analysis.vocalType}
Emotion: ${analysis.emotion}
Instruments: ${analysis.instruments.join(', ')}
Tempo & Energy: ${analysis.tempoEnergy}
Has Rap: ${analysis.hasRap}

Return ONLY valid JSON matching this schema:
{
  "title": "${analysis.titleKhmer}",
  "lyrics": "",
  "styleOfMusic": "Short concise Suno AI style string strictly under 120 chars, e.g. 'Sad Khmer acoustic ballad, emotional male vocal, piano, strings, 68 bpm'",
  "extendedStyle": "Detailed 2-3 paragraph studio arrangement guide including instruments, vocal styling, dynamic shifts, and mixing recommendations",
  "negativeStyle": "Comma-separated list of unwanted elements e.g. 'EDM, autotune, dance beat, cheerful, harsh distortion, metal'",
  "additionalInstructions": "Helpful Suno AI tags and execution tips (e.g. [Sad Solo Piano Intro], [Emotional Crescendo])"
}`;

      const response = await this.executeWithRetry(() =>
        this.ai!.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: promptText,
          config: {
            systemInstruction: KHMER_LYRICIST_SYSTEM_INSTRUCTION,
            responseMimeType: 'application/json',
            temperature: 0.7,
          },
        })
      );

      const text = response.text || '';
      const parsed = JSON.parse(text);
      return { sunoPrompt: parsed, isDemo: false };
    } catch (error) {
      console.error('Gemini generateMusicStyle failed:', error);
      return { sunoPrompt: this.demoGenerateStyle(analysis), isDemo: true };
    }
  }

  /**
   * Generate full song in one click
   */
  async generateFullSong(prompt: string): Promise<{
    analysis: SongAnalysis;
    lyrics: string;
    sunoPrompt: SunoPrompt;
    isDemo: boolean;
  }> {
    const { analysis, isDemo: demo1 } = await this.analyzePrompt(prompt);
    const { lyrics, isDemo: demo2 } = await this.generateLyrics(analysis);
    const { sunoPrompt, isDemo: demo3 } = await this.generateMusicStyle(analysis);

    sunoPrompt.lyrics = lyrics;
    sunoPrompt.title = analysis.titleKhmer || analysis.titleEnglish;

    return {
      analysis,
      lyrics,
      sunoPrompt,
      isDemo: demo1 || demo2 || demo3,
    };
  }

  /**
   * Advanced AI Actions: alternative hooks, rewrite, translate, emotionalize, etc.
   */
  async performAiAction(
    action: string,
    payload: {
      prompt?: string;
      lyrics?: string;
      title?: string;
      selectedText?: string;
      targetEmotion?: string;
      targetLanguage?: string;
      vocalType?: string;
    }
  ): Promise<{ result: any; isDemo: boolean }> {
    if (!this.ai || !this.hasApiKey) {
      return { result: this.demoAiAction(action, payload), isDemo: true };
    }

    try {
      if (action === 'expand-prompt') {
        const response = await this.ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Take this simple idea and expand it into a comprehensive, professional songwriting prompt for Khmer AI Songwriter:
Simple Idea: "${payload.prompt}"

Include: Story, deep emotional context, specific instruments (e.g. piano, soft guitar, Khmer traditional accents), vocal characteristics, tempo, and song structure. Output a ready-to-use prompt in English with Khmer nuances.`,
          config: { systemInstruction: KHMER_LYRICIST_SYSTEM_INSTRUCTION },
        });
        return { result: response.text?.trim() || '', isDemo: false };
      }

      if (action === 'alternative-choruses') {
        const response = await this.ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Create 3 distinctly different, highly catchy alternative Chorus hooks in Khmer for this song:
Title: ${payload.title || 'Khmer Song'}
Current Lyrics Context:
${payload.lyrics || ''}

Return ONLY valid JSON array with 3 items:
[
  {
    "id": "chorus-1",
    "title": "Emotional & Tearful (រំជួលចិត្ត)",
    "lyrics": "[Chorus]\\n...4 to 6 lines in Khmer with great rhymes...",
    "mood": "Heartbreaking & tearful"
  },
  {
    "id": "chorus-2",
    "title": "Melodic & Catchy (ទាក់ទាញ ងាយចាំ)",
    "lyrics": "[Chorus]\\n...",
    "mood": "Melodic earworm"
  },
  {
    "id": "chorus-3",
    "title": "Powerful & Climax (មានថាមពលខ្ពស់)",
    "lyrics": "[Chorus]\\n...",
    "mood": "Anthemic climax"
  }
]`,
          config: {
            systemInstruction: KHMER_LYRICIST_SYSTEM_INSTRUCTION,
            responseMimeType: 'application/json',
          },
        });
        return { result: JSON.parse(response.text || '[]'), isDemo: false };
      }

      if (action === 'improve-rhymes') {
        const response = await this.ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Polish the following Khmer lyrics to strictly enhance the Khmer poetic rhymes (ចុងចួន, ព្យាង្គរណ្តំ) and lyrical flow while keeping the exact same story and meaning intact.
Lyrics:
${payload.lyrics}`,
          config: { systemInstruction: KHMER_LYRICIST_SYSTEM_INSTRUCTION },
        });
        return { result: response.text?.trim() || payload.lyrics || '', isDemo: false };
      }

      if (action === 'adjust-emotion') {
        const response = await this.ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Rewrite these Khmer song lyrics to strongly reflect the emotion: "${payload.targetEmotion || 'Deeply Sad & Tearful'}".
Keep the song structure [Verse], [Chorus], etc.
Original Lyrics:
${payload.lyrics}`,
          config: { systemInstruction: KHMER_LYRICIST_SYSTEM_INSTRUCTION },
        });
        return { result: response.text?.trim() || payload.lyrics || '', isDemo: false };
      }

      if (action === 'simplify-for-singing') {
        const response = await this.ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Simplify the syllables and meter of these Khmer lyrics so they are effortlessly easy to sing, have smooth breathing pauses, and roll off the tongue naturally.
Lyrics:
${payload.lyrics}`,
          config: { systemInstruction: KHMER_LYRICIST_SYSTEM_INSTRUCTION },
        });
        return { result: response.text?.trim() || payload.lyrics || '', isDemo: false };
      }

      if (action === 'add-rap') {
        const response = await this.ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Add a powerful, emotional [Rap Verse] in Khmer that fits seamlessly between Verse 2 and Bridge.
Lyrics:
${payload.lyrics}`,
          config: { systemInstruction: KHMER_LYRICIST_SYSTEM_INSTRUCTION },
        });
        return { result: response.text?.trim() || payload.lyrics || '', isDemo: false };
      }

      if (action === 'remove-rap') {
        const cleaned = (payload.lyrics || '')
          .replace(/\[Rap Verse\][\s\S]*?(?=\n\[|$)/i, '')
          .replace(/\[Rap\][\s\S]*?(?=\n\[|$)/i, '')
          .trim();
        return { result: cleaned, isDemo: false };
      }

      if (action === 'shorten') {
        const response = await this.ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Condense and shorten these lyrics into a radio-friendly 2-3 minute version without losing the core emotional story or chorus hook.
Lyrics:
${payload.lyrics}`,
          config: { systemInstruction: KHMER_LYRICIST_SYSTEM_INSTRUCTION },
        });
        return { result: response.text?.trim() || payload.lyrics || '', isDemo: false };
      }

      if (action === 'translate') {
        const response = await this.ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Translate or create a poetic bilingual version of these lyrics. Target: ${payload.targetLanguage || 'English & Khmer bilingual'}.
Ensure poetic rhythm is preserved.
Lyrics:
${payload.lyrics}`,
          config: { systemInstruction: KHMER_LYRICIST_SYSTEM_INSTRUCTION },
        });
        return { result: response.text?.trim() || payload.lyrics || '', isDemo: false };
      }

      if (action === 'regenerate-section') {
        const response = await this.ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Regenerate ONLY this specific section of the song with fresh poetic phrasing, stronger rhymes, and deeper emotion.
Target Section to Replace:
${payload.selectedText}

Full Song Context:
${payload.lyrics}`,
          config: { systemInstruction: KHMER_LYRICIST_SYSTEM_INSTRUCTION },
        });
        return { result: response.text?.trim() || payload.selectedText || '', isDemo: false };
      }

      if (action === 'youtube-metadata') {
        const response = await this.ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Generate complete YouTube release metadata for this Khmer song:
Title: ${payload.title}
Lyrics snippet:
${(payload.lyrics || '').slice(0, 500)}

Return ONLY valid JSON matching this schema:
{
  "titles": ["3 Catchy YouTube Titles in Khmer and English"],
  "description": "Engaging YouTube description in Khmer and English with credits, mood, and lyrics timestamps placeholder",
  "hashtags": ["#KhmerSong", "#SunoAI", "#KhmerBallad", "#OriginalSong", "#AIKhmerSongwriter"],
  "thumbnailPrompt": "A vivid text-to-image prompt to generate an eye-catching YouTube thumbnail on Midjourney/Flux/Gemini"
}`,
          config: {
            systemInstruction: KHMER_LYRICIST_SYSTEM_INSTRUCTION,
            responseMimeType: 'application/json',
          },
        });
        return { result: JSON.parse(response.text || '{}'), isDemo: false };
      }

      if (action === 'instrumentation-guide') {
        const response = await this.ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Generate an in-depth music arrangement and instrumentation guide for this song:
Title: ${payload.title}
Lyrics snippet:
${(payload.lyrics || '').slice(0, 500)}

Return ONLY valid JSON matching this schema:
{
  "tempoBpm": "Recommended BPM (e.g., 68 BPM - 4/4 time signature)",
  "musicalKeySuggestion": "Suggested key (e.g. C Minor / A Minor for sorrow)",
  "instrumentLayers": [
    { "section": "[Intro]", "instruments": "Solo acoustic piano with subtle vinyl crackle", "dynamics": "Soft, ppp to p" },
    { "section": "[Verse 1]", "instruments": "Fingerstyle nylon acoustic guitar and warm bass", "dynamics": "Intimate, mp" },
    { "section": "[Pre-Chorus]", "instruments": "Cello enters with rising swell, reverse cymbal", "dynamics": "Building, mf" },
    { "section": "[Chorus]", "instruments": "Full cinematic string section, acoustic drums, sub-bass", "dynamics": "Powerful, f" },
    { "section": "[Rap Verse]", "instruments": "Tight 808 kick, rolling hi-hats, distant Rhodes chords", "dynamics": "Punchy, mf" },
    { "section": "[Bridge]", "instruments": "Violin solo, high emotional tension", "dynamics": "Dramatic peak, ff" },
    { "section": "[Outro]", "instruments": "Piano fade out with natural reverb", "dynamics": "Gentle decrescendo, p to silence" }
  ],
  "mixingTips": [
    "Scoop out 250Hz on the acoustic guitar to leave vocal clarity.",
    "Add wide stereo plate reverb with 2.4s decay on the emotional chorus vocal.",
    "Sidechain the 808 sub-bass gently to the kick drum during the rap section."
  ]
}`,
          config: {
            systemInstruction: KHMER_LYRICIST_SYSTEM_INSTRUCTION,
            responseMimeType: 'application/json',
          },
        });
        return { result: JSON.parse(response.text || '{}'), isDemo: false };
      }

      return { result: null, isDemo: false };
    } catch (error) {
      console.error(`AI Action ${action} failed:`, error);
      return { result: this.demoAiAction(action, payload), isDemo: true };
    }
  }

  // --- Domain-specific Fallbacks (Demo Mode) ---
  private demoAnalyzePrompt(prompt: string): SongAnalysis {
    const isSad = prompt.toLowerCase().includes('sad') || prompt.includes('កំសត់') || prompt.includes('poor') || prompt.includes('ម្តាយ');
    const hasRap = prompt.toLowerCase().includes('rap') || prompt.includes('រ៉េប');

    return {
      titleKhmer: isSad ? 'ទឹកភ្នែកកូនអ្នកក្រ (Tears of a Hardworking Son)' : 'រាត្រីស្រមោលស្នេហ៍ (Night of Love & Memories)',
      titleEnglish: isSad ? 'Tears of a Hardworking Son' : 'Night of Love & Memories',
      theme: isSad ? 'Filial sacrifice, poverty, working far from family' : 'Youth love, memories, urban romance',
      story: isSad
        ? 'A young worker endures hardship in the city to send every earned riel to his parents in the rural province.'
        : 'Two lovers reflect on their moments together in the vibrant city lights of Phnom Penh.',
      language: 'Khmer',
      emotion: isSad ? 'Heartbreaking, sentimental, resilient' : 'Romantic, nostalgic, heartfelt',
      genre: isSad ? 'Sad Acoustic Ballad' : 'Khmer Pop Ballad',
      vocalType: 'Emotional Male Solo with subtle raspy timbre',
      instruments: ['Grand Piano', 'Acoustic Guitar', 'Cello & Cinematic Strings', 'Sub Bass', 'Chimes'],
      tempoEnergy: isSad ? 'Slow & Melancholic (68 BPM)' : 'Mid-tempo Ballad (78 BPM)',
      duration: '3:30 - 4:00 minutes',
      targetAudience: 'General Cambodian audience, youth, diaspora',
      lyricsStructure: hasRap
        ? ['[Intro]', '[Verse 1]', '[Pre-Chorus]', '[Chorus]', '[Verse 2]', '[Rap Verse]', '[Bridge]', '[Final Chorus]', '[Outro]']
        : ['[Intro]', '[Verse 1]', '[Pre-Chorus]', '[Chorus]', '[Verse 2]', '[Bridge]', '[Final Chorus]', '[Outro]'],
      hasRap: hasRap,
      rapTone: hasRap ? 'Fast, emotional, heartfelt spoken delivery' : undefined,
      specialInstructions: 'Follow poetic Khmer meter with deep emotional resonance.'
    };
  }

  private demoGenerateLyrics(analysis: SongAnalysis): string {
    return `[Intro]
(សំឡេងព្យាណូដ៏ស្រទន់ និងសូរខ្យល់រងំ)
អូ... ម៉ែអើយ... ពុកអើយ...
កូននឹកអ្នកទាំងពីរណាស់...

[Verse 1]
ព្រះអាទិត្យលិចបាត់ ដួងចិត្តរឹតតែរងា
ក្រុងធំដាច់ឆ្ងាយ កូនរស់នៅឯនាយឯកា
បែកញើសហូរស្រក់ លើដែកស៊ីម៉ង់ត៍គ្រប់គ្រា
ដើម្បីតែប្រាក់ផ្ញើជូនអ្នកម្តាយពិសា។
ដៃកូនរឹងគគ្រើម តែចិត្តនៅចាំដំបូន្មាន
ម៉ែផ្តាំឱ្យទ្រាំ ទោះបីលំបាកយ៉ាងណា
ឃ្លានបាយហូបទឹក មិនហ៊ានចាយផ្តេសផ្តាសឡើយណា
ទុកប្រាក់ទិញថ្នាំ ជូនម៉ែពេលមានរោគា។

[Pre-Chorus]
យប់យន់ទន់សូរ ឮតែសូរសំឡេងផ្គរលាន់
ភ្នែកកូនសម្លឹងមើលទៅមេឃឆ្ងាយហួសផុត
តើម៉ែពិសាបាយហើយឬនៅ យប់ត្រជាក់ក្តៅយ៉ាងណា?
កូននៅទីនេះ មិនបោះបង់ក្តីសង្ឃឹមឡើយ...

[Chorus]
ទឹកភ្នែកកូនអ្នកក្រ ស្រក់លើដីធ្លីឥតស្តាយ
ទោះហត់នឿយស្ទើរស្លាប់ ក៏មិនឱ្យម៉ែបារម្ភ
ស្នាមញញឹមអ្នកម្តាយ ជាដង្ហើមកូនរស់នៅ
ពុកម៉ែអើយ... ចាំកូនណា កូននឹងវិលត្រឡប់!
ទោះត្រូវរែកពន់ ទុក្ខសោកធ្ងន់ប៉ុនភ្នំ
កូននៅតែញញឹម ដើម្បីម៉ែពុកសុខសាន្ត។

[Verse 2]
សម្លឹងមើលអាវចាស់ ដែលម៉ែដេរជូនកាលចេញដំណើរ
រហែកធ្លុះធ្លាយ ដូចបេះដូងកូននឹកស្រុក
ឃើញគេដើរលេង ជួបជុំសប្បាយក្អាកក្អាយ
កូនបានត្រឹមលេបទឹកភ្នែក លាក់ទុក្ខក្នុងទ្រូងស្ងាត់ៗ។

${analysis.hasRap ? `[Rap Verse]
(Beats kick in: Emotional slow 808, fast heartfelt flow)
ក្រោកពីព្រលឹម ម៉ោងប្រាំមិនទាន់ដឹងខ្លួន
ស្ពាយកាតាបចាស់ ដើរចូលការដ្ឋានសាងសង់
លើកឥដ្ឋរែកខ្សាច់ ធូលីចូលភ្នែកផ្សាខ្លាំង
ជើងដៃឡើងពង តែបេះដូងមិនដែលរុញរា!
ទូរស័ព្ទតេមក ឮសំឡេងម៉ែសួរនាំ
កូនឆ្លើយថា កូនស្រួលណាស់ម៉ែ កុំបារម្ភ
ទាំងដែលបំពង់ក កំពុងស្ទះទឹកភ្នែកហូរ!` : ''}

[Bridge]
(Strings crescendo into high emotional peak)
ខ្យល់អើយជួយបក់... នាំពាក្យនឹកទៅស្រុកកំណើត
ប្រាប់ម៉ែនិងពុកថា កូនកត្តញ្ញូនៅតែរង់ចាំ
ថ្ងៃដែលកូនមានគ្រប់គ្រាន់ វិលទៅឱបអ្នកទាំងពីរ
លាងជើងម៉ែពុក ដោយទឹកភ្នែកនៃក្តីអំណរ...

[Final Chorus]
(Full dramatic band with strings, heavy emotional vocals)
ទឹកភ្នែកកូនអ្នកក្រ ស្រក់លើដីធ្លីឥតស្តាយ!
ទោះហត់នឿយស្ទើរស្លាប់ ក៏មិនឱ្យម៉ែបារម្ភ!
ស្នាមញញឹមអ្នកម្តាយ ជាដង្ហើមកូនរស់នៅ
ពុកម៉ែអើយ... ចាំកូនណា កូននឹងវិលត្រឡប់!
ទោះត្រូវរែកពន់ ទុក្ខសោកធ្ងន់ប៉ុនភ្នំ
កូននៅតែញញឹម... ដើម្បីម៉ែពុកសុខសាន្ត!

[Outro]
(Acoustic guitar fades out with solo cello)
ចាំកូនណាពុក...
ចាំកូនណាម៉ែ...
កូនស្រឡាញ់ម៉ែពុកបំផុត...
(Fade out)`;
  }

  private demoGenerateStyle(analysis: SongAnalysis): SunoPrompt {
    return {
      title: analysis.titleKhmer || 'Sad Khmer Acoustic Ballad',
      lyrics: '',
      styleOfMusic: 'Sad Khmer acoustic ballad, emotional male vocal, piano, acoustic guitar, cello, strings, 68 bpm',
      extendedStyle: 'A deep sentimental acoustic ballad featuring melancholic grand piano progression, expressive fingerstyle nylon guitar, and soaring cinematic strings. Lead male vocal is raw, emotive, and heartfelt with natural dynamic breathing pauses. Includes building orchestral swell leading into an emotional climax.',
      negativeStyle: 'EDM, dance, electronic, autotune, party, metal, screaming, distortion, upbeat tempo',
      additionalInstructions: 'Suno AI tags: [Melancholic Piano Intro], [Emotional Vocal Delivery], [Strings Swell], [Fade Out Outro].'
    };
  }

  private demoAiAction(action: string, payload: any): any {
    if (action === 'expand-prompt') {
      return `Write a poignant, multi-layered Khmer song exploring ${payload.prompt || 'life hardship and family love'}. Incorporate traditional storytelling with modern acoustic arrangement: slow melancholic piano, nylon acoustic guitar, emotive strings, and an emotional vocal delivery with poetic rhymes following Khmer poetic meter (កាព្យពាក្យ៧). Duration ~3:30 mins.`;
    }
    if (action === 'alternative-choruses') {
      return [
        {
          id: 'alt-1',
          title: 'Emotional & Tearful (រំជួលចិត្តខ្លាំង)',
          lyrics: `[Chorus]
ទឹកភ្នែកស្រក់ចុះ លើដីខ្សាច់ហួតហែង
កូននៅតែខំប្រឹង ដើម្បីតែពុកម៉ែ
ទោះរងាឯកា ក្នុងក្រុងធំដាច់ឆ្ងាយ
បេះដូងកូនមួយនេះ នៅចាំស្នាមញញឹមអ្នក!`,
          mood: 'Tears of filial sacrifice'
        },
        {
          id: 'alt-2',
          title: 'Memorable Hook (ទំនុកច្រៀងងាយចាំ)',
          lyrics: `[Chorus]
ម៉ែអើយពុកអើយ កូននឹកផ្ទះយើងណាស់
ថ្ងៃណាបានជួបជុំ ហូបបាយជុំគ្រួសារ?
ទោះផ្លូវឆ្ងាយសែនឆ្ងាយ ឧបសគ្គរារាំងយ៉ាងណា
កូនតស៊ូជម្នះ នាំក្តីសុខជូនម៉ែ!`,
          mood: 'Catchy and warm nostalgic hook'
        },
        {
          id: 'alt-3',
          title: 'Anthemic Climax (បន្ទរឡើងខ្ពស់ មានអំណាច)',
          lyrics: `[Chorus]
(Crescendo with full orchestra)
ស៊ូ... ទោះត្រូវហត់នឿយស្ទើរស្លាប់!
ដើម្បីស្នាមញញឹម ដែលមានតម្លៃលើសអ្វីៗ
កូនសន្យានឹងវិលទៅ ឱបអ្នកម្តាយទាំងទឹកភ្នែក
ថ្ងៃស្អែកនឹងភ្លឺស្វាង គ្រួសារយើងនឹងសុខសាន្ត!`,
          mood: 'Grand climactic finale'
        }
      ];
    }
    if (action === 'improve-rhymes') {
      return (payload.lyrics || '') + '\n\n(Rhymes polished with enhanced poetic meter)';
    }
    if (action === 'adjust-emotion') {
      return payload.lyrics || '';
    }
    if (action === 'simplify-for-singing') {
      return payload.lyrics || '';
    }
    if (action === 'add-rap') {
      return (payload.lyrics || '') + `\n\n[Rap Verse]
ក្រោកពីព្រលឹម ម៉ោងប្រាំមិនទាន់ដឹងខ្លួន
ស្ពាយកាតាបចាស់ ដើរចូលការដ្ឋានសាងសង់
លើកឥដ្ឋរែកខ្សាច់ ធូលីចូលភ្នែកផ្សាខ្លាំង
ជើងដៃឡើងពង តែបេះដូងមិនដែលរុញរា!`;
    }
    if (action === 'remove-rap') {
      return (payload.lyrics || '')
        .replace(/\[Rap Verse\][\s\S]*?(?=\n\[|$)/i, '')
        .trim();
    }
    if (action === 'shorten') {
      return payload.lyrics || '';
    }
    if (action === 'translate') {
      return payload.lyrics || '';
    }
    if (action === 'regenerate-section') {
      return payload.selectedText || '';
    }
    if (action === 'youtube-metadata') {
      return {
        titles: [
          'ទឹកភ្នែកកូនអ្នកក្រ - Tears of a Hardworking Son | AI Khmer Songwriter Pro [Official Suno Audio]',
          'បទកំសត់រំជួលចិត្ត: ទឹកភ្នែកកូនអ្នកក្រ (Original Khmer AI Song)',
          'Tears of a Son (ទឹកភ្នែកកូនអ្នកក្រ) - Emotional Sad Acoustic Ballad 2026'
        ],
        description: `បទចម្រៀង៖ ទឹកភ្នែកកូនអ្នកក្រ (Tears of a Hardworking Son)\nនិពន្ធទំនុកច្រៀង និងចង្វាក់ដោយ៖ AI Khmer Songwriter Pro\nរចនាបទតន្ត្រី៖ Sad Acoustic Ballad / Emotional Rap\n\nបទចម្រៀងនេះរៀបរាប់ពីការតស៊ូរបស់កូនប្រុសកំសត់ម្នាក់ដែលឃ្លាតឆ្ងាយពីស្រុកកំណើត ដើម្បីធ្វើការងារធ្ងន់ធ្ងរនៅទីក្រុង ផ្ញើប្រាក់ជូនឪពុកម្តាយចាស់ជរា។\n\nGenerated with AI Khmer Songwriter Pro.\nOptimized for Suno AI & Udio creation.`,
        hashtags: ['#KhmerSong', '#SunoAI', '#ទឹកភ្នែកកូនអ្នកក្រ', '#KhmerSadSong', '#AIKhmerSongwriter', '#KhmerMusic2026'],
        thumbnailPrompt: 'Cinematic emotional scene in Cambodia, a tired young construction worker in Phnom Penh looking at a small old photograph of his elderly parents, golden hour sunset, atmospheric dust particles, warm melancholic lighting, photorealistic 8k, hyper-detailed, movie still style.'
      };
    }
    if (action === 'instrumentation-guide') {
      return {
        tempoBpm: '68 BPM - 4/4 Time Signature (Slow Melancholic Ballad)',
        musicalKeySuggestion: 'C Minor (Sorrowful & Reflective) / Eb Major resolution in Chorus',
        instrumentLayers: [
          { section: '[Intro]', instruments: 'Grand piano solo (reverb plate) with gentle wind atmosphere', dynamics: 'Pianissimo (pp)' },
          { section: '[Verse 1]', instruments: 'Fingerstyle nylon guitar and soft cello bass note', dynamics: 'Mezzo-piano (mp)' },
          { section: '[Pre-Chorus]', instruments: 'Warm violin swell, acoustic hi-hat ticking', dynamics: 'Mezzo-forte (mf)' },
          { section: '[Chorus]', instruments: 'Full orchestra strings, acoustic ballad drum kit, piano octaves, warm sub-bass', dynamics: 'Forte (f)' },
          { section: '[Rap Verse]', instruments: 'Emotional 808 sub kick, trap hi-hat rolls, continuous minor piano chords', dynamics: 'Punchy & tight (mf)' },
          { section: '[Bridge]', instruments: 'Soaring cello solo and vocal harmonies with dramatic crescendo', dynamics: 'Fortissimo (ff)' },
          { section: '[Outro]', instruments: 'Solo acoustic guitar chords fading into lone piano note', dynamics: 'Decrescendo to silence' }
        ],
        mixingTips: [
          'High-pass vocals around 85Hz and dip 400Hz slightly for clarity in emotional chest register.',
          'Use subtle stereo imaging on the piano to give room for the vocal center stage.',
          'Keep 808 mono below 120Hz to maintain solid low-end foundation.'
        ]
      };
    }
    return null;
  }
}

export const aiSongwriterService = new AiSongwriterService();
