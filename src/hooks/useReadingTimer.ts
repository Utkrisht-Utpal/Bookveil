import { useEffect, useRef } from 'react';
import { db } from '../services/db';

export function useReadingTimer(bookId: string | undefined, enabled: boolean = true) {
  const secondsRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!bookId || !enabled) return;

    intervalRef.current = setInterval(async () => {
      secondsRef.current += 1;
      
      // Every 30 seconds, persist reading stats to database
      if (secondsRef.current % 30 === 0) {
        try {
          const book = await db.books.get(bookId);
          if (book) {
            const currentTotalTime = (book.totalReadingTimeSeconds || 0) + 30;
            await db.books.update(bookId, {
              totalReadingTimeSeconds: currentTotalTime,
              lastReadAt: Date.now(),
            });
          }
        } catch (err) {
          console.warn('Error updating reading timer:', err);
        }
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [bookId, enabled]);

  return { getElapsedSeconds: () => secondsRef.current };
}
