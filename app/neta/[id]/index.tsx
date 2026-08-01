import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { deleteNeta, setFavorite, updateNeta } from '../../../data/netas';
import { useNeta } from '../../../hooks/useNeta';
import { NetaStatus } from '../../../types/neta';
import { getStatusLabel } from '../../../utils/neta';

const STATUS_OPTIONS: NetaStatus[] = ['draft', 'completed', 'performed'];

export default function NetaDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const neta = useNeta(id);

  if (!neta) {
    return (
      <View style={styles.container}>
        <Text>ネタが見つかりませんでした。</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert('このネタを削除しますか？', 'この操作は取り消せません。', [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: '削除する',
        style: 'destructive',
        onPress: async () => {
          await deleteNeta(neta.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'ネタ詳細',
          headerRight: () => (
            <Pressable onPress={() => setFavorite(neta.id, !neta.isFavorite)} hitSlop={8}>
              <Text style={styles.favoriteToggle}>{neta.isFavorite ? '★' : '☆'}</Text>
            </Pressable>
          ),
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {neta.title.length > 0 && <Text style={styles.title}>{neta.title}</Text>}

        <View style={styles.statusRow}>
          {STATUS_OPTIONS.map((option) => (
            <Pressable
              key={option}
              style={[styles.statusChip, neta.status === option && styles.statusChipActive]}
              onPress={() => updateNeta(neta.id, { status: option })}
            >
              <Text style={[styles.statusChipText, neta.status === option && styles.statusChipTextActive]}>
                {getStatusLabel(option)}
              </Text>
            </Pressable>
          ))}
        </View>

        {neta.furi.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>フリ</Text>
            <Text style={styles.sectionText}>{neta.furi}</Text>
          </View>
        )}
        {neta.ochi.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>オチ</Text>
            <Text style={styles.sectionText}>{neta.ochi}</Text>
          </View>
        )}
        {neta.point.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>ポイント</Text>
            <Text style={styles.sectionText}>{neta.point}</Text>
          </View>
        )}
        {neta.freeText.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>自由記述</Text>
            <Text style={styles.sectionText}>{neta.freeText}</Text>
          </View>
        )}

        {neta.tags.length > 0 && (
          <View style={styles.tagRow}>
            {neta.tags.map((tag) => (
              <Text key={tag} style={styles.tag}>
                #{tag}
              </Text>
            ))}
          </View>
        )}

        <View style={styles.buttonRow}>
          <Pressable
            style={[styles.button, styles.editButton]}
            onPress={() => router.push(`/neta/${neta.id}/edit`)}
          >
            <Text style={styles.editButtonText}>編集</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>削除</Text>
          </Pressable>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
    paddingBottom: 48,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  favoriteToggle: {
    fontSize: 22,
    color: '#e0a500',
    marginRight: 8,
  },
  statusRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  statusChip: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#aaa',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  statusChipActive: {
    backgroundColor: '#333',
    borderColor: '#333',
  },
  statusChipText: {
    color: '#333',
    fontSize: 13,
  },
  statusChipTextActive: {
    color: '#fff',
  },
  section: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 13,
    color: '#888',
    marginBottom: 4,
  },
  sectionText: {
    fontSize: 15,
    lineHeight: 22,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  tag: {
    fontSize: 13,
    color: '#0066cc',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#333',
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  deleteButton: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#cc3333',
  },
  deleteButtonText: {
    color: '#cc3333',
    fontWeight: '600',
  },
});
