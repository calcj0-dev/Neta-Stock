import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { signOut } from '../../data/auth';
import { useAuth } from '../../hooks/useAuth';

export default function SettingsScreen() {
  const user = useAuth();

  function handleLogout() {
    Alert.alert('ログアウトしますか？', undefined, [
      { text: 'キャンセル', style: 'cancel' },
      { text: 'ログアウト', style: 'destructive', onPress: () => signOut() },
    ]);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>アカウント情報</Text>
      <Text style={styles.email}>{user?.email}</Text>

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>ログアウト</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  label: {
    fontSize: 13,
    color: '#888',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    marginBottom: 32,
  },
  logoutButton: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#cc3333',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#cc3333',
    fontWeight: '600',
  },
});
