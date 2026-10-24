import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";
import { initAnalytics } from "./lib/analytics";

initAnalytics(import.meta.env.VITE_CLARITY_PROJECT_ID_SITE);

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);