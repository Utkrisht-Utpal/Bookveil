import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Book, BookPage, Highlight, ReaderSettings, ThemeId } from '../../types';
import { PageSpread } from './PageSpread';
import { READING_THEMES } from '../../utils/themes';

interface PageFlipContainerProps {
  book: Book;
  currentPage: number;
  totalPages: number;
  settings: ReaderSettings;
  highlights: Highlight[];
  onPageChange: (newPage: number) => void;
  onTextSelected: (text: string, rect: DOMRect) => void;
  isMobileOrTablet: boolean;
}

export const PageFlipContainer: React.FC<PageFlipContainerProps> = ({
  book,
  currentPage,
  totalPages,
  settings,
  highlights,
  onPageChange,
  onTextSelected,
  isMobileOrTablet,
}) => {
  const theme = READING_THEMES[settings.theme] || READING_THEMES.classic;
  
  // Decide whether to show 2 pages or 1 page in flip mode
  const isTwoPageSpread = !isMobileOrTablet && settings.viewMode !== 'single';

  // Corner drag state
  const [dragProgress, setDragProgress] = useState<number>(0);
  const [dragDirection, setDragDirection] = useState<'next' | 'prev' | null>(null);
  const dragStartXRef = useRef<number | null>(null);

  // Touch swipe state for mobile
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  // Turn page logic
  const handleTurnNext = () => {
    if (isTwoPageSpread) {
      if (currentPage + 2 <= totalPages) {
        onPageChange(currentPage + 2);
      } else if (currentPage + 1 <= totalPages) {
        onPageChange(currentPage + 1);
      }
    } else {
      if (currentPage < totalPages) {
        onPageChange(currentPage + 1);
      }
    }
  };

  const handleTurnPrev = () => {
    if (isTwoPageSpread) {
      if (currentPage - 2 >= 1) {
        onPageChange(currentPage - 2);
      } else if (currentPage > 1) {
        onPageChange(1);
      }
    } else {
      if (currentPage > 1) {
        onPageChange(currentPage - 1);
      }
    }
  };

  // Corner Drag Handlers (Top-Right / Top-Left)
  const handleCornerMouseDown = (direction: 'next' | 'prev', e: React.MouseEvent) => {
    e.preventDefault();
    setDragDirection(direction);
    dragStartXRef.current = e.clientX;
    setDragProgress(0.1);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (dragStartXRef.current === null) return;
      const deltaX = moveEvent.clientX - dragStartXRef.current;
      const threshold = 180;

      if (direction === 'next') {
        const progress = Math.min(1, Math.max(0, -deltaX / threshold));
        setDragProgress(progress);
      } else {
        const progress = Math.min(1, Math.max(0, deltaX / threshold));
        setDragProgress(progress);
      }
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      
      if (dragProgress > 0.45) {
        if (direction === 'next') handleTurnNext();
        else handleTurnPrev();
      }
      setDragDirection(null);
      setDragProgress(0);
      dragStartXRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Touch Swipe for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;

    // Only horizontal swipe if not scrolling vertically
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        handleTurnNext();
      } else {
        handleTurnPrev();
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  // Determine current page and adjacent page for 2-page spread
  const leftPageIndex = isTwoPageSpread ? (currentPage % 2 === 0 ? currentPage - 1 : currentPage) : currentPage;
  const rightPageIndex = isTwoPageSpread ? leftPageIndex + 1 : leftPageIndex;

  const leftPageData = book.pages.find((p) => p.pageNumber === leftPageIndex) || null;
  const rightPageData = isTwoPageSpread ? book.pages.find((p) => p.pageNumber === rightPageIndex) || null : null;

  // Render Continuous Scroll View if selected
  if (settings.viewMode === 'scroll') {
    return (
      <div className="w-full max-w-4xl mx-auto py-12 px-4 sm:px-6 space-y-8">
        {book.pages.map((p) => (
          <div
            key={p.pageNumber}
            id={`page-${p.pageNumber}`}
            className="rounded-2xl shadow-book overflow-hidden min-h-[500px] border border-black/5"
            style={{ backgroundColor: theme.paperColor }}
          >
            <PageSpread
              page={p}
              pageNumber={p.pageNumber}
              totalPages={totalPages}
              isLeftPage={false}
              themeId={settings.theme}
              settings={settings}
              highlights={highlights.filter((h) => h.pageNumber === p.pageNumber)}
              isTwoPageSpread={false}
              onTextSelected={onTextSelected}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full max-w-6xl mx-auto flex items-center justify-center my-auto px-2 sm:px-6 py-4"
    >
      {/* Navigation Arrow Left */}
      <button
        onClick={handleTurnPrev}
        disabled={currentPage <= 1}
        className="hidden md:flex absolute -left-2 lg:-left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-[#171916]/70 hover:bg-[#171916] text-white shadow-xl items-center justify-center transition-all disabled:opacity-0 disabled:pointer-events-none hover:scale-105 active:scale-95"
        title="Previous Page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Navigation Arrow Right */}
      <button
        onClick={handleTurnNext}
        disabled={currentPage >= totalPages}
        className="hidden md:flex absolute -right-2 lg:-right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-[#171916]/70 hover:bg-[#171916] text-white shadow-xl items-center justify-center transition-all disabled:opacity-0 disabled:pointer-events-none hover:scale-105 active:scale-95"
        title="Next Page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Realistic 3D Physical Book Container */}
      <div className="relative w-full rounded-2xl shadow-2xl p-1.5 sm:p-3 bg-[#24211D]/80 backdrop-blur-xs border border-white/10">
        
        {/* Book Outer Cover Bevel */}
        <div
          className={`relative w-full rounded-xl overflow-hidden flex flex-col md:flex-row transition-colors duration-300 ${
            isTwoPageSpread ? 'h-[75vh] min-h-[560px] max-h-[780px]' : 'h-[78vh] min-h-[520px]'
          }`}
          style={{
            backgroundColor: theme.paperColor,
            boxShadow: theme.isDark
              ? '0 25px 50px -12px rgba(0,0,0,0.8), inset 0 0 30px rgba(0,0,0,0.3)'
              : '0 25px 50px -12px rgba(37,37,37,0.2), inset 0 0 30px rgba(0,0,0,0.05)',
          }}
        >
          
          {/* Top-Left Draggable Corner Handle (Previous Page) */}
          {currentPage > 1 && (
            <div
              onMouseDown={(e) => handleCornerMouseDown('prev', e)}
              className="absolute top-0 left-0 w-14 h-14 z-30 cursor-ew-resize group pointer-events-auto"
              title="Drag right to flip to previous page"
            >
              <div className="w-full h-full bg-gradient-to-br from-black/15 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity"></div>
              <div
                className="absolute top-0 left-0 w-8 h-8 bg-black/10 group-hover:bg-[#6F8068]/30 transition-colors shadow-xs"
                style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
              ></div>
            </div>
          )}

          {/* Top-Right Draggable Corner Handle (Next Page) */}
          {currentPage < totalPages && (
            <div
              onMouseDown={(e) => handleCornerMouseDown('next', e)}
              className="absolute top-0 right-0 w-14 h-14 z-30 cursor-ew-resize group pointer-events-auto"
              title="Drag left to flip to next page"
            >
              <div className="w-full h-full bg-gradient-to-bl from-black/15 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity"></div>
              <div
                className="absolute top-0 right-0 w-8 h-8 bg-black/10 group-hover:bg-[#6F8068]/30 transition-colors shadow-xs"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }}
              ></div>
            </div>
          )}

          {/* Dynamic Interactive Drag Fold Overlay */}
          {dragDirection && dragProgress > 0 && (
            <div
              className={`absolute top-0 bottom-0 z-25 pointer-events-none transition-all ${
                dragDirection === 'next' ? 'right-0' : 'left-0'
              }`}
              style={{
                width: `${dragProgress * 50}%`,
                background:
                  dragDirection === 'next'
                    ? 'linear-gradient(to left, rgba(0,0,0,0.15) 0%, rgba(255,255,255,0.2) 50%, rgba(0,0,0,0.05) 100%)'
                    : 'linear-gradient(to right, rgba(0,0,0,0.15) 0%, rgba(255,255,255,0.2) 50%, rgba(0,0,0,0.05) 100%)',
                boxShadow:
                  dragDirection === 'next'
                    ? '-15px 0 25px rgba(0,0,0,0.2)'
                    : '15px 0 25px rgba(0,0,0,0.2)',
              }}
            ></div>
          )}

          {/* LEFT PAGE (Two-Page Spread Mode) */}
          {isTwoPageSpread && (
            <div className="flex-1 relative h-full overflow-hidden border-r border-black/5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`spread-left-${leftPageIndex}`}
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="w-full h-full"
                >
                  <PageSpread
                    page={leftPageData}
                    pageNumber={leftPageIndex}
                    totalPages={totalPages}
                    isLeftPage={true}
                    themeId={settings.theme}
                    settings={settings}
                    highlights={highlights.filter((h) => h.pageNumber === leftPageIndex)}
                    isTwoPageSpread={true}
                    onTextSelected={onTextSelected}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {/* CENTER SPINE GROOVE (Two-Page Mode) */}
          {isTwoPageSpread && (
            <div className="w-[3px] bg-black/10 relative z-20 shrink-0 h-full">
              <div className="absolute inset-0 spine-groove"></div>
            </div>
          )}

          {/* RIGHT PAGE (or Single Page on Mobile) */}
          <div className="flex-1 relative h-full overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={`spread-right-${isTwoPageSpread ? rightPageIndex : currentPage}`}
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0.8 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full"
              >
                <PageSpread
                  page={isTwoPageSpread ? rightPageData : leftPageData}
                  pageNumber={isTwoPageSpread ? rightPageIndex : currentPage}
                  totalPages={totalPages}
                  isLeftPage={false}
                  themeId={settings.theme}
                  settings={settings}
                  highlights={highlights.filter(
                    (h) => h.pageNumber === (isTwoPageSpread ? rightPageIndex : currentPage)
                  )}
                  isTwoPageSpread={isTwoPageSpread}
                  onTextSelected={onTextSelected}
                />
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
};
