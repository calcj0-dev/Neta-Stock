import { Neta } from '../types/neta';

type Listener = () => void;

const listeners = new Set<Listener>();

let netas: Neta[] = [];

export function getNetas(): Neta[] {
  return netas;
}

export function setNetas(next: Neta[]): void {
  netas = next;
  listeners.forEach((listener) => listener());
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
