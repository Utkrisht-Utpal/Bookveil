import React, { useState, useEffect, useCallback } from 'react';
import { Book, ReaderSettings } from './types';
import { db, loadStoredSettings, saveStoredSettings } from './services/db';
import { initializeDatabaseWithSampleBooks } from './services/sampleBooks';
import { Navbar } from './components/common/Navbar';
import { LandingView } from './components/landing/LandingView';
import { LibraryView } from './components/library/LibraryView';
import { BookReader } from './components/reader/BookReader';
import { UploadModal } from './components/library/UploadModal';
import { pageAudio } from './utils/audioSynthesis';

export function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'library' | 'reader'>('landing');
  const [books, setBooks] = useState<Book[]>([]);
  const [activeBookId, setActiveBookId] = useState<string | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [settings, setSettings] = useState<ReaderSettings>(loadStoredSettings());
  const [isLoading, setIsLoading] = useState(true);

  // Initialize DB and load books
  const loadBooksFromDb = useCallback(async () => {
    try {
      await initializeDatabaseWithSampleBooks();
      const allBooks = await db.books.toArray();
      setBooks(allBooks);
    } catch (e) {
      console.error('Failed to load books from DB:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBooksFromDb();
  }, [loadBooksFromDb]);

  // Sync settings
  const handleUpdateSettings = (newSettings: Partial<ReaderSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      saveStoredSettings(updated);
      return updated;
    });
  };

  // Open a specific book in Reader
  const handleOpenBook = (bookId: string) => {
    setActiveBookId(bookId);
    setCurrentView('reader');
  };

  // Toggle favorite
  const handleToggleFavorite = async (bookId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const target = books.find((b) => b.id === bookId);
    if (!target) return;
    const updatedFav = !target.isFavorite;
    await db.books.update(bookId, { isFavorite: updatedFav });
    setBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, isFavorite: updatedFav } : b))
    );
  };

  // Delete uploaded book
  const handleDeleteBook = async (bookId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await db.books.delete(bookId);
    setBooks((prev) => prev.filter((b) => b.id !== bookId));
    if (activeBookId === bookId) {
      setActiveBookId(null);
      setCurrentView('library');
    }
  };

  // Handle uploaded book
  const handleBookUploaded = (newBook: Book) => {
    setBooks((prev) => [newBook, ...prev]);
    setActiveBookId(newBook.id);
    setCurrentView('reader');
  };

  const activeBook = books.find((b) => b.id === activeBookId);

  return (
    <div className="min-h-screen bg-[#F5F1E8] text-[#252525] font-sans flex flex-col selection:bg-[#6F8068]/20">
      {/* Top Navigation Bar (Shown on Landing and Library, Reader has its own floating toolbar) */}
      {currentView !== 'reader' && (
        <Navbar
          currentView={currentView}
          onNavigate={(view) => setCurrentView(view)}
          onOpenUpload={() => setIsUploadOpen(true)}
          soundEnabled={settings.soundEnabled}
          onToggleSound={() =>
            handleUpdateSettings({ soundEnabled: !settings.soundEnabled })
          }
          activeBookTitle={activeBook?.title}
        />
      )}

      {/* Main Views */}
      <div className="flex-1 flex flex-col">
        {currentView === 'landing' && (
          <LandingView
            onStartReading={() => setCurrentView('library')}
            onExploreReader={() => {
              if (books.length > 0) {
                handleOpenBook(books[0].id);
              } else {
                setCurrentView('library');
              }
            }}
          />
        )}

        {currentView === 'library' && (
          <LibraryView
            books={books}
            onOpenBook={handleOpenBook}
            onOpenUpload={() => setIsUploadOpen(true)}
            onToggleFavorite={handleToggleFavorite}
            onDeleteBook={handleDeleteBook}
          />
        )}

        {currentView === 'reader' && activeBook && (
          <BookReader
            book={activeBook}
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onBackToLibrary={() => setCurrentView('library')}
          />
        )}
      </div>

      {/* Upload Book Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onBookUploaded={handleBookUploaded}
      />
    </div>
  );
}

export default App;
