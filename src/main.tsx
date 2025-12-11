// src/main.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { migrateLocalStorageToDexie } from "@/utils/migrateLocalStorage";

(async () => {
  // Run migration BEFORE the app mounts
  await migrateLocalStorageToDexie();

  const container = document.getElementById("root")!;
  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
})();
