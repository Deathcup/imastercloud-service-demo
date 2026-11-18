import { build } from "esbuild";
import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
const result = await build({
  entryPoints: ["src/main.tsx"],
  bundle: true,
  write: false,
  minify: true,
  format: "iife",
  platform: "browser",
  target: "es2022",
  define: { "process.env.NODE_ENV": '"production"' },
  loader: { ".css": "empty" },
  legalComments: "none",
});
const cssFiles = (await readdir("dist/assets")).filter((f) =>
  f.endsWith(".css"),
);
const css = (
  await Promise.all(cssFiles.map((f) => readFile(`dist/assets/${f}`, "utf8")))
).join("\n");
const js = result.outputFiles[0].text.replace(/<\/script/gi, "<\\/script");
await mkdir("artifacts", { recursive: true });
await writeFile(
  "artifacts/iMasterCloud-demo.html",
  `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>iMasterCloud · 离线路演演示</title><style>${css}</style></head><body><div id="root"></div><script>${js}</script></body></html>`,
);
console.log("Offline single-file demo: artifacts/iMasterCloud-demo.html");
