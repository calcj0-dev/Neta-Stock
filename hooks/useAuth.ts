import { useSyncExternalStore } from 'react';
import { getCurrentUser, subscribeToAuth } from '../data/auth';
import { User } from '../types/user';

export function useAuth(): User | null {
  return useSyncExternalStore(subscribeToAuth, getCurrentUser, getCurrentUser);
}
