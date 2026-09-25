import { AuthError } from '../data/auth';

const MESSAGES: Record<string, string> = {
  'auth/email-already-in-use': 'このメールアドレスは既に登録されています。',
  'auth/invalid-email': 'メールアドレスの形式が正しくありません。',
  'auth/weak-password': 'パスワードは6文字以上で入力してください。',
  'auth/invalid-credential': 'メールアドレスまたはパスワードが正しくありません。',
  'auth/user-not-found': '該当するアカウントが見つかりません。',
  'auth/wrong-password': 'パスワードが正しくありません。',
  'auth/too-many-requests': '試行回数が多すぎます。しばらくしてからお試しください。',
  'auth/network-request-failed': '通信エラーが発生しました。接続を確認してください。',
};

export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof AuthError) {
    return MESSAGES[error.code] ?? 'エラーが発生しました。もう一度お試しください。';
  }
  return 'エラーが発生しました。もう一度お試しください。';
}
