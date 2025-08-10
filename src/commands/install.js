const chalk = require('chalk');
const ora = require('ora');
const path = require('path');
const fs = require('fs-extra');
const { execSync } = require('child_process');
const os = require('os');

const INSTALL_PATHS = {
  win32: path.join(os.homedir(), 'AppData', 'Local', 'fxp'),
  linux: '/usr/local/bin',
  darwin: '/usr/local/bin'
};

const BINARY_NAMES = {
  win32: 'fxp.exe',
  linux: 'fxp',
  darwin: 'fxp'
};

async function installCLI() {
  try {
    console.log(chalk.blue('📦 Installing FXP CLI globally...\n'));

    const platform = os.platform();
    const installPath = INSTALL_PATHS[platform];
    const binaryName = BINARY_NAMES[platform];

    if (!installPath) {
      throw new Error(`Unsupported platform: ${platform}`);
    }

    const spinner = ora('Installing FXP CLI...').start();

    // Download latest release
    const { downloadLatestRelease } = require('../utils/download');
    const binaryPath = await downloadLatestRelease(platform);

    // Create install directory
    await fs.ensureDir(installPath);

    // Copy binary to install location
    const targetPath = path.join(installPath, binaryName);
    await fs.copy(binaryPath, targetPath);

    // Make executable on Unix systems
    if (platform !== 'win32') {
      await fs.chmod(targetPath, '755');
    }

    // Add to PATH on Windows
    if (platform === 'win32') {
      try {
        // Add to user PATH
        const currentPath = process.env.PATH || '';
        if (!currentPath.includes(installPath)) {
          execSync(`setx PATH "${currentPath};${installPath}"`, { stdio: 'pipe' });
        }
      } catch (error) {
        console.log(chalk.yellow('⚠️  Could not automatically add to PATH. Please add manually:'));
        console.log(chalk.gray(`   ${installPath}`));
      }
    }

    // Create symlink on Unix systems
    if (platform !== 'win32') {
      const symlinkPath = '/usr/local/bin/fxp';
      try {
        if (await fs.pathExists(symlinkPath)) {
          await fs.unlink(symlinkPath);
        }
        await fs.symlink(targetPath, symlinkPath);
      } catch (error) {
        console.log(chalk.yellow('⚠️  Could not create symlink. You may need to run with sudo:'));
        console.log(chalk.gray(`   sudo ln -sf ${targetPath} ${symlinkPath}`));
      }
    }

    spinner.succeed('FXP CLI installed successfully!');

    console.log(chalk.green('✅ Installation complete!'));
    console.log(chalk.gray(`📁 Installed to: ${targetPath}`));
    console.log(chalk.blue('\n🚀 Usage:'));
    console.log(chalk.white('   fxp create my-resource'));
    console.log(chalk.white('   fxp list'));
    console.log(chalk.white('   fxp update'));
    
    if (platform === 'win32') {
      console.log(chalk.yellow('\n💡 Restart your terminal to use the fxp command'));
    }

  } catch (error) {
    console.error(chalk.red('❌ Installation failed:'), error.message);
    process.exit(1);
  }
}

async function uninstallCLI() {
  try {
    console.log(chalk.blue('🗑️  Uninstalling FXP CLI...\n'));

    const platform = os.platform();
    const installPath = INSTALL_PATHS[platform];
    const binaryName = BINARY_NAMES[platform];

    if (!installPath) {
      throw new Error(`Unsupported platform: ${platform}`);
    }

    const spinner = ora('Uninstalling FXP CLI...').start();

    const targetPath = path.join(installPath, binaryName);
    
    // Remove binary
    if (await fs.pathExists(targetPath)) {
      await fs.remove(targetPath);
    }

    // Remove symlink on Unix systems
    if (platform !== 'win32') {
      const symlinkPath = '/usr/local/bin/fxp';
      if (await fs.pathExists(symlinkPath)) {
        try {
          await fs.unlink(symlinkPath);
        } catch (error) {
          console.log(chalk.yellow('⚠️  Could not remove symlink. You may need to run:'));
          console.log(chalk.gray(`   sudo rm ${symlinkPath}`));
        }
      }
    }

    // Remove install directory if empty
    try {
      const files = await fs.readdir(installPath);
      if (files.length === 0) {
        await fs.remove(installPath);
      }
    } catch (error) {
      // Directory doesn't exist or permission issue
    }

    spinner.succeed('FXP CLI uninstalled successfully!');

    console.log(chalk.green('✅ Uninstallation complete!'));
    console.log(chalk.gray('FXP CLI has been removed from your system'));

  } catch (error) {
    console.error(chalk.red('❌ Uninstallation failed:'), error.message);
    process.exit(1);
  }
}

module.exports = { installCLI, uninstallCLI };
