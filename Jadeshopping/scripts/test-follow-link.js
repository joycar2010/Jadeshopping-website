import { chromium, firefox, webkit } from 'playwright';

const START_PAGE = 'http://localhost:5174/favorites';
const TARGET_URL = 'http://localhost:5174/follow';
const ANCHOR_SELECTOR = `a[href="${TARGET_URL}"]`;

async function testBrowser(name, launcher) {
  const result = { name, anchorCount: 0, loadTimeMs: null, clickNavTimeMs: null, success: false, error: null };
  let browser;
  try {
    browser = await launcher.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    const start = Date.now();
    await page.goto(START_PAGE, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');
    result.loadTimeMs = Date.now() - start;

    const anchors = await page.$$(ANCHOR_SELECTOR);
    result.anchorCount = anchors.length;
    if (anchors.length === 0) {
      result.error = 'No matching anchor found on start page';
      return result;
    }

    const anchor = anchors[0];
    const href = await anchor.getAttribute('href');
    if (href !== TARGET_URL) {
      result.error = `Anchor href mismatch: ${href}`;
      return result;
    }

    const clickStart = Date.now();
    try {
      await Promise.all([
        page.waitForLoadState('load'),
        anchor.click()
      ]);
      await page.waitForLoadState('networkidle');
      result.clickNavTimeMs = Date.now() - clickStart;
    } catch (err) {
      result.error = `Navigation error: ${err.message}`;
      return result;
    }

    const currentUrl = page.url();
    result.success = currentUrl === TARGET_URL;
    if (!result.success) {
      result.error = `Final URL mismatch: ${currentUrl}`;
    }

    await browser.close();
    return result;
  } catch (e) {
    result.error = e.message;
    if (browser) await browser.close();
    return result;
  }
}

(async () => {
  const browsers = [
    { name: 'chromium', launcher: chromium },
    { name: 'firefox', launcher: firefox },
    { name: 'webkit', launcher: webkit },
  ];

  const results = [];
  for (const b of browsers) {
    const r = await testBrowser(b.name, b.launcher);
    results.push(r);
  }

  const successCount = results.filter(r => r.success).length;
  const total = results.length;
  const successRate = total ? Math.round((successCount / total) * 100) : 0;
  const avgLoad = Math.round(results.filter(r => r.loadTimeMs != null).reduce((s, r) => s + r.loadTimeMs, 0) / (results.length || 1));
  const avgNav = Math.round(results.filter(r => r.clickNavTimeMs != null).reduce((s, r) => s + r.clickNavTimeMs, 0) / (results.filter(r => r.clickNavTimeMs != null).length || 1));

  console.log('Follow link click verification results:');
  for (const r of results) {
    console.log(`- ${r.name}: success=${r.success}, anchors=${r.anchorCount}, loadTime=${r.loadTimeMs}ms, navTime=${r.clickNavTimeMs}ms, error=${r.error || 'none'}`);
  }
  console.log(`Summary: successRate=${successRate}%, avgLoad=${isNaN(avgLoad) ? 'n/a' : avgLoad + 'ms'}, avgNav=${isNaN(avgNav) ? 'n/a' : avgNav + 'ms'}`);

  console.log('JSON_RESULT_START');
  console.log(JSON.stringify({ results }, null, 2));
  console.log('JSON_RESULT_END');
})();