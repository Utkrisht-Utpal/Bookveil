import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Sparkles, Feather, ShieldCheck, Compass } from 'lucide-react';
import { InteractiveHeroBook } from './InteractiveHeroBook';

interface LandingHeroProps {
  onStartReading: () => void;
  onExploreReader: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartReading,
  onExploreReader,
}) => {
  return (
    <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
      
      {/* Editorial Badge */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EDE8DC] border border-[#E2DBD0] text-[#706D65] text-xs font-sans tracking-wide mb-6"
      >
        <Feather className="w-3.5 h-3.5 text-[#6F8068]" />
        <span>Introducing Turna · An Editorial Sanctuary for Digital Volumes</span>
      </motion.div>

      {/* Hero Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="font-serif text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-[#252525] max-w-4xl leading-[1.12]"
      >
        Read beyond the page.
      </motion.h1>

      {/* Supporting Text */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-6 font-sans text-lg sm:text-xl text-[#706D65] max-w-2xl font-light leading-relaxed"
      >
        An immersive reading space designed to make digital books feel a little more like real books.
      </motion.p>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-8 flex flex-wrap items-center justify-center gap-4"
      >
        <button
          onClick={onStartReading}
          className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#6F8068] hover:bg-[#566650] text-[#FAF8F5] text-base font-sans font-medium shadow-sm transition-all duration-200 hover:shadow-md active:scale-95"
        >
          <span>Start Reading</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>

        <button
          onClick={onExploreReader}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#EDE8DC] hover:bg-[#E3DCce] text-[#252525] text-base font-sans font-medium transition-all duration-200 border border-[#E0D7C9] active:scale-95"
        >
          <Compass className="w-4 h-4 text-[#706D65]" />
          <span>Explore the Reader</span>
        </button>
      </motion.div>

      {/* Hero Visual Mockup */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="w-full mt-10"
      >
        <InteractiveHeroBook onOpenSample={onExploreReader} />
      </motion.div>

    </section>
  );
};
