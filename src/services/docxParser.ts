import mammoth from 'mammoth';
import { Book, BookPage, Chapter } from '../types';
import { ParseProgressCallback } from './pdfParser';

export async function parseDocxFile(
  file: File,
  onProgress?: ParseProgressCallback
): Promise<Book> {
  const arrayBuffer = await file.arrayBuffer();

  if (onProgress) {
    onProgress({ loaded: 20, total: 100, stage: 'Converting DOCX structure...' });
  }

  const result = await mammoth.convertToHtml({ arrayBuffer });
  const html = result.value;

  if (onProgress) {
    onProgress({ loaded: 50, total: 100, stage: 'Formatting pages and typography...' });
  }

  // Parse HTML DOM into logical sections / pages
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const nodes = Array.from(doc.body.children);

  const pages: BookPage[] = [];
  const chapters: Chapter[] = [];
  let currentPageNodes: string[] = [];
  let currentPageText: string[] = [];
  let pageNum = 1;
  let wordCountInPage = 0;
  const WORDS_PER_PAGE_TARGET = 300;
  let totalWords = 0;

  // Title Page
  const docTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
  pages.push({
    pageNumber: pageNum++,
    htmlContent: `
      <div class="h-full flex flex-col justify-center items-center text-center p-8">
        <div class="w-12 h-1 bg-[#6F8068] mb-8"></div>
        <h1 class="text-3xl font-serif font-medium tracking-wide mb-3">${docTitle}</h1>
        <p class="text-sm font-sans tracking-widest uppercase opacity-70">Imported Document</p>
        <div class="mt-12 text-xs font-sans opacity-50 italic">Formatted for Turna Reader</div>
      </div>
    `,
    textContent: `${docTitle} Imported Document`,
    chapterTitle: 'Title Page'
  });

  let currentChapterTitle = 'Chapter 1';

  nodes.forEach((node) => {
    const tagName = node.tagName.toLowerCase();
    const isHeading = ['h1', 'h2', 'h3'].includes(tagName);
    const text = node.textContent || '';
    const words = text.split(/\s+/).filter(Boolean);
    totalWords += words.length;

    if (isHeading) {
      // If we have content, flush previous page
      if (currentPageNodes.length > 0) {
        pages.push({
          pageNumber: pageNum++,
          htmlContent: `<div class="h-full flex flex-col justify-between py-2"><div class="space-y-4 text-justify leading-relaxed">${currentPageNodes.join('')}</div></div>`,
          textContent: currentPageText.join(' '),
          chapterTitle: currentChapterTitle,
        });
        currentPageNodes = [];
        currentPageText = [];
        wordCountInPage = 0;
      }

      currentChapterTitle = text || `Section ${chapters.length + 1}`;
      chapters.push({
        id: `ch-${chapters.length + 1}`,
        title: currentChapterTitle,
        pageNumber: pageNum,
        level: tagName === 'h1' ? 1 : 2,
      });

      currentPageNodes.push(`<div class="mb-4 pb-2 border-b border-current border-opacity-15"><h2 class="text-2xl font-serif font-medium">${node.innerHTML}</h2></div>`);
      currentPageText.push(text);
      wordCountInPage += words.length;
    } else {
      currentPageNodes.push(node.outerHTML);
      currentPageText.push(text);
      wordCountInPage += words.length;

      if (wordCountInPage >= WORDS_PER_PAGE_TARGET) {
        pages.push({
          pageNumber: pageNum++,
          htmlContent: `<div class="h-full flex flex-col justify-between py-2"><div class="space-y-4 text-justify leading-relaxed">${currentPageNodes.join('')}</div></div>`,
          textContent: currentPageText.join(' '),
          chapterTitle: currentChapterTitle,
        });
        currentPageNodes = [];
        currentPageText = [];
        wordCountInPage = 0;
      }
    }
  });

  if (currentPageNodes.length > 0) {
    pages.push({
      pageNumber: pageNum++,
      htmlContent: `<div class="h-full flex flex-col justify-between py-2"><div class="space-y-4 text-justify leading-relaxed">${currentPageNodes.join('')}</div></div>`,
      textContent: currentPageText.join(' '),
      chapterTitle: currentChapterTitle,
    });
  }

  if (onProgress) {
    onProgress({ loaded: 100, total: 100, stage: 'Complete!' });
  }

  const bookId = `docx-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  const estimatedReadingTimeMinutes = Math.max(1, Math.round(totalWords / 200));

  const newBook: Book = {
    id: bookId,
    title: docTitle.charAt(0).toUpperCase() + docTitle.slice(1),
    author: 'DOCX Document',
    description: `Imported DOCX document with ${pages.length} pages and ${totalWords.toLocaleString()} words.`,
    coverColor: '#36403C',
    totalPages: pages.length,
    currentPage: 1,
    progress: 0,
    estimatedReadingTimeMinutes,
    lastReadAt: Date.now(),
    createdAt: Date.now(),
    isFavorite: false,
    fileType: 'docx',
    fileData: arrayBuffer,
    pages,
    chapters: chapters.length > 0 ? chapters : [{ id: 'ch-1', title: 'Start of Document', pageNumber: 1, level: 1 }],
    totalWords,
  };

  return newBook;
}
