import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Neta, NetaInput, NetaStatus } from '../types/neta';
import { getCurrentUser, subscribeToAuth } from './auth';
import { getNetas, setNetas, subscribe } from './netaStore';

export const subscribeToNetas = subscribe;
export { getNetas };

function netasCollection(uid: string) {
  return collection(db, 'users', uid, 'netas');
}

function toNeta(id: string, data: Record<string, unknown>): Neta {
  return {
    id,
    title: (data.title as string) ?? '',
    freeText: (data.freeText as string) ?? '',
    furi: (data.furi as string) ?? '',
    ochi: (data.ochi as string) ?? '',
    point: (data.point as string) ?? '',
    tags: (data.tags as string[]) ?? [],
    status: (data.status as NetaStatus) ?? 'draft',
    isFavorite: (data.isFavorite as boolean) ?? false,
    createdAt: (data.createdAt as Timestamp | undefined)?.toDate() ?? new Date(),
    updatedAt: (data.updatedAt as Timestamp | undefined)?.toDate() ?? new Date(),
  };
}

let unsubscribeFirestore: (() => void) | null = null;

function syncNetasForCurrentUser(): void {
  unsubscribeFirestore?.();
  unsubscribeFirestore = null;

  const user = getCurrentUser();
  if (!user) {
    setNetas([]);
    return;
  }

  const q = query(netasCollection(user.uid), orderBy('updatedAt', 'desc'));
  unsubscribeFirestore = onSnapshot(q, (snapshot) => {
    setNetas(snapshot.docs.map((docSnapshot) => toNeta(docSnapshot.id, docSnapshot.data())));
  });
}

// Covers both the case where auth state changes after this module has loaded, and the case
// where the user was already signed in (persisted session) before this module first loaded.
subscribeToAuth(syncNetasForCurrentUser);
syncNetasForCurrentUser();

function requireUid(): string {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('ログインしていません');
  }
  return user.uid;
}

export async function createNeta(input: NetaInput, status: NetaStatus = 'draft'): Promise<string> {
  const uid = requireUid();
  const now = serverTimestamp();
  const docRef = await addDoc(netasCollection(uid), {
    ...input,
    status,
    isFavorite: false,
    createdAt: now,
    updatedAt: now,
  });
  return docRef.id;
}

export async function updateNeta(
  id: string,
  patch: Partial<NetaInput> & { status?: NetaStatus }
): Promise<void> {
  const uid = requireUid();
  await updateDoc(doc(netasCollection(uid), id), { ...patch, updatedAt: serverTimestamp() });
}

export async function deleteNeta(id: string): Promise<void> {
  const uid = requireUid();
  await deleteDoc(doc(netasCollection(uid), id));
}

export async function setFavorite(id: string, isFavorite: boolean): Promise<void> {
  const uid = requireUid();
  await updateDoc(doc(netasCollection(uid), id), { isFavorite });
}
