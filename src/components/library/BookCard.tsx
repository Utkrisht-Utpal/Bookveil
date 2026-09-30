import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Heart, Clock, Trash2, FileText } from 'lucide-react';
import { Book } from '../../types';
import { calculateReadingTimeRemaining } from '../../utils/readingTime';

interface BookCardProps {
  book: Book;
  onOpenBook: (bookId: string) => void;
  onToggleFavorite: (bookId: string, e: React.MouseEvent) => void;
  onDeleteBook: (bookId: string, e: React.MouseEvent) => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onOpenBook,
  onToggleFavorite,
  onDeleteBook,
}) => {
  const { timeString, percent } = React.useMemo(() => {
    const res = calculateReadingTimeRemaining(book.currentPage, book.totalPages);
    return {
      timeString: res.formattedText.split(' · ')[2] || '~15 min left',
      percent: book.totalPages > 0 ? Math.round((book.currentPage / book.totalPages) * 100) : 0,
    };
  }, [book.currentPage, book.totalPages]);

  const coverBg = book.coverColor || '#2D3B36';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      onClick={() => onOpenBook(book.id)}
      className="group cursor-pointer flex flex-col justify-between rounded-2xl bg-[#EDE8DC]/40 hover:bg-[#EDE8DC]/80 border border-[#E5DFD2] p-4 transition-all duration-300 hover:shadow-md"
    >
      <div>
        {/* Realistic Book Cover Visual with 3D Spine and Paper Edge */}
        <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden mb-4 shadow-book flex flex-col justify-between p-5 text-white transition-transform duration-300 group-hover:scale-[1.02]">
          
          {/* Background color + paper texture overlay */}
          <div
            className="absolute inset-0"
            style={{ backgroundColor: coverBg }}
          ></div>
          
          <div className="absolute inset-0 paper-texture opacity-30"></div>

          {/* Realistic Spine groove on left */}
          <div className="absolute top-0 bottom-0 left-0 w-3.5 bg-gradient-to-r from-black/40 via-black/10 to-transparent pointer-events-none"></div>
          <div className="absolute top-0 bottom-0 left-3 w-[1px] bg-white/20 pointer-events-none"></div>

          {/* Top cover header */}
          <div className="relative z-10 flex items-start justify-between">
            <span className="text-[10px] uppercase font-sans tracking-widest opacity-75 px-2 py-0.5 rounded bg-black/25 backdrop-blur-xs">
              {book.fileType.toUpperCase()}
            </span>

            <button
              onClick={(e) => onToggleFavorite(book.id, e)}
              className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
              title={book.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart
                className={`w-3.5 h-3.5 ${
                  book.isFavorite ? 'fill-[#B79B68] text-[#B79B68]' : 'text-white/80'
                }`}
              />
            </button>
          </div>

          {/* Middle: Title & Author */}
          <div className="relative z-10 my-auto text-center px-2">
            <div className="w-8 h-0.5 bg-[#B79B68] mx-auto mb-3"></div>
            <h3 className="font-serif text-lg sm:text-xl font-semibold leading-snug line-clamp-2">
              {book.title}
            </h3>
            <p className="font-sans text-xs opacity-80 mt-1 font-light tracking-wide line-clamp-1">
              {book.author}
            </p>
          </div>

          {/* Bottom badge on cover */}
          <div className="relative z-10 flex items-center justify-between text-[11px] font-sans opacity-75 pt-2 border-t border-white/15">
            <span>{book.totalPages} pages</span>
            <span>{percent}%</span>
          </div>
        </div>

        {/* Book Metadata below cover */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-[#706D65]">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#6F8068]" />
              {timeString}
            </span>
            <span className="text-[11px] font-medium text-[#252525]">
              {book.currentPage} / {book.totalPages} p.
            </span>
          </div>

          {/* Reading Progress Bar */}
          <div className="w-full bg-[#E0D9CB] h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className="bg-[#6F8068] h-full rounded-full transition-all duration-500"
              style={{ width: `${percent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="mt-4 pt-3 border-t border-[#E0D9CB] flex items-center justify-between">
        <span className="text-xs font-sans font-medium text-[#6F8068] group-hover:text-[#566650] flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5" />
          {book.currentPage > 1 ? 'Continue' : 'Start'}
        </span>

        {book.fileType !== 'sample' && (
          <button
            onClick={(e) => onDeleteBook(book.id, e)}
            className="p-1 text-[#706D65] hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
            title="Delete book"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </motion.div>
  );
};
