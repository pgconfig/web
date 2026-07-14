import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const componentsPath = path.join(root, "components.json");
const config = JSON.parse(fs.readFileSync(componentsPath, "utf8"));

if (config.iconLibrary !== "remixicon") {
  config.iconLibrary = "remixicon";
  fs.writeFileSync(componentsPath, `${JSON.stringify(config, null, 2)}\n`);
  console.log("Set components.json iconLibrary to remixicon.");
} else {
  console.log("components.json already uses remixicon.");
}
