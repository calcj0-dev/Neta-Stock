import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { Alert } from 'react-native';

export function useDiscardGuard(hasUnsavedChanges: boolean): void {
  const navigation = useNavigation();

  useEffect(() => {
    return navigation.addListener('beforeRemove', (e) => {
      if (!hasUnsavedChanges) {
        return;
      }
      e.preventDefault();
      Alert.alert('編集内容を破棄しますか？', '保存されていない変更は失われます。', [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '破棄する',
          style: 'destructive',
          onPress: () => navigation.dispatch(e.data.action),
        },
      ]);
    });
  }, [navigation, hasUnsavedChanges]);
}
