/**
 * Capture ThemeForest marketplace screenshots from a running dev server.
 * Usage: npm run capture:assets
 * Requires: dev server at http://localhost:3000
 */
import { chromium } from "playwright";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "marketplace-assets");
const BASE_URL = process.env.CAPTURE_BASE_URL || "http://localhost:3000";

const DESKTOP_PAGES = [
  { name: "01-homepage", path: "/" },
  { name: "02-login", path: "/login" },
  { name: "03-shop", path: "/shop" },
  { name: "04-qr-demo", path: "/qr-demo" },
  { name: "05-about", path: "/about" },
  { name: "06-dashboard-inventory", path: "/dashboard/inventory" },
];

async function ensureDir(dir) {
  await mkdir(dir, { recursive: true });
}

async function capturePage(browser, { name, path: pagePath }, viewport, outSubdir) {
  const page = await browser.newPage({ viewport });
  const url = `${BASE_URL}${pagePath}`;
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(1500);
    const outPath = path.join(OUT_DIR, outSubdir, `${name}.png`);
    await page.screenshot({ path: outPath, fullPage: false });
    console.log(`✓ ${outSubdir}/${name}.png`);
    return outPath;
  } catch (err) {
    console.warn(`⚠ Skipped ${name}: ${err.message}`);
    return null;
  } finally {
    await page.close();
  }
}

async function createDerivedAssets(homepagePng) {
  if (!homepagePng) return;

  const previewPath = path.join(OUT_DIR, "preview-image-590x300.png");
  const thumbPath = path.join(OUT_DIR, "thumbnail-80x80.png");

  await sharp(homepagePng)
    .resize(590, 300, { fit: "cover", position: "top" })
    .webp({ quality: 85 })
    .toFile(previewPath.replace(".png", ".webp"));

  await sharp(homepagePng)
    .resize(590, 300, { fit: "cover", position: "top" })
    .png()
    .toFile(previewPath);

  await sharp(homepagePng)
    .resize(80, 80, { fit: "cover", position: "top" })
    .webp({ quality: 85 })
    .toFile(thumbPath.replace(".png", ".webp"));

  await sharp(homepagePng)
    .resize(80, 80, { fit: "cover", position: "top" })
    .png()
    .toFile(thumbPath);

  console.log("✓ preview-image-590x300.png + .webp");
  console.log("✓ thumbnail-80x80.png + .webp");
}

async function main() {
  await ensureDir(path.join(OUT_DIR, "screenshots-desktop"));
  await ensureDir(path.join(OUT_DIR, "screenshots-mobile"));

  const browser = await chromium.launch({ headless: true });

  let homepageShot = null;
  for (const item of DESKTOP_PAGES) {
    const shot = await capturePage(
      browser,
      item,
      { width: 1920, height: 1080 },
      "screenshots-desktop"
    );
    if (item.name === "01-homepage") homepageShot = shot;
  }

  const mobilePages = [
    { name: "01-homepage-mobile", path: "/" },
    { name: "02-login-mobile", path: "/login" },
    { name: "03-qr-demo-mobile", path: "/qr-demo" },
  ];

  for (const item of mobilePages) {
    await capturePage(
      browser,
      item,
      { width: 390, height: 844 },
      "screenshots-mobile"
    );
  }

  await browser.close();
  await createDerivedAssets(homepageShot);

  const readme = `# ThemeForest Marketplace Assets

Generated screenshots for Envato upload.

## Upload to ThemeForest
- **Thumbnail**: \`thumbnail-80x80.png\` (80×80)
- **Preview Image**: \`preview-image-590x300.png\` (590×300)
- **Screenshots**: \`screenshots-desktop/\` and \`screenshots-mobile/\`

## Regenerate
\`\`\`bash
npm run dev          # in one terminal
npm run capture:assets
\`\`\`

Set \`CAPTURE_BASE_URL\` for production captures:
\`\`\`bash
CAPTURE_BASE_URL=https://your-demo.vercel.app npm run capture:assets
\`\`\`
`;
  await writeFile(path.join(OUT_DIR, "README.md"), readme);
  console.log("\nDone! Assets saved to marketplace-assets/");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
