import React from 'react';
import { 
  Music2, 
  PlusCircle, 
  FolderKanban, 
  Sparkles, 
  Globe2, 
  SlidersHorizontal,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { ServerStatus } from '../services/apiClient';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onNewSong: () => void;
  onOpenLibrary: () => void;
  onOpenAdvanced: () => void;
  serverStatus: ServerStatus | null;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  onNewSong,
  onOpenLibrary,
  onOpenAdvanced,
  serverStatus,
  savedCount,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md px-4 py-3 sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 shadow-lg shadow-purple-500/20">
            <Music2 className="h-5 w-5 text-white" />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                AI Khmer Songwriter <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent font-black">PRO</span>
              </h1>
              {/* Audio visualizer wave bars */}
              <div className="hidden sm:flex items-end gap-0.5 h-4 w-6 px-1">
                <span className="w-1 bg-purple-500 rounded-full h-full animate-wave-1"></span>
                <span className="w-1 bg-indigo-400 rounded-full h-full animate-wave-2"></span>
                <span className="w-1 bg-cyan-400 rounded-full h-full animate-wave-3"></span>
                <span className="w-1 bg-pink-500 rounded-full h-full animate-wave-4"></span>
              </div>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Action Controls & Badges */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Status Pill */}
          <div className="hidden md:flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/80 px-2.5 py-1 text-xs">
            {serverStatus?.apiKeyConfigured ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-slate-300 font-medium">Gemini 3.8 Flash</span>
                <span className="rounded bg-emerald-500/20 px-1 py-0.2 text-[10px] font-semibold text-emerald-300">Live AI</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-slate-300 font-medium">Khmer Studio Pro</span>
                <span className="rounded bg-amber-500/20 px-1 py-0.2 text-[10px] font-semibold text-amber-300">Demo Ready</span>
              </>
            )}
          </div>

          {/* Language Switcher */}
          <button
            onClick={() => onLanguageChange(language === 'km' ? 'en' : 'km')}
            className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:border-slate-700 hover:bg-slate-800 transition"
            title="Toggle Language (ខ្មែរ / English)"
          >
            <Globe2 className="h-3.5 w-3.5 text-cyan-400" />
            <span>{language === 'km' ? 'ខ្មែរ' : 'English'}</span>
          </button>

          {/* Advanced Tools Button */}
          <button
            onClick={onOpenAdvanced}
            className="hidden lg:flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-purple-600/50 hover:bg-purple-950/30 transition"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-purple-400" />
            <span>{t.advancedTools}</span>
          </button>

          {/* Library Button */}
          <button
            onClick={onOpenLibrary}
            className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-slate-700 hover:bg-slate-800 transition relative"
          >
            <FolderKanban className="h-3.5 w-3.5 text-indigo-400" />
            <span className="hidden sm:inline">{t.library}</span>
            {savedCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-purple-600 px-1 text-[10px] font-bold text-white">
                {savedCount}
              </span>
            )}
          </button>

          {/* New Song Button */}
          <button
            onClick={onNewSong}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-purple-600/30 hover:from-purple-500 hover:to-indigo-500 transition active:scale-95"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>{t.newSong}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
