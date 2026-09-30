import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Bookmark, Sparkles, Clock, BookOpen } from 'lucide-react';
import { pageAudio } from '../../utils/audioSynthesis';
import { ThemeId } from '../../types';
import { READING_THEMES } from '../../utils/themes';

const HERO_PAGES = [
  {
    left: {
      chapter: 'THE ESSENCE OF READING',
      page: 1,
      title: 'A Sanctuary for Thought',
      content: `The printed book was never just a vessel for words. It was an architecture of calm. The weight in your hands, the quiet rustle as a leaf turns, the generous margins that give thoughts room to breathe.\n\nTurna restores this intimacy to your digital reading, transforming cold glass into the warm sanctuary of an open volume.`
    },
    right: {
      chapter: 'THE CRAFT OF DIGITAL PAPER',
      page: 2,
      title: 'Crafted with Intention',
      content: `Notice how light settles across the gutter, how the spine gently curves with tactile depth. No flashing advertisements, no algorithmic distractions, no neon glare.\n\nUpload your own PDFs and DOCX manuscripts. Select an ivory or sepia warmth tailored to your ambient lighting, and rediscover the joy of unhurried reading.`
    }
  },
  {
    left: {
      chapter: 'PHYSICAL FEEL',
      page: 3,
      title: 'Natural Physics',
      content: `Drag a corner or swipe with your fingertips. Pages flex and cast shadows with natural spring physics. Every turn triggers a subtle acoustic rustle synthesized in real-time.\n\nYour progress, reading velocity, and bookmarks remain synced quietly in the background without getting in your way.`
    },
    right: {
      chapter: 'EDITORIAL PURITY',
      page: 4,
      title: 'Focus Without Compromise',
      content: `Controls gently vanish as you immerse into the text. Highlights and annotations wait quietly at your cursor’s command.\n\nWhether studying a research paper or losing yourself in literature, Turna gives every word the reverence it deserves.`
    }
  }
];

interface InteractiveHeroBookProps {
  onOpenSample: () => void;
}

export const InteractiveHeroBook: React.FC<InteractiveHeroBookProps> = ({ onOpenSample }) => {
  const [spreadIndex, setSpreadIndex] = useState(0);
  const [heroTheme, setHeroTheme] = useState<ThemeId>('classic');
  const [isBookmarked, setIsBookmarked] = useState(false);

  const currentSpread = HERO_PAGES[spreadIndex];
  const theme = READING_THEMES[heroTheme];

  const handleNext = () => {
    if (spreadIndex < HERO_PAGES.length - 1) {
      pageAudio.playPageTurn(true);
      setSpreadIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (spreadIndex > 0) {
      pageAudio.playPageTurn(false);
      setSpreadIndex(prev => prev - 1);
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto my-8">
      {/* Subtle Floating Ambient Indicators */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 px-2 text-xs font-sans text-[#706D65]">
        <div className="flex items-center gap-2 bg-[#EDE8DC]/80 px-3 py-1.5 rounded-full backdrop-blur-sm border border-[#E2DBD0]">
          <span className="w-2 h-2 rounded-full bg-[#6F8068] animate-pulse"></span>
          <span>Interactive Preview Spread</span>
          <span className="text-[#9C988D]">·</span>
          <span className="flex items-center gap-1 font-medium text-[#252525]">
            <Clock className="w-3.5 h-3.5 text-[#6F8068]" />
            ~12 min remaining
          </span>
        </div>

        {/* Theme Pills in Hero */}
        <div className="flex items-center gap-1.5 bg-[#EDE8DC]/80 p-1 rounded-full border border-[#E2DBD0]">
          {(['classic', 'ivory', 'sepia', 'midnight', 'forest'] as ThemeId[]).map((tId) => (
            <button
              key={tId}
              onClick={() => setHeroTheme(tId)}
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all ${
                heroTheme === tId
                  ? 'bg-[#252525] text-[#FAF8F5] shadow-xs'
                  : 'text-[#706D65] hover:text-[#252525]'
              }`}
            >
              {READING_THEMES[tId].name}
            </button>
          ))}
        </div>
      </div>

      {/* Realistic 3D Physical Book Mockup */}
      <div className="relative rounded-2xl shadow-2xl p-2 sm:p-4 bg-[#2A2621]/90 backdrop-blur-sm transition-all duration-500">
        
        {/* Outer Cover Border & Book Thickness */}
        <div 
          className="relative rounded-xl overflow-hidden shadow-inner flex flex-col md:flex-row min-h-[380px] sm:min-h-[440px] transition-colors duration-500 paper-texture"
          style={{
            backgroundColor: theme.paperColor,
            color: theme.textColor,
            boxShadow: '0 20px 40px -15px rgba(0,0,0,0.3), inset 0 0 20px rgba(0,0,0,0.05)'
          }}
        >
          {/* Bookmark Ribbon */}
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className="absolute top-0 right-10 z-20 transition-transform duration-300 hover:translate-y-1 focus:outline-none"
            title="Toggle Bookmark"
          >
            <div
              className={`w-5 h-12 shadow-md flex items-end justify-center pb-1 transition-all ${
                isBookmarked ? 'bg-[#B79B68] h-14' : 'bg-[#6F8068]/80 hover:bg-[#6F8068]'
              }`}
              style={{
                clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)',
              }}
            >
              <Bookmark className="w-3 h-3 text-[#FAF8F5] opacity-90" />
            </div>
          </button>

          {/* Left Page Spread */}
          <div className="flex-1 p-6 sm:p-10 flex flex-col justify-between relative border-b md:border-b-0 md:border-r border-black/5">
            <div>
              {/* Top Page Header */}
              <div className="flex items-center justify-between text-[11px] font-sans tracking-widest uppercase opacity-60 pb-3 border-b border-current border-opacity-10 mb-6">
                <span>{currentSpread.left.chapter}</span>
                <span>{currentSpread.left.page}</span>
              </div>

              {/* Page Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`left-${spreadIndex}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="font-serif text-xl sm:text-2xl font-semibold mb-4 leading-snug">
                    {currentSpread.left.title}
                  </h3>
                  <div className="font-serif text-sm sm:text-base leading-relaxed opacity-90 whitespace-pre-line text-justify">
                    {currentSpread.left.content}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Subtle Footer */}
            <div className="pt-4 text-[10px] font-sans opacity-40 uppercase tracking-widest">
              Turna Reader Edition
            </div>

            {/* Left Page Inner Spine Shadow */}
            <div className="hidden md:block absolute top-0 right-0 bottom-0 w-8 pointer-events-none book-spine-gutter-left"></div>
          </div>

          {/* Center Spine Ridge */}
          <div className="hidden md:block w-[2px] bg-black/10 relative z-10">
            <div className="absolute inset-0 shadow-[0_0_10px_rgba(0,0,0,0.2)]"></div>
          </div>

          {/* Right Page Spread */}
          <div className="flex-1 p-6 sm:p-10 flex flex-col justify-between relative">
            {/* Right Page Inner Spine Shadow */}
            <div className="hidden md:block absolute top-0 left-0 bottom-0 w-8 pointer-events-none book-spine-gutter-right"></div>

            <div>
              {/* Top Page Header */}
              <div className="flex items-center justify-between text-[11px] font-sans tracking-widest uppercase opacity-60 pb-3 border-b border-current border-opacity-10 mb-6">
                <span>{currentSpread.right.page}</span>
                <span>{currentSpread.right.chapter}</span>
              </div>

              {/* Page Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`right-${spreadIndex}`}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="font-serif text-xl sm:text-2xl font-semibold mb-4 leading-snug">
                    {currentSpread.right.title}
                  </h3>
                  <div className="font-serif text-sm sm:text-base leading-relaxed opacity-90 whitespace-pre-line text-justify">
                    {currentSpread.right.content}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Interactive Turn Corner Buttons */}
            <div className="flex items-center justify-between pt-6 mt-4 border-t border-current border-opacity-10">
              <span className="text-[11px] font-sans opacity-60">
                {spreadIndex === 0 ? 'Page 1–2 of 4' : 'Page 3–4 of 4'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  disabled={spreadIndex === 0}
                  className={`p-1.5 rounded-full border border-current border-opacity-20 transition-all ${
                    spreadIndex === 0
                      ? 'opacity-20 cursor-not-allowed'
                      : 'hover:bg-black/5 active:scale-95'
                  }`}
                  title="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  disabled={spreadIndex >= HERO_PAGES.length - 1}
                  className={`p-1.5 rounded-full border border-current border-opacity-20 transition-all ${
                    spreadIndex >= HERO_PAGES.length - 1
                      ? 'opacity-20 cursor-not-allowed'
                      : 'hover:bg-black/5 active:scale-95'
                  }`}
                  title="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Floating CTA Overlay below preview */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-center">
        <button
          onClick={onOpenSample}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-sans font-medium bg-[#6F8068] hover:bg-[#566650] text-[#FAF8F5] shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          <BookOpen className="w-4 h-4" />
          <span>Open Full Reader with Sample Book</span>
        </button>
      </div>
    </div>
  );
};
