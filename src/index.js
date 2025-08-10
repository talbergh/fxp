import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { createRequire } from 'module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

import initCmd from './commands/init.js';
import createCmd from './commands/create.js';
import exportCmd from './commands/export.js';
import installCmd from './commands/install.js';
import uninstallCmd from './commands/uninstall.js';
import { checkForUpdates } from '../scripts/update.js';

const require = createRequire(import.meta.url);
const pkg = require('../package.json');

export default async function main(argv = process.argv) {
  const program = new Command();
  program
    .name('fxp')
    .description('FXP by Talbergh — CLI for FiveM modders to scaffold & export resources')
    .version(pkg.version);

  program
    .command('init')
    .description('Initialize current folder as FiveM resource OR create new project interactively')
    .option('-y, --yes', 'Use defaults without prompting', false)
    .action(async (opts) => {
      await initCmd(opts);
    });

  program
    .command('create <name>')
    .description('Create a new resource/project from template')
    .option('-t, --template <name>', 'Template name', 'basic-lua')
    .option('--ts', 'Use TypeScript for client/server (where applicable)', false)
    .action(async (name, opts) => {
      await createCmd(name, opts);
    });

  program
    .command('export [path]')
    .description('Export a resource folder into a FiveM-ready zip (fxmanifest.lua validated)')
    .option('-o, --out <file>', 'Output zip file path', null)
    .action(async (resourcePath, opts) => {
      await exportCmd(resourcePath, opts);
    });

  program
    .command('templates')
    .description('List available templates')
    .action(async () => {
      const { getTemplatesDir } = await import('./utils/templates.js');
      const dir = await getTemplatesDir();
      const files = fs.readdirSync(dir, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);
      console.log(chalk.cyan('Available templates:'));
      for (const f of files) console.log(' -', f);
    });

  program
    .command('install')
    .description('Install FXP globally on this system')
    .action(async () => {
      await installCmd();
    });

  program
    .command('uninstall')
    .description('Uninstall FXP from this system')
    .action(async () => {
      await uninstallCmd();
    });

  program
    .command('update')
    .description('Check for updates and update FXP')
    .option('--check', 'Only check for updates, do not download')
    .action(async (opts) => {
      const updateResult = await checkForUpdates(pkg.version);
      
      if (updateResult.hasUpdate && !opts.check) {
        const inquirer = await import('inquirer');
        const { shouldUpdate } = await inquirer.default.prompt([{
          type: 'confirm',
          name: 'shouldUpdate',
          message: `Update to v${updateResult.latestVersion}?`,
          default: true
        }]);
        
        if (shouldUpdate) {
          const { performUpdate } = await import('../scripts/update.js');
          await performUpdate(updateResult.latestVersion);
        }
      }
    });  if (argv[1] && argv[1].endsWith('fxp.js')) {
    await program.parseAsync(argv);
  } else {
    await program.parseAsync(process.argv);
  }
}

if (import.meta.url === `file://${process.argv[1]}` || process.env.FXP_STANDALONE) {
  // When executed directly
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
