import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/vitest.setup.ts",
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/vitest.setup.ts",
        "**/*.d.ts",
        "**/*.config.*",
        "**/mockData",
        "**/*.test.{ts,tsx}",
      ],
    },
  },
  optimizeDeps: {
    exclude: [
      "itk-wasm",
      "@itk-wasm/image-io",
      "@itk-wasm/dicom",
      "@thewtex/zstddec",
    ],
  },

  plugins: [
    react(),
    tailwindcss(),
    viteStaticCopy({
      targets: [
        {
          src: "../node_modules/@itk-wasm/image-io/dist/pipelines/*.{js,wasm,wasm.zst}",
          dest: "pipelines/",
        },
        {
          src: "../node_modules/@itk-wasm/dicom/dist/pipelines/*.{js,wasm,wasm.zst}",
          dest: "pipelines/",
        },
      ],
    }),
  ],
  server: {
    port: 5173,
  },
});
