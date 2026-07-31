# Neta Stock 開発手順書

各機能仕様は [SPEC.md](./SPEC.md) を参照。本ドキュメントは実装の進め方（フェーズ分け）を定義する。

## 前提・現状（本ドキュメント作成時点）

- Expoの初期テンプレート状態（`index.ts` + `App.tsx` による `registerRootComponent` 方式）
- `expo-router` は依存関係・`app.json`のpluginには登録済みだが、`app/`ディレクトリが存在せず未使用
- Firebaseプロジェクトは未作成（Phase 3で作成する）
- コード変更前は必ず [AGENTS.md](./AGENTS.md) の指示に従い、Expo v57公式ドキュメント
  （https://docs.expo.dev/versions/v57.0.0/）を確認してから着手する

## Phase 0: ルーティング基盤の切り替え

- `index.ts`・`App.tsx`（現行の非routerエントリー）を削除し、`expo-router`のファイルベース
  ルーティング構成（`app/`ディレクトリ）に切り替える
- ルートレイアウト（`app/_layout.tsx`）を作成し、SPEC.md §7.7の画面遷移（未認証時はログイン画面へ
  リダイレクト等）に対応できる骨格を用意する

## Phase 1: 型定義・データ層の土台

- SPEC.md §8のデータモデルに沿って `Neta`・`User` 等のTypeScript型を定義する
- Firestoreアクセス層（CRUD・検索・タグ絞り込み・お気に入り・ステータス更新）を関数／フックとして
  設計する。Firebase未接続のため、中身はモックデータで先行実装し、Phase 3で実装を差し替える

## Phase 2: 画面実装（モックデータ）

SPEC.md §7の各画面を、Phase 1のモックデータ層を使って実装する。

1. ログイン画面（§7.1）
2. ホーム（一覧）画面（§7.2）
3. ネタ詳細画面（§7.3）
4. ネタ作成・編集画面（§7.4）
5. 検索画面（§7.5）
6. 設定画面（§7.6）

§7.7の画面遷移図の通りに `expo-router` で画面間の遷移を配線する。

## Phase 2.5: 実機での簡易検証（Expo Go）

Firebase接続前に、Phase 2までの内容が実際にスマホ上で動くかをExpo Goで確認する。

**準備（初回のみ）**
1. スマホに「Expo Go」アプリをインストールする（Android: Google Playストア／iPhone: App Store）
2. スマホとPCを同じWi-Fiネットワークに接続する

**確認手順（変更のたびに実施）**
1. プロジェクトフォルダで `npx expo start` を実行する（ターミナルにQRコードが表示される）
2. Expo Goアプリの「Scan QR code」で、ターミナルのQRコードを読み取る
3. スマホ上でアプリが起動し、実装済みの画面・遷移を確認できる
4. コードを保存すると自動でスマホ側にも反映される（リビルド不要）

同じWi-Fiでの接続がうまくいかない場合は `npx expo start --tunnel` を試す。

## Phase 3: Firebase接続

1. （ユーザー作業）Firebase Consoleでプロジェクトを作成し、Authentication（メール／パスワード）と
   Firestoreを有効化する
2. `firebase` SDKを導入し、設定値（apiKey等）を環境変数化する
3. Phase 1のモック実装を実際のFirestore／Auth呼び出しに置き換える
4. SPEC.md §9のセキュリティルールをFirestoreにデプロイする

## Phase 4: 仕上げ

- SPEC.md §6・§7の細部（バリデーション、確認ダイアログ、空状態表示、エラーハンドリング等）を作り込む
- 実機（Expo Go、必要に応じてEAS Build）で再度動作確認する
