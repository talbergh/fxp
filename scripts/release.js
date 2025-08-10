#!/usr/bin/env node
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.dirname(__dirname);

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

function updateVersion(type) {
  const packagePath = path.join(rootDir, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  const [major, minor, patch] = pkg.version.split('.').map(Number);
  
  let newVersion;
  switch (type) {
    case 'major':
      newVersion = `${major + 1}.0.0`;
      break;
    case 'minor':
      newVersion = `${major}.${minor + 1}.0`;
      break;
    case 'patch':
      newVersion = `${major}.${minor}.${patch + 1}`;
      break;
    default:
      newVersion = type; // Custom version
  }
  
  pkg.version = newVersion;
  fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + '\n');
  
  return newVersion;
}

function createChangelog(version, changes) {
  const changelogPath = path.join(rootDir, 'CHANGELOG.md');
  const date = new Date().toISOString().split('T')[0];
  
  const entry = `## [${version}] - ${date}

${changes.map(change => `- ${change}`).join('\n')}

`;

  if (fs.existsSync(changelogPath)) {
    const existing = fs.readFileSync(changelogPath, 'utf8');
    fs.writeFileSync(changelogPath, entry + existing);
  } else {
    const header = `# Changelog

All notable changes to FXP will be documented in this file.

`;
    fs.writeFileSync(changelogPath, header + entry);
  }
}

async function release() {
  console.log(chalk.blue('🚀 FXP Release Process'));
  
  try {
    // Check if we're in a git repo
    try {
      run('git status', { silent: true });
    } catch {
      throw new Error('Not in a git repository');
    }
    
    // Check for uncommitted changes
    const status = run('git status --porcelain', { silent: true });
    if (status.trim()) {
      console.log(chalk.yellow('⚠️  Uncommitted changes detected:'));
      console.log(status);
      
      const { proceed } = await inquirer.prompt([{
        type: 'confirm',
        name: 'proceed',
        message: 'Continue with uncommitted changes?',
        default: false
      }]);
      
      if (!proceed) {
        console.log('Release cancelled');
        return;
      }
    }
    
    // Get current version
    const pkg = require(path.join(rootDir, 'package.json'));
    console.log(chalk.gray(`Current version: ${pkg.version}`));
    
    // Ask for version bump type
    const { versionType } = await inquirer.prompt([{
      type: 'list',
      name: 'versionType',
      message: 'Version bump type:',
      choices: [
        { name: 'Patch (0.0.X) - Bug fixes', value: 'patch' },
        { name: 'Minor (0.X.0) - New features', value: 'minor' },
        { name: 'Major (X.0.0) - Breaking changes', value: 'major' },
        { name: 'Custom version', value: 'custom' }
      ]
    }]);
    
    let newVersion;
    if (versionType === 'custom') {
      const { customVersion } = await inquirer.prompt([{
        type: 'input',
        name: 'customVersion',
        message: 'Enter custom version:',
        validate: input => /^\d+\.\d+\.\d+$/.test(input) || 'Invalid version format (x.y.z)'
      }]);
      newVersion = updateVersion(customVersion);
    } else {
      newVersion = updateVersion(versionType);
    }
    
    console.log(chalk.green(`Version bumped to: ${newVersion}`));
    
    // Ask for changelog
    const { addChangelog } = await inquirer.prompt([{
      type: 'confirm',
      name: 'addChangelog',
      message: 'Add changelog entries?',
      default: true
    }]);
    
    if (addChangelog) {
      const changes = [];
      let addMore = true;
      
      while (addMore) {
        const { change } = await inquirer.prompt([{
          type: 'input',
          name: 'change',
          message: 'Changelog entry (or press Enter to finish):'
        }]);
        
        if (change.trim()) {
          changes.push(change.trim());
        } else {
          addMore = false;
        }
      }
      
      if (changes.length > 0) {
        createChangelog(newVersion, changes);
        console.log(chalk.green('Changelog updated'));
      }
    }
    
    // Run tests
    const { runTests } = await inquirer.prompt([{
      type: 'confirm',
      name: 'runTests',
      message: 'Run tests before building?',
      default: true
    }]);
    
    if (runTests) {
      console.log(chalk.blue('\n🧪 Running tests...'));
      run('npm test');
    }
    
    // Build release
    console.log(chalk.blue('\n🔨 Building release...'));
    run('npm run build');
    
    // Git operations
    const { commitAndTag } = await inquirer.prompt([{
      type: 'confirm',
      name: 'commitAndTag',
      message: 'Commit changes and create git tag?',
      default: true
    }]);
    
    if (commitAndTag) {
      run('git add .');
      run(`git commit -m "Release v${newVersion}"`);
      run(`git tag -a v${newVersion} -m "Release v${newVersion}"`);
      
      console.log(chalk.green(`✅ Created git tag v${newVersion}`));
      
      const { pushChanges } = await inquirer.prompt([{
        type: 'confirm',
        name: 'pushChanges',
        message: 'Push changes and tags to remote?',
        default: true
      }]);
      
      if (pushChanges) {
        run('git push origin main');
        run('git push origin --tags');
        console.log(chalk.green('✅ Pushed to remote repository'));
      }
    }
    
    console.log(chalk.green(`\n🎉 Release v${newVersion} complete!`));
    console.log(chalk.gray('Next steps:'));
    console.log(chalk.gray('1. Create GitHub release from the tag'));
    console.log(chalk.gray('2. Upload binaries from dist/ to the release'));
    console.log(chalk.gray('3. Announce the release'));
    
  } catch (error) {
    console.error(chalk.red('\n❌ Release failed:'), error.message);
    process.exit(1);
  }
}

release();
