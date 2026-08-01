import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { NetaListItem } from '../../components/NetaListItem';
import { useNetas } from '../../hooks/useNetas';
import { filterNetas, getAllTags, sortByUpdatedAtDesc } from '../../utils/neta';

export default function SearchScreen() {
  const netas = useNetas();
  const [keyword, setKeyword] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const allTags = getAllTags(netas);
  const results = sortByUpdatedAtDesc(filterNetas(netas, { keyword, tags: selectedTags }));
  const hasFilter = keyword.trim().length > 0 || selectedTags.length > 0;

  function toggleTag(tag: string) {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        value={keyword}
        onChangeText={setKeyword}
        placeholder="キーワードで検索"
      />
      {allTags.length > 0 && (
        <View style={styles.tagRow}>
          {allTags.map((tag) => (
            <Pressable
              key={tag}
              style={[styles.tagChip, selectedTags.includes(tag) && styles.tagChipActive]}
              onPress={() => toggleTag(tag)}
            >
              <Text style={[styles.tagChipText, selectedTags.includes(tag) && styles.tagChipTextActive]}>
                #{tag}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
      <FlatList
        data={results}
        keyExtractor={(neta) => neta.id}
        renderItem={({ item }) => <NetaListItem neta={item} onPress={(id) => router.push(`/neta/${id}`)} />}
        contentContainerStyle={results.length === 0 ? styles.emptyContentContainer : undefined}
        ListEmptyComponent={
          hasFilter ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>見つかりませんでした</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchInput: {
    margin: 16,
    marginBottom: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  tagChip: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#aaa',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagChipActive: {
    backgroundColor: '#333',
    borderColor: '#333',
  },
  tagChipText: {
    color: '#555',
    fontSize: 13,
  },
  tagChipTextActive: {
    color: '#fff',
  },
  emptyContentContainer: {
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyStateText: {
    fontSize: 15,
    color: '#666',
  },
});
