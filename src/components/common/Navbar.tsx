import React from 'react';
import { BookOpen, Library as LibraryIcon, Upload, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { pageAudio } from '../../utils/audioSynthesis';

interface NavbarProps {
  currentView: 'landing' | 'library' | 'reader';
  onNavigate: (view: 'landing' | 'library') => void;
  onOpenUpload: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  activeBookTitle?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenUpload,
  soundEnabled,
  onToggleSound,
  activeBookTitle,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#F5F1E8]/85 border-b border-[#EDE8DC] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onNavigate('landing')}
            className="group flex items-center gap-2.5 text-left focus:outline-none"
          >
            <div className="w-9 h-9 rounded-lg bg-[#6F8068] text-[#F5F1E8] flex items-center justify-center shadow-sm group-hover:bg-[#566650] transition-colors">
              <BookOpen className="w-5 h-5 transition-transform duration-300 group-hover:scale-105" />
            </div>
            <div>
              <span className="font-serif text-2xl font-semibold tracking-tight text-[#252525]">
                Turna
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-sans tracking-widest text-[#706D65] px-1.5 py-0.5 rounded bg-[#EDE8DC]">
                Reader
              </span>
            </div>
          </button>

          {/* Active Book in Reader breadcrumb */}
          {currentView === 'reader' && activeBookTitle && (
            <div className="hidden md:flex items-center gap-2 text-sm text-[#706D65] border-l border-[#EDE8DC] pl-4">
              <span className="truncate max-w-xs font-serif italic text-[#252525]">{activeBookTitle}</span>
            </div>
          )}
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => onNavigate('library')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-sans font-medium transition-colors ${
              currentView === 'library'
                ? 'bg-[#EDE8DC] text-[#252525]'
                : 'text-[#706D65] hover:text-[#252525] hover:bg-[#EDE8DC]/50'
            }`}
          >
            <LibraryIcon className="w-4 h-4" />
            <span>Library</span>
          </button>

          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-sans font-medium bg-[#6F8068] hover:bg-[#566650] text-[#FAF8F5] shadow-sm transition-all duration-200 hover:shadow"
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Upload Book</span>
            <span className="sm:hidden">Upload</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              onToggleSound();
              if (!soundEnabled) {
                pageAudio.setMuted(false);
                pageAudio.playPageTurn(true);
              } else {
                pageAudio.setMuted(true);
              }
            }}
            title={soundEnabled ? 'Page flip sound is ON' : 'Page flip sound is MUTED'}
            className="p-2 rounded-lg text-[#706D65] hover:text-[#252525] hover:bg-[#EDE8DC]/70 transition-colors focus:outline-none"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#6F8068]" />
            ) : (
              <VolumeX className="w-4 h-4 opacity-50" />
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
