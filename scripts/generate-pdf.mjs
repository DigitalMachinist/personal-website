import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import net from 'node:net';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Find a free TCP port. */
function getFreePort() {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.listen(0, () => {
      const { port } = srv.address();
      srv.close(() => resolve(port));
    });
    srv.on('error', reject);
  });
}

/** Poll a URL until it responds with 200. */
async function waitForServer(url, timeoutMs = 30_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch { /* server not ready yet */ }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(`Server at ${url} did not become ready within ${timeoutMs}ms`);
}

async function main() {
  const port = await getFreePort();
  const url = `http://localhost:${port}/resume-pdf`;

  console.log(`Starting Astro dev server on port ${port}...`);
  const devServer = spawn('npx', ['astro', 'dev', '--port', String(port)], {
    cwd: ROOT,
    stdio: 'pipe',
  });

  // Forward stderr so build errors are visible
  devServer.stderr.on('data', (d) => process.stderr.write(d));

  try {
    await waitForServer(url);
    console.log('Dev server ready. Launching browser...');

    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(url, { waitUntil: 'networkidle' });

    // Force light theme and wait for CSS variables to propagate
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
    });

    // Activate print media (triggers @media print rules)
    await page.emulateMedia({ media: 'print' });

    // Wait for Google Fonts and CSS transitions to settle
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500);

    const outPath = path.join(ROOT, 'public', 'resume.pdf');
    await page.pdf({
      path: outPath,
      format: 'Letter',
      printBackground: true,
      margin: { top: '0.6in', right: '0.7in', bottom: '0.6in', left: '0.7in' },
    });

    console.log(`PDF saved to ${outPath}`);
    await browser.close();
  } finally {
    devServer.kill();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
