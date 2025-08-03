import { defineConfig, type Options } from "tsup";
import { copy } from "esbuild-plugin-copy";

export default defineConfig((options: Options) => ({
  entry: ["src/**/*", "!src/assets"],
  clean: true,
  format: ["cjs"],
  sourcemap: true,
  noExternal: ["@repo/lib"],
  esbuildPlugins: [
    copy({
      resolveFrom: "cwd",
      assets: [
        {
          from: ["./src/assets/**/*"],
          to: ["./dist/assets"],
        },
      ],
      watch: true,
    }),
  ],
  onSuccess: "node dist/env.cjs",
  esbuildOptions(options) {
    options.loader = {
      ".html": "text",
    };
  },
  ...options,
}));
