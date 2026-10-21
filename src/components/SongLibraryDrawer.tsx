import React, { useState } from 'react';
import { 
  X, 
  FolderKanban, 
  Search, 
  Copy, 
  Trash2, 
  FileDown, 
  FileText, 
  Plus, 
  Calendar, 
  Music, 
  Sparkles,
  Cloud,
  Check,
  ExternalLink
} from 'lucide-react';
import { SongProject } from '../types/songwriter';
import { StorageService } from '../services/storage';
import { Language, TRANSLATIONS } from '../i18n/translations';

interface SongLibraryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  projects: SongProject[];
  activeProjectId: string | null;
  onSelectProject: (proj: SongProject) => void;
  onNewProject: () => void;
  onProjectsUpdated: () => void;
  language: Language;
}

export const SongLibraryDrawer: React.FC<SongLibraryDrawerProps> = ({
  isOpen,
  onClose,
  projects,
  activeProjectId,
  onSelectProject,
  onNewProject,
  onProjectsUpdated,
  language,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const t = TRANSLATIONS[language];

  // Distinct genres for filter
  const genres = ['all', ...Array.from(new Set(projects.map((p) => p.analysis?.genre).filter(Boolean)))];

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      (p.titleKhmer || p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.analysis?.theme || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.originalPrompt || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGenre = selectedGenre === 'all' || p.analysis?.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const handleDuplicate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const duplicated = StorageService.duplicateProject(id);
    if (duplicated) {
      onProjectsUpdated();
      onSelectProject(duplicated);
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(language === 'km' ? 'តើអ្នកប្រាកដជាចង់លុបគម្រោងចម្រៀងនេះមែនទេ?' : 'Are you sure you want to delete this song project?')) {
      StorageService.deleteProject(id);
      onProjectsUpdated();
    }
  };

  const handleExport = (project: SongProject, format: 'txt' | 'md' | 'json', e: React.MouseEvent) => {
    e.stopPropagation();
    if (format === 'txt') StorageService.exportAsText(project);
    if (format === 'md') StorageService.exportAsMarkdown(project);
    if (format === 'json') StorageService.exportAsJson(project);

    setExportNotice(`${project.title} exported as .${format.toUpperCase()}`);
    setTimeout(() => setExportNotice(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="flex h-full w-full max-w-md flex-col border-l border-slate-800 bg-slate-950 p-4 sm:p-5 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FolderKanban className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {t.savedSongs}
              </h3>
              <p className="text-xs text-slate-400">
                {projects.length} {language === 'km' ? 'បទចម្រៀងនៅក្នុងស្ទូឌីយោ' : 'songs in your studio'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-900 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search & Genre Filters */}
        <div className="my-3.5 flex flex-col gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchSongs}
              className="w-full rounded-xl border border-slate-800 bg-slate-900/90 py-1.5 pl-8 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:border-purple-500 focus:outline-none"
            />
          </div>

          {genres.length > 2 && (
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px]">
              {genres.map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGenre(g)}
                  className={`rounded-full px-2.5 py-0.5 whitespace-nowrap transition ${
                    selectedGenre === g
                      ? 'bg-purple-600 text-white font-medium'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {g === 'all' ? t.filterGenre : g}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Export Notification Toast */}
        {exportNotice && (
          <div className="mb-2 flex items-center gap-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 p-2 text-xs text-emerald-300">
            <Check className="h-3.5 w-3.5" />
            <span>{exportNotice}</span>
          </div>
        )}

        {/* Project List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              <Music className="h-8 w-8 mx-auto mb-2 text-slate-600" />
              <p>{language === 'km' ? 'មិនមានបទចម្រៀងត្រូវនឹងការស្វែងរក' : 'No song projects found.'}</p>
            </div>
          ) : (
            filteredProjects.map((proj) => {
              const isActive = proj.id === activeProjectId;
              return (
                <div
                  key={proj.id}
                  onClick={() => {
                    onSelectProject(proj);
                    onClose();
                  }}
                  className={`group relative flex flex-col gap-2 rounded-xl border p-3 cursor-pointer transition ${
                    isActive
                      ? 'border-purple-500/80 bg-purple-950/30 shadow-md shadow-purple-500/10'
                      : 'border-slate-800/80 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900/90'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-purple-300 transition">
                        {proj.titleKhmer || proj.title}
                      </h4>
                      {proj.analysis?.titleEnglish && (
                        <p className="text-[11px] text-slate-400">
                          {proj.analysis.titleEnglish}
                        </p>
                      )}
                    </div>
                    {isActive && (
                      <span className="rounded-full bg-purple-500/20 border border-purple-500/30 px-2 py-0.5 text-[10px] font-semibold text-purple-300">
                        Active
                      </span>
                    )}
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                    <span className="rounded bg-slate-800 px-1.5 py-0.5 text-slate-300 border border-slate-700/60">
                      {proj.analysis?.genre || 'Ballad'}
                    </span>
                    <span className="rounded bg-indigo-950/50 px-1.5 py-0.5 text-indigo-300 border border-indigo-800/40">
                      {proj.analysis?.tempoEnergy || '68 BPM'}
                    </span>
                    {proj.analysis?.hasRap && (
                      <span className="rounded bg-amber-950/50 px-1.5 py-0.5 text-amber-300 border border-amber-800/40">
                        Rap Verse
                      </span>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-slate-500" />
                      {new Date(proj.updatedAt || proj.createdAt).toLocaleDateString()}
                    </span>

                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      {/* Exports */}
                      <button
                        onClick={(e) => handleExport(proj, 'txt', e)}
                        className="rounded p-1 text-slate-400 hover:text-white hover:bg-slate-800 transition"
                        title={t.exportTxt}
                      >
                        TXT
                      </button>
                      <button
                        onClick={(e) => handleExport(proj, 'md', e)}
                        className="rounded p-1 text-slate-400 hover:text-white hover:bg-slate-800 transition"
                        title={t.exportMd}
                      >
                        MD
                      </button>
                      <button
                        onClick={(e) => handleExport(proj, 'json', e)}
                        className="rounded p-1 text-slate-400 hover:text-white hover:bg-slate-800 transition"
                        title={t.exportJson}
                      >
                        JSON
                      </button>

                      {/* Duplicate */}
                      <button
                        onClick={(e) => handleDuplicate(proj.id, e)}
                        className="rounded p-1 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition"
                        title={t.duplicate}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={(e) => handleDelete(proj.id, e)}
                        className="rounded p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition"
                        title={t.delete}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info: Local storage + Firebase ready */}
        <div className="border-t border-slate-800 pt-3 text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Cloud className="h-3.5 w-3.5 text-purple-400" />
            <span>{language === 'km' ? 'ផ្ទុកទិន្នន័យក្នុងឧបករណ៍ (Offline & Guest Ready)' : 'Local Storage Mode'}</span>
          </div>
          <button
            onClick={() => {
              onNewProject();
              onClose();
            }}
            className="flex items-center gap-1 rounded-lg bg-purple-600 px-3 py-1 font-semibold text-white hover:bg-purple-500 transition text-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{t.newSong}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
