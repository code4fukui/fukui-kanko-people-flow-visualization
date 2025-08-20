import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Header } from "@fukui-kanko/shared/components/parts";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Header title="東尋坊 人流データ" />
    <App />
  </StrictMode>,
);
