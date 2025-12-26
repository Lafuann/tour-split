export const hasScrollbar =
  typeof window !== "undefined" &&
  document.documentElement.scrollHeight > document.documentElement.clientHeight;

export const normalizeDate = (date: Date) =>
  new Date(date.setHours(12, 0, 0, 0));
