import { Stack } from 'expo-router';
import { NetaForm } from '../../components/NetaForm';
import { createNeta } from '../../data/netas';

export default function CreateNetaScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'ネタ作成' }} />
      <NetaForm
        onSubmit={async (input, status) => {
          await createNeta(input, status);
        }}
      />
    </>
  );
}
