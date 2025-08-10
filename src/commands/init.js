import fs from 'node:fs';
import path from 'node:path';
import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';

export default async function initCmd(opts = {}) {
  const cwd = process.cwd();
  const spinner = ora('Initializing resource').start();

  try {
    // Check if directory is empty or has existing files
    const files = fs.readdirSync(cwd);
    const hasManifest = files.includes('fxmanifest.lua');
    const isEmpty = files.length === 0;

    let mode = 'init'; // init existing folder vs create new project
    
    if (isEmpty || (!hasManifest && !opts.yes)) {
      spinner.stop();
      const { projectMode } = await inquirer.prompt([{
        type: 'list',
        name: 'projectMode',
        message: 'What would you like to do?',
        choices: [
          { name: 'Initialize current folder as FiveM resource', value: 'init' },
          { name: 'Create new project structure', value: 'create' }
        ],
        default: isEmpty ? 'create' : 'init'
      }]);
      mode = projectMode;
      spinner.start();
    }

    const defaults = {
      name: path.basename(cwd),
      author: 'Talbergh',
      description: 'A FiveM resource',
      version: '0.1.0',
      game: 'gta5',
      scriptType: 'lua'
    };

    let answers = defaults;
    if (!opts.yes) {
      spinner.stop();
      const questions = [
        { name: 'name', message: 'Resource name:', default: defaults.name },
        { name: 'author', message: 'Author:', default: defaults.author },
        { name: 'description', message: 'Description:', default: defaults.description },
        { name: 'version', message: 'Version:', default: defaults.version },
        { 
          type: 'list',
          name: 'game', 
          message: 'Target game:', 
          choices: ['gta5', 'rdr3'], 
          default: defaults.game 
        }
      ];

      if (mode === 'create') {
        questions.push({
          type: 'list',
          name: 'scriptType',
          message: 'Scripting language:',
          choices: ['lua', 'javascript'],
          default: 'lua'
        });
      }

      answers = await inquirer.prompt(questions);
      spinner.start('Initializing resource');
    }

    const fxmanifest = generateManifest(answers);

    // Ensure folders
    const dirs = ['client', 'server', 'shared'];
    for (const d of dirs) {
      const p = path.join(cwd, d);
      if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
    }

    const manifestPath = path.join(cwd, 'fxmanifest.lua');
    fs.writeFileSync(manifestPath, fxmanifest, 'utf8');

    // Starter files
    if (mode === 'create') {
      createStarterFiles(cwd, answers);
    } else {
      // Only create if they don't exist
      const clientMain = answers.scriptType === 'lua' ? 'main.lua' : 'main.js';
      const serverMain = answers.scriptType === 'lua' ? 'main.lua' : 'main.js';
      
      const clientPath = path.join(cwd, 'client', clientMain);
      const serverPath = path.join(cwd, 'server', serverMain);
      
      if (!fs.existsSync(clientPath)) {
        fs.writeFileSync(clientPath, getStarterCode('client', answers.scriptType), 'utf8');
      }
      if (!fs.existsSync(serverPath)) {
        fs.writeFileSync(serverPath, getStarterCode('server', answers.scriptType), 'utf8');
      }
    }

    spinner.succeed(`${mode === 'create' ? 'Created' : 'Initialized'} resource '${answers.name}' in ${cwd}`);
    console.log(chalk.gray('Created fxmanifest.lua, client/, server/, shared/.'));
    
    if (mode === 'create') {
      console.log(chalk.green('\nNext steps:'));
      console.log(chalk.gray('- Edit fxmanifest.lua to add dependencies'));
      console.log(chalk.gray('- Start coding in client/ and server/'));
      console.log(chalk.gray('- Use "fxp export" to package for distribution'));
    }
  } catch (e) {
    spinner.fail('Failed to initialize resource');
    throw e;
  }
}

function generateManifest(answers) {
  const gameDecl = answers.game === 'rdr3' ? "games { 'rdr3' }" : "game 'gta5'";
  
  return `fx_version 'cerulean'
${gameDecl}

author '${answers.author}'
description '${answers.description}'
version '${answers.version}'

-- Modern FiveM features
lua54 'yes'
use_experimental_fxv2_oal 'yes'

client_scripts {
  'client/**/*.*'
}

server_scripts {
  'server/**/*.*'
}

shared_scripts {
  'shared/**/*.*'
}

-- Dependencies (uncomment as needed)
-- dependencies {
--   'ox_lib',
--   'ox_target'
-- }

-- Files for download to client
-- files {
--   'web/**/*.*'
-- }

-- NUI page (uncomment if using web UI)
-- ui_page 'web/index.html'
`;
}

function createStarterFiles(cwd, answers) {
  const isLua = answers.scriptType === 'lua';
  const ext = isLua ? 'lua' : 'js';
  
  // Client starter
  const clientCode = isLua ? `
print('${answers.name} client started')

-- Example: Register a key mapping
-- RegisterKeyMapping('${answers.name}:test', 'Test ${answers.name}', 'keyboard', 'F5')

-- Example: Key handler
-- RegisterCommand('${answers.name}:test', function()
--     TriggerEvent('chat:addMessage', {
--         color = { 255, 0, 0},
--         multiline = true,
--         args = {"${answers.name}", "Test command executed!"}
--     })
-- end, false)

-- Example: Server event listener
-- RegisterNetEvent('${answers.name}:clientEvent', function(data)
--     print('Received from server:', json.encode(data))
-- end)
` : `
console.log('${answers.name} client started');

// Example: Register key mapping
// RegisterKeyMapping('${answers.name}:test', 'Test ${answers.name}', 'keyboard', 'F5');

// Example: Command handler
// RegisterCommand('${answers.name}:test', () => {
//     emit('chat:addMessage', {
//         color: [255, 0, 0],
//         multiline: true,
//         args: ['${answers.name}', 'Test command executed!']
//     });
// }, false);

// Example: Server event listener
// onNet('${answers.name}:clientEvent', (data) => {
//     console.log('Received from server:', data);
// });
`;

  // Server starter
  const serverCode = isLua ? `
print('${answers.name} server started')

-- Example: Chat command
-- RegisterCommand('${answers.name}test', function(source, args, rawCommand)
--     local player = source
--     TriggerClientEvent('chat:addMessage', player, {
--         color = { 0, 255, 0},
--         multiline = true,
--         args = {"${answers.name}", "Server says hello!"}
--     })
-- end, false)

-- Example: Client event trigger
-- RegisterNetEvent('${answers.name}:serverEvent', function(data)
--     local player = source
--     print('Player ' .. player .. ' sent:', json.encode(data))
--     TriggerClientEvent('${answers.name}:clientEvent', player, { response = 'Got it!' })
-- end)
` : `
console.log('${answers.name} server started');

// Example: Chat command
// RegisterCommand('${answers.name}test', (source, args, rawCommand) => {
//     const player = source;
//     emitNet('chat:addMessage', player, {
//         color: [0, 255, 0],
//         multiline: true,
//         args: ['${answers.name}', 'Server says hello!']
//     });
// }, false);

// Example: Client event handler
// onNet('${answers.name}:serverEvent', (data) => {
//     const player = source;
//     console.log(\`Player \${player} sent:\`, data);
//     emitNet('${answers.name}:clientEvent', player, { response: 'Got it!' });
// });
`;

  // Shared starter
  const sharedCode = isLua ? `
-- Shared configuration for ${answers.name}

Config = {}

Config.Debug = false
Config.Version = '${answers.version}'

-- Example shared function
function Config.Log(message)
    if Config.Debug then
        print('[${answers.name}]', message)
    end
end
` : `
// Shared configuration for ${answers.name}

const Config = {};

Config.Debug = false;
Config.Version = '${answers.version}';

// Example shared function
Config.Log = function(message) {
    if (Config.Debug) {
        console.log('[${answers.name}]', message);
    }
};

// Export for both client and server
if (typeof exports !== 'undefined') {
    exports.Config = Config;
} else {
    global.Config = Config;
}
`;

  fs.writeFileSync(path.join(cwd, 'client', `main.${ext}`), clientCode, 'utf8');
  fs.writeFileSync(path.join(cwd, 'server', `main.${ext}`), serverCode, 'utf8');
  fs.writeFileSync(path.join(cwd, 'shared', `config.${ext}`), sharedCode, 'utf8');
}

function getStarterCode(side, scriptType) {
  const isLua = scriptType === 'lua';
  if (isLua) {
    return side === 'client' 
      ? "print('FXP client loaded')\n" 
      : "print('FXP server loaded')\n";
  } else {
    return side === 'client'
      ? "console.log('FXP client loaded');\n"
      : "console.log('FXP server loaded');\n";
  }
}
