import * as pdfjsLib from 'pdfjs-dist';
import { Book, BookPage, Chapter } from '../types';

// Set up pdf.js worker URL using CDN for high stability across Vite environments
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;

export interface ParseProgressCallback {
  (progress: { loaded: number; total: number; stage: string }): void;
}

export async function parsePdfFile(
  file: File,
  onProgress?: ParseProgressCallback
): Promise<Book> {
  const arrayBuffer = await file.arrayBuffer();
  
  if (onProgress) {
    onProgress({ loaded: 10, total: 100, stage: 'Loading PDF document...' });
  }

  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
    cMapUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/cmaps/`,
    cMapPacked: true,
  });

  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;
  const pages: BookPage[] = [];
  const chapters: Chapter[] = [];
  let totalWords = 0;

  // Extract outline / TOC if available
  try {
    const outline = await pdf.getOutline();
    if (outline && outline.length > 0) {
      for (let i = 0; i < outline.length; i++) {
        const item = outline[i];
        let targetPageNumber = 1;
        try {
          if (typeof item.dest === 'string') {
            const dest = await pdf.getDestination(item.dest);
            if (dest && dest[0]) {
              const destIndex = await pdf.getPageIndex(dest[0]);
              targetPageNumber = destIndex + 1;
            }
          } else if (Array.isArray(item.dest) && item.dest[0]) {
            const destIndex = await pdf.getPageIndex(item.dest[0]);
            targetPageNumber = destIndex + 1;
          }
        } catch (err) {
          // fallback page number
          targetPageNumber = Math.min(numPages, i + 1);
        }

        chapters.push({
          id: `toc-${i + 1}`,
          title: item.title,
          pageNumber: targetPageNumber,
          level: 1,
        });
      }
    }
  } catch (e) {
    console.warn('Could not extract PDF outline:', e);
  }

  // Parse each page
  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    if (onProgress) {
      const percent = 10 + Math.round((pageNum / numPages) * 80);
      onProgress({
        loaded: percent,
        total: 100,
        stage: `Rendering page ${pageNum} of ${numPages}...`,
      });
    }

    const page = await pdf.getPage(pageNum);
    
    // Extract text
    const textContent = await page.getTextContent();
    const textItems = textContent.items.map((item: any) => ('str' in item ? item.str : '')).join(' ');
    const wordCount = textItems.split(/\s+/).filter(Boolean).length;
    totalWords += wordCount;

    // Render page canvas to high-DPI data URL
    const viewport = page.getViewport({ scale: 1.6 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d', { alpha: false });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    if (context) {
      // Fill background
      context.fillStyle = '#FFFFFF';
      context.fillRect(0, 0, canvas.width, canvas.height);

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      await page.render(renderContext).promise;
      const canvasDataUrl = canvas.toDataURL('image/jpeg', 0.88);

      pages.push({
        pageNumber: pageNum,
        textContent: textItems,
        canvasDataUrl: canvasDataUrl,
        headerText: textItems.slice(0, 40),
      });
    }
  }

  const title = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
  const estimatedReadingTimeMinutes = Math.max(1, Math.round(totalWords / 200));

  const bookId = `pdf-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

  const newBook: Book = {
    id: bookId,
    title: title.charAt(0).toUpperCase() + title.slice(1),
    author: 'PDF Document',
    description: `Imported PDF containing ${numPages} pages and ${totalWords.toLocaleString()} words.`,
    coverColor: '#2D3B36',
    totalPages: numPages,
    currentPage: 1,
    progress: 0,
    estimatedReadingTimeMinutes,
    lastReadAt: Date.now(),
    createdAt: Date.now(),
    isFavorite: false,
    fileType: 'pdf',
    fileData: arrayBuffer,
    pages,
    chapters: chapters.length > 0 ? chapters : [{ id: 'ch-1', title: 'Start of Document', pageNumber: 1, level: 1 }],
    totalWords,
  };

  if (onProgress) {
    onProgress({ loaded: 100, total: 100, stage: 'Complete!' });
  }

  return newBook;
}
