import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { useDiscardGuard } from '../hooks/useDiscardGuard';
import { useNetas } from '../hooks/useNetas';
import {
  NETA_TAGS_MAX_COUNT,
  NETA_TEXT_MAX_LENGTH,
  NETA_TITLE_MAX_LENGTH,
  Neta,
  NetaInput,
  NetaStatus,
} from '../types/neta';
import { getAllTags, getStatusLabel } from '../utils/neta';

interface NetaFormProps {
  initialNeta?: Neta;
  onSubmit: (input: NetaInput, status: NetaStatus) => Promise<void>;
}

const STATUS_OPTIONS: NetaStatus[] = ['draft', 'completed', 'performed'];

export function NetaForm({ initialNeta, onSubmit }: NetaFormProps) {
  const netas = useNetas();
  const [title, setTitle] = useState(initialNeta?.title ?? '');
  const [freeText, setFreeText] = useState(initialNeta?.freeText ?? '');
  const [furi, setFuri] = useState(initialNeta?.furi ?? '');
  const [ochi, setOchi] = useState(initialNeta?.ochi ?? '');
  const [point, setPoint] = useState(initialNeta?.point ?? '');
  const [tags, setTags] = useState<string[]>(initialNeta?.tags ?? []);
  const [tagInput, setTagInput] = useState('');
  const [status, setStatus] = useState<NetaStatus>(initialNeta?.status ?? 'draft');
  const [structuredMode, setStructuredMode] = useState(
    Boolean(initialNeta && (initialNeta.furi || initialNeta.ochi || initialNeta.point))
  );
  const [saving, setSaving] = useState(false);
  const submittedRef = useRef(false);

  const hasUnsavedChanges =
    title !== (initialNeta?.title ?? '') ||
    freeText !== (initialNeta?.freeText ?? '') ||
    furi !== (initialNeta?.furi ?? '') ||
    ochi !== (initialNeta?.ochi ?? '') ||
    point !== (initialNeta?.point ?? '') ||
    status !== (initialNeta?.status ?? 'draft') ||
    tags.join(',') !== (initialNeta?.tags.join(',') ?? '');

  useDiscardGuard(!submittedRef.current && hasUnsavedChanges);

  const suggestedTags = getAllTags(netas).filter((tag) => !tags.includes(tag));

  function addTag(tag: string) {
    const trimmed = tag.trim();
    if (!trimmed) {
      return;
    }
    if (tags.includes(trimmed)) {
      setTagInput('');
      return;
    }
    if (tags.length >= NETA_TAGS_MAX_COUNT) {
      Alert.alert(`タグは最大${NETA_TAGS_MAX_COUNT}個までです`);
      return;
    }
    setTags([...tags, trimmed]);
    setTagInput('');
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  async function handleSave() {
    const hasContent = [title, freeText, furi, ochi, point].some((value) => value.trim().length > 0);
    if (!hasContent) {
      Alert.alert('入力してください', 'タイトル・自由記述・フリ・オチ・ポイントのいずれかを入力してください。');
      return;
    }
    setSaving(true);
    try {
      await onSubmit({ title, freeText, furi, ochi, point, tags }, status);
      submittedRef.current = true;
      router.back();
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>タイトル</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        maxLength={NETA_TITLE_MAX_LENGTH}
        placeholder="（未入力可）"
      />

      <View style={styles.modeRow}>
        <Text style={styles.label}>構造化モード（フリ・オチ・ポイント）</Text>
        <Switch value={structuredMode} onValueChange={setStructuredMode} />
      </View>

      {structuredMode ? (
        <>
          <Text style={styles.label}>フリ</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            value={furi}
            onChangeText={setFuri}
            maxLength={NETA_TEXT_MAX_LENGTH}
            multiline
          />
          <Text style={styles.label}>オチ</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            value={ochi}
            onChangeText={setOchi}
            maxLength={NETA_TEXT_MAX_LENGTH}
            multiline
          />
          <Text style={styles.label}>ポイント</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            value={point}
            onChangeText={setPoint}
            maxLength={NETA_TEXT_MAX_LENGTH}
            multiline
          />
        </>
      ) : (
        <>
          <Text style={styles.label}>自由記述</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            value={freeText}
            onChangeText={setFreeText}
            maxLength={NETA_TEXT_MAX_LENGTH}
            multiline
          />
        </>
      )}

      <Text style={styles.label}>タグ（最大{NETA_TAGS_MAX_COUNT}個）</Text>
      {tags.length > 0 && (
        <View style={styles.tagRow}>
          {tags.map((tag) => (
            <Pressable key={tag} style={styles.tagChip} onPress={() => removeTag(tag)}>
              <Text style={styles.tagChipText}>#{tag} ×</Text>
            </Pressable>
          ))}
        </View>
      )}
      <TextInput
        style={styles.input}
        value={tagInput}
        onChangeText={setTagInput}
        onSubmitEditing={() => addTag(tagInput)}
        placeholder="タグを入力して確定"
        returnKeyType="done"
      />
      {suggestedTags.length > 0 && (
        <View style={styles.tagRow}>
          {suggestedTags.map((tag) => (
            <Pressable key={tag} style={styles.suggestChip} onPress={() => addTag(tag)}>
              <Text style={styles.suggestChipText}>#{tag}</Text>
            </Pressable>
          ))}
        </View>
      )}

      <Text style={styles.label}>ステータス</Text>
      <View style={styles.tagRow}>
        {STATUS_OPTIONS.map((option) => (
          <Pressable
            key={option}
            style={[styles.statusChip, status === option && styles.statusChipActive]}
            onPress={() => setStatus(option)}
          >
            <Text style={[styles.statusChipText, status === option && styles.statusChipTextActive]}>
              {getStatusLabel(option)}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.buttonRow}>
        <Pressable style={[styles.button, styles.cancelButton]} onPress={() => router.back()}>
          <Text style={styles.cancelButtonText}>キャンセル</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.saveButton]} onPress={handleSave} disabled={saving}>
          <Text style={styles.saveButtonText}>{saving ? '保存中...' : '保存'}</Text>
        </Pressable>
      </View>
    </ScrollView>
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
  label: {
    fontSize: 13,
    color: '#555',
    marginTop: 16,
    marginBottom: 6,
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  tagChip: {
    backgroundColor: '#e6f0ff',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagChipText: {
    color: '#0066cc',
    fontSize: 13,
  },
  suggestChip: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#aaa',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  suggestChipText: {
    color: '#555',
    fontSize: 13,
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
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#eee',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#333',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
