import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { getCurrentUser, setCurrentUser, subscribe } from './authStore';

export const subscribeToAuth = subscribe;
export { getCurrentUser };

export class AuthError extends Error {
  code: string;

  constructor(code: string) {
    super(code);
    this.code = code;
  }
}

function toAuthError(error: unknown): AuthError {
  const code = typeof error === 'object' && error && 'code' in error ? String((error as { code: unknown }).code) : 'unknown';
  return new AuthError(code);
}

onAuthStateChanged(auth, (firebaseUser) => {
  if (!firebaseUser) {
    setCurrentUser(null);
    return;
  }
  setCurrentUser({
    uid: firebaseUser.uid,
    displayName: firebaseUser.displayName ?? firebaseUser.email?.split('@')[0] ?? '',
    email: firebaseUser.email ?? '',
    createdAt: firebaseUser.metadata.creationTime ? new Date(firebaseUser.metadata.creationTime) : new Date(),
  });
});

export async function signUp(email: string, password: string): Promise<void> {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, 'users', credential.user.uid), {
      displayName: email.split('@')[0],
      email,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    throw toAuthError(error);
  }
}

export async function signIn(email: string, password: string): Promise<void> {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    throw toAuthError(error);
  }
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

export async function sendPasswordResetEmail(email: string): Promise<void> {
  try {
    await firebaseSendPasswordResetEmail(auth, email);
  } catch (error) {
    throw toAuthError(error);
  }
}
