import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import ora from 'ora';
import chalk from 'chalk';

export default async function installCmd() {
  const spinner = ora('Installing FXP globally').start();

  try {
    const currentExe = process.execPath;
    const isWindows = os.platform() === 'win32';
    
    // Determine install location
    const installDir = isWindows 
      ? path.join(os.homedir(), 'AppData', 'Local', 'FXP')
      : path.join(os.homedir(), '.local', 'bin');
    
    const targetExe = isWindows 
      ? path.join(installDir, 'fxp.exe')
      : path.join(installDir, 'fxp');

    // Create install directory
    if (!fs.existsSync(installDir)) {
      fs.mkdirSync(installDir, { recursive: true });
    }

    // Copy current executable
    fs.copyFileSync(currentExe, targetExe);
    
    // Make executable on Unix
    if (!isWindows) {
      fs.chmodSync(targetExe, '755');
    }

    // Update PATH (instructions)
    spinner.succeed('FXP installed successfully!');
    
    console.log(chalk.green('\nInstallation complete!'));
    console.log(chalk.gray(`Binary installed to: ${targetExe}`));
    
    if (isWindows) {
      console.log(chalk.yellow('\nTo use FXP globally, add this to your PATH:'));
      console.log(chalk.cyan(installDir));
      console.log(chalk.gray('\nSteps:'));
      console.log(chalk.gray('1. Press Win+R, type "sysdm.cpl", press Enter'));
      console.log(chalk.gray('2. Go to Advanced tab → Environment Variables'));
      console.log(chalk.gray('3. Edit PATH, add the directory above'));
      console.log(chalk.gray('4. Restart your terminal/PowerShell'));
    } else {
      console.log(chalk.yellow('\nTo use FXP globally, add this to your ~/.bashrc or ~/.zshrc:'));
      console.log(chalk.cyan(`export PATH="${installDir}:$PATH"`));
      console.log(chalk.gray('Then run: source ~/.bashrc (or restart terminal)'));
    }
    
    console.log(chalk.green('\nAfter PATH setup, you can use: fxp --help'));
    
  } catch (e) {
    spinner.fail('Installation failed');
    console.error(chalk.red('Error:'), e.message);
    process.exitCode = 1;
  }
}
