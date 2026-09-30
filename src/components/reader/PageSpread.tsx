import React, { useMemo } from 'react';
import { BookPage, Highlight, ReaderSettings, ThemeId } from '../../types';
import { READING_THEMES } from '../../utils/themes';

interface PageSpreadProps {
  page: BookPage | null;
  pageNumber: number;
  totalPages: number;
  isLeftPage: boolean;
  themeId: ThemeId;
  settings: ReaderSettings;
  highlights: Highlight[];
  isTwoPageSpread: boolean;
  onTextSelected?: (selectedText: string, rect: DOMRect) => void;
}

export const PageSpread: React.FC<PageSpreadProps> = ({
  page,
  pageNumber,
  totalPages,
  isLeftPage,
  themeId,
  settings,
  highlights,
  isTwoPageSpread,
  onTextSelected,
}) => {
  const theme = READING_THEMES[themeId] || READING_THEMES.classic;

  const fontClass = useMemo(() => {
    switch (settings.fontFamily) {
      case 'cormorant':
        return 'font-serif';
      case 'playfair':
        return 'font-playfair';
      case 'lora':
        return 'font-lora';
      case 'merriweather':
        return 'font-merriweather';
      case 'sans':
        return 'font-sans';
      default:
        return 'font-serif';
    }
  }, [settings.fontFamily]);

  const marginPaddingClass = useMemo(() => {
    switch (settings.marginSize) {
      case 'compact':
        return 'p-6 sm:p-8';
      case 'spacious':
        return 'p-8 sm:p-14';
      case 'normal':
      default:
        return 'p-6 sm:p-10';
    }
  }, [settings.marginSize]);

  // Handle mouse selection for highlighting
  const handleMouseUp = () => {
    if (!onTextSelected) return;
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) {
      const text = selection.toString().trim();
      if (text.length > 2) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        onTextSelected(text, rect);
      }
    }
  };

  if (!page) {
    return (
      <div
        className={`w-full h-full flex items-center justify-center select-none paper-texture ${
          theme.isDark ? 'opacity-20' : 'opacity-40'
        }`}
        style={{ backgroundColor: theme.paperColor }}
      >
        <span className="font-serif italic text-xs opacity-50">Turna Blank Leaf</span>
      </div>
    );
  }

  return (
    <div
      onMouseUp={handleMouseUp}
      className={`relative w-full h-full flex flex-col justify-between overflow-hidden select-text transition-colors duration-300 ${
        theme.isDark ? 'paper-texture-subtle' : 'paper-texture'
      } ${marginPaddingClass}`}
      style={{
        backgroundColor: theme.paperColor,
        color: theme.textColor,
        fontSize: `${settings.fontSize}px`,
        lineHeight: settings.lineHeight,
      }}
    >
      {/* Center Gutter Inner Gradient Shadow */}
      {isTwoPageSpread && (
        <div
          className={`absolute top-0 bottom-0 pointer-events-none z-10 w-10 ${
            isLeftPage
              ? 'right-0 book-spine-gutter-left'
              : 'left-0 book-spine-gutter-right'
          }`}
        ></div>
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between text-[11px] font-sans tracking-widest uppercase opacity-60 pb-3 border-b border-current border-opacity-10 mb-4 select-none shrink-0">
        <span className="truncate max-w-[200px]">
          {page.headerText || page.chapterTitle || 'Turna Volume'}
        </span>
        <span className="font-mono text-[10px]">{pageNumber}</span>
      </div>

      {/* Page Body Content */}
      <div className={`flex-1 overflow-y-auto ${fontClass} leading-relaxed my-auto pr-1`}>
        {page.canvasDataUrl ? (
          // Render High-DPI PDF image
          <div className="w-full h-full flex items-center justify-center">
            <img
              src={page.canvasDataUrl}
              alt={`Page ${pageNumber}`}
              className="max-w-full max-h-full object-contain rounded-xs shadow-xs"
              loading="lazy"
            />
          </div>
        ) : page.htmlContent ? (
          // Render HTML page content (DOCX / Sample Book)
          <div
            className="turna-prose h-full flex flex-col justify-between"
            dangerouslySetInnerHTML={{ __html: page.htmlContent }}
          />
        ) : (
          // Plain text fallback
          <div className="space-y-4 text-justify">
            {page.textContent?.split('\n\n').map((para, pIdx) => (
              <p key={pIdx}>{para}</p>
            ))}
          </div>
        )}
      </div>

      {/* Page Footer */}
      <div className="flex items-center justify-between text-[10px] font-sans opacity-45 uppercase tracking-widest pt-3 border-t border-current border-opacity-10 mt-4 select-none shrink-0">
        <span>{page.chapterTitle || ''}</span>
        <span>{pageNumber} of {totalPages}</span>
      </div>
    </div>
  );
};
