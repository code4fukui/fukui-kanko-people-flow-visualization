# 福井県観光DX AIカメラオープンデータ可視化

**福井県観光DX AIカメラオープンデータ可視化ウェブアプリケーション**

このリポジトリには、福井県観光DXの取り組みの一環としてAIカメラによって収集された人流や関連データを可視化するウェブアプリケーションが含まれています。このプロジェクトは、複数のVite+Reactアプリケーションと共有コンポーネントライブラリを含むpnpmモノレポとして構成されています。

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

- **包括的な可視化**: すべての地点にわたる集約データをインタラクティブに探索するためのダッシュボード（`whole`）。日付範囲の選択、お気に入りシリーズ、データエクスポートなどの機能を備えています。
- **地域別ダッシュボード**: 福井駅、東尋坊、レインボーラインなどの特定の観光スポットのデータを可視化する専用アプリケーション。
- **モノレポアーキテクチャ**: 複数のアプリケーションと共有ライブラリをpnpmワークスペースで整理し、コードの再利用性と保守性を最大化したスケーラブルな構造。
- **共有コンポーネントライブラリ**: `@fukui-kanko/shared` パッケージがUIコンポーネント、フック、ユーティリティを提供し、すべてのアプリで一貫したユーザー体験を確保します。
- **自動化されたデータパイプライン**: 人流データはGitサブモジュールとして管理され、スケジュールされたGitHub Actionsを通じて毎日更新されます。
- **CI/CD**: `main` ブランチはGitHub Pagesへの自動デプロイ、開発ブランチはS3/CloudFrontへのデプロイを実現します。

## 🛠️ 技術スタック

- **フレームワーク**: React 18, Vite
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS, Radix UI
- **チャート**: Recharts
- **パッケージマネージャー**: pnpm (ワークスペース)
- **リンター / フォーマッター**: ESLint, Prettier
- **CI/CD**: GitHub Actions

## 📂 プロジェクト構造

このリポジトリは複数のパッケージを含むモノレポです:

```
fukui-kanko-people-flow-visualization/
├── packages/
│   ├── whole/           # メインの包括的な可視化アプリケーション
│   ├── landing-page/    # プロジェクトのランディングページ
│   ├── fukui-terminal/  # 福井駅周辺の可視化
│   ├── tojinbo/         # 東尋坊周辺の可視化
│   ├── rainbow-line/    # レインボーライン駐車場の可視化
│   └── shared/          # 共有コンポーネント、フック、ユーティリティ
├── data/                # 人流データのGitサブモジュール
└── tools/               # ユーティリティとデプロイスクリプト
```

## 🏁 はじめに

### 前提条件

- [Node.js](https://nodejs.org/) (v18以降)
- [pnpm](https://pnpm.io/) (v9以降)

### インストール

リポジトリをクローンし、依存関係をインストールします。`data` サブモジュールを初期化するために `--recursive` フラグが必要です。

```bash
git clone --recursive https://github.com/code4fukui/fukui-kanko-people-flow-visualization.git
cd fukui-kanko-people-flow-visualization
pnpm install
```

### 開発サーバーの起動

すべてのアプリケーションを同時に起動するか、特定のアプリケーションのみを起動できます。ローカルデータサーバーもポート `4000` で起動されます。

```bash
# すべてのアプリとデータサーバーを起動
pnpm dev

# メインの 'whole' アプリケーションのみ起動
pnpm dev:whole

# 福井駅アプリケーションのみ起動
pnpm dev:fukui-terminal
```

起動後、アプリケーションは以下のローカルURLで利用可能です:

- **Landing Page**: [http://localhost:3004](http://localhost:3004)
- **Whole (メインアプリ)**: [http://localhost:3000](http://localhost:3000)
- **Fukui Terminal**: [http://localhost:3001](http://localhost:3001)
- **Tojinbo**: [http://localhost:3002](http://localhost:3002)
- **Rainbow Line**: [http://localhost:3003](http://localhost:3003)

### 利用可能なスクリプト

| コマンド | 説明 |
| --- | --- |
| `pnpm dev` | 開発モードですべてのアプリケーションとローカルデータサーバーを起動します。 |
| `pnpm build` | すべてのアプリケーションを本番用にビルドします。 |
| `pnpm lint` | モノレポ全体でコード品質の問題をチェックします。 |
| `pnpm submodule` | データサブモジュールを手動で更新し、最新の人流データを取得します。 |

## 📊 データの取り扱い

- 人流データは `data/people-flow-data` ディレクトリにあるGitサブモジュールとして管理されています。
- ローカル開発では、データは `http://localhost:4000` から提供されます。
- `whole` アプリケーションは、開発およびビルド時にデータを `public` ディレクトリにコピーし、直接アクセスできるようにします。
- データサブモジュールは、`main` ブランチにおいて [`.github/workflows/submodule.yml`](.github/workflows/submodule.yml) ワークフローにより毎日自動的に更新されます。

## 🚀 デプロイ

- メインアプリケーションは、[`.github/workflows/pages.yml`](.github/workflows/pages.yml) ワークフローを通じて `main` ブランチからGitHub Pagesに自動デプロイされます。
- `tools/upload.sh` スクリプトは、S3/CloudFront環境への手動デプロイに利用可能で、通常はフォークされたリポジトリからのステージングや開発プレビューに使用されます。

## 🙏 謝辞

- 福井県観光DXプロジェクト
- Code for Fukui

## 📄 ライセンス

このプロジェクトは MIT License の下でライセンスされています。詳細は [LICENSE](LICENSE) を参照してください。
