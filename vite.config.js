import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// IMPORTANT: change "tamil-word-path" to match your actual GitHub
// repository name — GitHub Pages serves from
// https://YOUR_USERNAME.github.io/REPO_NAME/, not the domain root,
// so this base path must match the repo name exactly.
export default defineConfig({
  plugins: [react()],
  base: "/tamil-word-path/",
});
