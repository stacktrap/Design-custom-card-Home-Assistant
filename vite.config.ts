import { defineConfig } from "vite";

export default defineConfig({
  server: { open: "/dev/" },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: () => "luxury-cards.js",
    },
  },
});
