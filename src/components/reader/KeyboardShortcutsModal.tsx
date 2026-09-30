import React from 'react';
import { motion } from 'framer-motion';
import { X, Keyboard } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: '← / PageUp', action: 'Previous page' },
    { key: '→ / PageDown / Space', action: 'Next page' },
    { key: 'F', action: 'Toggle Fullscreen' },
    { key: 'B', action: 'Bookmark current page' },
    { key: 'T', action: 'Open Reading Themes' },
    { key: 'S', action: 'Search within book' },
    { key: 'C', action: 'Table of Contents' },
    { key: 'N', action: 'Notes & Highlights' },
    { key: 'H', action: 'Show / Hide Reader Toolbar' },
    { key: 'Esc', action: 'Close modal or overlay' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-[#FAF8F5] rounded-2xl shadow-2xl border border-[#E5DFD2] overflow-hidden text-[#252525]"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EDE8DC]">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-[#6F8068]" />
            <h3 className="font-serif text-lg font-semibold">Keyboard Shortcuts</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#706D65] hover:text-[#252525] hover:bg-[#EDE8DC] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 divide-y divide-[#EDE8DC]/60 max-h-[60vh] overflow-y-auto font-sans">
          {shortcuts.map((sc, idx) => (
            <div key={idx} className="flex items-center justify-between py-2.5 text-xs">
              <span className="text-[#706D65]">{sc.action}</span>
              <kbd className="px-2.5 py-1 rounded-lg bg-[#EDE8DC] border border-[#D9D1C3] text-[#252525] font-mono font-medium shadow-xs">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="px-6 py-3 bg-[#EDE8DC]/40 border-t border-[#EDE8DC] text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-medium bg-[#252525] text-white hover:bg-black transition-colors"
          >
            Got it
          </button>
        </div>
      </motion.div>
    </div>
  );
};
