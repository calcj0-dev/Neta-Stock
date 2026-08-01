import { Neta } from '../types/neta';
import { useNetas } from './useNetas';

export function useNeta(id: string): Neta | undefined {
  return useNetas().find((neta) => neta.id === id);
}
