import React from 'react';
import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { ThemeId } from '../../types';
import { READING_THEMES } from '../../utils/themes';

interface ThemeSelectorProps {
  currentTheme: ThemeId;
  onSelectTheme: (theme: ThemeId) => void;
  onClose: () => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  onSelectTheme,
  onClose,
}) => {
  const themeList = Object.values(READING_THEMES);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      className="w-80 p-4 rounded-2xl bg-[#FAF8F5] shadow-2xl border border-[#E5DFD2] text-[#252525]"
    >
      <div className="flex items-center justify-between pb-3 border-b border-[#EDE8DC] mb-3">
        <h4 className="font-serif text-base font-semibold text-[#252525]">
          Reading Environment
        </h4>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-[#706D65] hover:text-[#252525] hover:bg-[#EDE8DC] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2">
        {themeList.map((t) => {
          const isSelected = currentTheme === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onSelectTheme(t.id)}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'border-[#6F8068] ring-1 ring-[#6F8068] shadow-xs'
                  : 'border-[#EDE8DC] hover:border-[#D9D1C3]'
              }`}
              style={{ backgroundColor: t.paperColor, color: t.textColor }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-6 h-6 rounded-full border border-black/10 shadow-inner flex items-center justify-center"
                  style={{ backgroundColor: t.paperColor }}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: t.accentColor }}
                  ></div>
                </div>
                <div>
                  <div className="font-serif text-sm font-medium">{t.name}</div>
                  <div className="text-[11px] opacity-70 line-clamp-1">{t.description}</div>
                </div>
              </div>

              {isSelected && (
                <div className="w-5 h-5 rounded-full bg-[#6F8068] text-white flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
};
