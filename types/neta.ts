export type NetaStatus = 'draft' | 'completed' | 'performed';

export interface Neta {
  id: string;
  title: string;
  freeText: string;
  furi: string;
  ochi: string;
  point: string;
  tags: string[];
  status: NetaStatus;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type NetaInput = Pick<Neta, 'title' | 'freeText' | 'furi' | 'ochi' | 'point' | 'tags'>;

export const NETA_TITLE_MAX_LENGTH = 100;
export const NETA_TEXT_MAX_LENGTH = 2000;
export const NETA_TAGS_MAX_COUNT = 10;
