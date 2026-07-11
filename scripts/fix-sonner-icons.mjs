import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sonnerPath = path.join(root, "src/components/ui/sonner/Sonner.vue");

const LUCIDE_TO_REMIX = {
  CircleCheckIcon: "RiCheckboxCircleLine",
  InfoIcon: "RiInformationLine",
  TriangleAlertIcon: "RiAlertLine",
  OctagonXIcon: "RiCloseCircleLine",
  Loader2Icon: "RiLoader4Line",
  XIcon: "RiCloseLine",
};

let content = fs.readFileSync(sonnerPath, "utf8");
let changed = false;

for (const [from, to] of Object.entries(LUCIDE_TO_REMIX)) {
  if (content.includes(from)) {
    content = content.replaceAll(from, to);
    changed = true;
  }
}

if (content.includes("@lucide/vue")) {
  content = content.replaceAll("@lucide/vue", "@remixicon/vue");
  changed = true;
}

if (!changed) {
  console.log("Sonner.vue icons already OK.");
  process.exit(0);
}

fs.writeFileSync(sonnerPath, content);
console.log("Fixed Sonner.vue icon imports.");
