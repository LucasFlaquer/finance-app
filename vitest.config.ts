import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    coverage: {
      exclude: [
        "src/components/ui/**",
        "src/**/*.test.{ts,tsx}",
        "src/generated/**",
      ],
      include: [
        "src/lib/**",
        "src/hooks/**",
        "src/server/**",
        "src/components/**",
        "src/app/**/page.tsx",
      ],
      provider: "v8",
      thresholds: { branches: 80, functions: 80, lines: 80, statements: 80 },
    },
    environment: "jsdom",
    exclude: [...configDefaults.exclude, "e2e/**"],
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
  },
});
