import React from 'react';
import { BookOpen, Library as LibraryIcon, Upload, Volume2, VolumeX, Sparkles, Settings } from 'lucide-react';
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
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#0E0C0A]/85 border-b border-[#2A241C] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onNavigate('landing')}
            className="group flex items-center gap-3 text-left focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2D261C] to-[#1A1612] border border-[#C9A86A]/40 text-[#E5C88F] flex items-center justify-center shadow-lg shadow-black/40 group-hover:border-[#C9A86A] transition-all duration-300 group-hover:scale-105">
              <BookOpen className="w-5 h-5 text-[#E5C88F] transition-transform duration-300" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-2xl font-semibold tracking-tight text-[#FAF8F5] group-hover:text-[#E5C88F] transition-colors">
                Bookveil
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-sans tracking-widest text-[#A08044] px-1.5 py-0.5 rounded-md bg-[#251F17] border border-[#3D3325]">
                Sanctuary
              </span>
            </div>
          </button>

          {/* Active Book in Reader breadcrumb */}
          {currentView === 'reader' && activeBookTitle && (
            <div className="hidden md:flex items-center gap-2 text-sm text-[#8E8575] border-l border-[#2A241C] pl-4">
              <span className="truncate max-w-xs font-serif italic text-[#FAF8F5]">{activeBookTitle}</span>
            </div>
          )}
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => onNavigate('library')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-sans font-medium transition-all ${
              currentView === 'library'
                ? 'bg-[#251F17] text-[#E5C88F] border border-[#C9A86A]/30 shadow-xs'
                : 'text-[#8E8575] hover:text-[#FAF8F5] hover:bg-[#1A1612]'
            }`}
          >
            <LibraryIcon className="w-4 h-4" />
            <span>Library</span>
          </button>

          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-sans font-medium gold-gradient-btn active:scale-95 transition-all duration-200"
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
            title={soundEnabled ? 'Acoustic page turn sound is ON' : 'Acoustic page turn sound is MUTED'}
            className="p-2 rounded-xl text-[#8E8575] hover:text-[#E5C88F] hover:bg-[#1A1612] border border-transparent hover:border-[#2A241C] transition-all focus:outline-none"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#C9A86A]" />
            ) : (
              <VolumeX className="w-4 h-4 opacity-40" />
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
