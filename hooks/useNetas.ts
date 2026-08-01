import { useSyncExternalStore } from 'react';
import { getNetas, subscribeToNetas } from '../data/netas';
import { Neta } from '../types/neta';

export function useNetas(): Neta[] {
  return useSyncExternalStore(subscribeToNetas, getNetas, getNetas);
}
