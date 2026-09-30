import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Highlighter, Trash2, Plus, MessageSquare } from 'lucide-react';
import { Highlight, Note } from '../../types';

interface NotesPanelProps {
  highlights: Highlight[];
  notes: Note[];
  currentPage: number;
  onAddNote: (pageNumber: number, content: string, quote?: string) => void;
  onRemoveHighlight: (id: string) => void;
  onRemoveNote: (id: string) => void;
  onSelectPage: (pageNum: number) => void;
  onClose: () => void;
}

export const NotesPanel: React.FC<NotesPanelProps> = ({
  highlights,
  notes,
  currentPage,
  onAddNote,
  onRemoveHighlight,
  onRemoveNote,
  onSelectPage,
  onClose,
}) => {
  const [newNoteText, setNewNoteText] = useState('');

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    onAddNote(currentPage, newNoteText.trim());
    setNewNoteText('');
  };

  const colorMap = {
    sage: 'bg-[#6F8068]/20 border-[#6F8068] text-[#252525]',
    gold: 'bg-[#B79B68]/20 border-[#B79B68] text-[#252525]',
    rose: 'bg-[#C77D7D]/20 border-[#C77D7D] text-[#252525]',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      className="w-80 sm:w-96 max-h-[75vh] flex flex-col p-4 rounded-2xl bg-[#FAF8F5] shadow-2xl border border-[#E5DFD2] text-[#252525]"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#EDE8DC] mb-3">
        <div className="flex items-center gap-2">
          <Highlighter className="w-4 h-4 text-[#6F8068]" />
          <h4 className="font-serif text-base font-semibold text-[#252525]">
            Notes & Highlights
          </h4>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-[#706D65] hover:text-[#252525] hover:bg-[#EDE8DC] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Add note on current page */}
      <form onSubmit={handleCreateNote} className="mb-4">
        <div className="flex flex-col gap-2">
          <textarea
            placeholder={`Add a note for page ${currentPage}...`}
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 rounded-lg bg-[#EDE8DC]/70 border border-[#E0D9CB] focus:bg-white text-xs text-[#252525] focus:outline-none focus:border-[#6F8068] resize-none"
          />
          <button
            type="submit"
            disabled={!newNoteText.trim()}
            className="self-end px-3 py-1.5 rounded-lg bg-[#6F8068] hover:bg-[#566650] text-[#FAF8F5] text-xs font-sans font-medium flex items-center gap-1 shadow-xs transition-colors disabled:opacity-50"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Save Note</span>
          </button>
        </div>
      </form>

      {/* Highlights & Notes Feed */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {/* Notes */}
        {notes.map((n) => (
          <div
            key={n.id}
            className="p-3 rounded-xl border border-[#EDE8DC] bg-[#EDE8DC]/25 hover:bg-[#EDE8DC]/50 transition-all group"
          >
            <div className="flex items-center justify-between text-[11px] text-[#706D65] mb-1">
              <span className="font-semibold text-[#6F8068]">Note · Page {n.pageNumber}</span>
              <button
                onClick={() => onRemoveNote(n.id)}
                className="p-0.5 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="font-serif text-xs text-[#252525] leading-relaxed whitespace-pre-wrap">
              {n.content}
            </p>
          </div>
        ))}

        {/* Highlights */}
        {highlights.map((h) => (
          <div
            key={h.id}
            className="p-3 rounded-xl border border-[#EDE8DC] bg-[#EDE8DC]/20 hover:bg-[#EDE8DC]/40 transition-all group"
          >
            <div className="flex items-center justify-between text-[11px] text-[#706D65] mb-1.5">
              <span className="font-semibold text-[#B79B68]">
                Highlight · Page {h.pageNumber}
              </span>
              <button
                onClick={() => onRemoveHighlight(h.id)}
                className="p-0.5 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={() => {
                onSelectPage(h.pageNumber);
                onClose();
              }}
              className="text-left w-full"
            >
              <div
                className={`p-2 rounded-lg border-l-2 text-xs font-serif italic ${
                  colorMap[h.color] || colorMap.sage
                }`}
              >
                "{h.selectedText}"
              </div>
            </button>
          </div>
        ))}

        {notes.length === 0 && highlights.length === 0 && (
          <div className="py-8 text-center text-xs text-[#706D65]">
            No notes or highlights yet. You can write thoughts above or select text while reading to highlight.
          </div>
        )}
      </div>
    </motion.div>
  );
};
