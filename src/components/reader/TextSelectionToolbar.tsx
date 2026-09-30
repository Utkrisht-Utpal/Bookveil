import React from 'react';
import { motion } from 'framer-motion';
import { Highlighter, MessageSquare, X } from 'lucide-react';

interface TextSelectionToolbarProps {
  position: { top: number; left: number };
  onHighlight: (color: 'sage' | 'gold' | 'rose') => void;
  onAddNote: () => void;
  onClear: () => void;
}

export const TextSelectionToolbar: React.FC<TextSelectionToolbarProps> = ({
  position,
  onHighlight,
  onAddNote,
  onClear,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 5 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 5 }}
      style={{
        position: 'fixed',
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: 'translate(-50%, -100%)',
        marginTop: '-10px',
      }}
      className="z-50 flex items-center gap-1.5 p-1.5 rounded-full bg-[#171916]/90 backdrop-blur-md shadow-2xl border border-white/15 text-white"
    >
      {/* Highlight Color Buttons */}
      <button
        onClick={() => onHighlight('sage')}
        className="w-6 h-6 rounded-full bg-[#6F8068] hover:scale-110 transition-transform flex items-center justify-center"
        title="Sage Highlight"
      ></button>

      <button
        onClick={() => onHighlight('gold')}
        className="w-6 h-6 rounded-full bg-[#B79B68] hover:scale-110 transition-transform flex items-center justify-center"
        title="Antique Gold Highlight"
      ></button>

      <button
        onClick={() => onHighlight('rose')}
        className="w-6 h-6 rounded-full bg-[#C77D7D] hover:scale-110 transition-transform flex items-center justify-center"
        title="Rose Highlight"
      ></button>

      <div className="w-[1px] h-4 bg-white/20 mx-1"></div>

      {/* Add Note */}
      <button
        onClick={onAddNote}
        className="p-1.5 rounded-full hover:bg-white/10 text-white/90 transition-colors"
        title="Add Note to Selection"
      >
        <MessageSquare className="w-3.5 h-3.5" />
      </button>

      {/* Dismiss */}
      <button
        onClick={onClear}
        className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
        title="Dismiss"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
};
