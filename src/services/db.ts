import Dexie, { Table } from 'dexie';
import { Book, Highlight, Bookmark, ReaderSettings } from '../types';

export class TurnaDatabase extends Dexie {
  books!: Table<Book, string>;
  highlights!: Table<Highlight, string>;
  bookmarks!: Table<Bookmark, string>;

  constructor() {
    super('TurnaDB');
    this.version(1).stores({
      books: 'id, title, author, fileType, lastReadAt, progress, isFavorite, isCompleted',
      highlights: 'id, bookId, pageNumber, color, createdAt',
      bookmarks: 'id, bookId, pageNumber, createdAt',
    });
  }
}

export const db = new TurnaDatabase();

export const DEFAULT_SETTINGS: ReaderSettings = {
  theme: 'classic',
  fontFamily: 'cormorant',
  fontSize: 18,
  lineHeight: 1.7,
  marginSize: 'normal',
  soundEnabled: true,
  soundVolume: 0.6,
  viewMode: 'flip',
  autoHideToolbar: true,
};

export const SETTINGS_STORAGE_KEY = 'turna_reader_settings';

export function loadStoredSettings(): ReaderSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.warn('Failed to parse stored settings:', e);
  }
  return DEFAULT_SETTINGS;
}

export function saveStoredSettings(settings: ReaderSettings) {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save settings:', e);
  }
}
