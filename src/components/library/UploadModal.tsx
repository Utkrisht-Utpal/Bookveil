import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UploadCloud, FileText, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { parsePdfFile } from '../../services/pdfParser';
import { parseDocxFile } from '../../services/docxParser';
import { db } from '../../services/db';
import { Book } from '../../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookUploaded: (book: Book) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onBookUploaded,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressState, setProgressState] = useState<{ percent: number; stage: string }>({
    percent: 0,
    stage: '',
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleProcessFile = async (file: File) => {
    const isPdf = file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf';
    const isDocx =
      file.name.toLowerCase().endsWith('.docx') ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    if (!isPdf && !isDocx) {
      setErrorMessage('Please select a valid PDF (.pdf) or Word (.docx) document.');
      return;
    }

    setErrorMessage(null);
    setIsProcessing(true);
    setProgressState({ percent: 10, stage: 'Reading file...' });

    try {
      let parsedBook: Book;

      if (isPdf) {
        parsedBook = await parsePdfFile(file, (p) => {
          setProgressState({
            percent: p.loaded,
            stage: p.stage,
          });
        });
      } else {
        parsedBook = await parseDocxFile(file, (p) => {
          setProgressState({
            percent: p.loaded,
            stage: p.stage,
          });
        });
      }

      // Save into IndexedDB
      await db.books.put(parsedBook);

      setIsProcessing(false);
      onBookUploaded(parsedBook);
      onClose();
    } catch (err: any) {
      console.error('Error parsing book:', err);
      setIsProcessing(false);
      setErrorMessage(err.message || 'Failed to process document. Please ensure it is a readable PDF or DOCX file.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleProcessFile(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-lg bg-[#FAF8F5] rounded-2xl shadow-2xl border border-[#E5DFD2] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EDE8DC]">
          <div className="flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-[#6F8068]" />
            <h3 className="font-serif text-xl font-semibold text-[#252525]">
              Upload Book or Document
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1 rounded-lg text-[#706D65] hover:text-[#252525] hover:bg-[#EDE8DC] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {!isProcessing ? (
            <div>
              {/* Drop Target Area */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`cursor-pointer border-2 border-dashed rounded-xl p-8 sm:p-10 flex flex-col items-center justify-center text-center transition-all ${
                  isDragging
                    ? 'border-[#6F8068] bg-[#6F8068]/5 scale-[0.99]'
                    : 'border-[#D9D1C3] hover:border-[#6F8068] bg-[#F5F1E8]/50 hover:bg-[#F5F1E8]'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleInputChange}
                  className="hidden"
                />

                <div className="w-14 h-14 rounded-2xl bg-[#EDE8DC] text-[#6F8068] flex items-center justify-center mb-4 shadow-xs">
                  <FileText className="w-7 h-7" />
                </div>

                <p className="font-serif text-lg font-medium text-[#252525] mb-1">
                  Drop your book here
                </p>
                <p className="text-sm text-[#706D65] font-sans mb-4">
                  or <span className="text-[#6F8068] font-medium underline underline-offset-2">choose a file</span> from your computer
                </p>

                <div className="flex items-center gap-3 text-xs text-[#706D65] font-sans">
                  <span className="px-2 py-0.5 rounded bg-[#EDE8DC] font-medium text-[#252525]">PDF</span>
                  <span className="px-2 py-0.5 rounded bg-[#EDE8DC] font-medium text-[#252525]">DOCX</span>
                  <span>· Instant client-side formatting</span>
                </div>
              </div>

              {errorMessage && (
                <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="py-8 flex flex-col items-center justify-center text-center">
              <Loader2 className="w-10 h-10 text-[#6F8068] animate-spin mb-4" />
              <h4 className="font-serif text-lg font-medium text-[#252525] mb-1">
                Formatting Your Book
              </h4>
              <p className="text-xs font-sans text-[#706D65] mb-4">
                {progressState.stage || 'Processing document structure...'}
              </p>

              {/* Progress Bar */}
              <div className="w-full max-w-xs bg-[#EDE8DC] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#6F8068] h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressState.percent}%` }}
                ></div>
              </div>
              <span className="text-[11px] font-sans text-[#706D65] mt-2">
                {progressState.percent}%
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#EDE8DC]/50 border-t border-[#EDE8DC] text-right flex items-center justify-between text-xs text-[#706D65]">
          <span>Files stay private in your local browser storage</span>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-1.5 rounded-lg font-sans font-medium text-[#252525] hover:bg-[#EDE8DC] transition-colors"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
};
