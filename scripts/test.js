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
    cwd: rootDir,
    ...options 
  });
}

async function runTests() {
  console.log(chalk.blue(`🧪 Testing FXP v${pkg.version}`));
  
  const tempDir = path.join(rootDir, 'test-temp');
  
  try {
    // Clean up any existing test directory
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    fs.mkdirSync(tempDir, { recursive: true });
    
    process.chdir(tempDir);
    
    // Test 1: Help command
    let spinner = ora('Testing help command').start();
    try {
      const help = run('node ../bin/fxp.js --help', { silent: true });
      if (help.includes('FXP by Talbergh')) {
        spinner.succeed('Help command works');
      } else {
        throw new Error('Help output invalid');
      }
    } catch (e) {
      spinner.fail('Help command failed');
      throw e;
    }
    
    // Test 2: Templates command
    spinner = ora('Testing templates command').start();
    try {
      const templates = run('node ../bin/fxp.js templates', { silent: true });
      if (templates.includes('basic-lua') && templates.includes('modern-lua')) {
        spinner.succeed('Templates command works');
      } else {
        throw new Error('Templates output invalid');
      }
    } catch (e) {
      spinner.fail('Templates command failed');
      throw e;
    }
    
    // Test 3: Create command
    spinner = ora('Testing create command').start();
    try {
      run('node ../bin/fxp.js create test-resource -t basic-lua', { silent: true });
      if (fs.existsSync(path.join(tempDir, 'test-resource', 'fxmanifest.lua'))) {
        spinner.succeed('Create command works');
      } else {
        throw new Error('Resource not created');
      }
    } catch (e) {
      spinner.fail('Create command failed');
      throw e;
    }
    
    // Test 4: Init command (non-interactive)
    spinner = ora('Testing init command').start();
    try {
      process.chdir(path.join(tempDir, 'test-resource'));
      run('node ../../bin/fxp.js init -y', { silent: true });
      
      const manifest = fs.readFileSync('fxmanifest.lua', 'utf8');
      if (manifest.includes('test-resource')) {
        spinner.succeed('Init command works');
      } else {
        throw new Error('Init failed to update manifest');
      }
    } catch (e) {
      spinner.fail('Init command failed');
      throw e;
    }
    
    // Test 5: Export command
    spinner = ora('Testing export command').start();
    try {
      run('node ../../bin/fxp.js export . -o test.zip', { silent: true });
      if (fs.existsSync('test.zip')) {
        spinner.succeed('Export command works');
      } else {
        throw new Error('Export file not created');
      }
    } catch (e) {
      spinner.fail('Export command failed');
      throw e;
    }
    
    console.log(chalk.green('\n✅ All tests passed!'));
    
  } catch (error) {
    console.error(chalk.red('\n❌ Tests failed:'), error.message);
    process.exit(1);
  } finally {
    // Cleanup
    process.chdir(rootDir);
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
}

runTests();
