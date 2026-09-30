import { useEffect } from 'react';

interface ShortcutHandlers {
  onPrevPage?: () => void;
  onNextPage?: () => void;
  onToggleFullscreen?: () => void;
  onToggleBookmark?: () => void;
  onToggleTheme?: () => void;
  onToggleSearch?: () => void;
  onToggleContents?: () => void;
  onToggleSettings?: () => void;
  onToggleNotes?: () => void;
  onToggleControls?: () => void;
  onCloseOverlay?: () => void;
  onOpenShortcuts?: () => void;
}

export function useKeyboardShortcuts(
  handlers: ShortcutHandlers,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        if (e.key === 'Escape') {
          handlers.onCloseOverlay?.();
        }
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          handlers.onPrevPage?.();
          break;
        case 'ArrowRight':
        case 'PageDown':
        case ' ': // Spacebar
          e.preventDefault();
          handlers.onNextPage?.();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          handlers.onToggleFullscreen?.();
          break;
        case 'b':
        case 'B':
          e.preventDefault();
          handlers.onToggleBookmark?.();
          break;
        case 't':
        case 'T':
          e.preventDefault();
          handlers.onToggleTheme?.();
          break;
        case 's':
        case 'S':
          e.preventDefault();
          handlers.onToggleSearch?.();
          break;
        case 'c':
        case 'C':
          e.preventDefault();
          handlers.onToggleContents?.();
          break;
        case 'n':
        case 'N':
          e.preventDefault();
          handlers.onToggleNotes?.();
          break;
        case 'h':
        case 'H':
          e.preventDefault();
          handlers.onToggleControls?.();
          break;
        case 'Escape':
          e.preventDefault();
          handlers.onCloseOverlay?.();
          break;
        case '?':
          e.preventDefault();
          handlers.onOpenShortcuts?.();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handlers, enabled]);
}
