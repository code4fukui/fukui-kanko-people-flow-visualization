import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  base: process.env.PAGES ? "/fukui-kanko-people-flow-visualization/tojinbo/" : "./",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3002,
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
