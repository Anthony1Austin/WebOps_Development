/**
 * Rasterize the SVG brandmark (same geometry as the legacy site icon) onto
 * 1080×1080 black and white squares for social profile use.
 *
 * Requires: PLAYWRIGHT_BROWSERS_PATH=.playwright-browsers npx playwright install chromium
 * Run: npm run render:brandmark-profiles
 */
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
if (!process.env.PLAYWRIGHT_BROWSERS_PATH) {
    process.env.PLAYWRIGHT_BROWSERS_PATH = join(root, '.playwright-browsers');
}

const { chromium } = await import('playwright');

const brandmarkSvg = readFileSync(join(root, 'assets', 'images', 'logo', 'webops-brandmark.svg'), 'utf8').trim();

function pageHtml(bg) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<style>
  * { margin: 0; box-sizing: border-box; }
  .stage {
    width: 1080px;
    height: 1080px;
    background: ${bg};
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .stage svg {
    width: 900px;
    height: auto;
    max-width: 92%;
    display: block;
  }
</style>
</head>
<body>
  <div class="stage">${brandmarkSvg}</div>
</body>
</html>`;
}

const outDir = join(root, 'assets', 'images', 'logo');
const VIEWPORT = { width: 1080, height: 1080 };

const browser = await chromium.launch({ headless: true });
try {
    for (const { file, bg } of [
        { file: 'social-profile-brandmark-black-bg-1080.png', bg: '#000000' },
        { file: 'social-profile-brandmark-white-bg-1080.png', bg: '#ffffff' },
    ]) {
        const page = await browser.newPage({ viewport: VIEWPORT });
        await page.setContent(pageHtml(bg), { waitUntil: 'load' });
        await page.screenshot({
            path: join(outDir, file),
            type: 'png',
            clip: { x: 0, y: 0, width: 1080, height: 1080 },
        });
        await page.close();
        console.log('Wrote', file);
    }
} finally {
    await browser.close();
}
