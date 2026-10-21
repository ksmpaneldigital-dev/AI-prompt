import React, { useState } from 'react';
import { 
  Sparkles, 
  Wand2, 
  Music, 
  FileText, 
  Sliders, 
  ClipboardPaste, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  Layers,
  HeartCrack,
  Flame,
  Film,
  CloudRain,
  Mic,
  Plus
} from 'lucide-react';
import { SongAnalysis } from '../types/songwriter';
import { SAMPLE_PROMPT_PRESETS } from '../data/presets';
import { Language, TRANSLATIONS } from '../i18n/translations';

interface PromptPanelProps {
  prompt: string;
  onPromptChange: (val: string) => void;
  analysis: SongAnalysis | null;
  onAnalysisChange: (analysis: SongAnalysis) => void;
  onGenerateFull: () => void;
  onGenerateLyrics: () => void;
  onGenerateStyle: () => void;
  onAnalyzeOnly: () => void;
  onExpandPrompt: () => void;
  onClear: () => void;
  isGenerating: boolean;
  generatingStep: string;
  language: Language;
}

export const PromptPanel: React.FC<PromptPanelProps> = ({
  prompt,
  onPromptChange,
  analysis,
  onAnalysisChange,
  onGenerateFull,
  onGenerateLyrics,
  onGenerateStyle,
  onAnalyzeOnly,
  onExpandPrompt,
  onClear,
  isGenerating,
  generatingStep,
  language,
}) => {
  const [showSettings, setShowSettings] = useState<boolean>(true);
  const [newInstrument, setNewInstrument] = useState<string>('');
  const t = TRANSLATIONS[language];

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onPromptChange(text);
      }
    } catch {
      // If clipboard permission denied or not supported in iframe, notify user politely
      alert(language === 'km' ? 'សូមចុច Ctrl+V ឬ Command+V ដើម្បីបិទភ្ជាប់' : 'Please press Ctrl+V / Cmd+V to paste');
    }
  };

  const handlePresetSelect = (presetPrompt: string) => {
    onPromptChange(presetPrompt);
  };

  const handleAddInstrument = () => {
    if (!newInstrument.trim() || !analysis) return;
    onAnalysisChange({
      ...analysis,
      instruments: [...analysis.instruments, newInstrument.trim()],
    });
    setNewInstrument('');
  };

  const handleRemoveInstrument = (idx: number) => {
    if (!analysis) return;
    const updated = [...analysis.instruments];
    updated.splice(idx, 1);
    onAnalysisChange({ ...analysis, instruments: updated });
  };

  const getPresetIcon = (iconName: string) => {
    switch (iconName) {
      case 'HeartCrack': return <HeartCrack className="h-3.5 w-3.5 text-rose-400" />;
      case 'Mic': return <Mic className="h-3.5 w-3.5 text-amber-400" />;
      case 'Film': return <Film className="h-3.5 w-3.5 text-cyan-400" />;
      case 'CloudRain': return <CloudRain className="h-3.5 w-3.5 text-blue-400" />;
      case 'Flame': return <Flame className="h-3.5 w-3.5 text-orange-400" />;
      default: return <Sparkles className="h-3.5 w-3.5 text-purple-400" />;
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 backdrop-blur-sm shadow-xl">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white">
              {t.promptHeader}
            </h2>
            <p className="text-[11px] text-slate-400">
              {language === 'km' ? 'វាយបញ្ចូល ឬបិទភ្ជាប់គំនិតបទចម្រៀងរបស់អ្នក' : 'Type or paste your song concept & direction'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePaste}
            type="button"
            className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-xs text-slate-300 hover:border-slate-600 hover:text-white transition"
            title="Paste from clipboard"
          >
            <ClipboardPaste className="h-3.5 w-3.5 text-cyan-400" />
            <span className="hidden sm:inline">{t.pastePrompt}</span>
          </button>
          {prompt && (
            <button
              onClick={onClear}
              type="button"
              className="flex items-center gap-1 rounded-lg border border-slate-700/60 bg-slate-800/60 px-2 py-1 text-xs text-rose-400 hover:bg-rose-950/40 hover:border-rose-700 transition"
              title="Clear Prompt"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t.clear}</span>
            </button>
          )}
        </div>
      </div>

      {/* Preset Chips */}
      <div>
        <div className="mb-1.5 text-[11px] font-medium text-slate-400">
          {t.presets}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {SAMPLE_PROMPT_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handlePresetSelect(preset.prompt)}
              className="group flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-950/60 px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:border-purple-500/50 hover:bg-purple-950/20 hover:text-white transition active:scale-95 text-left"
            >
              {getPresetIcon(preset.iconName)}
              <span>{language === 'km' ? preset.labelKhmer : preset.labelEnglish}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Prompt Textarea */}
      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder={t.promptPlaceholder}
          rows={4}
          className="w-full rounded-xl border border-slate-700 bg-slate-950/80 p-3.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition leading-relaxed"
        />
        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1 px-1">
          <span>{prompt.length} characters</span>
          <button
            onClick={onExpandPrompt}
            disabled={!prompt.trim() || isGenerating}
            className="flex items-center gap-1 text-purple-400 hover:text-purple-300 disabled:opacity-40 transition font-medium cursor-pointer"
          >
            <Wand2 className="h-3 w-3" />
            <span>{t.expandPrompt}</span>
          </button>
        </div>
      </div>

      {/* Primary Generation Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <button
          onClick={onGenerateFull}
          disabled={!prompt.trim() || isGenerating}
          className="sm:col-span-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-purple-600/30 hover:from-purple-500 hover:to-cyan-500 transition active:scale-98 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
        >
          <Sparkles className="h-4 w-4" />
          <span>{t.generateFull}</span>
        </button>

        <button
          onClick={onGenerateLyrics}
          disabled={!prompt.trim() || isGenerating}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-purple-500/40 bg-purple-950/30 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-purple-200 hover:bg-purple-900/40 hover:border-purple-400 transition active:scale-98 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
        >
          <FileText className="h-4 w-4 text-purple-400" />
          <span>{t.generateLyrics}</span>
        </button>

        <button
          onClick={onGenerateStyle}
          disabled={!prompt.trim() || isGenerating}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-950/30 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-cyan-200 hover:bg-cyan-900/40 hover:border-cyan-400 transition active:scale-98 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
        >
          <Music className="h-4 w-4 text-cyan-400" />
          <span>{t.generateStyle}</span>
        </button>
      </div>

      {/* Loading state bar if generating */}
      {isGenerating && (
        <div className="flex items-center gap-3 rounded-xl border border-purple-500/30 bg-purple-950/40 p-3 text-xs text-purple-200">
          <div className="flex items-end gap-1 h-4 w-5">
            <span className="w-1 bg-purple-400 rounded-full h-full animate-wave-1"></span>
            <span className="w-1 bg-cyan-400 rounded-full h-full animate-wave-2"></span>
            <span className="w-1 bg-pink-400 rounded-full h-full animate-wave-3"></span>
          </div>
          <span className="font-medium animate-pulse">{generatingStep || t.generating}</span>
        </div>
      )}

      {/* Detected Settings & Analysis Drawer */}
      {analysis && (
        <div className="mt-1 rounded-xl border border-slate-800 bg-slate-950/70 p-3.5 transition">
          <div 
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center justify-between cursor-pointer select-none"
          >
            <div className="flex items-center gap-2">
              <Sliders className="h-4 w-4 text-indigo-400" />
              <span className="text-xs sm:text-sm font-bold text-slate-200">
                {t.songAnalysis}: <span className="text-purple-300 font-semibold">{analysis.titleKhmer || analysis.titleEnglish}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAnalyzeOnly();
                }}
                className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
              >
                <span>{t.analyzeSettings}</span>
              </button>
              {showSettings ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
            </div>
          </div>

          {showSettings && (
            <div className="mt-3.5 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs border-t border-slate-800/80 pt-3">
              {/* Title & Theme */}
              <div className="flex flex-col gap-1">
                <label className="text-slate-400 font-medium">{t.songTitle} (Khmer / English):</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={analysis.titleKhmer}
                    onChange={(e) => onAnalysisChange({ ...analysis, titleKhmer: e.target.value })}
                    className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-slate-100 focus:border-purple-500 focus:outline-none"
                    placeholder="ចំណងជើងជាភាសាខ្មែរ"
                  />
                  <input
                    type="text"
                    value={analysis.titleEnglish}
                    onChange={(e) => onAnalysisChange({ ...analysis, titleEnglish: e.target.value })}
                    className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-slate-100 focus:border-purple-500 focus:outline-none"
                    placeholder="English title"
                  />
                </div>
              </div>

              {/* Genre & Emotion */}
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-slate-400 font-medium">{t.genre}:</label>
                  <input
                    type="text"
                    value={analysis.genre}
                    onChange={(e) => onAnalysisChange({ ...analysis, genre: e.target.value })}
                    className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-slate-100 focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-slate-400 font-medium">{t.emotion}:</label>
                  <input
                    type="text"
                    value={analysis.emotion}
                    onChange={(e) => onAnalysisChange({ ...analysis, emotion: e.target.value })}
                    className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-slate-100 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Vocal & Tempo */}
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-slate-400 font-medium">{t.vocalType}:</label>
                  <input
                    type="text"
                    value={analysis.vocalType}
                    onChange={(e) => onAnalysisChange({ ...analysis, vocalType: e.target.value })}
                    className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-slate-100 focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-slate-400 font-medium">{t.tempo}:</label>
                  <input
                    type="text"
                    value={analysis.tempoEnergy}
                    onChange={(e) => onAnalysisChange({ ...analysis, tempoEnergy: e.target.value })}
                    className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-slate-100 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Language & Rap verse switch */}
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-slate-400 font-medium">ភាសា / Language:</label>
                  <select
                    value={analysis.language}
                    onChange={(e) => onAnalysisChange({ ...analysis, language: e.target.value as any })}
                    className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-slate-100 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="Khmer">Khmer (ភាសាខ្មែរ)</option>
                    <option value="English">English</option>
                    <option value="Khmer-English Mixed">Khmer-English Mixed</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-slate-400 font-medium">{t.hasRap}:</label>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => onAnalysisChange({ ...analysis, hasRap: !analysis.hasRap })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                        analysis.hasRap ? 'bg-purple-600' : 'bg-slate-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          analysis.hasRap ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <span className="text-slate-300 text-xs">
                      {analysis.hasRap ? (language === 'km' ? 'មានវគ្គរ៉េប' : 'Rap Included') : (language === 'km' ? 'គ្មាន' : 'No Rap')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Instruments list */}
              <div className="md:col-span-2 flex flex-col gap-1">
                <label className="text-slate-400 font-medium">{t.instruments}:</label>
                <div className="flex flex-wrap items-center gap-1.5">
                  {analysis.instruments?.map((inst, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 rounded-md bg-slate-800 px-2 py-0.5 text-[11px] text-slate-200 border border-slate-700"
                    >
                      {inst}
                      <button
                        type="button"
                        onClick={() => handleRemoveInstrument(idx)}
                        className="text-slate-400 hover:text-rose-400 text-xs ml-0.5"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <div className="inline-flex items-center gap-1">
                    <input
                      type="text"
                      value={newInstrument}
                      onChange={(e) => setNewInstrument(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddInstrument()}
                      placeholder="Add instrument..."
                      className="rounded-md border border-slate-700 bg-slate-900 px-2 py-0.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 w-28"
                    />
                    <button
                      type="button"
                      onClick={handleAddInstrument}
                      className="rounded bg-slate-800 p-1 text-slate-300 hover:bg-slate-700"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
