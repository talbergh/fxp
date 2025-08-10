#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import chalk from 'chalk';
import ora from 'ora';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.dirname(__dirname);

const GITHUB_REPO = 'talbergh/fxp';
const GITHUB_API = `https://api.github.com/repos/${GITHUB_REPO}`;

// GitHub API helper
function fetchGitHub(endpoint) {
  return new Promise((resolve, reject) => {
    const url = `${GITHUB_API}${endpoint}`;
    
    https.get(url, {
      headers: {
        'User-Agent': 'FXP-CLI-Updater',
        'Accept': 'application/vnd.github.v3+json'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error('Invalid JSON response'));
        }
      });
    }).on('error', reject);
  });
}

// Download file helper
function downloadFile(url, destination) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destination);
    
    https.get(url, (res) => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        // Follow redirect
        return downloadFile(res.headers.location, destination).then(resolve).catch(reject);
      }
      
      if (res.statusCode !== 200) {
        reject(new Error(`Download failed: ${res.statusCode}`));
        return;
      }
      
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', reject);
  });
}

// Version comparison
function compareVersions(v1, v2) {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);
  
  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const part1 = parts1[i] || 0;
    const part2 = parts2[i] || 0;
    
    if (part1 > part2) return 1;
    if (part1 < part2) return -1;
  }
  return 0;
}

export async function checkForUpdates(currentVersion) {
  const spinner = ora('Checking for updates').start();
  
  try {
    const release = await fetchGitHub('/releases/latest');
    const latestVersion = release.tag_name.replace(/^v/, '');
    
    spinner.stop();
    
    const comparison = compareVersions(latestVersion, currentVersion);
    
    if (comparison > 0) {
      console.log(chalk.green(`🎉 New version available: ${latestVersion} (current: ${currentVersion})`));
      console.log(chalk.gray(`Release: ${release.name}`));
      console.log(chalk.gray(`Published: ${new Date(release.published_at).toLocaleDateString()}`));
      
      if (release.body) {
        console.log(chalk.yellow('\nChangelog:'));
        console.log(release.body.split('\n').slice(0, 5).map(line => `  ${line}`).join('\n'));
      }
      
      return {
        hasUpdate: true,
        latestVersion,
        release
      };
    } else {
      console.log(chalk.green(`✅ You have the latest version (${currentVersion})`));
      return { hasUpdate: false };
    }
  } catch (error) {
    spinner.fail('Update check failed');
    console.error(chalk.red('Error:'), error.message);
    return { hasUpdate: false, error: error.message };
  }
}

export async function performUpdate(targetVersion, platform = process.platform) {
  const spinner = ora(`Downloading FXP v${targetVersion}`).start();
  
  try {
    // Get release info
    const release = await fetchGitHub(`/releases/tags/v${targetVersion}`);
    
    // Find the correct asset for platform
    const assetName = platform === 'win32' ? 'fxp.exe' : 'fxp';
    const asset = release.assets.find(a => a.name === assetName);
    
    if (!asset) {
      throw new Error(`No binary found for platform: ${platform}`);
    }
    
    // Download to temp location
    const tempDir = path.join(process.cwd(), '.fxp-update');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
    
    const tempFile = path.join(tempDir, assetName);
    
    spinner.text = 'Downloading update';
    await downloadFile(asset.browser_download_url, tempFile);
    
    // Verify download
    if (!fs.existsSync(tempFile)) {
      throw new Error('Download verification failed');
    }
    
    spinner.succeed(`Downloaded FXP v${targetVersion}`);
    
    console.log(chalk.yellow('\n📦 Update downloaded to:'));
    console.log(chalk.cyan(tempFile));
    console.log(chalk.gray('\nTo install:'));
    
    if (platform === 'win32') {
      console.log(chalk.white('1. Close this FXP instance'));
      console.log(chalk.white('2. Replace your current fxp.exe with the downloaded file'));
      console.log(chalk.white('3. Run the new version'));
    } else {
      console.log(chalk.white('1. Close this FXP instance'));
      console.log(chalk.white(`2. Replace your current fxp binary with: ${tempFile}`));
      console.log(chalk.white('3. Make it executable: chmod +x /path/to/fxp'));
      console.log(chalk.white('4. Run the new version'));
    }
    
    console.log(chalk.green('\n✨ Update ready! Restart FXP to use the new version.'));
    
    return { success: true, path: tempFile };
  } catch (error) {
    spinner.fail('Update failed');
    console.error(chalk.red('Error:'), error.message);
    return { success: false, error: error.message };
  }
}

// Command line interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (!command) {
    console.log(chalk.red('Usage: node update.js <check|update> [version]'));
    process.exit(1);
  }
  
  // Get current version
  const pkg = require(path.join(rootDir, 'package.json'));
  const currentVersion = pkg.version;
  
  if (command === 'check') {
    await checkForUpdates(currentVersion);
  } else if (command === 'update') {
    const targetVersion = args[1];
    if (!targetVersion) {
      console.log(chalk.red('Please specify target version: node update.js update 1.0.0'));
      process.exit(1);
    }
    await performUpdate(targetVersion);
  } else {
    console.log(chalk.red(`Unknown command: ${command}`));
    console.log(chalk.gray('Available commands: check, update'));
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
