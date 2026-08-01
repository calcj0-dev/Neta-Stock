import { Neta, NetaInput, NetaStatus } from '../types/neta';
import { getNetas, setNetas, subscribe } from './netaStore';

export const subscribeToNetas = subscribe;
export { getNetas };

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export async function createNeta(input: NetaInput, status: NetaStatus = 'draft'): Promise<string> {
  const now = new Date();
  const neta: Neta = {
    id: generateId(),
    ...input,
    status,
    isFavorite: false,
    createdAt: now,
    updatedAt: now,
  };
  setNetas([neta, ...getNetas()]);
  return neta.id;
}

export async function updateNeta(
  id: string,
  patch: Partial<NetaInput> & { status?: NetaStatus }
): Promise<void> {
  setNetas(
    getNetas().map((neta) => (neta.id === id ? { ...neta, ...patch, updatedAt: new Date() } : neta))
  );
}

export async function deleteNeta(id: string): Promise<void> {
  setNetas(getNetas().filter((neta) => neta.id !== id));
}

export async function setFavorite(id: string, isFavorite: boolean): Promise<void> {
  setNetas(getNetas().map((neta) => (neta.id === id ? { ...neta, isFavorite } : neta)));
}
