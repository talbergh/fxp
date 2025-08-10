#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import chalk from 'chalk';
import ora from 'ora';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.dirname(__dirname);

async function clean() {
  const spinner = ora('Cleaning build artifacts').start();
  
  try {
    const dirsToClean = ['dist', '.fxp-templates', 'tmp', 'test'];
    
    for (const dir of dirsToClean) {
      const dirPath = path.join(rootDir, dir);
      if (fs.existsSync(dirPath)) {
        fs.rmSync(dirPath, { recursive: true, force: true });
        spinner.text = `Cleaned ${dir}/`;
      }
    }
    
    spinner.succeed('Cleanup complete');
  } catch (error) {
    spinner.fail('Cleanup failed');
    console.error(chalk.red(error.message));
    process.exit(1);
  }
}

clean();
