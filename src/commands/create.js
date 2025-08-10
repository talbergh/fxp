import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ora from 'ora';
import chalk from 'chalk';

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

export default async function createCmd(name, opts = {}) {
  const cwd = process.cwd();
  const target = path.join(cwd, name);
  const spinner = ora(`Creating resource '${name}'`).start();

  try {
    if (fs.existsSync(target) && fs.readdirSync(target).length > 0) {
      spinner.fail(`Target directory already exists and is not empty: ${target}`);
      process.exitCode = 1;
      return;
    }

    const templateName = opts.template || 'basic-lua';
    const { getTemplatesDir } = await import('../utils/templates.js');
    const templatesDir = await getTemplatesDir();
    const templateDir = path.join(templatesDir, templateName);
    if (!fs.existsSync(templateDir)) {
      spinner.fail(`Template not found: ${templateName}`);
      process.exitCode = 1;
      return;
    }

    copyDir(templateDir, target);

    // Rename placeholders
    const manifestPath = path.join(target, 'fxmanifest.lua');
    if (fs.existsSync(manifestPath)) {
      const data = fs.readFileSync(manifestPath, 'utf8')
        .replaceAll('__RESOURCE_NAME__', name);
      fs.writeFileSync(manifestPath, data, 'utf8');
    }

    spinner.succeed(`Created resource '${name}' from template '${templateName}'.`);
    console.log(chalk.gray(`Next: cd ${name} ; fxp init -y`));
  } catch (e) {
    spinner.fail('Failed to create resource');
    throw e;
  }
}
