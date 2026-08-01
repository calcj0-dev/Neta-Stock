import { AuthError } from '../data/auth';

const MESSAGES: Record<string, string> = {
  'auth/email-already-in-use': 'このメールアドレスは既に登録されています。',
  'auth/user-not-found': '該当するアカウントが見つかりません。',
  'auth/wrong-password': 'パスワードが正しくありません。',
};

export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof AuthError) {
    return MESSAGES[error.code] ?? 'エラーが発生しました。もう一度お試しください。';
  }
  return 'エラーが発生しました。もう一度お試しください。';
}
