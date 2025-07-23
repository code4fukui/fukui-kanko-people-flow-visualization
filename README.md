# 福井県観光DX AIカメラオープンデータ 可視化ウェブアプリケーション

福井県観光DXで収集したAIカメラのオープンデータを元に、データの可視化をするウェブアプリケーション群

[アプリを開く](https://code4fukui.github.io/fukui-kanko-people-flow-visualization/)(毎朝1時頃　更新)

[<img src="pagelink-qr.png" alt="GitHub Pages へのQR" width="200"/>](https://code4fukui.github.io/fukui-kanko-people-flow-visualization/)

## プロジェクト構成

このプロジェクトはモノレポ構成で、複数のVite+Reactアプリケーションを管理しています。

```
fukui-kanko-visualization/
├── packages/
│   ├── whole/               # 包括的データ可視化アプリ
│   ├── shared/              # 共有コンポーネント・ユーティリティ
│   └── (新しいアプリ)        # 今後追加予定
├── data/                    # gitサブモジュール（データ）
└── ...
```

## 開発者向け資料

### 開発サーバーの起動

```bash
# 包括的データ可視化アプリの開発サーバーを起動
pnpm dev

# または直接指定
pnpm --filter whole dev

# 全アプリの開発サーバーを同時起動
pnpm dev:all

# メインアプリ（landing + whole）のみ同時起動
pnpm dev:main

# 個別のアプリを起動
pnpm dev:landing        # ランディングページ
pnpm dev:whole          # 包括的データ可視化アプリ
pnpm dev:fukui-terminal # 福井駅周辺データ可視化アプリ
pnpm dev:tojinbo        # 東尋坊データ可視化アプリ
pnpm dev:rainbow-line   # レインボーラインデータ可視化アプリ
```

ブラウザで各アプリのポートを開くことで起動された開発サーバーのビルド結果を閲覧できます：

- ランディングページ: [http://localhost:3004](http://localhost:3004)
- 包括的データ可視化: [http://localhost:3000](http://localhost:3000)
- 福井駅周辺: [http://localhost:3001](http://localhost:3001)
- 東尋坊: [http://localhost:3002](http://localhost:3002)
- レインボーライン: [http://localhost:3003](http://localhost:3003)

**ローカル開発時のナビゲーション:**
ランディングページ（http://localhost:3004）から各アプリへのリンクは、開発環境では自動的に適切なポートに遷移します。各アプリは新しいタブで開きます。

### ビルド

```bash
# 包括的データ可視化アプリのビルド
pnpm build

# 全アプリのビルド（並列実行）
pnpm build:all

# メインアプリ（landing + whole）のみビルド
pnpm build:main

# 個別のアプリをビルド
pnpm build:landing        # ランディングページ
pnpm build:whole          # 包括的データ可視化アプリ
pnpm build:fukui-terminal # 福井駅周辺データ可視化アプリ
pnpm build:tojinbo        # 東尋坊データ可視化アプリ
pnpm build:rainbow-line   # レインボーラインデータ可視化アプリ
```

### gitサブモジュールの更新

手元で最新データに更新したいときはサブモジュールで利用しているデータをupdateする必要があります。

```bash
git submodule update --remote
```

### 新しいアプリの追加

1. `packages/` ディレクトリに新しいアプリのディレクトリを作成
2. Vite+Reactプロジェクトをセットアップ
3. 共有リソースが必要な場合は `packages/shared` から import
4. ルートの `package.json` にスクリプトを追加
