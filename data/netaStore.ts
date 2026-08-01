import { Neta } from '../types/neta';

type Listener = () => void;

const listeners = new Set<Listener>();

let netas: Neta[] = createSeedNetas();

export function getNetas(): Neta[] {
  return netas;
}

export function setNetas(next: Neta[]): void {
  netas = next;
  listeners.forEach((listener) => listener());
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function createSeedNetas(): Neta[] {
  const now = new Date();
  return [
    {
      id: 'seed-1',
      title: 'コンビニ店員に二度見された話',
      freeText: '',
      furi: '深夜バイト終わりにコンビニでおでんを買おうとしたら',
      ochi: '店員に「温めますか」と聞かれ、寝ぼけて自分の体温を答えてしまった',
      point: '「温めますか」と言われた瞬間の間を意識する',
      tags: ['バイト', 'あるある'],
      status: 'completed',
      isFavorite: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'seed-2',
      title: '',
      freeText: '実家の犬が毎回インターホンより先に来客を察知して吠える。しかも郵便配達員の日だけ吠え方が違う。',
      furi: '',
      ochi: '',
      point: '',
      tags: ['家族'],
      status: 'draft',
      isFavorite: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'seed-3',
      title: '飲み会の一発ギャグで滑った件',
      freeText: '',
      furi: '飲み会の自己紹介で一発ギャグを振られて',
      ochi: '緊張しすぎてギャグの前に自分の名前を二回言ってしまった',
      point: '間の取り方を練習してから披露する',
      tags: ['失敗談', 'あるある'],
      status: 'performed',
      isFavorite: false,
      createdAt: now,
      updatedAt: now,
    },
  ];
}
