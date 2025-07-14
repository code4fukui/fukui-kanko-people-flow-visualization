#!/usr/bin/env node

// ランディングページのローカル開発時のナビゲーションテスト用スクリプト
// 各アプリのポートが正しく設定されているかを確認

const portMap = {
  "landing-page": 3004,
  whole: 3000,
  "fukui-terminal": 3001,
  tojinbo: 3002,
  "rainbow-line": 3003,
};

console.log("🚀 福井県観光DX 可視化アプリ ローカル開発環境");
console.log("=====================================");
console.log("");
console.log("📋 各アプリのローカルURL:");
console.log("");

Object.entries(portMap).forEach(([app, port]) => {
  const displayName = {
    "landing-page": "ランディングページ",
    whole: "包括的データ可視化",
    "fukui-terminal": "福井駅周辺",
    tojinbo: "東尋坊",
    "rainbow-line": "レインボーライン",
  }[app];

  console.log(`${displayName}: http://localhost:${port}`);
});

console.log("");
console.log("🔧 開発サーバー起動コマンド:");
console.log("");
console.log("# 全アプリ同時起動");
console.log("pnpm dev:all");
console.log("");
console.log("# メインアプリのみ");
console.log("pnpm dev:main");
console.log("");
console.log("# 個別起動");
console.log("pnpm dev:landing    # ランディングページ");
console.log("pnpm dev:whole      # 包括的データ可視化");
console.log("pnpm dev:fukui-terminal  # 福井駅周辺");
console.log("pnpm dev:tojinbo    # 東尋坊");
console.log("pnpm dev:rainbow-line    # レインボーライン");
console.log("");
console.log("💡 ランディングページ (http://localhost:3004) から");
console.log("   各アプリへのリンクが新しいタブで開きます");
