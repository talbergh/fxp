import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import archiver from 'archiver';
import ora from 'ora';

function validateResourceDir(dir) {
  const manifest = path.join(dir, 'fxmanifest.lua');
  if (!fs.existsSync(manifest)) return 'Missing fxmanifest.lua';
  // Basic check for client/server folders existing (non-fatal)
  return null;
}

export default async function exportCmd(resourcePath = '.', opts = {}) {
  const cwd = process.cwd();
  const dir = path.resolve(cwd, resourcePath);

  const spinner = ora(`Exporting ${dir}`).start();
  try {
    const err = validateResourceDir(dir);
    if (err) {
      spinner.fail(err);
      process.exitCode = 1;
      return;
    }

    const outPath = opts.out
      ? path.resolve(cwd, opts.out)
      : path.resolve(cwd, `${path.basename(dir)}.zip`);

    await new Promise((resolve, reject) => {
      const output = fs.createWriteStream(outPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      output.on('close', resolve);
      archive.on('error', reject);

      archive.pipe(output);
      archive.directory(dir, false);
      archive.finalize();
    });

    spinner.succeed(`Exported to ${outPath}`);
  } catch (e) {
    spinner.fail('Export failed');
    throw e;
  }
}
