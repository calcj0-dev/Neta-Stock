import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Neta } from '../types/neta';
import { getDisplayTitle, getStatusLabel } from '../utils/neta';

interface NetaListItemProps {
  neta: Neta;
  onPress: (id: string) => void;
}

export function NetaListItem({ neta, onPress }: NetaListItemProps) {
  return (
    <Pressable style={styles.container} onPress={() => onPress(neta.id)}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {getDisplayTitle(neta)}
        </Text>
        {neta.isFavorite && <Text style={styles.favorite}>★</Text>}
      </View>
      <View style={styles.metaRow}>
        <Text style={styles.statusBadge}>{getStatusLabel(neta.status)}</Text>
        {neta.tags.map((tag) => (
          <Text key={tag} style={styles.tag}>
            #{tag}
          </Text>
        ))}
      </View>
      <Text style={styles.updatedAt}>{neta.updatedAt.toLocaleString('ja-JP')}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  favorite: {
    color: '#e0a500',
    marginLeft: 8,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  statusBadge: {
    fontSize: 12,
    color: '#fff',
    backgroundColor: '#555',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
  tag: {
    fontSize: 12,
    color: '#0066cc',
  },
  updatedAt: {
    fontSize: 11,
    color: '#888',
    marginTop: 6,
  },
});
