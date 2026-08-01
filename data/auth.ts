import { User } from '../types/user';
import { getCurrentUser, setCurrentUser, subscribe } from './authStore';

export const subscribeToAuth = subscribe;
export { getCurrentUser };

export type AuthErrorCode = 'auth/email-already-in-use' | 'auth/user-not-found' | 'auth/wrong-password';

export class AuthError extends Error {
  code: AuthErrorCode;

  constructor(code: AuthErrorCode) {
    super(code);
    this.code = code;
  }
}

interface StoredAccount {
  password: string;
  uid: string;
  displayName: string;
  createdAt: Date;
}

const accounts = new Map<string, StoredAccount>();

function generateUid(): string {
  return Math.random().toString(36).slice(2, 10);
}

function toUser(email: string, account: StoredAccount): User {
  return {
    uid: account.uid,
    displayName: account.displayName,
    email,
    createdAt: account.createdAt,
  };
}

export async function signUp(email: string, password: string): Promise<void> {
  if (accounts.has(email)) {
    throw new AuthError('auth/email-already-in-use');
  }
  const account: StoredAccount = {
    password,
    uid: generateUid(),
    displayName: email.split('@')[0],
    createdAt: new Date(),
  };
  accounts.set(email, account);
  setCurrentUser(toUser(email, account));
}

export async function signIn(email: string, password: string): Promise<void> {
  const account = accounts.get(email);
  if (!account) {
    throw new AuthError('auth/user-not-found');
  }
  if (account.password !== password) {
    throw new AuthError('auth/wrong-password');
  }
  setCurrentUser(toUser(email, account));
}

export async function signOut(): Promise<void> {
  setCurrentUser(null);
}

export async function sendPasswordResetEmail(email: string): Promise<void> {
  if (!accounts.has(email)) {
    throw new AuthError('auth/user-not-found');
  }
}
