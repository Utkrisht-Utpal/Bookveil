import React from 'react';
import { motion } from 'framer-motion';
import { Book } from '../../types';

interface BookOpeningAnimationProps {
  book: Book;
  onAnimationComplete: () => void;
}

export const BookOpeningAnimation: React.FC<BookOpeningAnimationProps> = ({
  book,
  onAnimationComplete,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#171916]/90 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.85, opacity: 0, rotateY: 0 }}
        animate={{
          scale: [0.85, 1, 1.05],
          opacity: [0, 1, 1],
          rotateY: [0, 0, -50],
        }}
        transition={{
          duration: 1.1,
          times: [0, 0.4, 1],
          ease: 'easeInOut',
        }}
        onAnimationComplete={onAnimationComplete}
        className="w-72 sm:w-80 aspect-[3/4] rounded-xl shadow-2xl overflow-hidden p-6 flex flex-col justify-between text-white relative"
        style={{
          backgroundColor: book.coverColor || '#2D3B36',
          transformStyle: 'preserve-3d',
          perspective: 1200,
        }}
      >
        <div className="absolute inset-0 paper-texture opacity-30"></div>
        <div className="absolute top-0 bottom-0 left-0 w-4 bg-gradient-to-r from-black/50 to-transparent"></div>

        <div className="relative z-10 text-[10px] uppercase font-sans tracking-widest opacity-70">
          {book.fileType.toUpperCase()}
        </div>

        <div className="relative z-10 text-center my-auto px-2">
          <div className="w-10 h-0.5 bg-[#B79B68] mx-auto mb-4"></div>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold leading-tight mb-2">
            {book.title}
          </h2>
          <p className="font-sans text-xs opacity-80">{book.author}</p>
        </div>

        <div className="relative z-10 text-[10px] text-center font-sans opacity-60">
          Opening volume...
        </div>
      </motion.div>
    </div>
  );
};
