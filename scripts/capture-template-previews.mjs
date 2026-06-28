/**
 * Capture above-the-fold hero screenshots for live Vercel demos.
 *
 * First time: PLAYWRIGHT_BROWSERS_PATH=.playwright-browsers npx playwright install chromium
 * Then: npm run capture:template-previews
 */
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
if (!process.env.PLAYWRIGHT_BROWSERS_PATH) {
    process.env.PLAYWRIGHT_BROWSERS_PATH = join(root, '.playwright-browsers');
}

const { chromium } = await import('playwright');

const outDir = join(root, 'assets', 'images', 'templates');

const jobs = [
    { url: 'https://special-event-designs-cnnf.vercel.app/', file: 'special-event-designs-preview.jpg' },
    { url: 'https://www.neptunewashpros.com/', file: 'neptune-pressure-washing-preview.jpg' },
    { url: 'https://the-group-sales-network.vercel.app/', file: 'the-group-sales-network-preview.jpg' }
];

const VIEWPORT = { width: 1200, height: 675 };

async function delay(ms) {
    return new Promise((r) => setTimeout(r, ms));
}

const browser = await chromium.launch({ headless: true });
try {
    for (const { url, file } of jobs) {
        const page = await browser.newPage({ viewport: VIEWPORT });
        await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
        await delay(1500);
        await page.screenshot({
            path: join(outDir, file),
            type: 'jpeg',
            quality: 88,
            clip: { x: 0, y: 0, width: VIEWPORT.width, height: VIEWPORT.height }
        });
        await page.close();
        console.log('Wrote', file);
    }
} finally {
    await browser.close();
}
