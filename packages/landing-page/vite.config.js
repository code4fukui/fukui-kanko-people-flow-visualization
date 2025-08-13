import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  base: process.env.PAGES ? "/fukui-kanko-people-flow-visualization/" : "./",
  server: {
    port: 3004,
  },
  build: {
    rollupOptions: {
      input: {
        main: "./index.html",
      },
    },
  },
  define: {
    __CSV_ORIGIN__: JSON.stringify(
      process.env.PAGES
        ? `${process.env.PAGES_ROOT}/data/` // GitHub Pages (本番)
        : process.env.LOCAL === "true"
          ? "http://localhost:4000/" // ローカル開発
          : `${process.env.INTERNAL_ROOT}/data/`, // 社内確認環境
    ),
  },
});
