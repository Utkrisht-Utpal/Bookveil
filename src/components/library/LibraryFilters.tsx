import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

export type LibraryTab = 'all' | 'recent' | 'completed' | 'favorites';
export type SortOption = 'recent' | 'title' | 'progress';

interface LibraryFiltersProps {
  activeTab: LibraryTab;
  onTabChange: (tab: LibraryTab) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  bookCounts: {
    all: number;
    recent: number;
    completed: number;
    favorites: number;
  };
}

export const LibraryFilters: React.FC<LibraryFiltersProps> = ({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  bookCounts,
}) => {
  const tabs: { id: LibraryTab; label: string; count: number }[] = [
    { id: 'all', label: 'All Books', count: bookCounts.all },
    { id: 'recent', label: 'Recently Read', count: bookCounts.recent },
    { id: 'favorites', label: 'Favorites', count: bookCounts.favorites },
    { id: 'completed', label: 'Completed', count: bookCounts.completed },
  ];

  return (
    <div className="space-y-4 mb-8">
      {/* Search and Sort controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#706D65]" />
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#EDE8DC]/60 border border-[#E0D9CB] focus:bg-[#FAF8F5] focus:outline-none focus:border-[#6F8068] text-sm text-[#252525] placeholder-[#706D65] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#706D65] hover:text-[#252525]"
            >
              Clear
            </button>
          )}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-[#706D65] font-sans">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#6F8068]" />
          <span>Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="bg-[#EDE8DC]/70 border border-[#E0D9CB] rounded-lg px-2.5 py-1.5 text-xs text-[#252525] focus:outline-none focus:border-[#6F8068]"
          >
            <option value="recent">Recently Read</option>
            <option value="title">Title (A-Z)</option>
            <option value="progress">Reading Progress</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#EDE8DC]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-t-lg text-sm font-sans font-medium transition-all relative ${
              activeTab === tab.id
                ? 'text-[#252525] font-semibold'
                : 'text-[#706D65] hover:text-[#252525]'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                activeTab === tab.id
                  ? 'bg-[#6F8068] text-[#FAF8F5]'
                  : 'bg-[#EDE8DC] text-[#706D65]'
              }`}
            >
              {tab.count}
            </span>

            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6F8068]"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
