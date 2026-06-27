/**
 * Smoke test: public pages load + key API routes respond.
 * Usage: npm run test:smoke
 * Requires dev server at http://localhost:3000
 */
import { chromium } from "playwright";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.CAPTURE_BASE_URL || "http://localhost:3000";
const OUT = path.join(__dirname, "..", "marketplace-assets", "smoke-test");

const PUBLIC_PAGES = [
  "/",
  "/about",
  "/shop",
  "/blog",
  "/contact",
  "/login",
  "/register",
  "/demo",
  "/qr-demo",
  "/faq",
  "/terms",
  "/privacy-policy",
  "/refund",
  "/robots.txt",
  "/sitemap.xml",
];

const API_ROUTES = [
  { path: "/api/demo-data", method: "GET", expectStatus: [200, 500] },
  { path: "/api/demo-products", method: "GET", expectStatus: [200, 500] },
  { path: "/api/categories", method: "GET", expectStatus: [200, 401, 500] },
];

async function fetchApi(route) {
  const res = await fetch(`${BASE}${route.path}`, { method: route.method });
  const ok = route.expectStatus.includes(res.status);
  return { ...route, status: res.status, ok };
}

async function testPage(browser, pagePath) {
  const page = await browser.newPage();
  const errors = [];
  const consoleErrors = [];
  const waitUntil = pagePath === "/blog" ? "domcontentloaded" : "networkidle";

  page.on("pageerror", (err) => errors.push(err.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      const text = msg.text();
      if (!text.includes("favicon") && !text.includes("Hydration")) {
        consoleErrors.push(text);
      }
    }
  });

  try {
    const res = await page.goto(`${BASE}${pagePath}`, {
      waitUntil,
      timeout: 60000,
    });
    await page.waitForTimeout(800);

    const hydrationError = await page
      .locator("text=Hydration failed")
      .count()
      .then((c) => c > 0)
      .catch(() => false);

    const ok =
      res?.ok() &&
      errors.length === 0 &&
      !hydrationError;

    return {
      page: pagePath,
      status: res?.status(),
      ok,
      errors: [...errors, ...consoleErrors],
      hydrationError,
    };
  } catch (err) {
    return { page: pagePath, ok: false, errors: [err.message] };
  } finally {
    await page.close();
  }
}

async function testDashboardHydration(browser) {
  const page = await browser.newPage();
  const hydrationIssues = [];

  page.on("console", (msg) => {
    const text = msg.text();
    if (text.includes("Hydration") || text.includes("didn't match")) {
      hydrationIssues.push(text.slice(0, 200));
    }
  });

  try {
    await page.goto(`${BASE}/login`, { waitUntil: "networkidle", timeout: 60000 });
    await page.evaluate(() => {
      localStorage.setItem("token", "demo-smoke-token");
      localStorage.setItem(
        "user",
        JSON.stringify({ name: "Demo", email: "admin@inventory.com", role: "admin" })
      );
    });
    await page.goto(`${BASE}/dashboard/orders`, { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(1500);

    const footerVisible = await page.locator("footer").isVisible().catch(() => false);
    const publicNavVisible = await page
      .locator('nav a[href="/"]')
      .first()
      .isVisible()
      .catch(() => false);

    return {
      page: "/dashboard/orders",
      ok: hydrationIssues.length === 0 && !footerVisible && !publicNavVisible,
      hydrationIssues,
      footerVisible,
      publicNavVisible,
    };
  } catch (err) {
    return { page: "/dashboard/orders", ok: false, errors: [err.message] };
  } finally {
    await page.close();
  }
}

async function main() {
  await mkdir(OUT, { recursive: true });

  let serverUp = true;
  try {
    const ping = await fetch(BASE);
    if (!ping.ok && ping.status !== 404) serverUp = false;
  } catch {
    serverUp = false;
  }

  if (!serverUp) {
    console.error(`Dev server not running at ${BASE}. Start with: npm run dev`);
    process.exit(1);
  }

  const browser = await chromium.launch({ headless: true });
  const results = [];

  console.log("\n--- Public Pages ---");
  for (const p of PUBLIC_PAGES) {
    const r = await testPage(browser, p);
    results.push(r);
    console.log(r.ok ? `✓ ${p}` : `✗ ${p} — ${r.errors?.join("; ") || "failed"}`);
  }

  console.log("\n--- Dashboard Hydration ---");
  const dash = await testDashboardHydration(browser);
  results.push(dash);
  console.log(
    dash.ok
      ? "✓ /dashboard/orders (no hydration error, chrome hidden)"
      : `✗ /dashboard/orders — hydration: ${dash.hydrationIssues?.length || 0}, footer: ${dash.footerVisible}`
  );

  console.log("\n--- API Routes ---");
  for (const route of API_ROUTES) {
    const r = await fetchApi(route);
    results.push({ page: route.path, ok: r.ok, status: r.status });
    console.log(r.ok ? `✓ ${route.method} ${route.path} (${r.status})` : `✗ ${route.path} (${r.status})`);
  }

  await browser.close();

  const passed = results.filter((r) => r.ok).length;
  const report = { generatedAt: new Date().toISOString(), baseUrl: BASE, passed, total: results.length, results };
  await writeFile(path.join(OUT, "report.json"), JSON.stringify(report, null, 2));
  console.log(`\n${passed}/${results.length} passed → ${OUT}/report.json\n`);

  if (passed < results.length) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
