import React, { useState, useRef, useEffect } from 'react';
import { 
  FileEdit, 
  Copy, 
  Check, 
  Undo2, 
  Redo2, 
  Search, 
  Replace, 
  Sparkles, 
  Clock, 
  Type, 
  RefreshCw, 
  Heart, 
  Mic, 
  Languages, 
  Scissors,
  Wand2,
  ChevronDown,
  Volume2
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../i18n/translations';

interface LyricsEditorProps {
  lyrics: string;
  onChange: (val: string) => void;
  title: string;
  onTitleChange: (val: string) => void;
  onAiAction: (action: string, payload?: any) => Promise<any>;
  isProcessing: boolean;
  language: Language;
}

export const LyricsEditor: React.FC<LyricsEditorProps> = ({
  lyrics,
  onChange,
  title,
  onTitleChange,
  onAiAction,
  isProcessing,
  language,
}) => {
  const [history, setHistory] = useState<string[]>([lyrics]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [showFindReplace, setShowFindReplace] = useState<boolean>(false);
  const [findText, setFindText] = useState<string>('');
  const [replaceText, setReplaceText] = useState<string>('');
  const [selectedText, setSelectedText] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const t = TRANSLATIONS[language];

  // Sync incoming lyrics if new generation arrives
  useEffect(() => {
    if (lyrics !== history[historyIndex]) {
      const nextHistory = history.slice(0, historyIndex + 1);
      nextHistory.push(lyrics);
      setHistory(nextHistory);
      setHistoryIndex(nextHistory.length - 1);
    }
  }, [lyrics]);

  const updateLyrics = (newVal: string) => {
    onChange(newVal);
    const nextHistory = history.slice(0, historyIndex + 1);
    nextHistory.push(newVal);
    // Keep max 30 history states
    if (nextHistory.length > 30) nextHistory.shift();
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      onChange(prev);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      onChange(next);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(lyrics);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInsertTag = (tag: string) => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = lyrics.substring(0, start);
    const after = lyrics.substring(end);
    const insertion = `\n${tag}\n`;
    const updated = before + insertion + after;
    updateLyrics(updated);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + insertion.length, start + insertion.length);
    }, 50);
  };

  const handleTextareaSelect = () => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    if (start !== end) {
      setSelectedText(lyrics.substring(start, end));
    } else {
      setSelectedText('');
    }
  };

  const handleFindReplace = () => {
    if (!findText) return;
    const regex = new RegExp(findText, 'g');
    const updated = lyrics.replace(regex, replaceText);
    updateLyrics(updated);
  };

  // Word, line, and singing duration calculations
  const wordCount = lyrics.trim() ? lyrics.trim().split(/\s+/).length : 0;
  const lineCount = lyrics.split('\n').length;
  // Average singing tempo is ~70-90 words per minute for ballad, ~120 for pop
  const estMinutes = Math.floor(wordCount / 85);
  const estSeconds = Math.round(((wordCount / 85) - estMinutes) * 60);

  const sectionTags = [
    '[Intro]',
    '[Verse 1]',
    '[Pre-Chorus]',
    '[Chorus]',
    '[Verse 2]',
    '[Rap Verse]',
    '[Bridge]',
    '[Final Chorus]',
    '[Outro]',
  ];

  return (
    <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm shadow-xl overflow-hidden">
      {/* Studio Header Bar */}
      <div className="border-b border-slate-800 bg-slate-950/70 p-3.5 sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <FileEdit className="h-4 w-4 text-purple-400" />
            <input
              type="text"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              className="bg-transparent font-bold text-sm sm:text-base text-white focus:outline-none focus:border-b focus:border-purple-500 w-full"
              placeholder="Song Title..."
            />
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Undo / Redo */}
            <div className="flex items-center rounded-lg border border-slate-800 bg-slate-900 p-0.5">
              <button
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className="rounded p-1 text-slate-400 hover:text-white disabled:opacity-30 transition"
                title={t.undo}
              >
                <Undo2 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                className="rounded p-1 text-slate-400 hover:text-white disabled:opacity-30 transition"
                title={t.redo}
              >
                <Redo2 className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Find / Replace toggle */}
            <button
              onClick={() => setShowFindReplace(!showFindReplace)}
              className={`rounded-lg border px-2.5 py-1 text-xs transition flex items-center gap-1 ${
                showFindReplace
                  ? 'border-purple-500 bg-purple-950/50 text-purple-200'
                  : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
              }`}
            >
              <Search className="h-3.5 w-3.5 text-cyan-400" />
              <span className="hidden sm:inline">{t.findReplace}</span>
            </button>

            {/* Copy Lyrics */}
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-200 hover:border-slate-700 hover:bg-slate-800 transition active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">{t.copied}</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-purple-400" />
                  <span>{t.copyLyrics}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Word / Line counters & Singing duration estimate */}
        <div className="mt-2.5 flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
          <div className="flex items-center gap-1">
            <Type className="h-3.5 w-3.5 text-purple-400" />
            <span><strong className="text-slate-200">{wordCount}</strong> {t.wordCount}</span>
          </div>
          <span className="text-slate-600">•</span>
          <div>
            <span><strong className="text-slate-200">{lineCount}</strong> {t.lineCount}</span>
          </div>
          <span className="text-slate-600">•</span>
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-cyan-400" />
            <span>{t.estSingTime}: <strong className="text-slate-200">~{estMinutes}:{estSeconds < 10 ? '0' : ''}{estSeconds} min</strong></span>
          </div>
          {selectedText && (
            <div className="ml-auto text-purple-300 bg-purple-950/40 border border-purple-500/30 px-2 py-0.5 rounded-md text-[10px]">
              Highlighted: {selectedText.length} chars
            </div>
          )}
        </div>
      </div>

      {/* Find & Replace Bar (Collapsible) */}
      {showFindReplace && (
        <div className="border-b border-slate-800 bg-slate-950/90 p-2.5 flex flex-wrap items-center gap-2 text-xs">
          <input
            type="text"
            value={findText}
            onChange={(e) => setFindText(e.target.value)}
            placeholder="Find text..."
            className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-slate-200 focus:border-purple-500 focus:outline-none w-36 sm:w-44"
          />
          <input
            type="text"
            value={replaceText}
            onChange={(e) => setReplaceText(e.target.value)}
            placeholder="Replace with..."
            className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-slate-200 focus:border-purple-500 focus:outline-none w-36 sm:w-44"
          />
          <button
            onClick={handleFindReplace}
            className="flex items-center gap-1 rounded-lg bg-purple-600 px-3 py-1 font-medium text-white hover:bg-purple-500 transition"
          >
            <Replace className="h-3.5 w-3.5" />
            <span>Replace All</span>
          </button>
        </div>
      )}

      {/* Section Insertion Tags Toolbar */}
      <div className="border-b border-slate-800/80 bg-slate-950/50 px-3 py-1.5 flex items-center gap-1.5 overflow-x-auto text-[11px]">
        <span className="text-slate-500 font-medium whitespace-nowrap">{t.insertTag}</span>
        {sectionTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => handleInsertTag(tag)}
            className="rounded-md border border-slate-800 bg-slate-900/80 px-2 py-0.5 text-slate-300 hover:border-purple-500/60 hover:text-white hover:bg-purple-950/30 transition whitespace-nowrap cursor-pointer"
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Main Lyrics Textarea */}
      <div className="relative p-3.5 sm:p-4">
        <textarea
          ref={textareaRef}
          value={lyrics}
          onChange={(e) => updateLyrics(e.target.value)}
          onSelect={handleTextareaSelect}
          placeholder="Lyrics will be generated here in Khmer with poetic meter..."
          rows={16}
          className="w-full bg-transparent font-sans text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none leading-relaxed resize-y selection:bg-purple-600/40"
          style={{ minHeight: '380px' }}
        />
      </div>

      {/* AI Quick Enhancement Toolbar on Lyrics */}
      <div className="border-t border-slate-800 bg-slate-950/80 p-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Improve Rhymes */}
          <button
            onClick={() => onAiAction('improve-rhymes', { lyrics, title })}
            disabled={!lyrics.trim() || isProcessing}
            className="flex items-center gap-1 rounded-lg border border-purple-500/30 bg-purple-950/20 px-2.5 py-1 text-xs font-medium text-purple-200 hover:bg-purple-900/40 hover:border-purple-400 transition disabled:opacity-40"
          >
            <Sparkles className="h-3 w-3 text-purple-400" />
            <span>{t.improveRhymes}</span>
          </button>

          {/* More Emotional */}
          <button
            onClick={() => onAiAction('adjust-emotion', { lyrics, title, targetEmotion: 'Deeply sorrowful & emotional tearjerker' })}
            disabled={!lyrics.trim() || isProcessing}
            className="flex items-center gap-1 rounded-lg border border-rose-500/30 bg-rose-950/20 px-2.5 py-1 text-xs font-medium text-rose-200 hover:bg-rose-900/40 hover:border-rose-400 transition disabled:opacity-40"
          >
            <Heart className="h-3 w-3 text-rose-400" />
            <span>{t.moreEmotional}</span>
          </button>

          {/* Simplify for Singing */}
          <button
            onClick={() => onAiAction('simplify-for-singing', { lyrics, title })}
            disabled={!lyrics.trim() || isProcessing}
            className="flex items-center gap-1 rounded-lg border border-cyan-500/30 bg-cyan-950/20 px-2.5 py-1 text-xs font-medium text-cyan-200 hover:bg-cyan-900/40 hover:border-cyan-400 transition disabled:opacity-40"
          >
            <Volume2 className="h-3 w-3 text-cyan-400" />
            <span>{t.simplifySinging}</span>
          </button>

          {/* Add / Remove Rap */}
          {lyrics.includes('[Rap') ? (
            <button
              onClick={() => onAiAction('remove-rap', { lyrics, title })}
              disabled={!lyrics.trim() || isProcessing}
              className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-slate-800 transition disabled:opacity-40"
            >
              <Mic className="h-3 w-3 text-slate-400" />
              <span>{t.removeRap}</span>
            </button>
          ) : (
            <button
              onClick={() => onAiAction('add-rap', { lyrics, title })}
              disabled={!lyrics.trim() || isProcessing}
              className="flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-950/20 px-2.5 py-1 text-xs font-medium text-amber-200 hover:bg-amber-900/40 hover:border-amber-400 transition disabled:opacity-40"
            >
              <Mic className="h-3 w-3 text-amber-400" />
              <span>{t.addRap}</span>
            </button>
          )}

          {/* Shorten */}
          <button
            onClick={() => onAiAction('shorten', { lyrics, title })}
            disabled={!lyrics.trim() || isProcessing}
            className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-slate-800 transition disabled:opacity-40"
          >
            <Scissors className="h-3 w-3 text-slate-400" />
            <span>{t.shortenLyrics}</span>
          </button>

          {/* Translate */}
          <button
            onClick={() => onAiAction('translate', { lyrics, title, targetLanguage: 'Bilingual Khmer & English' })}
            disabled={!lyrics.trim() || isProcessing}
            className="flex items-center gap-1 rounded-lg border border-indigo-500/30 bg-indigo-950/20 px-2.5 py-1 text-xs font-medium text-indigo-200 hover:bg-indigo-900/40 hover:border-indigo-400 transition disabled:opacity-40"
          >
            <Languages className="h-3 w-3 text-indigo-400" />
            <span>{t.translateSong}</span>
          </button>
        </div>

        {/* Regenerate highlighted section */}
        {selectedText && (
          <button
            onClick={() => onAiAction('regenerate-section', { lyrics, selectedText, title })}
            disabled={isProcessing}
            className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1 text-xs font-semibold text-white shadow hover:opacity-90 transition active:scale-95"
          >
            <RefreshCw className="h-3 w-3 animate-spin" />
            <span>{t.regenSelected}</span>
          </button>
        )}
      </div>
    </div>
  );
};
