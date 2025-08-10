import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import ora from 'ora';
import chalk from 'chalk';

export default async function uninstallCmd() {
  const spinner = ora('Uninstalling FXP').start();

  try {
    const isWindows = os.platform() === 'win32';
    
    // Determine install locations
    const installDir = isWindows 
      ? path.join(os.homedir(), 'AppData', 'Local', 'FXP')
      : path.join(os.homedir(), '.local', 'bin');
    
    const targetExe = isWindows 
      ? path.join(installDir, 'fxp.exe')
      : path.join(installDir, 'fxp');

    // Remove executable
    if (fs.existsSync(targetExe)) {
      fs.unlinkSync(targetExe);
    }

    // Clean up empty directory on Windows
    if (isWindows && fs.existsSync(installDir)) {
      try {
        const files = fs.readdirSync(installDir);
        if (files.length === 0) {
          fs.rmdirSync(installDir);
        }
      } catch (e) {
        // Ignore if directory not empty
      }
    }

    // Remove temp templates if they exist
    const tempTemplates = path.join(process.cwd(), '.fxp-templates');
    if (fs.existsSync(tempTemplates)) {
      fs.rmSync(tempTemplates, { recursive: true, force: true });
    }

    spinner.succeed('FXP uninstalled successfully!');
    
    console.log(chalk.green('\nUninstallation complete!'));
    console.log(chalk.gray('Note: You may want to remove the PATH entry manually.'));
    
  } catch (e) {
    spinner.fail('Uninstallation failed');
    console.error(chalk.red('Error:'), e.message);
    process.exitCode = 1;
  }
}
