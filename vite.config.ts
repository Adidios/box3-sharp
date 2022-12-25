import { defineConfig } from "vite";
import monkey from "vite-plugin-monkey";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    monkey({
      entry: "src/main.ts",
      userscript: {
        icon: "https://box3.fun/favicon.ico",
        namespace: "box3.codemao.cn",
        match: ["https://box3.codemao.cn/*", "https://box3.fun/*"],
        version: "1.1.3",
        license: "GPL-3.0",
        description: "Box3增强插件",
        author: "AlanBestHacker",
        updateURL:
          "https://greasyfork.org/scripts/456978-box3-sharp/code/box3-sharp.user.js",
        name: "box3-sharp",
      },
      build: {
        autoGrant: true,
      },
    }),
  ],
});
