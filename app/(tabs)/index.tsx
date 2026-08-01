import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NetaListItem } from '../../components/NetaListItem';
import { useNetas } from '../../hooks/useNetas';
import { getDisplayTitle, sortByUpdatedAtDesc } from '../../utils/neta';

export default function HomeScreen() {
  const netas = useNetas();
  const [refreshing, setRefreshing] = useState(false);

  const sorted = sortByUpdatedAtDesc(netas);
  const favorites = sorted.filter((neta) => neta.isFavorite);

  function handleRefresh() {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  }

  function handlePressNeta(id: string) {
    router.push(`/neta/${id}`);
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={sorted}
        keyExtractor={(neta) => neta.id}
        renderItem={({ item }) => <NetaListItem neta={item} onPress={handlePressNeta} />}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        contentContainerStyle={sorted.length === 0 ? styles.emptyContentContainer : undefined}
        ListHeaderComponent={
          favorites.length > 0 ? (
            <View style={styles.favoritesSection}>
              <Text style={styles.sectionTitle}>お気に入り</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {favorites.map((neta) => (
                  <Pressable key={neta.id} style={styles.favoriteChip} onPress={() => handlePressNeta(neta.id)}>
                    <Text numberOfLines={1} style={styles.favoriteChipText}>
                      {getDisplayTitle(neta)}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>最初のネタを記録しよう</Text>
            <Pressable style={styles.emptyStateButton} onPress={() => router.push('/neta/create')}>
              <Text style={styles.emptyStateButtonText}>新規作成</Text>
            </Pressable>
          </View>
        }
      />
      <Pressable style={styles.fab} onPress={() => router.push('/neta/create')}>
        <Text style={styles.fabText}>＋</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emptyContentContainer: {
    flexGrow: 1,
  },
  favoritesSection: {
    paddingTop: 12,
    paddingBottom: 4,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 13,
    color: '#888',
    marginBottom: 8,
  },
  favoriteChip: {
    backgroundColor: '#fff7e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    maxWidth: 160,
  },
  favoriteChipText: {
    color: '#8a6d00',
    fontWeight: '600',
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
    marginBottom: 16,
  },
  emptyStateButton: {
    backgroundColor: '#333',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  fabText: {
    color: '#fff',
    fontSize: 28,
    lineHeight: 30,
  },
});
