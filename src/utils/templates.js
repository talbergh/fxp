import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if running from pkg bundle or development
const isPkg = typeof process.pkg !== 'undefined';

export async function getTemplatesDir() {
  if (isPkg) {
    // In pkg bundle, extract templates to temp dir
    const tempDir = path.join(process.cwd(), '.fxp-templates');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
      // Extract embedded templates
      await extractTemplates(tempDir);
    }
    return tempDir;
  } else {
    // Development mode
    return path.resolve(__dirname, '../../templates');
  }
}

async function extractTemplates(targetDir) {
  // In pkg, assets are available via process.cwd() or snapshot filesystem
  // We'll copy from the bundled assets to a writable location
  const sourceDir = path.resolve(__dirname, '../../templates');
  if (fs.existsSync(sourceDir)) {
    copyDirRecursive(sourceDir, targetDir);
  }
}

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(s, d);
    } else {
      fs.copyFileSync(s, d);
    }
  }
}
