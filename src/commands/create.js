const inquirer = require('inquirer');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs-extra');
const ora = require('ora');
const { execSync } = require('child_process');
const { getTemplates, copyTemplate } = require('../utils/templates');
const { validateResourceName } = require('../utils/validation');

async function createResource(name, options) {
  try {
    console.log(chalk.blue('🚀 Creating new FiveM/RedM resource...\n'));

    // Get resource name if not provided
    if (!name) {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'resourceName',
          message: 'Resource name:',
          validate: validateResourceName
        }
      ]);
      name = answers.resourceName;
    } else {
      // Validate provided name
      const validation = validateResourceName(name);
      if (validation !== true) {
        console.error(chalk.red('❌ Invalid resource name:'), validation);
        process.exit(1);
      }
    }

    // Get available templates
    const templates = getTemplates();
    
    // Interactive template selection if not provided
    let selectedTemplate = options.template;
    let selectedFramework = options.framework;

    if (!selectedTemplate) {
      const templateChoices = Object.keys(templates).map(key => ({
        name: `${templates[key].name} - ${templates[key].description}`,
        value: key
      }));

      const templateAnswer = await inquirer.prompt([
        {
          type: 'list',
          name: 'template',
          message: 'Select a template:',
          choices: templateChoices
        }
      ]);
      selectedTemplate = templateAnswer.template;
    }

    // Framework selection if template supports it
    const templateConfig = templates[selectedTemplate];
    if (!selectedFramework && templateConfig.frameworks && templateConfig.frameworks.length > 0) {
      const frameworkAnswer = await inquirer.prompt([
        {
          type: 'list',
          name: 'framework',
          message: 'Select framework:',
          choices: templateConfig.frameworks.map(fw => ({
            name: fw.charAt(0).toUpperCase() + fw.slice(1),
            value: fw
          }))
        }
      ]);
      selectedFramework = frameworkAnswer.framework;
    }

    // Additional configuration
    const configAnswers = await inquirer.prompt([
      {
        type: 'input',
        name: 'description',
        message: 'Resource description:',
        default: `A ${templateConfig.name} resource for FiveM/RedM`
      },
      {
        type: 'input',
        name: 'author',
        message: 'Author:',
        default: 'talbergh'
      },
      {
        type: 'confirm',
        name: 'useOxLib',
        message: 'Use ox_lib? (recommended)',
        default: true,
        when: () => templateConfig.type === 'fivem'
      },
      {
        type: 'confirm',
        name: 'useOxMySQL',
        message: 'Use oxmysql?',
        default: false,
        when: (answers) => answers.useOxLib !== false
      }
    ]);

    // Create resource directory
    const resourcePath = path.join(process.cwd(), name);
    
    if (await fs.pathExists(resourcePath)) {
      console.error(chalk.red('❌ Directory already exists:'), resourcePath);
      process.exit(1);
    }

    const spinner = ora('Creating resource...').start();

    try {
      // Copy template files
      await copyTemplate(selectedTemplate, resourcePath, {
        name,
        framework: selectedFramework,
        description: configAnswers.description,
        author: configAnswers.author,
        useOxLib: configAnswers.useOxLib,
        useOxMySQL: configAnswers.useOxMySQL
      });

      spinner.succeed('Resource created successfully!');

      // Install dependencies if requested
      if (options.install !== false && await fs.pathExists(path.join(resourcePath, 'package.json'))) {
        const installSpinner = ora('Installing dependencies...').start();
        try {
          execSync('npm install', { cwd: resourcePath, stdio: 'pipe' });
          installSpinner.succeed('Dependencies installed!');
        } catch (error) {
          installSpinner.fail('Failed to install dependencies');
          console.log(chalk.yellow('💡 You can install them manually with: npm install'));
        }
      }

      // Success message
      console.log(chalk.green('\n✅ Resource created successfully!'));
      console.log(chalk.gray(`📁 Location: ${resourcePath}`));
      console.log(chalk.gray(`🎨 Template: ${templateConfig.name}`));
      if (selectedFramework) {
        console.log(chalk.gray(`🔧 Framework: ${selectedFramework}`));
      }
      
      console.log(chalk.blue('\n📝 Next steps:'));
      console.log(chalk.white(`   cd ${name}`));
      if (await fs.pathExists(path.join(resourcePath, 'package.json'))) {
        console.log(chalk.white('   npm install'));
        console.log(chalk.white('   npm run dev'));
      }
      console.log(chalk.white('   Start coding! 🚀'));

    } catch (error) {
      spinner.fail('Failed to create resource');
      throw error;
    }

  } catch (error) {
    console.error(chalk.red('❌ Error creating resource:'), error.message);
    if (options.verbose) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

module.exports = { createResource };
