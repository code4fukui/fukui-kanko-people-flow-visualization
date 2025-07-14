import App from "@/App";
import { Header } from "@/components/parts/header.component";
import "@/index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Header />
    <main className="flex h-full w-full max-w-full flex-grow items-center pt-4">
      <App />
    </main>
  </StrictMode>,
);
