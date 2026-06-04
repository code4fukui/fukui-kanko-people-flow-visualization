# 福井県観光DX AIカメラオープンデータ可視化

[English](README.md)

**福井県観光DX AIカメラオープンデータ可視化ウェブアプリケーション**

このリポジトリには、福井県観光DXイニシアチブの一環としてAIカメラで収集された人の流れや関連データを可視化するウェブアプリケーションが含まれています。このプロジェクトは、複数のVite+Reactアプリケーションと共有コンポーネントライブラリを含むpnpmモノレポとして構成されています。

[
![Deploy to GitHub Pages](https://github.com/code4fukui/fukui-kanko-people-flow-visualization/actions/workflows/pages.yml/badge.svg)
](https://github.com/code4fukui/fukui-kanko-people-flow-visualization/actions/workflows/pages.yml)
[
![Update Submodule](https://github.com/code4fukui/fukui-kanko-people-flow-visualization/actions/workflows/submodule.yml/badge.svg)
](https://github.com/code4fukui/fukui-kanko-people-flow-visualization/actions/workflows/submodule.yml)

---

## ✨ ライブアプリケーション

[**アプリケーションを開く**](https://code4fukui.github.io/fukui-kanko-people-flow-visualization/)

*データは日本時間午前1時頃に毎日更新されます。*

## 🚀 特徴

- **包括的な可視化**: すべての場所にわたる集約データをインタラクティブなダッシュボード(`whole`)で確認可能。日付範囲選択、お気に入りシリーズ、データエクスポートなどの機能が搭載されています。
- **地域別ダッシュボード**: 福井駅、東尋坊、レインボーラインなどの特定観光地のデータを可視化する専用アプリケーション。
- **モノレポアーキテクチャ**: 複数のアプリケーションと共有ライブラリを整理し、コード再利用とメンテナビリティを最大化するスケーラブルなpnpmワークスペース。
- **共有コンポーネントライブラリ**: `@fukui-kanko/shared`パッケージがUIコンポーネント、フック、ユーティリティを提供し、すべてのアプリで一貫したユーザー体験を確保します。
- **自動化されたデータパイプライン**: 人の流れデータはGitサブモジュールとして管理され、スケジュールされたGitHub Actionを通じて毎日更新されます。
- **CI/CD**: メインブランチはGitHub Pagesへの自動デプロイ、開発ブランチはS3/CloudFrontへのデプロイが実装されています。

## 🛠️ 技術スタック

- **フレームワーク**: React 18, Vite
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS, Radix UI
- **チャート**: Recharts
- **パッケージマネージャー**: pnpm (ワークスペース)
- **リンタ/フォーマッター**: ESLint, Prettier
- **CI/CD**: GitHub Actions

## 📂 プロジェクト構造

```
fukui-kanko-people-flow-visualization/
├── packages/
│   ├── whole/           # メインの包括的可視化アプリ
│   ├── landing-page/    # プロジェクトのランディングページ
│   ├── fukui-terminal/  # 福井駅周辺の可視化
│   ├── tojinbo/         # 東尋坊エリアの可視化
│   ├── rainbow-line/    # レインボーライン駐車場の可視化
│   └── shared/          # 共有コンポーネント、フック、ユーティリティ
├── data/                # 人の流れデータのGitサブモジュール
└── tools/               # ユーティリティとデプロイスクリプト
```

## 🏁 はじめに

### 必要な環境

- [Node.js](https://nodejs.org/) (18+)
- [pnpm](https://pnpm.io/) (ワークスペース対応のパッケージマネージャー)

### 依存関係のインストール

```bash
pnpm install
```

### 開発を開始

- すべてのアプリとデータサーバーを起動:
  ```bash
  pnpm dev
  ```
- メインアプリ(`whole`)のみ起動:
  ```bash
  pnpm dev:whole
  ```
- 特定のアプリ（例: `fukui-terminal`）のみ起動:
  ```bash
  pnpm dev:fukui-terminal
  ```
- ランディングページのみ起動:
  ```bash
  pnpm dev:landing
  ```

### アプリへのアクセス

- ランディングページ: [http://localhost:3004](http://localhost:3004)
- Whole (メイン): [http://localhost:3000](http://localhost:3000)
- 福井ターミナル: [http://localhost:3001](http://localhost:3001)
- 東尋坊: [http://localhost:3002](http://localhost:3002)
- レインボーライン: [http://localhost:3003](http://localhost:3003)

### データサーバー

ローカルで生データを提供する（`whole`以外のアプリが必要）:

```bash
pnpm serve:data
```

### データサブモジュールの更新

最新の人の流れデータを取得するには:

```bash
pnpm submodule
```

### ビルド

```bash
pnpm build
```

### リント

```bash
pnpm lint
```

## 📦 モノレポアプリケーション

### 1. `whole`

- **目的**: すべての場所にわたる集約データのメインダッシュボード。
- **特徴**: インタラクティブなグラフ、日付範囲選択、データエクスポート、お気に入りシリーズ。
- **技術**: React, Vite, Tailwind CSS, Recharts, Radix UI.

### 2. `landing-page`

- **目的**: すべてのサブアプリケーションへのナビゲーションエントリポイント。
- **特徴**: レスポンシブデザイン、QRコードリンク。
- **技術**: React, Vite, Tailwind CSS.

### 3. `fukui-terminal`

- **目的**: 福井駅東口の可視化。
- **特徴**: 期間ベースのグラフ、データ比較。
- **技術**: React, Vite, Tailwind CSS, Recharts.

### 4. `tojinbo`

- **目的**: 東尋坊エリアの可視化。
- **特徴**: 地域特化型データ分析。
- **技術**: React, Vite, Tailwind CSS, Recharts.

### 5. `rainbow-line`

- **目的**: レインボーライン景勝道路沿線の駐車場利用率分析。
- **特徴**: 駐車場フィルター、集約/日別ビュー。
- **技術**: React, Vite, Tailwind CSS, Recharts.

### 6. `shared`

- **目的**: 再利用可能なコンポーネント、フック、ユーティリティ。
- **エクスポート**: UIコンポーネント、データユーティリティ、型、定数。

## 🚀 デプロイ

- `main`ブランチは`.github/workflows/pages.yml`を通じてGitHub Pagesに自動デプロイされます。
- 開発ブランチは`tools/upload.sh`を使用してS3/CloudFrontにデプロイされます。

## 📜 ライセンス

このプロジェクトは[MITライセンス](LICENSE)に従って提供されています。
