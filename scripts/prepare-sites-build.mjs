import { copyFileSync, mkdirSync } from "node:fs";

mkdirSync("dist/server", { recursive: true });
copyFileSync("dist/server/index.mjs", "dist/server/index.js");
mkdirSync("dist/.openai", { recursive: true });
copyFileSync(".openai/hosting.json", "dist/.openai/hosting.json");
