import React from 'react';
import { BookOpen } from 'lucide-react';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="w-full border-t border-[#2A241C] bg-[#0A0806] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-[#251F17] border border-[#C9A86A]/30 text-[#E5C88F] flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <span className="font-serif text-lg font-semibold tracking-tight text-[#FAF8F5]">
            Bookveil
          </span>
          <span className="text-xs text-[#8E8575] font-sans">
            · An Editorial Sanctuary for Digital Volumes
          </span>
        </div>

        <div className="text-xs font-sans text-[#756E61] flex items-center gap-1">
          <span>Crafted with care for typography, paper aesthetics & offline privacy</span>
        </div>
      </div>
    </footer>
  );
};
