export function calculateReadingTimeRemaining(
  currentPage: number,
  totalPages: number,
  averageWpm: number = 220,
  wordsPerPage: number = 280
): { minutesLeft: number; percent: number; formattedText: string } {
  const pagesRemaining = Math.max(0, totalPages - currentPage);
  const wordsRemaining = pagesRemaining * wordsPerPage;
  const minutesLeft = Math.max(1, Math.round(wordsRemaining / averageWpm));
  const percent = totalPages > 0 ? Math.min(100, Math.round((currentPage / totalPages) * 100)) : 0;

  let timeString = '';
  if (minutesLeft < 60) {
    timeString = `~${minutesLeft} min left`;
  } else {
    const hours = Math.floor(minutesLeft / 60);
    const mins = minutesLeft % 60;
    timeString = mins > 0 ? `~${hours}h ${mins}m left` : `~${hours}h left`;
  }

  const formattedText = `${currentPage} / ${totalPages} · ${percent}% · ${timeString}`;

  return {
    minutesLeft,
    percent,
    formattedText,
  };
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${Math.round(seconds)} sec`;
  }
  const mins = Math.floor(seconds / 60);
  if (mins < 60) {
    return `${mins} min`;
  }
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return `${hours}h ${remainingMins}m`;
}
