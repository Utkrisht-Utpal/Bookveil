import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Book, Highlight, Bookmark, Note, ReaderSettings, ThemeId } from '../../types';
import { db } from '../../services/db';
import { pageAudio } from '../../utils/audioSynthesis';
import { useAutoIdleToolbar } from '../../hooks/useAutoIdleToolbar';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { useReadingTimer } from '../../hooks/useReadingTimer';
import { ReaderToolbar } from './ReaderToolbar';
import { PageFlipContainer } from './PageFlipContainer';
import { ThemeSelector } from './ThemeSelector';
import { BookContents } from './BookContents';
import { SearchPanel } from './SearchPanel';
import { BookmarkPanel } from './BookmarkPanel';
import { NotesPanel } from './NotesPanel';
import { ReadingSettings as ReadingSettingsPanel } from './ReadingSettings';
import { KeyboardShortcutsModal } from './KeyboardShortcutsModal';
import { BookOpeningAnimation } from './BookOpeningAnimation';
import { BookCompletionModal } from './BookCompletionModal';
import { TextSelectionToolbar } from './TextSelectionToolbar';
import { READING_THEMES } from '../../utils/themes';

interface BookReaderProps {
  book: Book;
  settings: ReaderSettings;
  onUpdateSettings: (newSettings: Partial<ReaderSettings>) => void;
  onBackToLibrary: () => void;
}

type ActivePanel =
  | 'none'
  | 'contents'
  | 'search'
  | 'bookmarks'
  | 'notes'
  | 'theme'
  | 'settings'
  | 'shortcuts';

export const BookReader: React.FC<BookReaderProps> = ({
  book,
  settings,
  onUpdateSettings,
  onBackToLibrary,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(book.currentPage || 1);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [activePanel, setActivePanel] = useState<ActivePanel>('none');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showOpeningAnimation, setShowOpeningAnimation] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Selected text for floating toolbar
  const [selectionState, setSelectionState] = useState<{
    text: string;
    position: { top: number; left: number };
  } | null>(null);

  // Screen width state for responsive layout
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileOrTablet(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Configure Audio Engine
  useEffect(() => {
    pageAudio.setMuted(!settings.soundEnabled);
    pageAudio.setVolume(settings.soundVolume);
  }, [settings.soundEnabled, settings.soundVolume]);

  // Load book highlights, bookmarks, notes from IndexedDB
  useEffect(() => {
    const loadAnnotations = async () => {
      try {
        const dbHighlights = await db.highlights.where('bookId').equals(book.id).toArray();
        const dbBookmarks = await db.bookmarks.where('bookId').equals(book.id).toArray();
        setHighlights(dbHighlights);
        setBookmarks(dbBookmarks);
      } catch (e) {
        console.warn('Error loading annotations:', e);
      }
    };
    loadAnnotations();
  }, [book.id]);

  // Reading Timer
  const { getElapsedSeconds } = useReadingTimer(book.id, true);

  // Auto-hiding Toolbar Hook
  const { isVisible: isToolbarVisible, toggleVisibility: toggleToolbarVisibility, resetTimer } =
    useAutoIdleToolbar(settings.autoHideToolbar, 3500, activePanel !== 'none');

  // Handle Page Change
  const handlePageChange = useCallback(
    async (newPage: number) => {
      const bounded = Math.max(1, Math.min(book.totalPages, newPage));
      if (bounded !== currentPage) {
        pageAudio.playPageTurn(bounded > currentPage);
        setCurrentPage(bounded);
        setSelectionState(null);
        resetTimer();

        // Check if reached the end
        if (bounded >= book.totalPages) {
          setShowCompletionModal(true);
        }

        // Update in IndexedDB
        try {
          const progress = Math.round((bounded / book.totalPages) * 100);
          await db.books.update(book.id, {
            currentPage: bounded,
            progress,
            isCompleted: bounded >= book.totalPages,
            lastReadAt: Date.now(),
          });
        } catch (e) {
          console.warn('Error updating progress:', e);
        }
      }
    },
    [book.id, book.totalPages, currentPage, resetTimer]
  );

  // Toggle Fullscreen
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Toggle Bookmark
  const handleToggleBookmark = async () => {
    const existing = bookmarks.find((b) => b.pageNumber === currentPage);
    if (existing) {
      await db.bookmarks.delete(existing.id);
      setBookmarks((prev) => prev.filter((b) => b.id !== existing.id));
    } else {
      const newBm: Bookmark = {
        id: `bm-${Date.now()}`,
        bookId: book.id,
        pageNumber: currentPage,
        label: `Bookmark p. ${currentPage}`,
        createdAt: Date.now(),
      };
      await db.bookmarks.put(newBm);
      setBookmarks((prev) => [...prev, newBm]);
    }
  };

  // Add Bookmark from Panel
  const handleAddBookmark = async (pageNum: number, label: string) => {
    const newBm: Bookmark = {
      id: `bm-${Date.now()}`,
      bookId: book.id,
      pageNumber: pageNum,
      label,
      createdAt: Date.now(),
    };
    await db.bookmarks.put(newBm);
    setBookmarks((prev) => [...prev, newBm]);
  };

  const handleRemoveBookmark = async (id: string) => {
    await db.bookmarks.delete(id);
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  // Add Highlight
  const handleAddHighlight = async (color: 'sage' | 'gold' | 'rose') => {
    if (!selectionState) return;
    const newHl: Highlight = {
      id: `hl-${Date.now()}`,
      bookId: book.id,
      pageNumber: currentPage,
      selectedText: selectionState.text,
      color,
      createdAt: Date.now(),
    };
    await db.highlights.put(newHl);
    setHighlights((prev) => [...prev, newHl]);
    setSelectionState(null);
  };

  // Add Note
  const handleAddNote = (pageNum: number, content: string, quote?: string) => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      bookId: book.id,
      pageNumber: pageNum,
      content,
      quote,
      createdAt: Date.now(),
    };
    setNotes((prev) => [...prev, newNote]);
  };

  const handleRemoveHighlight = async (id: string) => {
    await db.highlights.delete(id);
    setHighlights((prev) => prev.filter((h) => h.id !== id));
  };

  const handleRemoveNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  // Keyboard Shortcuts Hook
  useKeyboardShortcuts({
    onPrevPage: () => handlePageChange(currentPage - (isMobileOrTablet || settings.viewMode === 'single' ? 1 : 2)),
    onNextPage: () => handlePageChange(currentPage + (isMobileOrTablet || settings.viewMode === 'single' ? 1 : 2)),
    onToggleFullscreen: handleToggleFullscreen,
    onToggleBookmark: handleToggleBookmark,
    onToggleTheme: () => setActivePanel((prev) => (prev === 'theme' ? 'none' : 'theme')),
    onToggleSearch: () => setActivePanel((prev) => (prev === 'search' ? 'none' : 'search')),
    onToggleContents: () => setActivePanel((prev) => (prev === 'contents' ? 'none' : 'contents')),
    onToggleNotes: () => setActivePanel((prev) => (prev === 'notes' ? 'none' : 'notes')),
    onToggleSettings: () => setActivePanel((prev) => (prev === 'settings' ? 'none' : 'settings')),
    onToggleControls: toggleToolbarVisibility,
    onCloseOverlay: () => {
      setActivePanel('none');
      setSelectionState(null);
    },
    onOpenShortcuts: () => setActivePanel('shortcuts'),
  });

  const isBookmarked = bookmarks.some((b) => b.pageNumber === currentPage);
  const currentChapter = useMemo(() => {
    if (!book.chapters || book.chapters.length === 0) return undefined;
    for (let i = book.chapters.length - 1; i >= 0; i--) {
      if (currentPage >= book.chapters[i].pageNumber) {
        return book.chapters[i].title;
      }
    }
    return book.chapters[0]?.title;
  }, [book.chapters, currentPage]);

  const activeTheme = READING_THEMES[settings.theme] || READING_THEMES.classic;

  return (
    <div
      className={`relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden transition-colors duration-500 ${
        activeTheme.isDark ? 'bg-[#121411]' : 'bg-[#EAE4D7]'
      }`}
    >
      {/* Opening Cover Animation */}
      {showOpeningAnimation && (
        <BookOpeningAnimation
          book={book}
          onAnimationComplete={() => setShowOpeningAnimation(false)}
        />
      )}

      {/* Floating Reader Toolbar */}
      <ReaderToolbar
        book={book}
        currentPage={currentPage}
        totalPages={book.totalPages}
        currentChapterTitle={currentChapter}
        isVisible={isToolbarVisible}
        settings={settings}
        isFullscreen={isFullscreen}
        isBookmarked={isBookmarked}
        activePanel={activePanel}
        onTogglePanel={(panel) => setActivePanel((prev) => (prev === panel ? 'none' : panel))}
        onPrevPage={() => handlePageChange(currentPage - (isMobileOrTablet || settings.viewMode === 'single' ? 1 : 2))}
        onNextPage={() => handlePageChange(currentPage + (isMobileOrTablet || settings.viewMode === 'single' ? 1 : 2))}
        onSelectPage={handlePageChange}
        onBackToLibrary={onBackToLibrary}
        onToggleFullscreen={handleToggleFullscreen}
        onToggleBookmark={handleToggleBookmark}
        onToggleSound={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
        onToggleViewMode={() =>
          onUpdateSettings({
            viewMode: settings.viewMode === 'scroll' ? 'flip' : 'scroll',
          })
        }
      />

      {/* Main Reading Canvas & Page Engine */}
      <main className="flex-1 flex flex-col justify-center items-center py-6 sm:py-10">
        <PageFlipContainer
          book={book}
          currentPage={currentPage}
          totalPages={book.totalPages}
          settings={settings}
          highlights={highlights}
          onPageChange={handlePageChange}
          onTextSelected={(text, rect) => {
            setSelectionState({
              text,
              position: {
                top: rect.top,
                left: rect.left + rect.width / 2,
              },
            });
          }}
          isMobileOrTablet={isMobileOrTablet}
        />
      </main>

      {/* Text Selection Highlight Popover */}
      {selectionState && (
        <TextSelectionToolbar
          position={selectionState.position}
          onHighlight={handleAddHighlight}
          onAddNote={() => {
            setActivePanel('notes');
            setSelectionState(null);
          }}
          onClear={() => setSelectionState(null)}
        />
      )}

      {/* Active Modal / Floating Overlays */}
      <AnimatePresence>
        {activePanel !== 'none' && (
          <div className="fixed top-16 right-4 sm:right-8 z-50">
            {activePanel === 'theme' && (
              <ThemeSelector
                currentTheme={settings.theme}
                onSelectTheme={(t) => onUpdateSettings({ theme: t })}
                onClose={() => setActivePanel('none')}
              />
            )}
            {activePanel === 'contents' && (
              <BookContents
                chapters={book.chapters || []}
                currentPage={currentPage}
                onSelectPage={handlePageChange}
                onClose={() => setActivePanel('none')}
              />
            )}
            {activePanel === 'search' && (
              <SearchPanel
                pages={book.pages}
                onSelectPage={handlePageChange}
                onClose={() => setActivePanel('none')}
              />
            )}
            {activePanel === 'bookmarks' && (
              <BookmarkPanel
                bookmarks={bookmarks}
                currentPage={currentPage}
                onAddBookmark={handleAddBookmark}
                onRemoveBookmark={handleRemoveBookmark}
                onSelectPage={handlePageChange}
                onClose={() => setActivePanel('none')}
              />
            )}
            {activePanel === 'notes' && (
              <NotesPanel
                highlights={highlights}
                notes={notes}
                currentPage={currentPage}
                onAddNote={handleAddNote}
                onRemoveHighlight={handleRemoveHighlight}
                onRemoveNote={handleRemoveNote}
                onSelectPage={handlePageChange}
                onClose={() => setActivePanel('none')}
              />
            )}
            {activePanel === 'settings' && (
              <ReadingSettingsPanel
                settings={settings}
                onUpdateSettings={onUpdateSettings}
                onClose={() => setActivePanel('none')}
              />
            )}
          </div>
        )}
      </AnimatePresence>

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={activePanel === 'shortcuts'}
        onClose={() => setActivePanel('none')}
      />

      {/* End of Book Completion Modal */}
      {showCompletionModal && (
        <BookCompletionModal
          book={book}
          totalReadingSeconds={getElapsedSeconds()}
          onReadAgain={() => {
            setShowCompletionModal(false);
            handlePageChange(1);
          }}
          onBackToLibrary={() => {
            setShowCompletionModal(false);
            onBackToLibrary();
          }}
        />
      )}
    </div>
  );
};
