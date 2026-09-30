import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { X, Search as SearchIcon, FileText, ChevronRight } from 'lucide-react';
import { BookPage } from '../../types';

interface SearchPanelProps {
  pages: BookPage[];
  onSelectPage: (pageNum: number) => void;
  onClose: () => void;
}

export const SearchPanel: React.FC<SearchPanelProps> = ({
  pages,
  onSelectPage,
  onClose,
}) => {
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!query.trim() || query.trim().length < 2) return [];

    const q = query.toLowerCase();
    const results: { pageNumber: number; snippet: string; chapterTitle?: string }[] = [];

    pages.forEach((page) => {
      const text = page.textContent || '';
      const lower = text.toLowerCase();
      const index = lower.indexOf(q);

      if (index !== -1) {
        const start = Math.max(0, index - 40);
        const end = Math.min(text.length, index + query.length + 60);
        const snippet = (start > 0 ? '…' : '') + text.substring(start, end) + (end < text.length ? '…' : '');

        results.push({
          pageNumber: page.pageNumber,
          snippet,
          chapterTitle: page.chapterTitle,
        });
      }
    });

    return results;
  }, [pages, query]);

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
          <SearchIcon className="w-4 h-4 text-[#6F8068]" />
          <h4 className="font-serif text-base font-semibold text-[#252525]">
            Search Volume
          </h4>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-[#706D65] hover:text-[#252525] hover:bg-[#EDE8DC] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Input */}
      <div className="relative mb-3">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#706D65]" />
        <input
          type="text"
          placeholder="Search phrases or words..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#EDE8DC]/70 border border-[#E0D9CB] focus:bg-[#FFFDF9] focus:outline-none focus:border-[#6F8068] text-xs sm:text-sm text-[#252525] placeholder-[#706D65]"
        />
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-[#706D65] px-1 mb-2 font-sans">
        <span>
          {query.trim().length >= 2
            ? `${searchResults.length} match${searchResults.length === 1 ? '' : 'es'} found`
            : 'Type at least 2 characters'}
        </span>
      </div>

      {/* Results List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {searchResults.map((res, idx) => (
          <button
            key={idx}
            onClick={() => {
              onSelectPage(res.pageNumber);
              onClose();
            }}
            className="w-full text-left p-2.5 rounded-xl border border-[#EDE8DC] hover:border-[#6F8068]/50 hover:bg-[#EDE8DC]/40 transition-all group"
          >
            <div className="flex items-center justify-between text-[11px] text-[#6F8068] font-semibold mb-1">
              <span>Page {res.pageNumber}</span>
              {res.chapterTitle && (
                <span className="text-[#706D65] font-normal truncate max-w-[150px]">
                  {res.chapterTitle}
                </span>
              )}
            </div>
            <p className="font-serif text-xs text-[#252525] leading-relaxed line-clamp-3">
              {res.snippet}
            </p>
          </button>
        ))}

        {query.trim().length >= 2 && searchResults.length === 0 && (
          <div className="py-8 text-center text-xs text-[#706D65]">
            No matches found for "{query}"
          </div>
        )}
      </div>
    </motion.div>
  );
};
