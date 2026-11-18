import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'tests', 'reports');
fs.mkdirSync(REPORTS_DIR, { recursive: true });

function walkFiles(dir, exts, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(full, exts, out);
    } else if (exts.some((ext) => entry.name.endsWith(ext))) {
      out.push(full);
    }
  }
  return out;
}

function scanSourceSecurity() {
  const files = walkFiles(path.join(ROOT, 'src'), ['.ts', '.tsx']);
  const findings = [];

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const rel = path.relative(ROOT, file);

    if (/dangerouslySetInnerHTML/.test(content)) {
      findings.push({ file: rel, severity: 'high', issue: 'dangerouslySetInnerHTML usage' });
    }
    if (/\beval\s*\(/.test(content) || /new Function\s*\(/.test(content)) {
      findings.push({ file: rel, severity: 'critical', issue: 'Dynamic code execution (eval/Function)' });
    }
    if (/AIza[0-9A-Za-z-_]{35}|sk-[0-9A-Za-z]{20,}|ghp_[0-9A-Za-z]{36}/.test(content)) {
      findings.push({ file: rel, severity: 'critical', issue: 'Hardcoded API key/secret pattern' });
    }
    if (/target=["']_blank["'](?![^>]*noopener)/.test(content)) {
      findings.push({ file: rel, severity: 'medium', issue: 'target="_blank" missing rel="noopener"' });
    }
  }
  return findings;
}

function runNpmAudit(omitDev) {
  try {
    const cmd = omitDev ? 'npm audit --omit=dev --json' : 'npm audit --json';
    const raw = execSync(cmd, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    return JSON.parse(raw);
  } catch (err) {
    const stdout = err.stdout?.toString?.() ?? '';
    return stdout ? JSON.parse(stdout) : { error: err.message };
  }
}

const prodAudit = runNpmAudit(true);
const fullAudit = runNpmAudit(false);
const codeFindings = scanSourceSecurity();

const summary = {
  generatedAt: new Date().toISOString(),
  productionDependencies: prodAudit.metadata?.vulnerabilities ?? prodAudit,
  allDependencies: fullAudit.metadata?.vulnerabilities ?? fullAudit,
  staticCodeFindings: codeFindings,
};

fs.writeFileSync(
  path.join(REPORTS_DIR, 'security-summary.json'),
  JSON.stringify(summary, null, 2)
);

console.log('Production deps vulnerabilities:', JSON.stringify(summary.productionDependencies));
console.log('All deps vulnerabilities:', JSON.stringify(summary.allDependencies));
console.log('Static security findings:', codeFindings.length);

const criticalOrHighProd =
  (summary.productionDependencies?.critical ?? 0) +
  (summary.productionDependencies?.high ?? 0);
const criticalCode = codeFindings.filter(
  (f) => f.severity === 'critical' || f.severity === 'high'
).length;

if (criticalOrHighProd > 0 || criticalCode > 0) {
  process.exit(1);
}
