const chalk = require('chalk');
const ora = require('ora');
const { checkForUpdates, downloadLatestRelease } = require('../utils/download');
const { getCurrentVersion } = require('../utils/version');
const semver = require('semver');

async function updateCLI(options) {
  try {
    console.log(chalk.blue('🔄 Checking for updates...\n'));

    const spinner = ora('Checking for updates...').start();

    // Check for updates
    const updateInfo = await checkForUpdates();
    const currentVersion = getCurrentVersion();

    if (!updateInfo.hasUpdate && !options.force) {
      spinner.succeed('Already up to date!');
      console.log(chalk.green(`✅ FXP CLI is already at the latest version (v${currentVersion})`));
      return;
    }

    spinner.stop();

    if (updateInfo.hasUpdate) {
      console.log(chalk.yellow(`📦 Update available: v${currentVersion} → v${updateInfo.latestVersion}`));
      console.log(chalk.gray(`🔗 Release: ${updateInfo.releaseUrl}`));
    } else if (options.force) {
      console.log(chalk.yellow(`🔄 Force updating to v${updateInfo.latestVersion}`));
    }

    // Download and install update
    const downloadSpinner = ora('Downloading update...').start();

    try {
      const platform = require('os').platform();
      const binaryPath = await downloadLatestRelease(platform);

      downloadSpinner.succeed('Update downloaded!');

      const installSpinner = ora('Installing update...').start();

      // Replace current binary
      const { replaceBinary } = require('./install');
      await replaceBinary(binaryPath, platform);

      installSpinner.succeed('Update installed successfully!');

      console.log(chalk.green('✅ FXP CLI updated successfully!'));
      console.log(chalk.gray(`📊 Version: v${currentVersion} → v${updateInfo.latestVersion}`));
      console.log(chalk.blue('\n🚀 Changes:'));
      
      if (updateInfo.changelog) {
        console.log(chalk.gray(updateInfo.changelog));
      } else {
        console.log(chalk.gray('Check the release notes on GitHub for details'));
      }

    } catch (error) {
      downloadSpinner.fail('Update failed');
      throw error;
    }

  } catch (error) {
    console.error(chalk.red('❌ Update failed:'), error.message);
    console.log(chalk.yellow('\n💡 Manual update:'));
    console.log(chalk.gray('1. Download latest release from: https://github.com/talbergh/fxp/releases'));
    console.log(chalk.gray('2. Replace your current fxp binary'));
    console.log(chalk.gray('3. Or reinstall: fxp install'));
    process.exit(1);
  }
}

module.exports = { updateCLI };
