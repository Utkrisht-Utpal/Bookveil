import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Plus, Clock, Sparkles, Upload, Bookmark, BookMarked } from 'lucide-react';
import { Book } from '../../types';
import { BookCard } from './BookCard';
import { LibraryFilters, LibraryTab, SortOption } from './LibraryFilters';
import { calculateReadingTimeRemaining } from '../../utils/readingTime';

interface LibraryViewProps {
  books: Book[];
  onOpenBook: (bookId: string) => void;
  onOpenUpload: () => void;
  onToggleFavorite: (bookId: string, e: React.MouseEvent) => void;
  onDeleteBook: (bookId: string, e: React.MouseEvent) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  books,
  onOpenBook,
  onOpenUpload,
  onToggleFavorite,
  onDeleteBook,
}) => {
  const [activeTab, setActiveTab] = useState<LibraryTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recent');

  // Find the most recently active book
  const mostRecentBook = useMemo(() => {
    if (books.length === 0) return null;
    return [...books].sort((a, b) => (b.lastReadAt || 0) - (a.lastReadAt || 0))[0];
  }, [books]);

  // Filtered & Sorted books
  const filteredBooks = useMemo(() => {
    let list = [...books];

    // Filter by tab
    if (activeTab === 'recent') {
      list = list.filter((b) => b.currentPage > 1);
    } else if (activeTab === 'favorites') {
      list = list.filter((b) => b.isFavorite);
    } else if (activeTab === 'completed') {
      list = list.filter((b) => b.isCompleted || (b.totalPages > 0 && b.currentPage >= b.totalPages));
    }

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.description?.toLowerCase().includes(q)
      );
    }

    // Sort
    list.sort((a, b) => {
      if (sortBy === 'recent') {
        return (b.lastReadAt || 0) - (a.lastReadAt || 0);
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'progress') {
        const progA = a.totalPages > 0 ? a.currentPage / a.totalPages : 0;
        const progB = b.totalPages > 0 ? b.currentPage / b.totalPages : 0;
        return progB - progA;
      }
      return 0;
    });

    return list;
  }, [books, activeTab, searchQuery, sortBy]);

  const bookCounts = useMemo(() => {
    return {
      all: books.length,
      recent: books.filter((b) => b.currentPage > 1).length,
      completed: books.filter((b) => b.isCompleted || (b.totalPages > 0 && b.currentPage >= b.totalPages)).length,
      favorites: books.filter((b) => b.isFavorite).length,
    };
  }, [books]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header with Title and Upload Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#252525]">
            Personal Library
          </h1>
          <p className="font-sans text-sm text-[#706D65] mt-1">
            Your collection of curated volumes and uploaded manuscripts
          </p>
        </div>

        <button
          onClick={onOpenUpload}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6F8068] hover:bg-[#566650] text-[#FAF8F5] text-sm font-sans font-medium shadow-sm transition-all duration-200 hover:shadow active:scale-95"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Book</span>
        </button>
      </div>

      {/* Featured "Continue Reading" Banner if there is a recent book */}
      {mostRecentBook && activeTab === 'all' && !searchQuery && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 p-6 sm:p-8 rounded-2xl bg-[#EDE8DC]/80 border border-[#E2DBD0] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left z-10">
            {/* Mini 3D Cover */}
            <div
              className="w-24 h-32 shrink-0 rounded-lg shadow-book overflow-hidden relative flex flex-col justify-between p-3 text-white"
              style={{ backgroundColor: mostRecentBook.coverColor || '#2D3B36' }}
            >
              <div className="absolute inset-0 paper-texture opacity-30"></div>
              <div className="text-[8px] font-sans tracking-widest uppercase opacity-75">
                {mostRecentBook.fileType.toUpperCase()}
              </div>
              <div className="my-auto font-serif text-xs font-semibold line-clamp-2">
                {mostRecentBook.title}
              </div>
              <div className="text-[8px] opacity-75">
                {mostRecentBook.totalPages} p.
              </div>
            </div>

            {/* Content info */}
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold uppercase tracking-wider text-[#6F8068] mb-1">
                <Clock className="w-3.5 h-3.5" />
                Continue Reading
              </span>
              <h2 className="font-serif text-2xl font-semibold text-[#252525]">
                {mostRecentBook.title}
              </h2>
              <p className="font-sans text-sm text-[#706D65] mt-0.5">
                {mostRecentBook.author}
              </p>

              {/* Progress text */}
              <div className="mt-3 flex items-center gap-3 text-xs font-sans text-[#706D65]">
                <span>
                  Page {mostRecentBook.currentPage} of {mostRecentBook.totalPages}
                </span>
                <span>·</span>
                <span className="font-medium text-[#252525]">
                  {Math.round((mostRecentBook.currentPage / mostRecentBook.totalPages) * 100)}% complete
                </span>
                <span>·</span>
                <span>
                  {calculateReadingTimeRemaining(mostRecentBook.currentPage, mostRecentBook.totalPages).formattedText.split(' · ')[2]}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full max-w-md bg-[#DCD4C4] h-2 rounded-full overflow-hidden mt-3">
                <div
                  className="bg-[#6F8068] h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.round(
                      (mostRecentBook.currentPage / mostRecentBook.totalPages) * 100
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onOpenBook(mostRecentBook.id)}
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#252525] hover:bg-[#3D3A36] text-[#FAF8F5] text-sm font-sans font-medium transition-all shadow-sm hover:shadow active:scale-95 z-10"
          >
            <BookOpen className="w-4 h-4" />
            <span>Resume Volume</span>
          </button>
        </motion.div>
      )}

      {/* Filters and Search Bar */}
      <LibraryFilters
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        bookCounts={bookCounts}
      />

      {/* Books Grid */}
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onOpenBook={onOpenBook}
              onToggleFavorite={onToggleFavorite}
              onDeleteBook={onDeleteBook}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center flex flex-col items-center justify-center rounded-2xl bg-[#EDE8DC]/40 border border-[#E5DFD2] p-8">
          <BookMarked className="w-12 h-12 text-[#9C988D] mb-3" />
          <h3 className="font-serif text-xl font-medium text-[#252525] mb-1">
            No books found
          </h3>
          <p className="text-sm font-sans text-[#706D65] max-w-sm mb-6">
            {searchQuery
              ? `No volumes matched "${searchQuery}". Try a different search term.`
              : 'You have no books in this category yet. Upload a PDF or DOCX file to get started.'}
          </p>
          <button
            onClick={onOpenUpload}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6F8068] hover:bg-[#566650] text-[#FAF8F5] text-sm font-sans font-medium shadow-sm transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>Upload a Document</span>
          </button>
        </div>
      )}

    </div>
  );
};
