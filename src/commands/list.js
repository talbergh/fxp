const chalk = require('chalk');
const { getTemplates } = require('../utils/templates');

async function listTemplates(options) {
  try {
    console.log(chalk.blue('📋 Available Templates\n'));

    const templates = getTemplates();
    const framework = options.framework;

    // Filter by framework if specified
    const filteredTemplates = framework 
      ? Object.keys(templates).filter(key => 
          templates[key].frameworks && templates[key].frameworks.includes(framework)
        )
      : Object.keys(templates);

    if (filteredTemplates.length === 0) {
      console.log(chalk.yellow(`No templates found${framework ? ` for framework: ${framework}` : ''}`));
      return;
    }

    // Group templates by type
    const grouped = {
      fivem: [],
      redm: [],
      universal: []
    };

    filteredTemplates.forEach(key => {
      const template = templates[key];
      const type = template.type || 'universal';
      grouped[type].push({ key, ...template });
    });

    // Display templates
    Object.keys(grouped).forEach(type => {
      if (grouped[type].length === 0) return;

      console.log(chalk.cyan(`\n${type.toUpperCase()} Templates:`));
      console.log(chalk.gray('─'.repeat(40)));

      grouped[type].forEach(template => {
        console.log(chalk.white(`📦 ${template.name}`));
        console.log(chalk.gray(`   ${template.description}`));
        if (template.frameworks && template.frameworks.length > 0) {
          console.log(chalk.blue(`   Frameworks: ${template.frameworks.join(', ')}`));
        }
        if (template.features && template.features.length > 0) {
          console.log(chalk.green(`   Features: ${template.features.join(', ')}`));
        }
        console.log();
      });
    });

    console.log(chalk.blue('\n🚀 Usage:'));
    console.log(chalk.white('   fxp create my-resource --template <template-name>'));
    console.log(chalk.white('   fxp create my-resource --framework <framework>'));

  } catch (error) {
    console.error(chalk.red('❌ Error listing templates:'), error.message);
    process.exit(1);
  }
}

module.exports = { listTemplates };
