import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Bookmark as BookmarkIcon, Plus, Trash2, ChevronRight } from 'lucide-react';
import { Bookmark } from '../../types';

interface BookmarkPanelProps {
  bookmarks: Bookmark[];
  currentPage: number;
  onAddBookmark: (pageNumber: number, label: string) => void;
  onRemoveBookmark: (id: string) => void;
  onSelectPage: (pageNum: number) => void;
  onClose: () => void;
}

export const BookmarkPanel: React.FC<BookmarkPanelProps> = ({
  bookmarks,
  currentPage,
  onAddBookmark,
  onRemoveBookmark,
  onSelectPage,
  onClose,
}) => {
  const [newLabel, setNewLabel] = useState('');
  const isCurrentPageBookmarked = bookmarks.some((b) => b.pageNumber === currentPage);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const label = newLabel.trim() || `Bookmark on page ${currentPage}`;
    onAddBookmark(currentPage, label);
    setNewLabel('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      className="w-80 sm:w-96 max-h-[75vh] flex flex-col p-4 rounded-2xl bg-[#FAF8F5] shadow-2xl border border-[#E5DFD2] text-[#252525]"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#EDE8DC] mb-3">
        <div className="flex items-center gap-2">
          <BookmarkIcon className="w-4 h-4 text-[#B79B68]" />
          <h4 className="font-serif text-base font-semibold text-[#252525]">
            Bookmarks
          </h4>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-[#706D65] hover:text-[#252525] hover:bg-[#EDE8DC] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Add Bookmark for Current Page */}
      <form onSubmit={handleAdd} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder={`Note for page ${currentPage} (optional)...`}
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            className="flex-1 px-3 py-1.5 rounded-lg bg-[#EDE8DC]/70 border border-[#E0D9CB] focus:bg-white text-xs text-[#252525] focus:outline-none focus:border-[#6F8068]"
          />
          <button
            type="submit"
            disabled={isCurrentPageBookmarked && !newLabel.trim()}
            className="px-3 py-1.5 rounded-lg bg-[#6F8068] hover:bg-[#566650] text-[#FAF8F5] text-xs font-sans font-medium flex items-center gap-1 shadow-xs transition-colors shrink-0 disabled:opacity-50"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isCurrentPageBookmarked ? 'Add Another' : 'Bookmark'}</span>
          </button>
        </div>
      </form>

      {/* Bookmarks List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {bookmarks.length > 0 ? (
          bookmarks.map((bm) => (
            <div
              key={bm.id}
              className="flex items-center justify-between p-2.5 rounded-xl border border-[#EDE8DC] hover:border-[#B79B68]/60 hover:bg-[#EDE8DC]/30 transition-all group"
            >
              <button
                onClick={() => {
                  onSelectPage(bm.pageNumber);
                  onClose();
                }}
                className="flex-1 text-left pr-2 flex items-start gap-2"
              >
                <BookmarkIcon className="w-3.5 h-3.5 text-[#B79B68] shrink-0 mt-0.5 fill-[#B79B68]" />
                <div>
                  <div className="text-xs font-serif font-medium text-[#252525] line-clamp-1">
                    {bm.label}
                  </div>
                  <div className="text-[11px] font-sans text-[#706D65]">
                    Page {bm.pageNumber} · {new Date(bm.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </button>

              <button
                onClick={() => onRemoveBookmark(bm.id)}
                className="p-1 text-[#706D65] hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                title="Remove Bookmark"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-xs text-[#706D65]">
            No bookmarks added yet. Press <kbd className="px-1 py-0.5 bg-[#EDE8DC] rounded text-[10px]">B</kbd> or click above to bookmark page {currentPage}.
          </div>
        )}
      </div>
    </motion.div>
  );
};
