import * as React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./providers/AuthProvider";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

createRoot(root).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
