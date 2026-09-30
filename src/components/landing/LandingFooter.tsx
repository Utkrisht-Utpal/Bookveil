import React from 'react';
import { BookOpen, Heart } from 'lucide-react';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="w-full border-t border-[#EDE8DC] bg-[#EDE8DC]/40 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-[#6F8068] text-[#F5F1E8] flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <span className="font-serif text-lg font-semibold tracking-tight text-[#252525]">
            Turna
          </span>
          <span className="text-xs text-[#706D65] font-sans">
            · Digital Editorial Reading Sanctuary
          </span>
        </div>

        <div className="text-xs font-sans text-[#706D65] flex items-center gap-1">
          <span>Designed with care for lovers of typography and physical books</span>
        </div>
      </div>
    </footer>
  );
};
