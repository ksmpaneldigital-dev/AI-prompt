import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { PromptPanel } from './components/PromptPanel';
import { LyricsEditor } from './components/LyricsEditor';
import { SunoPromptCard } from './components/SunoPromptCard';
import { SongLibraryDrawer } from './components/SongLibraryDrawer';
import { AdvancedActionsModal } from './components/AdvancedActionsModal';
import { SongProject, SongAnalysis, SunoPrompt } from './types/songwriter';
import { INITIAL_DEMO_PROJECT, SAMPLE_PROMPT_PRESETS } from './data/presets';
import { StorageService } from './services/storage';
import { ApiClient, ServerStatus } from './services/apiClient';
import { Language, TRANSLATIONS } from './i18n/translations';
import { 
  Sparkles, 
  AlertCircle, 
  RefreshCw, 
  SlidersHorizontal, 
  Youtube, 
  Layers, 
  Music2, 
  Info,
  CheckCircle2
} from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<Language>('km');
  const [serverStatus, setServerStatus] = useState<ServerStatus | null>(null);

  // Active Project State
  const [project, setProject] = useState<SongProject>(() => {
    const projects = StorageService.getProjects();
    const activeId = StorageService.getActiveProjectId();
    const found = projects.find((p) => p.id === activeId);
    return found || projects[0] || INITIAL_DEMO_PROJECT;
  });

  const [promptInput, setPromptInput] = useState<string>(project.originalPrompt || '');
  const [savedProjects, setSavedProjects] = useState<SongProject[]>([]);
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState<boolean>(false);

  // Async Generation States
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatingStep, setGeneratingStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<(() => void) | null>(null);

  const t = TRANSLATIONS[language];

  // Refresh server status and local library on mount
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const status = await ApiClient.getStatus();
        setServerStatus(status);
      } catch (e) {
        console.warn('Backend status check warning (using demo fallback if offline):', e);
        setServerStatus({
          status: 'ok',
          apiKeyConfigured: false,
          provider: 'demo',
          model: 'gemini-3.8-flash',
          mode: 'demo_mode',
        });
      }
    };

    fetchStatus();
    loadProjects();
  }, []);

  const loadProjects = () => {
    const list = StorageService.getProjects();
    setSavedProjects(list);
  };

  // Auto-save project whenever it changes
  useEffect(() => {
    if (project && project.id) {
      StorageService.saveProject(project);
      loadProjects();
    }
  }, [project.lyrics, project.title, project.sunoPrompt, project.analysis]);

  // Handle New Song
  const handleNewSong = () => {
    const newProj: SongProject = {
      id: 'song_' + Date.now(),
      title: 'Untitled Khmer Song',
      titleKhmer: 'បទចម្រៀងថ្មី',
      originalPrompt: '',
      analysis: {
        titleKhmer: 'បទចម្រៀងថ្មី',
        titleEnglish: 'New Khmer Song',
        theme: 'Love, life, and emotion',
        story: 'Expressive lyrical journey',
        language: 'Khmer',
        emotion: 'Emotional and touching',
        genre: 'Sad Acoustic Ballad',
        vocalType: 'Emotional Male Solo',
        instruments: ['Grand Piano', 'Acoustic Guitar', 'Cello & Strings'],
        tempoEnergy: 'Slow Ballad (68 BPM)',
        duration: '3:30 mins',
        targetAudience: 'Youth & Music Lovers',
        lyricsStructure: ['[Intro]', '[Verse 1]', '[Pre-Chorus]', '[Chorus]', '[Verse 2]', '[Bridge]', '[Final Chorus]', '[Outro]'],
        hasRap: false,
      },
      lyrics: `[Intro]
(សំឡេងព្យាណូដ៏ស្រទន់)

[Verse 1]
...វាយបញ្ចូលទំនុកច្រៀង ឬចុច "តែងទំនុកច្រៀង"...

[Chorus]
...`,
      sunoPrompt: {
        title: 'New Khmer Song',
        lyrics: '',
        styleOfMusic: 'Sad Khmer acoustic ballad, emotional male vocal, piano, strings, 68 bpm',
        extendedStyle: 'Gentle acoustic arrangement with grand piano and strings.',
        negativeStyle: 'EDM, autotune, distortion, party, screaming',
        additionalInstructions: 'Suno AI tags: [Piano Intro], [Vocal Crescendo], [Outro Fade].',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      source: 'ai',
    };

    setProject(newProj);
    setPromptInput('');
    setErrorMessage(null);
    StorageService.saveProject(newProj);
    loadProjects();
  };

  // Switch to selected project from library
  const handleSelectProject = (proj: SongProject) => {
    setProject(proj);
    setPromptInput(proj.originalPrompt || '');
    StorageService.setActiveProjectId(proj.id);
    setErrorMessage(null);
  };

  // 1. Analyze prompt only
  const handleAnalyzeOnly = async () => {
    if (!promptInput.trim()) return;
    setIsGenerating(true);
    setGeneratingStep(language === 'km' ? 'កំពុងវិភាគប៉ារ៉ាម៉ែត្របទចម្រៀង...' : 'Analyzing song parameters...');
    setErrorMessage(null);
    setLastAction(() => handleAnalyzeOnly);

    try {
      const res = await ApiClient.analyzePrompt(promptInput);
      if (res?.analysis) {
        setProject((prev) => ({
          ...prev,
          originalPrompt: promptInput,
          analysis: res.analysis,
          title: res.analysis.titleEnglish || prev.title,
          titleKhmer: res.analysis.titleKhmer || prev.titleKhmer,
        }));
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to analyze prompt. Please try again.');
    } finally {
      setIsGenerating(false);
      setGeneratingStep('');
    }
  };

  // 2. Generate Lyrics Only
  const handleGenerateLyrics = async () => {
    if (!promptInput.trim()) return;
    setIsGenerating(true);
    setGeneratingStep(language === 'km' ? 'កំពុងតែងទំនុកច្រៀងខ្មែររណ្តំចុងចួន...' : 'Composing Khmer lyrics with poetic rhymes...');
    setErrorMessage(null);
    setLastAction(() => handleGenerateLyrics);

    try {
      // First ensure analysis exists or generate fresh analysis
      let currentAnalysis = project.analysis;
      if (!currentAnalysis || currentAnalysis.titleKhmer === 'បទចម្រៀងថ្មី') {
        const analyzeRes = await ApiClient.analyzePrompt(promptInput);
        currentAnalysis = analyzeRes.analysis;
      }

      const lyricsRes = await ApiClient.generateLyrics(currentAnalysis);
      if (lyricsRes?.lyrics) {
        setProject((prev) => ({
          ...prev,
          originalPrompt: promptInput,
          analysis: currentAnalysis!,
          lyrics: lyricsRes.lyrics,
          titleKhmer: currentAnalysis?.titleKhmer || prev.titleKhmer,
          title: currentAnalysis?.titleEnglish || prev.title,
          source: lyricsRes.isDemo ? 'demo' : 'ai',
        }));
      }
    } catch (err: any) {
      // Never lose current lyrics on failure
      setErrorMessage(err.message || 'Lyrics generation failed. Your current lyrics remain preserved.');
    } finally {
      setIsGenerating(false);
      setGeneratingStep('');
    }
  };

  // 3. Generate Music Style Only
  const handleGenerateStyle = async () => {
    if (!promptInput.trim() && !project.analysis) return;
    setIsGenerating(true);
    setGeneratingStep(language === 'km' ? 'កំពុងបង្កើត Prompt Style សម្រាប់ Suno AI...' : 'Generating music style for Suno AI...');
    setErrorMessage(null);
    setLastAction(() => handleGenerateStyle);

    try {
      let currentAnalysis = project.analysis;
      if (!currentAnalysis || currentAnalysis.titleKhmer === 'បទចម្រៀងថ្មី') {
        const analyzeRes = await ApiClient.analyzePrompt(promptInput);
        currentAnalysis = analyzeRes.analysis;
      }

      const styleRes = await ApiClient.generateMusicStyle(currentAnalysis!);
      if (styleRes?.sunoPrompt) {
        setProject((prev) => ({
          ...prev,
          sunoPrompt: {
            ...styleRes.sunoPrompt,
            lyrics: prev.lyrics,
          },
        }));
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Style generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
      setGeneratingStep('');
    }
  };

  // 4. Generate Full Song (All in one)
  const handleGenerateFull = async () => {
    if (!promptInput.trim()) return;
    setIsGenerating(true);
    setGeneratingStep(language === 'km' ? 'កំពុងវិភាគ តែងទំនុកច្រៀង និងបង្កើត Suno Style...' : 'Analyzing prompt, composing lyrics & Suno AI styles...');
    setErrorMessage(null);
    setLastAction(() => handleGenerateFull);

    try {
      const res = await ApiClient.generateFullSong(promptInput);
      if (res) {
        setProject((prev) => ({
          ...prev,
          originalPrompt: promptInput,
          analysis: res.analysis,
          lyrics: res.lyrics,
          sunoPrompt: res.sunoPrompt,
          titleKhmer: res.analysis?.titleKhmer || prev.titleKhmer,
          title: res.analysis?.titleEnglish || prev.title,
          source: res.isDemo ? 'demo' : 'ai',
        }));
      }
    } catch (err: any) {
      // Retain current project lyrics safely
      setErrorMessage(err.message || 'Full generation failed. Your current lyrics were not lost.');
    } finally {
      setIsGenerating(false);
      setGeneratingStep('');
    }
  };

  // 5. Expand Prompt
  const handleExpandPrompt = async () => {
    if (!promptInput.trim()) return;
    setIsGenerating(true);
    setGeneratingStep(language === 'km' ? 'កំពុងពង្រីកគំនិតទៅជា Prompt អាជីព...' : 'Expanding prompt into professional studio prompt...');
    try {
      const res = await ApiClient.performAiAction<string>('expand-prompt', { prompt: promptInput });
      if (res?.result) {
        setPromptInput(res.result);
      }
    } catch (e: any) {
      setErrorMessage(e.message || 'Could not expand prompt.');
    } finally {
      setIsGenerating(false);
      setGeneratingStep('');
    }
  };

  // AI Actions on Lyrics (rewrite, rhymes, emotionalize, etc.)
  const handleAiAction = async (action: string, payload: any = {}) => {
    setIsGenerating(true);
    setGeneratingStep(language === 'km' ? 'AI កំពុងកែច្នៃ និងកែលម្អទំនុកច្រៀង...' : 'AI is processing your request...');
    setErrorMessage(null);

    try {
      const res = await ApiClient.performAiAction(action, {
        ...payload,
        lyrics: project.lyrics,
        title: project.titleKhmer || project.title,
      });

      if (action === 'improve-rhymes' || action === 'adjust-emotion' || action === 'simplify-for-singing' || action === 'add-rap' || action === 'remove-rap' || action === 'shorten' || action === 'translate') {
        if (typeof res?.result === 'string') {
          setProject((prev) => ({ ...prev, lyrics: res.result }));
        }
      } else if (action === 'regenerate-section') {
        if (typeof res?.result === 'string' && payload.selectedText) {
          const updatedLyrics = project.lyrics.replace(payload.selectedText, res.result);
          setProject((prev) => ({ ...prev, lyrics: updatedLyrics }));
        }
      }

      return res;
    } catch (err: any) {
      setErrorMessage(err.message || 'Action failed. Please try again.');
      return null;
    } finally {
      setIsGenerating(false);
      setGeneratingStep('');
    }
  };

  // Replace chorus with alternative hook
  const handleReplaceChorus = (newChorusLyrics: string) => {
    const currentLyrics = project.lyrics;
    // Replace [Chorus] section or append
    const chorusRegex = /\[Chorus\][\s\S]*?(?=\n\[|$)/i;
    if (chorusRegex.test(currentLyrics)) {
      const updated = currentLyrics.replace(chorusRegex, newChorusLyrics.trim());
      setProject((prev) => ({ ...prev, lyrics: updated }));
    } else {
      setProject((prev) => ({ ...prev, lyrics: currentLyrics + '\n\n' + newChorusLyrics.trim() }));
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* Navigation Header */}
      <Navbar
        language={language}
        onLanguageChange={setLanguage}
        onNewSong={handleNewSong}
        onOpenLibrary={() => setIsLibraryOpen(true)}
        onOpenAdvanced={() => setIsAdvancedOpen(true)}
        serverStatus={serverStatus}
        savedCount={savedProjects.length}
      />

      {/* Main Container */}
      <main className="mx-auto flex-1 w-full max-w-7xl px-3 py-4 sm:px-6 sm:py-6 flex flex-col gap-5">
        {/* Error notification banner with retry */}
        {errorMessage && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-rose-500/40 bg-rose-950/40 p-3 sm:p-4 text-xs sm:text-sm text-rose-200 shadow-lg">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
            {lastAction && (
              <button
                onClick={() => lastAction()}
                className="flex items-center gap-1 rounded-lg bg-rose-600 px-3 py-1 font-semibold text-white hover:bg-rose-500 transition cursor-pointer shrink-0"
              >
                <RefreshCw className="h-3 w-3" />
                <span>{t.retry}</span>
              </button>
            )}
          </div>
        )}

        {/* Demo Mode / AI Status Transparent Banner */}
        {serverStatus && !serverStatus.apiKeyConfigured && (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-500/30 bg-amber-950/20 px-3.5 py-2 text-xs text-amber-300">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-amber-400 shrink-0" />
              <span>
                {language === 'km'
                  ? 'ស្ទូឌីយោកំពុងដំណើរការក្នុង Demo Mode (គំរូជាក់ស្តែង)។ នៅពេលភ្ជាប់ GEMINI_API_KEY ប្រព័ន្ធនឹងដំណើរការ AI Live ដោយស្វ័យប្រវត្តិ។'
                  : 'Studio running in Demo Mode with rich sample output. When GEMINI_API_KEY is attached, it calls Gemini 3.8 Flash live.'}
              </span>
            </div>
            <span className="font-semibold rounded bg-amber-900/60 px-2 py-0.5 text-[10px] uppercase">
              Demo Active
            </span>
          </div>
        )}

        {/* Responsive Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Prompt Input & Studio Lyrics Workspace (7 Cols on desktop) */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            {/* Prompt Panel */}
            <PromptPanel
              prompt={promptInput}
              onPromptChange={setPromptInput}
              analysis={project.analysis}
              onAnalysisChange={(analysis) => setProject((prev) => ({ ...prev, analysis }))}
              onGenerateFull={handleGenerateFull}
              onGenerateLyrics={handleGenerateLyrics}
              onGenerateStyle={handleGenerateStyle}
              onAnalyzeOnly={handleAnalyzeOnly}
              onExpandPrompt={handleExpandPrompt}
              onClear={() => setPromptInput('')}
              isGenerating={isGenerating}
              generatingStep={generatingStep}
              language={language}
            />

            {/* Lyrics Editor Studio */}
            <LyricsEditor
              lyrics={project.lyrics}
              onChange={(lyrics) => setProject((prev) => ({ ...prev, lyrics }))}
              title={project.titleKhmer || project.title}
              onTitleChange={(titleKhmer) => setProject((prev) => ({ ...prev, titleKhmer }))}
              onAiAction={handleAiAction}
              isProcessing={isGenerating}
              language={language}
            />
          </div>

          {/* Right Column: Suno AI Prompt Builder & Studio Quick Tools (5 Cols on desktop) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* Suno AI Card */}
            <SunoPromptCard
              sunoPrompt={project.sunoPrompt}
              onChange={(sunoPrompt) => setProject((prev) => ({ ...prev, sunoPrompt }))}
              lyrics={project.lyrics}
              songTitle={project.titleKhmer || project.title}
              language={language}
            />

            {/* Studio Quick Actions Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 backdrop-blur-sm shadow-xl flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-400" />
                <h3 className="text-xs sm:text-sm font-bold text-white">
                  {language === 'km' ? 'សេវាកម្មបន្ថែមក្នុងស្ទូឌីយោ' : 'Studio Production Hub'}
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => setIsAdvancedOpen(true)}
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 p-3 hover:border-purple-500/50 hover:bg-purple-950/20 transition text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-200">
                        {language === 'km' ? '៣ បន្ទរជម្រើស (Alternative Hooks)' : '3 Alternative Chorus Hooks'}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {language === 'km' ? 'ជ្រើសរើសបន្ទរពិរោះជាងគេ' : 'Pick the most memorable melodic hook'}
                      </div>
                    </div>
                  </div>
                  <span className="text-purple-400 text-xs">→</span>
                </button>

                <button
                  onClick={() => setIsAdvancedOpen(true)}
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 p-3 hover:border-rose-500/50 hover:bg-rose-950/20 transition text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400">
                      <Youtube className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-200">
                        {language === 'km' ? 'YouTube & Thumbnail Prompts' : 'YouTube SEO & Thumbnail Prompts'}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {language === 'km' ? 'ចំណងជើង និង Prompt គូររូប AI' : 'Viral titles, description, and Midjourney image prompt'}
                      </div>
                    </div>
                  </div>
                  <span className="text-rose-400 text-xs">→</span>
                </button>

                <button
                  onClick={() => setIsAdvancedOpen(true)}
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 p-3 hover:border-cyan-500/50 hover:bg-cyan-950/20 transition text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                      <Layers className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-200">
                        {language === 'km' ? 'ការណែនាំតន្ត្រី & ការលាយសំឡេង' : 'Arrangement & Mixing Guide'}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {language === 'km' ? 'BPM, Key, និង Dynamic Layers' : 'BPM, scale keys, stems, and audio EQ tips'}
                      </div>
                    </div>
                  </div>
                  <span className="text-cyan-400 text-xs">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Drawers and Modals */}
      <SongLibraryDrawer
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        projects={savedProjects}
        activeProjectId={project.id}
        onSelectProject={handleSelectProject}
        onNewProject={handleNewSong}
        onProjectsUpdated={loadProjects}
        language={language}
      />

      <AdvancedActionsModal
        isOpen={isAdvancedOpen}
        onClose={() => setIsAdvancedOpen(false)}
        lyrics={project.lyrics}
        songTitle={project.titleKhmer || project.title}
        onReplaceChorus={handleReplaceChorus}
        onAiAction={handleAiAction}
        isProcessing={isGenerating}
        language={language}
      />
    </div>
  );
}
