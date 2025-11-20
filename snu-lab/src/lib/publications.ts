import type { PublicationRecord } from './types';

export type RawBibEntry = {
  citationKey: string;
  entryTags: Record<string, string | undefined>;
};

const cleanText = (value?: string) => {
  if (!value) return '';
  return value.replace(/[{}]/g, '').replace(/\\\\/g, '\\').replace(/\\(['"\\])/g, '$1');
};

const buildCitation = (tags: Record<string, string | undefined>, year: number) => {
  const venue = cleanText(tags.journal || tags.booktitle || '');
  const segments: string[] = [];
  if (venue) segments.push(venue);

  const volume = cleanText(tags.volume);
  const number = cleanText(tags.number);
  if (volume) {
    segments.push(number ? `${volume}(${number})` : volume);
  }

  const pages = cleanText(tags.pages);
  if (pages) {
    segments.push(pages);
  }

  segments.push(`(${year})`);
  return segments.filter(Boolean).join(' ');
};

export function normalizeBibEntry(entry: RawBibEntry): PublicationRecord {
  const tags = entry.entryTags || {};
  const authors = tags.author
    ? cleanText(tags.author)
        .split(' and ')
        .map((name) => name.trim())
    : [];

  const year = Number(tags.year) || new Date().getFullYear();
  const venue = cleanText(tags.journal || tags.booktitle || 'Preprint');

  return {
    id: entry.citationKey,
    title: cleanText(tags.title) || 'Untitled',
    authors,
    venue,
    year,
    type: tags.journal ? 'Journal' : 'Conference',
    doi: tags.doi ? cleanText(tags.doi) : undefined,
    link: tags.url ? cleanText(tags.url) : undefined,
    summary: cleanText(tags.abstract),
    citation: buildCitation(tags, year)
  };
}
