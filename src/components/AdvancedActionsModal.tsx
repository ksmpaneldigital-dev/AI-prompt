import React, { useState } from 'react';
import { 
  X, 
  SlidersHorizontal, 
  Sparkles, 
  Youtube, 
  Music, 
  Copy, 
  Check, 
  Layers, 
  Image as ImageIcon,
  Flame,
  CheckCircle,
  Lightbulb,
  Radio,
  FileText
} from 'lucide-react';
import { AlternativeChorus, YouTubeMetadata, ArrangementGuide } from '../types/songwriter';
import { Language, TRANSLATIONS } from '../i18n/translations';

interface AdvancedActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lyrics: string;
  songTitle: string;
  onReplaceChorus: (newChorusLyrics: string) => void;
  onAiAction: (action: string, payload?: any) => Promise<any>;
  isProcessing: boolean;
  language: Language;
}

export const AdvancedActionsModal: React.FC<AdvancedActionsModalProps> = ({
  isOpen,
  onClose,
  lyrics,
  songTitle,
  onReplaceChorus,
  onAiAction,
  isProcessing,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<'hooks' | 'youtube' | 'arrangement' | 'mood'>('hooks');
  const [alternativeHooks, setAlternativeHooks] = useState<AlternativeChorus[]>([]);
  const [youtubeData, setYoutubeData] = useState<YouTubeMetadata | null>(null);
  const [arrangementGuide, setArrangementGuide] = useState<ArrangementGuide | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const t = TRANSLATIONS[language];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleFetchHooks = async () => {
    const res = await onAiAction('alternative-choruses', { lyrics, title: songTitle });
    if (res?.result && Array.isArray(res.result)) {
      setAlternativeHooks(res.result);
    }
  };

  const handleFetchYouTube = async () => {
    const res = await onAiAction('youtube-metadata', { lyrics, title: songTitle });
    if (res?.result) {
      setYoutubeData(res.result);
    }
  };

  const handleFetchArrangement = async () => {
    const res = await onAiAction('instrumentation-guide', { lyrics, title: songTitle });
    if (res?.result) {
      setArrangementGuide(res.result);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative flex flex-col w-full max-w-3xl max-h-[90vh] rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <SlidersHorizontal className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {language === 'km' ? 'ឧបករណ៍ជំនួយការ AI កម្រិតខ្ពស់' : 'Advanced AI Music Studio Tools'}
              </h3>
              <p className="text-xs text-slate-400">
                {songTitle || 'Current Song Project'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-5 gap-2 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab('hooks')}
            className={`flex items-center gap-1.5 border-b-2 py-3 px-2 transition whitespace-nowrap ${
              activeTab === 'hooks'
                ? 'border-purple-500 text-purple-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>{language === 'km' ? '៣ បន្ទរជម្រើស (Alt Hooks)' : '3 Alt Chorus Hooks'}</span>
          </button>

          <button
            onClick={() => setActiveTab('youtube')}
            className={`flex items-center gap-1.5 border-b-2 py-3 px-2 transition whitespace-nowrap ${
              activeTab === 'youtube'
                ? 'border-rose-500 text-rose-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Youtube className="h-4 w-4" />
            <span>{language === 'km' ? 'YouTube & Thumbnail Prompts' : 'YouTube & Thumbnail'}</span>
          </button>

          <button
            onClick={() => setActiveTab('arrangement')}
            className={`flex items-center gap-1.5 border-b-2 py-3 px-2 transition whitespace-nowrap ${
              activeTab === 'arrangement'
                ? 'border-cyan-500 text-cyan-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>{language === 'km' ? 'តន្ត្រីវិទ្យា & ការរៀបចំឧបករណ៍' : 'Arrangement & Stems'}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 text-slate-200 text-xs sm:text-sm">
          {/* TAB 1: 3 Alternative Chorus Hooks */}
          {activeTab === 'hooks' && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-purple-950/20 border border-purple-500/20 p-3">
                <p className="text-purple-300 text-xs">
                  {language === 'km'
                    ? 'បង្កើតបន្ទរ (Chorus) ៣ បែបប្លែកៗគ្នា ដើម្បីជ្រើសរើសមួយដែលអ្នកពេញចិត្តបំផុត។'
                    : 'Generate 3 distinctly creative alternative Chorus hooks with emotional rhyming meters.'}
                </p>
                <button
                  onClick={handleFetchHooks}
                  disabled={isProcessing}
                  className="rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-purple-500 transition disabled:opacity-50 cursor-pointer"
                >
                  {isProcessing ? 'Generating...' : (language === 'km' ? 'បង្កើតបន្ទរ ៣ ថ្មី' : 'Generate 3 Hooks')}
                </button>
              </div>

              {alternativeHooks.length === 0 ? (
                <div className="text-center py-10 text-slate-500">
                  <Sparkles className="h-8 w-8 mx-auto mb-2 text-slate-600" />
                  <p>Click "Generate 3 Hooks" to create alternative chorus options.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {alternativeHooks.map((hook, idx) => (
                    <div
                      key={hook.id || idx}
                      className="flex flex-col gap-2 rounded-xl border border-slate-800 bg-slate-950/70 p-4 hover:border-purple-500/40 transition"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-purple-300 text-xs sm:text-sm flex items-center gap-1.5">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-600/30 text-[10px] text-purple-200">
                            {idx + 1}
                          </span>
                          {hook.title}
                        </span>
                        <span className="text-[11px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
                          {hook.mood}
                        </span>
                      </div>
                      <div className="rounded-lg bg-slate-900/90 p-3 text-xs sm:text-sm font-sans text-slate-200 whitespace-pre-wrap leading-relaxed border border-slate-800/80">
                        {hook.lyrics}
                      </div>
                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          onClick={() => handleCopy(hook.lyrics, `hook-${idx}`)}
                          className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:text-white"
                        >
                          {copiedKey === `hook-${idx}` ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                          <span>{copiedKey === `hook-${idx}` ? t.copied : 'Copy'}</span>
                        </button>
                        <button
                          onClick={() => {
                            onReplaceChorus(hook.lyrics);
                            onClose();
                          }}
                          className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:opacity-90 shadow"
                        >
                          <CheckCircle className="h-3 w-3" />
                          <span>{language === 'km' ? 'ប្រើបន្ទរនេះក្នុងបទ' : 'Use This Chorus'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: YouTube Metadata & Thumbnail Prompts */}
          {activeTab === 'youtube' && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-rose-950/20 border border-rose-500/20 p-3">
                <p className="text-rose-300 text-xs">
                  {language === 'km'
                    ? 'បង្កើតចំណងជើង YouTube SEO, ការពិពណ៌នា, Hashtags និង Prompt សម្រាប់គូររូប Thumbnail ដោយ AI។'
                    : 'Generate YouTube SEO titles, description, hashtags, and Midjourney/Flux image prompts for thumbnails.'}
                </p>
                <button
                  onClick={handleFetchYouTube}
                  disabled={isProcessing}
                  className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-500 transition disabled:opacity-50 cursor-pointer"
                >
                  {isProcessing ? 'Generating...' : (language === 'km' ? 'បង្កើត YouTube Package' : 'Generate Package')}
                </button>
              </div>

              {youtubeData ? (
                <div className="flex flex-col gap-4">
                  {/* Titles */}
                  <div className="flex flex-col gap-2 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                    <span className="font-bold text-slate-300 text-xs">3 Click-Worthy Titles:</span>
                    {youtubeData.titles?.map((tStr, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg bg-slate-900 p-2.5 border border-slate-800 text-xs">
                        <span className="text-slate-100">{tStr}</span>
                        <button
                          onClick={() => handleCopy(tStr, `yt-title-${i}`)}
                          className="text-slate-400 hover:text-white ml-2 shrink-0"
                        >
                          {copiedKey === `yt-title-${i}` ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Thumbnail Prompt */}
                  <div className="flex flex-col gap-2 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-300 text-xs flex items-center gap-1.5">
                        <ImageIcon className="h-4 w-4 text-purple-400" />
                        Thumbnail Image Prompt (Midjourney / Flux / Gemini):
                      </span>
                      <button
                        onClick={() => handleCopy(youtubeData.thumbnailPrompt, 'yt-thumb')}
                        className="text-slate-400 hover:text-white"
                      >
                        {copiedKey === 'yt-thumb' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                    <div className="rounded-lg bg-slate-900 p-3 text-xs font-mono text-purple-200 border border-slate-800 leading-relaxed">
                      {youtubeData.thumbnailPrompt}
                    </div>
                  </div>

                  {/* Description & Hashtags */}
                  <div className="flex flex-col gap-2 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-300 text-xs">YouTube Video Description:</span>
                      <button
                        onClick={() => handleCopy(youtubeData.description, 'yt-desc')}
                        className="text-slate-400 hover:text-white"
                      >
                        {copiedKey === 'yt-desc' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                    <div className="rounded-lg bg-slate-900 p-3 text-xs font-sans text-slate-300 border border-slate-800 max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                      {youtubeData.description}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-slate-500">
                  <Youtube className="h-8 w-8 mx-auto mb-2 text-slate-600" />
                  <p>Click "Generate Package" to prepare ready-to-publish YouTube metadata.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Arrangement Guide & Instrumentation */}
          {activeTab === 'arrangement' && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-cyan-950/20 border border-cyan-500/20 p-3">
                <p className="text-cyan-300 text-xs">
                  {language === 'km'
                    ? 'ការណែនាំពីរបៀបលាយសំឡេង (Mixing) កម្រិតថាមពល (Dynamics) និងការរៀបចំឧបករណ៍តន្ត្រីតាមវគ្គនីមួយៗ។'
                    : 'Professional studio instrumentation layers, BPM & musical key suggestions, dynamic progression, and audio mixing recommendations.'}
                </p>
                <button
                  onClick={handleFetchArrangement}
                  disabled={isProcessing}
                  className="rounded-lg bg-cyan-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-cyan-500 transition disabled:opacity-50 cursor-pointer"
                >
                  {isProcessing ? 'Generating...' : (language === 'km' ? 'បង្កើតការណែនាំ' : 'Generate Guide')}
                </button>
              </div>

              {arrangementGuide ? (
                <div className="flex flex-col gap-4">
                  {/* Tempo & Key */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5">
                      <span className="text-[11px] text-slate-400 block mb-1">Recommended Tempo / BPM:</span>
                      <span className="font-bold text-slate-100 text-sm">{arrangementGuide.tempoBpm}</span>
                    </div>
                    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5">
                      <span className="text-[11px] text-slate-400 block mb-1">Suggested Musical Key:</span>
                      <span className="font-bold text-cyan-300 text-sm">{arrangementGuide.musicalKeySuggestion}</span>
                    </div>
                  </div>

                  {/* Section Layers Table */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                    <span className="font-bold text-slate-300 text-xs mb-3 block">Section-by-Section Arrangement:</span>
                    <div className="flex flex-col gap-2">
                      {arrangementGuide.instrumentLayers?.map((layer, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg bg-slate-900 p-2.5 border border-slate-800 text-xs">
                          <span className="font-bold text-purple-400 w-28 shrink-0">{layer.section}</span>
                          <span className="text-slate-300 flex-1">{layer.instruments}</span>
                          <span className="text-slate-400 font-mono text-[11px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800 shrink-0">
                            {layer.dynamics}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mixing Tips */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                    <span className="font-bold text-slate-300 text-xs mb-2 block">Audio Mixing & EQ Tips:</span>
                    <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-300">
                      {arrangementGuide.mixingTips?.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-slate-500">
                  <Layers className="h-8 w-8 mx-auto mb-2 text-slate-600" />
                  <p>Click "Generate Guide" to receive musical arrangement and stem production suggestions.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
