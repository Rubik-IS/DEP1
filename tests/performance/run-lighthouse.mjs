import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'tests', 'reports');
fs.mkdirSync(REPORTS_DIR, { recursive: true });

const ROUTES = [
  { name: 'home', path: '/' },
  { name: 'zkteco', path: '/solutions/zkteco-attendance' },
  { name: 'weighing', path: '/solutions/weighing-management' },
];

const CHROME_PATH =
  process.env.CHROME_PATH ||
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function runCommand(cmd, args, env = process.env) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      cwd: ROOT,
      env,
      shell: true,
      stdio: 'pipe',
    });
    let stderr = '';
    child.stderr.on('data', (d) => (stderr += d.toString()));
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} ${args.join(' ')} exited ${code}: ${stderr}`));
    });
  });
}

async function main() {
  const preview = spawn(
    'npx',
    ['vite', 'preview', '--host', '127.0.0.1', '--port', '4173', '--strictPort'],
    { cwd: ROOT, shell: true, stdio: 'ignore' }
  );

  const results = [];

  try {
    await wait(3000);
    const env = { ...process.env, CHROME_PATH };

    for (const route of ROUTES) {
      for (const preset of ['desktop', 'mobile']) {
        const outFile = path.join(
          REPORTS_DIR,
          `lh-${route.name}-${preset}.json`
        );
        const args = [
          '--yes',
          'lighthouse',
          `"http://127.0.0.1:4173${route.path}"`,
          ...(preset === 'desktop' ? ['--preset=desktop'] : []),
          '--output=json',
          `"--output-path=${outFile}"`,
          '"--chrome-flags=--headless=new --no-sandbox --disable-gpu-sandbox"',
          '--quiet',
        ];
        await runCommand('npx', args, env);

        const raw = JSON.parse(fs.readFileSync(outFile, 'utf8'));
        const a = raw.audits;
        const entry = {
          route: route.path,
          preset,
          performance: Math.round(raw.categories.performance.score * 100),
          accessibility: Math.round(raw.categories.accessibility.score * 100),
          bestPractices: Math.round(raw.categories['best-practices'].score * 100),
          seo: Math.round(raw.categories.seo.score * 100),
          fcp: a['first-contentful-paint']?.displayValue,
          lcp: a['largest-contentful-paint']?.displayValue,
          tbt: a['total-blocking-time']?.displayValue,
          cls: a['cumulative-layout-shift']?.displayValue,
        };
        results.push(entry);
        console.log(JSON.stringify(entry));
      }
    }
  } finally {
    preview.kill('SIGTERM');
  }

  fs.writeFileSync(
    path.join(REPORTS_DIR, 'lighthouse-summary.json'),
    JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2)
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
