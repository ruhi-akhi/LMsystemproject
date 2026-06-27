/**
 * Remove stale Next.js cache that causes ENOENT / _app errors in dev.
 * Usage: npm run clean  OR  npm run dev:clean
 */
import { rmSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const targets = [".next", "node_modules/.cache"];

for (const dir of targets) {
  const full = path.join(root, dir);
  if (existsSync(full)) {
    rmSync(full, { recursive: true, force: true });
    console.log(`Removed ${dir}`);
  }
}

console.log("Cache cleared. Run: npm run dev");
