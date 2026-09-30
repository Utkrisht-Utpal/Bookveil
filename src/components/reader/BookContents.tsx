import React from 'react';
import { motion } from 'framer-motion';
import { X, List, ChevronRight } from 'lucide-react';
import { Chapter } from '../../types';

interface BookContentsProps {
  chapters: Chapter[];
  currentPage: number;
  onSelectPage: (pageNum: number) => void;
  onClose: () => void;
}

export const BookContents: React.FC<BookContentsProps> = ({
  chapters,
  currentPage,
  onSelectPage,
  onClose,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      className="w-80 sm:w-96 max-h-[70vh] flex flex-col p-4 rounded-2xl bg-[#FAF8F5] shadow-2xl border border-[#E5DFD2] text-[#252525]"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#EDE8DC] mb-3">
        <div className="flex items-center gap-2">
          <List className="w-4 h-4 text-[#6F8068]" />
          <h4 className="font-serif text-base font-semibold text-[#252525]">
            Table of Contents
          </h4>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-[#706D65] hover:text-[#252525] hover:bg-[#EDE8DC] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Chapters list */}
      <div className="flex-1 overflow-y-auto space-y-1 pr-1">
        {chapters.length > 0 ? (
          chapters.map((ch, idx) => {
            const isCurrent =
              currentPage >= ch.pageNumber &&
              (idx === chapters.length - 1 || currentPage < chapters[idx + 1].pageNumber);

            return (
              <button
                key={ch.id || idx}
                onClick={() => {
                  onSelectPage(ch.pageNumber);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                  isCurrent
                    ? 'bg-[#EDE8DC] text-[#252525] font-semibold shadow-xs'
                    : 'text-[#706D65] hover:text-[#252525] hover:bg-[#EDE8DC]/50'
                }`}
              >
                <div className="flex items-center gap-2 truncate pr-2">
                  <ChevronRight
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isCurrent ? 'text-[#6F8068]' : 'opacity-40'
                    }`}
                  />
                  <span className="font-serif text-sm truncate">{ch.title}</span>
                </div>
                <span className="text-xs font-sans opacity-70 shrink-0">
                  p. {ch.pageNumber}
                </span>
              </button>
            );
          })
        ) : (
          <div className="py-8 text-center text-xs text-[#706D65]">
            No table of contents found in this document.
          </div>
        )}
      </div>
    </motion.div>
  );
};
