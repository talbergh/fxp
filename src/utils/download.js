const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const chalk = require('chalk');

const GITHUB_REPO = 'talbergh/fxp';
const RELEASES_URL = `https://api.github.com/repos/${GITHUB_REPO}/releases`;

async function checkForUpdates() {
  try {
    const response = await axios.get(`${RELEASES_URL}/latest`, {
      timeout: 5000,
      headers: {
        'User-Agent': 'FXP-CLI'
      }
    });

    const latestRelease = response.data;
    const latestVersion = latestRelease.tag_name.replace(/^v/, '');
    const currentVersion = getCurrentVersion();

    const semver = require('semver');
    const hasUpdate = semver.gt(latestVersion, currentVersion);

    return {
      hasUpdate,
      latestVersion,
      currentVersion,
      releaseUrl: latestRelease.html_url,
      changelog: latestRelease.body,
      assets: latestRelease.assets
    };

  } catch (error) {
    throw new Error(`Failed to check for updates: ${error.message}`);
  }
}

function getCurrentVersion() {
  try {
    const pkg = require('../../package.json');
    return pkg.version;
  } catch (error) {
    return '1.0.0';
  }
}

async function downloadLatestRelease(platform) {
  try {
    const updateInfo = await checkForUpdates();
    const assets = updateInfo.assets;

    // Determine asset name based on platform
    let assetName;
    switch (platform) {
      case 'win32':
        assetName = 'fxp-win.exe';
        break;
      case 'linux':
        assetName = 'fxp-linux';
        break;
      case 'darwin':
        assetName = 'fxp-macos';
        break;
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }

    // Find the asset
    const asset = assets.find(a => a.name === assetName);
    if (!asset) {
      throw new Error(`No binary found for platform: ${platform}`);
    }

    // Download the asset
    const downloadUrl = asset.browser_download_url;
    const tempDir = os.tmpdir();
    const tempFile = path.join(tempDir, assetName);

    console.log(chalk.gray(`Downloading from: ${downloadUrl}`));

    const response = await axios({
      method: 'GET',
      url: downloadUrl,
      responseType: 'stream',
      timeout: 30000,
      headers: {
        'User-Agent': 'FXP-CLI'
      }
    });

    const writer = fs.createWriteStream(tempFile);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(tempFile));
      writer.on('error', reject);
    });

  } catch (error) {
    throw new Error(`Failed to download release: ${error.message}`);
  }
}

module.exports = {
  checkForUpdates,
  getCurrentVersion,
  downloadLatestRelease
};
