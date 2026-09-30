import React from 'react';
import { motion } from 'framer-motion';
import { Volume2, Palette, FileText, Smartphone, Search, Highlighter, Clock, Sparkles } from 'lucide-react';

export const FeatureShowcase: React.FC = () => {
  const features = [
    {
      icon: Volume2,
      title: 'Physical Page-Turn Physics & Sound',
      description: 'Drag corners or swipe to flip pages with natural paper curvature, realistic shadows, and synthetic acoustic paper rustle.',
      accent: '#6F8068',
    },
    {
      icon: Palette,
      title: '7 Warm Editorial Themes',
      description: 'Carefully tuned palettes from Warm Ivory and Aged Parchment to deep Midnight and Forest reading atmospheres.',
      accent: '#B79B68',
    },
    {
      icon: FileText,
      title: 'Native PDF & DOCX Parsing',
      description: 'Upload your documents directly in your browser. Read cleanly without bloated toolbars or PDF rendering lag.',
      accent: '#6F8068',
    },
    {
      icon: Smartphone,
      title: 'Adaptive Dual View on Mobile & Tablets',
      description: 'Effortlessly toggle between immersive single-page 3D turning and continuous scroll reading modes on any screen.',
      accent: '#B79B68',
    },
    {
      icon: Search,
      title: 'Instant Search & Navigable TOC',
      description: 'Find phrases instantly with highlighted occurrences and chapter outline detection for seamless navigation.',
      accent: '#6F8068',
    },
    {
      icon: Highlighter,
      title: 'Distraction-Free Annotations',
      description: 'Bookmark beloved passages and highlight text in subtle sage, antique gold, or rose tones with attached personal notes.',
      accent: '#B79B68',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#EDE8DC]">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs uppercase font-sans tracking-widest text-[#6F8068] font-semibold">
          Design Philosophy
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl font-semibold text-[#252525] mt-2 mb-4">
          The reader is the product.
        </h2>
        <p className="font-sans text-base sm:text-lg text-[#706D65] leading-relaxed">
          We stripped away the noise of conventional e-readers to recreate the quiet dignity of reading a real physical book.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((f, idx) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="p-6 rounded-2xl bg-[#EDE8DC]/50 hover:bg-[#EDE8DC]/80 border border-[#E5DFD2] transition-all duration-300 hover:shadow-sm flex flex-col justify-between"
            >
              <div>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-5 bg-[#FAF8F5] shadow-xs text-[#252525]"
                  style={{ color: f.accent }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-[#252525] mb-2">
                  {f.title}
                </h3>
                <p className="font-sans text-sm text-[#706D65] leading-relaxed">
                  {f.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
