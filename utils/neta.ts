import { Neta } from '../types/neta';

const FALLBACK_TITLE_SOURCE_ORDER: (keyof Neta)[] = ['freeText', 'furi', 'ochi', 'point'];
const FALLBACK_TITLE_LENGTH = 20;
const SEARCHABLE_FIELDS: (keyof Neta)[] = ['title', 'freeText', 'furi', 'ochi', 'point'];

export function getDisplayTitle(neta: Neta): string {
  if (neta.title.trim().length > 0) {
    return neta.title;
  }
  for (const field of FALLBACK_TITLE_SOURCE_ORDER) {
    const value = neta[field] as string;
    if (value.trim().length > 0) {
      return value.slice(0, FALLBACK_TITLE_LENGTH);
    }
  }
  return '';
}

export function getAllTags(netas: Neta[]): string[] {
  const tags = new Set<string>();
  for (const neta of netas) {
    for (const tag of neta.tags) {
      tags.add(tag);
    }
  }
  return Array.from(tags);
}

export interface NetaFilter {
  keyword?: string;
  tags?: string[];
}

export function filterNetas(netas: Neta[], filter: NetaFilter): Neta[] {
  const keyword = filter.keyword?.trim().toLowerCase();
  const tags = filter.tags ?? [];

  return netas.filter((neta) => {
    const matchesKeyword =
      !keyword || SEARCHABLE_FIELDS.some((field) => (neta[field] as string).toLowerCase().includes(keyword));
    const matchesTags = tags.length === 0 || tags.some((tag) => neta.tags.includes(tag));
    return matchesKeyword && matchesTags;
  });
}

export function sortByUpdatedAtDesc(netas: Neta[]): Neta[] {
  return [...netas].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
}

const STATUS_LABELS: Record<Neta['status'], string> = {
  draft: '下書き',
  completed: '完成',
  performed: '披露済み',
};

export function getStatusLabel(status: Neta['status']): string {
  return STATUS_LABELS[status];
}
