# 福井県観光DX AIカメラオープンデータ可視化ウェブアプリケーション

このリポジトリは、福井県観光DXプロジェクトで収集されたAIカメラによる人流データの可視化を目的としたモノレポです。複数のVite+Reactアプリケーションと、共通コンポーネントライブラリを含みます。

[アプリを開く](https://code4fukui.github.io/fukui-kanko-people-flow-visualization/)（毎日1時更新）

---

## プロジェクト構成

```
fukui-kanko-people-flow-visualization/
├── packages/
│   ├── whole/           # 全エリアの包括的可視化アプリ
│   ├── landing-page/    # プロジェクトのランディングページ
│   ├── fukui-terminal/  # 福井駅東口エリア可視化
│   ├── tojinbo/         # 東尋坊エリア可視化
│   ├── rainbow-line/    # レインボーライン駐車場可視化
│   └── shared/          # 共通コンポーネント・ユーティリティ・フック・型
├── data/                # データサブモジュール（人流データ）
└── tools/               # ユーティリティスクリプト
```

## モノレポアプリ一覧

### 1. `whole`

- **目的:** 全エリアの人流・関連データの包括的可視化
- **機能:** インタラクティブなグラフ、日付範囲選択、お気に入りシリーズ、データエクスポート・共有
- **技術:** React, Vite, Tailwind CSS, Radix UI, Recharts

### 2. `landing-page`

- **目的:** 各アプリへのナビゲーション・エントリーポイント
- **機能:** サブアプリへのリンク、レスポンシブデザイン
- **技術:** React, Vite, Tailwind CSS

### 3. `fukui-terminal`

- **目的:** 福井駅東口エリアの可視化
- **機能:** 期間別グラフ、データ比較モード
- **技術:** React, Vite, Tailwind CSS, Recharts

### 4. `tojinbo`

- **目的:** 東尋坊エリアの可視化
- **機能:** fukui-terminalと同様、エリア固有データ
- **技術:** React, Vite, Tailwind CSS, Recharts

### 5. `rainbow-line`

- **目的:** レインボーライン駐車場の可視化
- **機能:** 駐車場フィルタ、集計・日別データ表示
- **技術:** React, Vite, Tailwind CSS, Recharts

### 6. `shared`

- **目的:** 全アプリ共通のUIコンポーネント、フック、ユーティリティ、型、定数、リデューサー

## データ

- データは `data/people-flow-data` ディレクトリのgitサブモジュールで管理
- 開発・ビルド時に各アプリの `public` ディレクトリへコピー

## 開発

### 前提条件

- [pnpm](https://pnpm.io/)（推奨）
- Node.js 18+

### 依存関係インストール

```bash
pnpm install
```

### 開発サーバー起動

- 全アプリ・データサーバー起動:
  ```bash
  pnpm dev
  ```
- メインアプリ（whole）のみ起動:
  ```bash
  pnpm dev:whole
  ```
- 特定アプリのみ起動（例: fukui-terminal）:
  ```bash
  pnpm dev:fukui-terminal
  ```
- ランディングページのみ起動:
  ```bash
  pnpm dev:landing
  ```
- 全アプリ同時起動:
  ```bash
  pnpm dev:all
  ```

### アクセスURL

- ランディングページ: [http://localhost:3004](http://localhost:3004)
- whole（メイン）: [http://localhost:3000](http://localhost:3000)
- 福井ターミナル: [http://localhost:3001](http://localhost:3001)
- 東尋坊: [http://localhost:3002](http://localhost:3002)
- レインボーライン: [http://localhost:3003](http://localhost:3003)

### ビルド

```bash
pnpm build
```

### Lint

```bash
pnpm lint
```

### データサブモジュール

データサブモジュールを更新し、最新データをコピーするには:

```bash
pnpm submodule
```

## デプロイ

- `tools/` ディレクトリの `upload.sh` でGitHub Pagesへデプロイ
- データのみアップロードは `pnpm upload:data`

## ライセンス

詳細は [LICENSE](LICENSE) を参照

---

## 謝辞

- 福井県観光DXプロジェクト
- Code for Fukui

---

## お問い合わせ

質問やコントリビューションはGitHubでissueやpull requestをお願いします。
