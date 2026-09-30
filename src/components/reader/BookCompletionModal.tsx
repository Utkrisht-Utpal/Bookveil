import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Library as LibraryIcon, RotateCcw, Clock, CheckCircle2 } from 'lucide-react';
import { Book } from '../../types';
import { formatDuration } from '../../utils/readingTime';
import { pageAudio } from '../../utils/audioSynthesis';

interface BookCompletionModalProps {
  book: Book;
  totalReadingSeconds: number;
  onReadAgain: () => void;
  onBackToLibrary: () => void;
}

export const BookCompletionModal: React.FC<BookCompletionModalProps> = ({
  book,
  totalReadingSeconds,
  onReadAgain,
  onBackToLibrary,
}) => {
  useEffect(() => {
    pageAudio.playBookClose();
  }, []);

  const formattedTime = formatDuration(totalReadingSeconds || book.estimatedReadingTimeMinutes * 60);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171916]/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md bg-[#FAF8F5] rounded-2xl shadow-2xl border border-[#E5DFD2] p-8 text-center text-[#252525]"
      >
        {/* Subtle Ornamental Accent */}
        <div className="w-12 h-0.5 bg-[#6F8068] mx-auto mb-6"></div>

        <h3 className="font-serif text-3xl font-semibold mb-2">
          You've reached the end.
        </h3>
        <p className="font-serif italic text-sm text-[#706D65] mb-8">
          "{book.title}" by {book.author}
        </p>

        {/* Minimal Reading Stats */}
        <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-[#EDE8DC]/50 border border-[#E2DBD0] mb-8 font-sans">
          <div className="text-center">
            <span className="block text-xs text-[#706D65] mb-1">Time Spent</span>
            <span className="font-serif text-lg font-semibold text-[#252525]">
              {formattedTime}
            </span>
          </div>

          <div className="text-center border-x border-[#DCD4C4]">
            <span className="block text-xs text-[#706D65] mb-1">Pages Read</span>
            <span className="font-serif text-lg font-semibold text-[#252525]">
              {book.totalPages} / {book.totalPages}
            </span>
          </div>

          <div className="text-center">
            <span className="block text-xs text-[#706D65] mb-1">Completed</span>
            <span className="font-serif text-lg font-semibold text-[#6F8068]">
              100%
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onReadAgain}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-[#D9D1C3] bg-[#EDE8DC] hover:bg-[#E3DCCF] text-xs font-sans font-medium text-[#252525] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Read Again</span>
          </button>

          <button
            onClick={onBackToLibrary}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#6F8068] hover:bg-[#566650] text-[#FAF8F5] text-xs font-sans font-medium shadow-xs transition-colors"
          >
            <LibraryIcon className="w-3.5 h-3.5" />
            <span>Back to Library</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
