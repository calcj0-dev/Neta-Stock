import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { sendPasswordResetEmail, signIn, signUp } from '../../data/auth';
import { getAuthErrorMessage } from '../../utils/authErrorMessage';

type Mode = 'signIn' | 'signUp';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

export default function LoginScreen() {
  const [mode, setMode] = useState<Mode>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function validate(): string | null {
    if (!EMAIL_PATTERN.test(email)) {
      return 'メールアドレスの形式が正しくありません。';
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      return `パスワードは${MIN_PASSWORD_LENGTH}文字以上で入力してください。`;
    }
    return null;
  }

  function switchMode(next: Mode) {
    setMode(next);
    setError(null);
  }

  async function handleSubmit() {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      if (mode === 'signIn') {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
    } catch (e) {
      setError(getAuthErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleForgotPassword() {
    if (!EMAIL_PATTERN.test(email)) {
      setError('パスワード再設定にはメールアドレスを正しく入力してください。');
      return;
    }
    setError(null);
    try {
      await sendPasswordResetEmail(email);
      Alert.alert('送信しました', 'パスワード再設定メールを送信しました。');
    } catch (e) {
      setError(getAuthErrorMessage(e));
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.appName}>Neta Stock</Text>

      <View style={styles.tabRow}>
        <Pressable style={[styles.tab, mode === 'signIn' && styles.tabActive]} onPress={() => switchMode('signIn')}>
          <Text style={[styles.tabText, mode === 'signIn' && styles.tabTextActive]}>サインイン</Text>
        </Pressable>
        <Pressable style={[styles.tab, mode === 'signUp' && styles.tabActive]} onPress={() => switchMode('signUp')}>
          <Text style={[styles.tabText, mode === 'signUp' && styles.tabTextActive]}>サインアップ</Text>
        </Pressable>
      </View>

      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="メールアドレス"
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="パスワード（6文字以上）"
        secureTextEntry
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <Pressable style={styles.submitButton} onPress={handleSubmit} disabled={submitting}>
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>{mode === 'signIn' ? 'サインイン' : 'サインアップ'}</Text>
        )}
      </Pressable>

      <Pressable onPress={handleForgotPassword}>
        <Text style={styles.forgotPassword}>パスワードを忘れた方</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 24,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 32,
  },
  tabRow: {
    flexDirection: 'row',
    marginBottom: 24,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  tabActive: {
    backgroundColor: '#333',
  },
  tabText: {
    color: '#555',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#fff',
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 12,
  },
  error: {
    color: '#cc3333',
    marginBottom: 12,
  },
  submitButton: {
    backgroundColor: '#333',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  forgotPassword: {
    color: '#0066cc',
    textAlign: 'center',
    marginTop: 20,
  },
});
