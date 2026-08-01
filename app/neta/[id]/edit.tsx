import { Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { NetaForm } from '../../../components/NetaForm';
import { updateNeta } from '../../../data/netas';
import { useNeta } from '../../../hooks/useNeta';

export default function EditNetaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const neta = useNeta(id);

  if (!neta) {
    return (
      <View style={styles.container}>
        <Text>ネタが見つかりませんでした。</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'ネタ編集' }} />
      <NetaForm
        initialNeta={neta}
        onSubmit={async (input, status) => {
          await updateNeta(neta.id, { ...input, status });
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
});
