const chalk = require('chalk');
const { program } = require('commander');

function showHelp(command) {
  if (!command) {
    console.log(chalk.blue('🆘 FXP CLI Help\n'));
    
    console.log(chalk.cyan('Available Commands:'));
    console.log(chalk.white('  create [name]     ') + chalk.gray('Create a new FiveM/RedM resource'));
    console.log(chalk.white('  list              ') + chalk.gray('List available templates'));
    console.log(chalk.white('  install           ') + chalk.gray('Install FXP CLI globally'));
    console.log(chalk.white('  uninstall         ') + chalk.gray('Uninstall FXP CLI'));
    console.log(chalk.white('  update            ') + chalk.gray('Update to latest version'));
    console.log(chalk.white('  help [command]    ') + chalk.gray('Show help for specific command'));

    console.log(chalk.cyan('\nQuick Start:'));
    console.log(chalk.white('  fxp create my-resource'));
    console.log(chalk.white('  fxp list'));

    console.log(chalk.cyan('\nGlobal Options:'));
    console.log(chalk.white('  -v, --verbose     ') + chalk.gray('Enable verbose logging'));
    console.log(chalk.white('  --no-header       ') + chalk.gray('Skip header display'));
    console.log(chalk.white('  --version         ') + chalk.gray('Show version number'));

    return;
  }

  // Command-specific help
  switch (command.toLowerCase()) {
    case 'create':
      console.log(chalk.blue('🔧 fxp create - Create Resource\n'));
      console.log(chalk.cyan('Usage:'));
      console.log(chalk.white('  fxp create [name] [options]'));
      console.log(chalk.cyan('\nOptions:'));
      console.log(chalk.white('  -t, --template <type>      ') + chalk.gray('Template type (basic, esx, qb, etc.)'));
      console.log(chalk.white('  -f, --framework <fw>       ') + chalk.gray('Framework (esx, qb-core, standalone)'));
      console.log(chalk.white('  --no-install               ') + chalk.gray('Skip npm install'));
      console.log(chalk.cyan('\nExamples:'));
      console.log(chalk.white('  fxp create my-shop --template esx-shop'));
      console.log(chalk.white('  fxp create bank-robbery --framework qb-core'));
      break;

    case 'list':
      console.log(chalk.blue('📋 fxp list - List Templates\n'));
      console.log(chalk.cyan('Usage:'));
      console.log(chalk.white('  fxp list [options]'));
      console.log(chalk.cyan('\nOptions:'));
      console.log(chalk.white('  -f, --framework <fw>       ') + chalk.gray('Filter by framework'));
      console.log(chalk.cyan('\nExamples:'));
      console.log(chalk.white('  fxp list'));
      console.log(chalk.white('  fxp list --framework esx'));
      break;

    case 'install':
      console.log(chalk.blue('📦 fxp install - Global Installation\n'));
      console.log(chalk.cyan('Usage:'));
      console.log(chalk.white('  fxp install'));
      console.log(chalk.cyan('\nDescription:'));
      console.log(chalk.gray('Installs FXP CLI globally on your system so you can use'));
      console.log(chalk.gray('the "fxp" command from anywhere in your terminal.'));
      break;

    case 'uninstall':
      console.log(chalk.blue('🗑️  fxp uninstall - Remove Installation\n'));
      console.log(chalk.cyan('Usage:'));
      console.log(chalk.white('  fxp uninstall'));
      console.log(chalk.cyan('\nDescription:'));
      console.log(chalk.gray('Removes FXP CLI from your system completely.'));
      break;

    case 'update':
      console.log(chalk.blue('🔄 fxp update - Update CLI\n'));
      console.log(chalk.cyan('Usage:'));
      console.log(chalk.white('  fxp update [options]'));
      console.log(chalk.cyan('\nOptions:'));
      console.log(chalk.white('  --force                    ') + chalk.gray('Force update even if already latest'));
      console.log(chalk.cyan('\nDescription:'));
      console.log(chalk.gray('Automatically downloads and installs the latest version'));
      console.log(chalk.gray('of FXP CLI from GitHub releases.'));
      break;

    default:
      console.log(chalk.red(`❌ Unknown command: ${command}`));
      console.log(chalk.gray('Use "fxp help" to see all available commands.'));
  }
}

module.exports = { showHelp };
