const chalk = require('chalk');
const { checkForUpdates, getCurrentVersion } = require('./download');

async function checkVersion() {
  try {
    const updateInfo = await checkForUpdates();
    
    if (updateInfo.hasUpdate) {
      console.log(chalk.yellow(`\n📦 Update available: v${updateInfo.currentVersion} → v${updateInfo.latestVersion}`));
      console.log(chalk.gray('Run "fxp update" to upgrade'));
    }
  } catch (error) {
    // Silent fail for version check
  }
}

module.exports = {
  checkVersion,
  getCurrentVersion
};
