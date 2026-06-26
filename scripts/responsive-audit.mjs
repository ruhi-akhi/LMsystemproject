/**
 * Responsive layout audit — captures key pages at ThemeForest review breakpoints.
 * Usage: npm run audit:responsive
 * Requires: dev server at http://localhost:3000 (or set CAPTURE_BASE_URL)
 */
import { chromium } from "playwright";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "marketplace-assets", "responsive-audit");
const BASE_URL = process.env.CAPTURE_BASE_URL || "http://localhost:3000";

const VIEWPORTS = [
  { name: "320px", width: 320, height: 640 },
  { name: "375px", width: 375, height: 812 },
  { name: "768px", width: 768, height: 1024 },
  { name: "1024px", width: 1024, height: 768 },
  { name: "1440px", width: 1440, height: 900 },
];

const PAGES = [
  { name: "homepage", path: "/" },
  { name: "login", path: "/login" },
  { name: "shop", path: "/shop" },
  { name: "qr-demo", path: "/qr-demo" },
  { name: "about", path: "/about" },
  { name: "faq", path: "/faq" },
];

async function auditPage(page, pagePath) {
  const issues = [];
  const overflow = await page.evaluate(() => {
    const doc = document.documentElement;
    const body = document.body;
    const scrollWidth = Math.max(doc.scrollWidth, body.scrollWidth);
    const clientWidth = doc.clientWidth;
    return scrollWidth > clientWidth + 2;
  });

  if (overflow) {
    issues.push("horizontal overflow detected");
  }

  const tinyText = await page.evaluate(() => {
    const elements = document.querySelectorAll("p, span, a, button, label");
    let count = 0;
    elements.forEach((el) => {
      const size = parseFloat(window.getComputedStyle(el).fontSize);
      if (size > 0 && size < 10) count++;
    });
    return count;
  });

  if (tinyText > 5) {
    issues.push(`${tinyText} elements with font-size below 10px`);
  }

  return issues;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const report = [];

  for (const viewport of VIEWPORTS) {
    for (const { name, path: pagePath } of PAGES) {
      const page = await browser.newPage({
        viewport: { width: viewport.width, height: viewport.height },
      });
      const url = `${BASE_URL}${pagePath}`;
      const entry = { viewport: viewport.name, page: name, url, issues: [], ok: true };

      try {
        await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
        await page.waitForTimeout(1000);
        const fileName = `${viewport.name}-${name}.png`;
        await page.screenshot({ path: path.join(OUT_DIR, fileName), fullPage: false });
        entry.issues = await auditPage(page, pagePath);
        entry.ok = entry.issues.length === 0;
        console.log(
          entry.ok
            ? `✓ ${viewport.name} / ${name}`
            : `⚠ ${viewport.name} / ${name}: ${entry.issues.join(", ")}`
        );
      } catch (err) {
        entry.ok = false;
        entry.issues.push(err.message);
        console.warn(`✗ ${viewport.name} / ${name}: ${err.message}`);
      } finally {
        await page.close();
      }

      report.push(entry);
    }
  }

  await browser.close();

  const summary = {
    generatedAt: new Date().toISOString(),
    baseUrl: BASE_URL,
    viewports: VIEWPORTS.map((v) => v.name),
    total: report.length,
    passed: report.filter((r) => r.ok).length,
    failed: report.filter((r) => !r.ok).length,
    results: report,
  };

  await writeFile(path.join(OUT_DIR, "report.json"), JSON.stringify(summary, null, 2));
  console.log(`\nReport: ${summary.passed}/${summary.total} passed → ${OUT_DIR}/report.json`);

  if (summary.failed > 0) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
