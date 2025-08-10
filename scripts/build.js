#!/usr/bin/env node
import { execSync } from 'node:child_process';
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

const pkg = require(path.join(rootDir, 'package.json'));

function run(cmd, options = {}) {
  if (!options.silent) console.log(chalk.gray('> ' + cmd));
  return execSync(cmd, { 
    stdio: options.silent ? 'pipe' : 'inherit', 
    env: process.env,
    encoding: 'utf8',
    ...options 
  });
}

function ensurePkg() {
  try {
    const pkgPath = path.join(rootDir, 'node_modules', '.bin', process.platform === 'win32' ? 'pkg.cmd' : 'pkg');
    if (fs.existsSync(pkgPath)) return pkgPath;
  } catch {}
  return 'npx pkg';
}

function cleanDist() {
  const distDir = path.join(rootDir, 'dist');
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
  }
  fs.mkdirSync(distDir, { recursive: true });
}

function copyAssets() {
  const spinner = ora('Copying assets').start();
  
  // Copy templates
  const templatesSource = path.join(rootDir, 'templates');
  const templatesDest = path.join(rootDir, 'dist', 'templates');
  
  if (fs.existsSync(templatesSource)) {
    copyDirRecursive(templatesSource, templatesDest);
  }
  
  // Copy package.json for version info
  const packageSource = path.join(rootDir, 'package.json');
  const packageDest = path.join(rootDir, 'dist', 'package.json');
  fs.copyFileSync(packageSource, packageDest);
  
  // Create build info
  const buildInfo = {
    version: pkg.version,
    buildDate: new Date().toISOString(),
    platform: process.platform,
    node: process.version,
    targets: ['node18-win-x64', 'node18-linux-x64']
  };
  
  fs.writeFileSync(
    path.join(rootDir, 'dist', 'build-info.json'),
    JSON.stringify(buildInfo, null, 2)
  );
  
  spinner.succeed('Assets copied');
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

function buildBinaries(isDev = false) {
  const spinner = ora('Building standalone binaries').start();
  
  try {
    const pkgCmd = ensurePkg();
    const targets = isDev ? ['node18-win-x64'] : ['node18-win-x64', 'node18-linux-x64'];
    const entry = path.join(rootDir, 'bin', 'fxp.js');
    const outDir = path.join(rootDir, 'dist');

    for (const target of targets) {
      spinner.text = `Building for ${target}`;
      run(`${pkgCmd} ${entry} --targets ${target} --out-path ${outDir}`, { silent: true });
    }

    spinner.succeed(`Built ${targets.length} binary(ies)`);
  } catch (error) {
    spinner.fail('Build failed');
    throw error;
  }
}

function createChecksums() {
  const spinner = ora('Creating checksums').start();
  
  try {
    const distDir = path.join(rootDir, 'dist');
    const files = fs.readdirSync(distDir).filter(f => 
      f.endsWith('.exe') || (f === 'fxp' && !f.includes('.'))
    );
    
    const checksums = {};
    const crypto = require('node:crypto');
    
    for (const file of files) {
      const filePath = path.join(distDir, file);
      const content = fs.readFileSync(filePath);
      const hash = crypto.createHash('sha256').update(content).digest('hex');
      checksums[file] = hash;
    }
    
    fs.writeFileSync(
      path.join(distDir, 'checksums.json'),
      JSON.stringify(checksums, null, 2)
    );
    
    spinner.succeed('Checksums created');
  } catch (error) {
    spinner.fail('Checksum creation failed');
    throw error;
  }
}

function printBuildSummary() {
  const distDir = path.join(rootDir, 'dist');
  const files = fs.readdirSync(distDir);
  
  console.log(chalk.green('\n✅ Build complete!'));
  console.log(chalk.cyan('\nGenerated files:'));
  
  files.forEach(file => {
    const filePath = path.join(distDir, file);
    const stat = fs.statSync(filePath);
    const size = (stat.size / 1024 / 1024).toFixed(2);
    console.log(chalk.gray(`  ${file} (${size} MB)`));
  });
  
  console.log(chalk.yellow(`\nVersion: ${pkg.version}`));
  console.log(chalk.gray(`Output: ${distDir}`));
}

function main() {
  const args = process.argv.slice(2);
  const isDev = args.includes('--dev');
  
  console.log(chalk.blue(`🔨 Building FXP v${pkg.version}${isDev ? ' (dev)' : ''}`));
  
  try {
    cleanDist();
    copyAssets();
    buildBinaries(isDev);
    createChecksums();
    printBuildSummary();
  } catch (error) {
    console.error(chalk.red('\n❌ Build failed:'), error.message);
    process.exit(1);
  }
}

main();
