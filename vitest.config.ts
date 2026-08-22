import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    coverage: {
      include: ["src/lib/**", "src/components/transactions/**", "src/hooks/**"],
      provider: "v8",
      thresholds: { branches: 80, functions: 80, lines: 80, statements: 80 },
    },
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
  },
});
