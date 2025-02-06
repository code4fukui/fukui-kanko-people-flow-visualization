# 福井県観光DX AIカメラオープンデータ 可視化ウェブアプリケーション

福井県観光DXで収集したAIカメラのオープンデータを元に、データの可視化をするウェブアプリケーション

[アプリを開く](https://code4fukui.github.io/fukui-kanko-people-flow-visualization/)(毎朝1時頃　更新)

[<img src="pagelink-qr.png" alt="GitHub Pages へのQR" width="200"/>](https://code4fukui.github.io/fukui-kanko-people-flow-visualization/)

## 開発者向け資料

このプロジェクトは [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) を利用して作成された [Next.js](https://nextjs.org) プロジェクトです。

### 開発サーバーの起動

```bash
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開くことで起動された開発サーバーのビルド結果を閲覧できます。

### gitサブモジュールの更新

手元で最新データに更新したいときはサブモジュールで利用しているデータをupdateする必要があります。

```bash
git submodule update --remote
```
