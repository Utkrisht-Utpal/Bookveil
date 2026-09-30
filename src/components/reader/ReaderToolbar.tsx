import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Search,
  List,
  Palette,
  Sliders,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Highlighter,
  BookOpen,
  ScrollText,
  HelpCircle,
} from 'lucide-react';
import { ThemeId, ReaderSettings, Book } from '../../types';
import { calculateReadingTimeRemaining } from '../../utils/readingTime';

interface ReaderToolbarProps {
  book: Book;
  currentPage: number;
  totalPages: number;
  currentChapterTitle?: string;
  isVisible: boolean;
  settings: ReaderSettings;
  isFullscreen: boolean;
  isBookmarked: boolean;
  activePanel: 'none' | 'contents' | 'search' | 'bookmarks' | 'notes' | 'theme' | 'settings' | 'shortcuts';
  onTogglePanel: (panel: 'contents' | 'search' | 'bookmarks' | 'notes' | 'theme' | 'settings' | 'shortcuts') => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  onSelectPage: (pageNum: number) => void;
  onBackToLibrary: () => void;
  onToggleFullscreen: () => void;
  onToggleBookmark: () => void;
  onToggleSound: () => void;
  onToggleViewMode: () => void;
}

export const ReaderToolbar: React.FC<ReaderToolbarProps> = ({
  book,
  currentPage,
  totalPages,
  currentChapterTitle,
  isVisible,
  settings,
  isFullscreen,
  isBookmarked,
  activePanel,
  onTogglePanel,
  onPrevPage,
  onNextPage,
  onSelectPage,
  onBackToLibrary,
  onToggleFullscreen,
  onToggleBookmark,
  onToggleSound,
  onToggleViewMode,
}) => {
  const readingStats = calculateReadingTimeRemaining(currentPage, totalPages);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.25 }}
          className="fixed top-0 left-0 right-0 z-40 pointer-events-none"
        >
          {/* Top Bar */}
          <div className="w-full bg-[#171916]/80 backdrop-blur-md border-b border-white/10 text-[#E8E3D7] px-4 py-2.5 pointer-events-auto shadow-md">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              
              {/* Left: Back to Library & Title */}
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={onBackToLibrary}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-[#E8E3D7] transition-colors focus:outline-none flex items-center gap-1.5 text-xs font-sans"
                  title="Back to Library"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Library</span>
                </button>

                <div className="h-4 w-[1px] bg-white/15 hidden sm:block"></div>

                <div className="min-w-0">
                  <h2 className="font-serif text-sm font-semibold truncate text-[#FAF8F5]">
                    {book.title}
                  </h2>
                  {currentChapterTitle && (
                    <p className="text-[11px] font-sans opacity-70 truncate max-w-[200px] sm:max-w-xs">
                      {currentChapterTitle}
                    </p>
                  )}
                </div>
              </div>

              {/* Center: Dynamic Reading Progress & Time Remaining */}
              <div className="hidden md:flex items-center gap-2 text-xs font-sans text-[#E8E3D7]/90 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                <span>{readingStats.formattedText}</span>
              </div>

              {/* Right: Feature Tool Buttons */}
              <div className="flex items-center gap-1 sm:gap-1.5">
                
                {/* Mobile / Screen View Switch: Flip mode vs Continuous scroll */}
                <button
                  onClick={onToggleViewMode}
                  className={`p-2 rounded-lg transition-colors text-xs flex items-center gap-1 ${
                    settings.viewMode === 'scroll'
                      ? 'bg-[#6F8068] text-white'
                      : 'hover:bg-white/10 text-[#E8E3D7]'
                  }`}
                  title={settings.viewMode === 'scroll' ? 'Switch to Physical Flip Spread' : 'Switch to Continuous Scroll View'}
                >
                  {settings.viewMode === 'scroll' ? (
                    <>
                      <ScrollText className="w-4 h-4" />
                      <span className="hidden lg:inline text-[11px]">Scroll</span>
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-4 h-4" />
                      <span className="hidden lg:inline text-[11px]">Book Spread</span>
                    </>
                  )}
                </button>

                {/* Table of Contents */}
                <button
                  onClick={() => onTogglePanel('contents')}
                  className={`p-2 rounded-lg transition-colors ${
                    activePanel === 'contents' ? 'bg-[#6F8068] text-white' : 'hover:bg-white/10 text-[#E8E3D7]'
                  }`}
                  title="Table of Contents (C)"
                >
                  <List className="w-4 h-4" />
                </button>

                {/* Search */}
                <button
                  onClick={() => onTogglePanel('search')}
                  className={`p-2 rounded-lg transition-colors ${
                    activePanel === 'search' ? 'bg-[#6F8068] text-white' : 'hover:bg-white/10 text-[#E8E3D7]'
                  }`}
                  title="Search Book (S)"
                >
                  <Search className="w-4 h-4" />
                </button>

                {/* Bookmark Toggle */}
                <button
                  onClick={onToggleBookmark}
                  className={`p-2 rounded-lg transition-colors ${
                    isBookmarked ? 'text-[#B79B68] bg-white/10' : 'hover:bg-white/10 text-[#E8E3D7]'
                  }`}
                  title="Bookmark Current Page (B)"
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-[#B79B68]' : ''}`} />
                </button>

                {/* Bookmarks & Notes List */}
                <button
                  onClick={() => onTogglePanel('notes')}
                  className={`p-2 rounded-lg transition-colors ${
                    activePanel === 'notes' ? 'bg-[#6F8068] text-white' : 'hover:bg-white/10 text-[#E8E3D7]'
                  }`}
                  title="Notes & Highlights (N)"
                >
                  <Highlighter className="w-4 h-4" />
                </button>

                {/* Themes */}
                <button
                  onClick={() => onTogglePanel('theme')}
                  className={`p-2 rounded-lg transition-colors ${
                    activePanel === 'theme' ? 'bg-[#6F8068] text-white' : 'hover:bg-white/10 text-[#E8E3D7]'
                  }`}
                  title="Reading Themes (T)"
                >
                  <Palette className="w-4 h-4" />
                </button>

                {/* Typography & Reading Settings */}
                <button
                  onClick={() => onTogglePanel('settings')}
                  className={`p-2 rounded-lg transition-colors ${
                    activePanel === 'settings' ? 'bg-[#6F8068] text-white' : 'hover:bg-white/10 text-[#E8E3D7]'
                  }`}
                  title="Reading Preferences"
                >
                  <Sliders className="w-4 h-4" />
                </button>

                {/* Sound Toggle */}
                <button
                  onClick={onToggleSound}
                  className="p-2 rounded-lg hover:bg-white/10 text-[#E8E3D7] transition-colors"
                  title={settings.soundEnabled ? 'Page flip sound: ON' : 'Page flip sound: OFF'}
                >
                  {settings.soundEnabled ? (
                    <Volume2 className="w-4 h-4 text-[#8E9F87]" />
                  ) : (
                    <VolumeX className="w-4 h-4 opacity-50" />
                  )}
                </button>

                {/* Fullscreen */}
                <button
                  onClick={onToggleFullscreen}
                  className="p-2 rounded-lg hover:bg-white/10 text-[#E8E3D7] transition-colors hidden sm:block"
                  title="Fullscreen (F)"
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                {/* Shortcuts */}
                <button
                  onClick={() => onTogglePanel('shortcuts')}
                  className="p-2 rounded-lg hover:bg-white/10 text-[#E8E3D7] opacity-70 hover:opacity-100 transition-colors hidden sm:block"
                  title="Keyboard Shortcuts (?)"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>

          {/* Bottom Floating Navigation Bar */}
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 pointer-events-auto">
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-[#171916]/85 backdrop-blur-md border border-white/10 shadow-2xl text-[#E8E3D7]">
              <button
                onClick={onPrevPage}
                disabled={currentPage <= 1}
                className="p-1.5 rounded-full hover:bg-white/10 disabled:opacity-30 transition-colors"
                title="Previous Page (←)"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page Slider / Jump */}
              <div className="flex items-center gap-2 text-xs font-sans">
                <input
                  type="range"
                  min="1"
                  max={Math.max(1, totalPages)}
                  value={currentPage}
                  onChange={(e) => onSelectPage(Number(e.target.value))}
                  className="w-24 sm:w-36 accent-[#8E9F87] cursor-pointer"
                />
                <span className="font-mono text-[11px] opacity-80 min-w-[40px] text-center">
                  {currentPage} / {totalPages}
                </span>
              </div>

              <button
                onClick={onNextPage}
                disabled={currentPage >= totalPages}
                className="p-1.5 rounded-full hover:bg-white/10 disabled:opacity-30 transition-colors"
                title="Next Page (→)"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
