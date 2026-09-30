export type ThemeId = 'classic' | 'ivory' | 'sepia' | 'parchment' | 'midnight' | 'forest' | 'minimal';

export type FontFamily = 'cormorant' | 'playfair' | 'lora' | 'merriweather' | 'sans';

export type MarginSize = 'compact' | 'normal' | 'spacious';

export type ViewMode = 'flip' | 'scroll' | 'single';

export interface BookPage {
  pageNumber: number;
  htmlContent?: string;
  textContent?: string;
  canvasDataUrl?: string;
  chapterTitle?: string;
  headerText?: string;
}

export interface Chapter {
  id: string;
  title: string;
  pageNumber: number;
  level?: number;
}

export interface Highlight {
  id: string;
  bookId: string;
  pageNumber: number;
  selectedText: string;
  note?: string;
  color: 'sage' | 'gold' | 'rose';
  createdAt: number;
}

export interface Bookmark {
  id: string;
  bookId: string;
  pageNumber: number;
  label: string;
  snippet?: string;
  createdAt: number;
}

export interface Note {
  id: string;
  bookId: string;
  pageNumber: number;
  content: string;
  quote?: string;
  createdAt: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description?: string;
  coverUrl?: string;
  coverColor?: string;
  totalPages: number;
  currentPage: number;
  progress: number; // 0 to 100
  estimatedReadingTimeMinutes: number;
  lastReadAt: number;
  createdAt: number;
  isFavorite?: boolean;
  isCompleted?: boolean;
  fileType: 'pdf' | 'docx' | 'sample';
  fileData?: ArrayBuffer | string; // Stored in IndexedDB
  pages: BookPage[];
  chapters: Chapter[];
  totalWords?: number;
  readingSpeedWPM?: number;
  totalReadingTimeSeconds?: number;
}

export interface ReaderSettings {
  theme: ThemeId;
  fontFamily: FontFamily;
  fontSize: number; // in px, e.g. 18
  lineHeight: number; // e.g. 1.7
  marginSize: MarginSize;
  soundEnabled: boolean;
  soundVolume: number; // 0.0 to 1.0
  viewMode: ViewMode; // 'flip' (2-page or adaptive), 'single' (1-page flip), 'scroll' (continuous)
  autoHideToolbar: boolean;
}

export interface SearchResult {
  pageNumber: number;
  matchIndex: number;
  snippet: string;
  matchText: string;
}

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  description: string;
  paperColor: string;
  textColor: string;
  accentColor: string;
  isDark: boolean;
}
