import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import alias from "@rollup/plugin-alias";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const jsconfig = JSON.parse(
  fs.readFileSync(path.join(__dirname, "jsconfig.json"), "utf-8"),
);

const aliases = Object.entries(jsconfig.compilerOptions?.paths).flatMap(
  ([alias, targets]) => {
    const pattern = alias.replace("/*", "/(.*)$");

    return targets.map((target) => {
      target = target.replace("*", "");

      return {
        find: new RegExp(`^${pattern}`),
        replacement: path.join(path.resolve(jsconfig.compilerOptions.baseUrl, target), "$1"),
      };
    });
  },
);

const config = {
  input: "src/server.js",
  output: {
    dir: "dist",
    format: "es",
    preserveModules: true
  },
  plugins: [alias({ entries: aliases })],
};

export default config;
