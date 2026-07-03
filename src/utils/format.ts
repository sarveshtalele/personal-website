/** Format a date as "Jan 5, 2026" for listings and metadata. */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/** Format a date as "Jan 2026" for timelines. */
export function formatMonthYear(date: Date): string {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
}

/** Sort entries newest-first by the given date field. */
export function byDateDesc<T>(getDate: (item: T) => Date) {
  return (a: T, b: T) => getDate(b).valueOf() - getDate(a).valueOf();
}

/** Turn a tag into a URL-safe slug. */
export function slugifyTag(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
