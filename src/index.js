#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const figlet = require('figlet');
const { createResource } = require('./commands/create');
const { installCLI, uninstallCLI } = require('./commands/install');
const { updateCLI } = require('./commands/update');
const { checkVersion } = require('./utils/version');
const { showHelp } = require('./commands/help');
const { listTemplates } = require('./commands/list');

// Package info
const pkg = require('../package.json');

// CLI Header
function showHeader() {
  console.log(
    chalk.cyan(
      figlet.textSync('FXP', {
        font: 'ANSI Shadow',
        horizontalLayout: 'default',
        verticalLayout: 'default'
      })
    )
  );
  console.log(chalk.gray(`v${pkg.version} - FiveM & RedM Resource Generator`));
  console.log(chalk.gray(`Author: ${pkg.author}`));
  console.log('');
}

// Main CLI Setup
async function main() {
  // Check for updates on startup (non-blocking)
  checkVersion().catch(() => {}); // Silent fail

  program
    .name('fxp')
    .description('CLI Tool for FiveM & RedM Modders')
    .version(pkg.version)
    .option('-v, --verbose', 'enable verbose logging')
    .option('--no-header', 'skip header display');

  // Show header by default
  if (!program.opts().noHeader) {
    showHeader();
  }

  // Commands
  program
    .command('create [name]')
    .description('Create a new FiveM/RedM resource')
    .option('-t, --template <type>', 'template type (basic, esx, qb, redm, etc.)')
    .option('-f, --framework <framework>', 'framework (esx, qb-core, standalone)')
    .option('--no-install', 'skip npm install')
    .action(createResource);

  program
    .command('list')
    .description('List available templates')
    .option('-f, --framework <framework>', 'filter by framework')
    .action(listTemplates);

  program
    .command('install')
    .description('Install FXP CLI globally on system')
    .action(installCLI);

  program
    .command('uninstall')
    .description('Uninstall FXP CLI from system')
    .action(uninstallCLI);

  program
    .command('update')
    .description('Update FXP CLI to latest version')
    .option('--force', 'force update even if already latest')
    .action(updateCLI);

  program
    .command('help [command]')
    .description('Display help for command')
    .action(showHelp);

  // Parse arguments
  program.parse();

  // Show help if no command provided
  if (!process.argv.slice(2).length) {
    program.outputHelp();
  }
}

// Error handling
process.on('uncaughtException', (error) => {
  console.error(chalk.red('Uncaught Exception:'), error.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(chalk.red('Unhandled Rejection at:'), promise, chalk.red('reason:'), reason);
  process.exit(1);
});

// Start CLI
if (require.main === module) {
  main().catch((error) => {
    console.error(chalk.red('CLI Error:'), error.message);
    process.exit(1);
  });
}

module.exports = { main };
