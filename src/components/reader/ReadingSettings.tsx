import React from 'react';
import { motion } from 'framer-motion';
import { X, Type, Layout, Volume2, Eye, Sliders, BookOpen, ScrollText } from 'lucide-react';
import { ReaderSettings, FontFamily, MarginSize, ViewMode } from '../../types';

interface ReadingSettingsProps {
  settings: ReaderSettings;
  onUpdateSettings: (newSettings: Partial<ReaderSettings>) => void;
  onClose: () => void;
}

export const ReadingSettings: React.FC<ReadingSettingsProps> = ({
  settings,
  onUpdateSettings,
  onClose,
}) => {
  const fontFamilies: { id: FontFamily; label: string; fontClass: string }[] = [
    { id: 'cormorant', label: 'Cormorant', fontClass: 'font-serif' },
    { id: 'playfair', label: 'Playfair', fontClass: 'font-playfair' },
    { id: 'lora', label: 'Lora', fontClass: 'font-lora' },
    { id: 'merriweather', label: 'Merriweather', fontClass: 'font-merriweather' },
    { id: 'sans', label: 'Inter Sans', fontClass: 'font-sans' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      className="w-80 sm:w-96 p-5 rounded-2xl bg-[#FAF8F5] shadow-2xl border border-[#E5DFD2] text-[#252525] max-h-[85vh] overflow-y-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#EDE8DC] mb-4">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#6F8068]" />
          <h4 className="font-serif text-base font-semibold text-[#252525]">
            Reading Preferences
          </h4>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-[#706D65] hover:text-[#252525] hover:bg-[#EDE8DC] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-5 text-xs font-sans">
        
        {/* Reading Layout Mode (Immersive Flip vs Normal PDF Scroll) */}
        <div>
          <label className="block text-[#706D65] font-medium mb-2">Reading Layout</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onUpdateSettings({ viewMode: 'flip' })}
              className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center ${
                settings.viewMode === 'flip'
                  ? 'border-[#6F8068] bg-[#6F8068]/10 font-semibold text-[#252525]'
                  : 'border-[#EDE8DC] hover:border-[#D9D1C3] text-[#706D65]'
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#6F8068]" />
              <span className="text-xs">Immersive Book</span>
              <span className="text-[10px] opacity-70">Physical page flips</span>
            </button>

            <button
              onClick={() => onUpdateSettings({ viewMode: 'scroll' })}
              className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center ${
                settings.viewMode === 'scroll'
                  ? 'border-[#6F8068] bg-[#6F8068]/10 font-semibold text-[#252525]'
                  : 'border-[#EDE8DC] hover:border-[#D9D1C3] text-[#706D65]'
              }`}
            >
              <ScrollText className="w-4 h-4 text-[#6F8068]" />
              <span className="text-xs">Continuous Scroll</span>
              <span className="text-[10px] opacity-70">Clean vertical stream</span>
            </button>
          </div>
        </div>

        {/* Typography / Font Family */}
        <div>
          <label className="block text-[#706D65] font-medium mb-2">Typeface</label>
          <div className="grid grid-cols-2 gap-1.5">
            {fontFamilies.map((f) => (
              <button
                key={f.id}
                onClick={() => onUpdateSettings({ fontFamily: f.id })}
                className={`px-3 py-2 rounded-lg border text-left transition-all ${
                  settings.fontFamily === f.id
                    ? 'border-[#6F8068] bg-[#6F8068]/10 font-semibold text-[#252525]'
                    : 'border-[#EDE8DC] hover:border-[#D9D1C3] text-[#706D65]'
                }`}
              >
                <span className={`text-sm ${f.fontClass}`}>{f.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Font Size */}
        <div>
          <div className="flex items-center justify-between text-[#706D65] mb-2">
            <span className="font-medium">Type Size</span>
            <span className="text-[#252525] font-semibold">{settings.fontSize}px</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-serif">A</span>
            <input
              type="range"
              min="14"
              max="26"
              step="1"
              value={settings.fontSize}
              onChange={(e) => onUpdateSettings({ fontSize: Number(e.target.value) })}
              className="w-full accent-[#6F8068] cursor-pointer"
            />
            <span className="text-lg font-serif">A</span>
          </div>
        </div>

        {/* Line Spacing */}
        <div>
          <div className="flex items-center justify-between text-[#706D65] mb-2">
            <span className="font-medium">Line Spacing</span>
            <span className="text-[#252525] font-semibold">{settings.lineHeight}x</span>
          </div>
          <input
            type="range"
            min="1.4"
            max="2.2"
            step="0.1"
            value={settings.lineHeight}
            onChange={(e) => onUpdateSettings({ lineHeight: Number(e.target.value) })}
            className="w-full accent-[#6F8068] cursor-pointer"
          />
        </div>

        {/* Margins */}
        <div>
          <label className="block text-[#706D65] font-medium mb-2">Page Margins</label>
          <div className="grid grid-cols-3 gap-1.5">
            {(['compact', 'normal', 'spacious'] as MarginSize[]).map((m) => (
              <button
                key={m}
                onClick={() => onUpdateSettings({ marginSize: m })}
                className={`py-1.5 px-2 rounded-lg border capitalize transition-all ${
                  settings.marginSize === m
                    ? 'border-[#6F8068] bg-[#6F8068]/10 font-semibold text-[#252525]'
                    : 'border-[#EDE8DC] hover:border-[#D9D1C3] text-[#706D65]'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Sound Volume */}
        <div>
          <div className="flex items-center justify-between text-[#706D65] mb-2">
            <span className="font-medium flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-[#6F8068]" />
              Page Flip Sound
            </span>
            <span className="text-[#252525] font-semibold">
              {settings.soundEnabled ? `${Math.round(settings.soundVolume * 100)}%` : 'Muted'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
              className={`px-2.5 py-1 rounded-md text-xs border ${
                settings.soundEnabled
                  ? 'bg-[#6F8068] text-white border-[#6F8068]'
                  : 'bg-[#EDE8DC] text-[#706D65] border-[#E0D9CB]'
              }`}
            >
              {settings.soundEnabled ? 'ON' : 'OFF'}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              disabled={!settings.soundEnabled}
              value={settings.soundVolume}
              onChange={(e) => onUpdateSettings({ soundVolume: Number(e.target.value) })}
              className="w-full accent-[#6F8068] cursor-pointer disabled:opacity-40"
            />
          </div>
        </div>

        {/* Auto Hide Toolbar */}
        <div className="pt-2 border-t border-[#EDE8DC] flex items-center justify-between">
          <div>
            <span className="font-medium text-[#252525] block">Auto-hide Toolbar</span>
            <span className="text-[10px] text-[#706D65]">
              Hides controls while reading for total immersion
            </span>
          </div>
          <input
            type="checkbox"
            checked={settings.autoHideToolbar}
            onChange={(e) => onUpdateSettings({ autoHideToolbar: e.target.checked })}
            className="w-4 h-4 accent-[#6F8068] rounded cursor-pointer"
          />
        </div>

      </div>
    </motion.div>
  );
};
