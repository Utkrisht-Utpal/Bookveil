import React from 'react';
import { motion } from 'framer-motion';
import { Volume2, Palette, FileText, Smartphone, Search, Highlighter, Clock, Sparkles } from 'lucide-react';

export const FeatureShowcase: React.FC = () => {
  const features = [
    {
      icon: Volume2,
      title: 'Physical Page-Turn Physics & Sound',
      description: 'Drag corners or swipe to flip pages with natural paper curvature, realistic shadows, and synthetic acoustic paper rustle.',
      accent: '#C9A86A',
    },
    {
      icon: Palette,
      title: '7 Warm Editorial Themes',
      description: 'Carefully tuned palettes from Warm Ivory and Aged Parchment to deep Midnight and Forest reading atmospheres.',
      accent: '#E5C88F',
    },
    {
      icon: FileText,
      title: 'Native PDF & DOCX Parsing',
      description: 'Upload your documents directly in your browser. Read cleanly without bloated toolbars or PDF rendering lag.',
      accent: '#C9A86A',
    },
    {
      icon: Smartphone,
      title: 'Adaptive Dual View on Mobile & Tablets',
      description: 'Effortlessly toggle between immersive single-page 3D turning and continuous scroll reading modes on any screen.',
      accent: '#E5C88F',
    },
    {
      icon: Search,
      title: 'Instant Search & Navigable TOC',
      description: 'Find phrases instantly with highlighted occurrences and chapter outline detection for seamless navigation.',
      accent: '#C9A86A',
    },
    {
      icon: Highlighter,
      title: 'Distraction-Free Annotations',
      description: 'Bookmark beloved passages and highlight text in subtle sage, antique gold, or rose tones with attached personal notes.',
      accent: '#E5C88F',
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-[#2A241C]">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs uppercase font-sans tracking-widest text-[#C9A86A] font-semibold">
          Design Philosophy
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl font-semibold text-[#FAF8F5] mt-2 mb-4 tracking-tight">
          The reader is the product.
        </h2>
        <p className="font-sans text-sm sm:text-base text-[#8E8575] leading-relaxed">
          We stripped away the noise of conventional e-readers to recreate the quiet dignity of reading a real physical book.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, idx) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="p-7 rounded-2xl bg-[#171410] hover:bg-[#1F1A15] border border-[#2A241C] hover:border-[#C9A86A]/40 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between group"
            >
              <div>
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 bg-[#231E18] border border-[#383024] group-hover:border-[#C9A86A]/50 shadow-inner text-[#E5C88F] transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-xl font-medium text-[#FAF8F5] mb-2 group-hover:text-[#E5C88F] transition-colors">
                  {f.title}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-[#8E8575] leading-relaxed">
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
