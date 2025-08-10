const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

function getTemplatesPath() {
  // Check if running from development or packaged binary
  const isDev = __filename.includes('node_modules') === false && process.env.NODE_ENV !== 'production';
  
  if (isDev) {
    return path.join(__dirname, '..', '..', 'templates');
  } else {
    // For packaged binary, templates are included in the assets
    return path.join(process.cwd(), 'templates');
  }
}

function getTemplates() {
  return {
    'basic-fivem': {
      name: 'Basic FiveM',
      description: 'Simple FiveM resource with client/server structure',
      type: 'fivem',
      frameworks: ['standalone'],
      features: ['Client/Server scripts', 'fxmanifest.lua', 'Basic structure']
    },
    'esx-basic': {
      name: 'ESX Basic',
      description: 'ESX framework compatible resource',
      type: 'fivem',
      frameworks: ['esx'],
      features: ['ESX integration', 'Database ready', 'Locales support']
    },
    'esx-shop': {
      name: 'ESX Shop',
      description: 'Complete shop system for ESX',
      type: 'fivem',
      frameworks: ['esx'],
      features: ['Shop UI', 'Item management', 'Economy integration', 'Admin panel']
    },
    'qb-basic': {
      name: 'QB-Core Basic',
      description: 'QB-Core framework compatible resource',
      type: 'fivem',
      frameworks: ['qb-core', 'qbox'],
      features: ['QB-Core integration', 'Player data', 'Event system']
    },
    'qb-job': {
      name: 'QB-Core Job',
      description: 'Complete job system for QB-Core',
      type: 'fivem',
      frameworks: ['qb-core', 'qbox'],
      features: ['Job mechanics', 'Duty system', 'Boss menu', 'Payment system']
    },
    'redm-basic': {
      name: 'RedM Basic',
      description: 'Basic RedM resource structure',
      type: 'redm',
      frameworks: ['standalone'],
      features: ['RedM compatible', 'Client/Server scripts', 'Native support']
    },
    'redm-rsg': {
      name: 'RedM RSG',
      description: 'RSG framework compatible resource',
      type: 'redm',
      frameworks: ['rsg'],
      features: ['RSG integration', 'Character system', 'Economy support']
    },
    'ui-nui': {
      name: 'NUI Interface',
      description: 'Modern NUI interface with HTML/CSS/JS',
      type: 'fivem',
      frameworks: ['standalone', 'esx', 'qb-core'],
      features: ['Modern UI', 'Responsive design', 'Dark theme', 'CEF optimized']
    }
  };
}

async function copyTemplate(templateName, targetPath, config) {
  try {
    const templates = getTemplates();
    const template = templates[templateName];
    
    if (!template) {
      throw new Error(`Template "${templateName}" not found`);
    }

    const templatesPath = getTemplatesPath();
    const sourcePath = path.join(templatesPath, templateName);

    // Check if template directory exists
    if (!await fs.pathExists(sourcePath)) {
      // Create template on the fly for basic templates
      await createTemplateOnTheFly(templateName, targetPath, config);
      return;
    }

    // Copy template files
    await fs.copy(sourcePath, targetPath);

    // Process template files (replace placeholders)
    await processTemplateFiles(targetPath, config);

  } catch (error) {
    throw new Error(`Failed to copy template: ${error.message}`);
  }
}

async function createTemplateOnTheFly(templateName, targetPath, config) {
  // Create basic template structure for common templates
  await fs.ensureDir(targetPath);

  switch (templateName) {
    case 'basic-fivem':
      await createBasicFiveMTemplate(targetPath, config);
      break;
    case 'esx-basic':
      await createESXBasicTemplate(targetPath, config);
      break;
    case 'qb-basic':
      await createQBBasicTemplate(targetPath, config);
      break;
    case 'redm-basic':
      await createRedMBasicTemplate(targetPath, config);
      break;
    case 'ui-nui':
      await createNUITemplate(targetPath, config);
      break;
    default:
      await createBasicFiveMTemplate(targetPath, config);
  }
}

async function createBasicFiveMTemplate(targetPath, config) {
  // fxmanifest.lua
  const fxmanifest = `fx_version 'cerulean'
game 'gta5'

name '${config.name}'
description '${config.description}'
author '${config.author}'
version '1.0.0'

shared_scripts {
    ${config.useOxLib ? "'@ox_lib/init.lua'," : ''}
}

client_scripts {
    'client/*.lua'
}

server_scripts {
    ${config.useOxMySQL ? "'@oxmysql/lib/MySQL.lua'," : ''}
    'server/*.lua'
}

files {
    'locales/*.json'
}

${config.useOxLib ? "lua54 'yes'" : ''}
`;

  await fs.writeFile(path.join(targetPath, 'fxmanifest.lua'), fxmanifest);

  // Client script
  const clientScript = `-- ${config.name} Client Script
-- Author: ${config.author}

${config.useOxLib ? "local ox_lib = exports.ox_lib" : ''}

-- Event Handlers
RegisterNetEvent('${config.name}:client:example', function(data)
    print('Client event received:', json.encode(data))
end)

-- Key Mapping (Optional)
RegisterKeyMapping('${config.name}', 'Open ${config.name}', 'keyboard', 'F6')

-- Command Handler
RegisterCommand('${config.name}', function(source, args, rawCommand)
    -- Your code here
    ${config.useOxLib ? "ox_lib:notify({type = 'info', description = 'Command executed!'})" : "print('Command executed!')"}
end, false)

-- Initialize
CreateThread(function()
    print('^2[${config.name}]^7 Client script loaded')
end)
`;

  await fs.ensureDir(path.join(targetPath, 'client'));
  await fs.writeFile(path.join(targetPath, 'client', 'main.lua'), clientScript);

  // Server script
  const serverScript = `-- ${config.name} Server Script
-- Author: ${config.author}

${config.useOxMySQL ? "local MySQL = exports.oxmysql" : ''}

-- Event Handlers
RegisterNetEvent('${config.name}:server:example', function(data)
    local source = source
    print('Server event received from player:', source, json.encode(data))
    
    -- Trigger client event back
    TriggerClientEvent('${config.name}:client:example', source, {
        message = 'Response from server'
    })
end)

-- Server Commands
RegisterCommand('${config.name}admin', function(source, args, rawCommand)
    local xPlayer = source
    
    -- Admin check here
    if source == 0 then -- Console
        print('Admin command executed from console')
    else
        print('Admin command executed by player:', source)
    end
end, true)

-- Resource Start
AddEventHandler('onResourceStart', function(resourceName)
    if GetCurrentResourceName() == resourceName then
        print('^2[${config.name}]^7 Server script loaded')
        
        ${config.useOxMySQL ? `
        -- Database initialization example
        MySQL.ready(function()
            MySQL.query([[
                CREATE TABLE IF NOT EXISTS \`${config.name}_data\` (
                    \`id\` int(11) NOT NULL AUTO_INCREMENT,
                    \`identifier\` varchar(60) NOT NULL,
                    \`data\` longtext NOT NULL,
                    \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    PRIMARY KEY (\`id\`),
                    UNIQUE KEY \`identifier\` (\`identifier\`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            ]])
        end)
        ` : '-- No database setup'}
    end
end)
`;

  await fs.ensureDir(path.join(targetPath, 'server'));
  await fs.writeFile(path.join(targetPath, 'server', 'main.lua'), serverScript);

  // Locales
  const locales = {
    "command_usage": "Usage: /%s [args]",
    "command_executed": "Command executed successfully",
    "error_occurred": "An error occurred",
    "success": "Success!"
  };

  await fs.ensureDir(path.join(targetPath, 'locales'));
  await fs.writeFile(path.join(targetPath, 'locales', 'en.json'), JSON.stringify(locales, null, 2));

  // README
  const readme = `# ${config.name}

${config.description}

## Installation

1. Download and extract to your resources folder
2. Add \`ensure ${config.name}\` to your server.cfg
3. Restart your server

## Usage

- Use \`/${config.name}\` command in-game
- Press F6 to open (configurable)

## Configuration

Edit the configuration in the script files as needed.

## Support

For support, please open an issue on GitHub.

## License

This project is licensed under the MIT License.
`;

  await fs.writeFile(path.join(targetPath, 'README.md'), readme);
}

async function createESXBasicTemplate(targetPath, config) {
  // Start with basic template
  await createBasicFiveMTemplate(targetPath, config);

  // Modify for ESX
  const fxmanifest = `fx_version 'cerulean'
game 'gta5'

name '${config.name}'
description '${config.description}'
author '${config.author}'
version '1.0.0'

shared_scripts {
    '@es_extended/imports.lua',
    ${config.useOxLib ? "'@ox_lib/init.lua'," : ''}
    'config.lua'
}

client_scripts {
    'client/*.lua'
}

server_scripts {
    ${config.useOxMySQL ? "'@oxmysql/lib/MySQL.lua'," : ''}
    'server/*.lua'
}

dependencies {
    'es_extended'${config.useOxLib ? ",\n    'ox_lib'" : ''}${config.useOxMySQL ? ",\n    'oxmysql'" : ''}
}

${config.useOxLib ? "lua54 'yes'" : ''}
`;

  await fs.writeFile(path.join(targetPath, 'fxmanifest.lua'), fxmanifest);

  // ESX Config
  const esxConfig = `Config = {}

Config.Locale = 'en'
Config.UseESXNotify = true
Config.EnableDebug = false

-- Add your configuration options here
Config.Settings = {
    enableFeature = true,
    maxAmount = 100,
    cooldown = 5000 -- milliseconds
}
`;

  await fs.writeFile(path.join(targetPath, 'config.lua'), esxConfig);
}

async function createQBBasicTemplate(targetPath, config) {
  // Start with basic template
  await createBasicFiveMTemplate(targetPath, config);

  // Modify for QB-Core
  const fxmanifest = `fx_version 'cerulean'
game 'gta5'

name '${config.name}'
description '${config.description}'
author '${config.author}'
version '1.0.0'

shared_scripts {
    ${config.useOxLib ? "'@ox_lib/init.lua'," : ''}
    'config.lua'
}

client_scripts {
    'client/*.lua'
}

server_scripts {
    ${config.useOxMySQL ? "'@oxmysql/lib/MySQL.lua'," : ''}
    'server/*.lua'
}

dependencies {
    'qb-core'${config.useOxLib ? ",\n    'ox_lib'" : ''}${config.useOxMySQL ? ",\n    'oxmysql'" : ''}
}

${config.useOxLib ? "lua54 'yes'" : ''}
`;

  await fs.writeFile(path.join(targetPath, 'fxmanifest.lua'), fxmanifest);

  // QB Config
  const qbConfig = `Config = {}

Config.UseTarget = GetConvar('UseTarget', 'false') == 'true'
Config.Debug = false

-- Add your configuration options here
Config.Settings = {
    enableFeature = true,
    maxAmount = 100,
    cooldown = 5000 -- milliseconds
}
`;

  await fs.writeFile(path.join(targetPath, 'config.lua'), qbConfig);
}

async function createRedMBasicTemplate(targetPath, config) {
  // fxmanifest.lua for RedM
  const fxmanifest = `fx_version 'cerulean'
game 'rdr3'
rdr3_warning 'I acknowledge that this is a prerelease build of RedM, and I am aware my resources *will* become incompatible once RedM ships.'

name '${config.name}'
description '${config.description}'
author '${config.author}'
version '1.0.0'

client_scripts {
    'client/*.lua'
}

server_scripts {
    'server/*.lua'
}

files {
    'locales/*.json'
}
`;

  await fs.writeFile(path.join(targetPath, 'fxmanifest.lua'), fxmanifest);

  // RedM Client script
  const clientScript = `-- ${config.name} RedM Client Script
-- Author: ${config.author}

-- RedM specific initialization
CreateThread(function()
    print('^2[${config.name}]^7 RedM client script loaded')
end)

-- Event Handlers
RegisterNetEvent('${config.name}:client:example', function(data)
    print('Client event received:', json.encode(data))
end)

-- Key Mapping
RegisterKeyMapping('${config.name}', 'Open ${config.name}', 'keyboard', 'F6')

-- Command Handler
RegisterCommand('${config.name}', function(source, args, rawCommand)
    -- Your RedM code here
    print('RedM command executed!')
end, false)
`;

  await fs.ensureDir(path.join(targetPath, 'client'));
  await fs.writeFile(path.join(targetPath, 'client', 'main.lua'), clientScript);

  // RedM Server script
  const serverScript = `-- ${config.name} RedM Server Script
-- Author: ${config.author}

-- Event Handlers
RegisterNetEvent('${config.name}:server:example', function(data)
    local source = source
    print('Server event received from player:', source, json.encode(data))
    
    TriggerClientEvent('${config.name}:client:example', source, {
        message = 'Response from RedM server'
    })
end)

-- Resource Start
AddEventHandler('onResourceStart', function(resourceName)
    if GetCurrentResourceName() == resourceName then
        print('^2[${config.name}]^7 RedM server script loaded')
    end
end)
`;

  await fs.ensureDir(path.join(targetPath, 'server'));
  await fs.writeFile(path.join(targetPath, 'server', 'main.lua'), serverScript);
}

async function createNUITemplate(targetPath, config) {
  // Start with basic template
  await createBasicFiveMTemplate(targetPath, config);

  // Add NUI to fxmanifest
  const fxmanifest = `fx_version 'cerulean'
game 'gta5'

name '${config.name}'
description '${config.description}'
author '${config.author}'
version '1.0.0'

ui_page 'html/index.html'

files {
    'html/index.html',
    'html/style.css',
    'html/script.js',
    'html/assets/*'
}

shared_scripts {
    ${config.useOxLib ? "'@ox_lib/init.lua'," : ''}
}

client_scripts {
    'client/*.lua'
}

server_scripts {
    'server/*.lua'
}

${config.useOxLib ? "lua54 'yes'" : ''}
`;

  await fs.writeFile(path.join(targetPath, 'fxmanifest.lua'), fxmanifest);

  // Create HTML structure
  await fs.ensureDir(path.join(targetPath, 'html'));
  await fs.ensureDir(path.join(targetPath, 'html', 'assets'));

  // HTML
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.name}</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="app" class="hidden">
        <div class="container">
            <div class="header">
                <h1>${config.name}</h1>
                <button id="closeBtn" class="close-btn">&times;</button>
            </div>
            <div class="content">
                <p>Welcome to ${config.name}!</p>
                <div class="actions">
                    <button id="exampleBtn" class="btn btn-primary">Example Action</button>
                </div>
            </div>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>`;

  await fs.writeFile(path.join(targetPath, 'html', 'index.html'), html);

  // CSS (Dark theme)
  const css = `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', sans-serif;
    background: transparent;
    color: #C1C2C5;
    overflow: hidden;
}

.hidden {
    display: none;
}

#app {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(20, 21, 23, 0.75);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.container {
    background: #141517;
    border-radius: 12px;
    padding: 2rem;
    min-width: 400px;
    max-width: 600px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid #2c2e33;
    padding-bottom: 1rem;
}

.header h1 {
    color: #fff;
    font-size: 1.5rem;
    font-weight: 600;
}

.close-btn {
    background: none;
    border: none;
    color: #C1C2C5;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 4px;
    transition: background 0.2s ease;
}

.close-btn:hover {
    background: #2c2e33;
    color: #fff;
}

.content {
    margin-bottom: 1rem;
}

.content p {
    margin-bottom: 1.5rem;
    line-height: 1.6;
}

.actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
}

.btn {
    padding: 0.6rem 1.2rem;
    border: none;
    border-radius: 8px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background 0.2s ease;
    font-weight: 500;
}

.btn-primary {
    background: #228be6;
    color: #fff;
}

.btn-primary:hover {
    background: #1c7ed6;
}

/* Responsive */
@media (max-width: 768px) {
    .container {
        margin: 1rem;
        padding: 1.5rem;
        min-width: auto;
    }
    
    .actions {
        justify-content: center;
    }
    
    .btn {
        flex: 1;
    }
}
`;

  await fs.writeFile(path.join(targetPath, 'html', 'style.css'), css);

  // JavaScript
  const js = `// ${config.name} NUI Script
// Author: ${config.author}

const app = document.getElementById('app');
const closeBtn = document.getElementById('closeBtn');
const exampleBtn = document.getElementById('exampleBtn');

// Event Listeners
closeBtn.addEventListener('click', closeUI);
exampleBtn.addEventListener('click', handleExampleAction);

// ESC key handler
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeUI();
    }
});

// NUI Message Handler
window.addEventListener('message', function(event) {
    const data = event.data;
    
    switch (data.action) {
        case 'show':
            showUI(data.data);
            break;
        case 'hide':
            hideUI();
            break;
        case 'update':
            updateUI(data.data);
            break;
    }
});

// UI Functions
function showUI(data = {}) {
    app.classList.remove('hidden');
    document.body.style.cursor = 'default';
}

function hideUI() {
    app.classList.add('hidden');
    document.body.style.cursor = 'none';
}

function closeUI() {
    hideUI();
    // Notify game script
    fetch(\`https://\${GetParentResourceName()}/close\`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({})
    });
}

function updateUI(data) {
    // Update UI elements with new data
    console.log('Updating UI with:', data);
}

function handleExampleAction() {
    // Send data to game script
    fetch(\`https://\${GetParentResourceName()}/example-action\`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
            action: 'example',
            timestamp: Date.now()
        })
    });
}

// Utility function to get resource name
function GetParentResourceName() {
    return window.location.hostname;
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('${config.name} NUI loaded');
});
`;

  await fs.writeFile(path.join(targetPath, 'html', 'script.js'), js);

  // Update client script for NUI
  const nuiClientScript = `-- ${config.name} NUI Client Script
-- Author: ${config.author}

local isUIOpen = false

-- NUI Callbacks
RegisterNUICallback('close', function(data, cb)
    closeUI()
    cb('ok')
end)

RegisterNUICallback('example-action', function(data, cb)
    print('Example action triggered:', json.encode(data))
    
    -- Handle the action here
    TriggerServerEvent('${config.name}:server:example', data)
    
    cb('ok')
end)

-- UI Functions
function openUI(data)
    if isUIOpen then return end
    
    isUIOpen = true
    SetNuiFocus(true, true)
    
    SendNUIMessage({
        action = 'show',
        data = data or {}
    })
end

function closeUI()
    if not isUIOpen then return end
    
    isUIOpen = false
    SetNuiFocus(false, false)
    
    SendNUIMessage({
        action = 'hide'
    })
end

-- Event Handlers
RegisterNetEvent('${config.name}:client:openUI', function(data)
    openUI(data)
end)

RegisterNetEvent('${config.name}:client:closeUI', function()
    closeUI()
end)

RegisterNetEvent('${config.name}:client:updateUI', function(data)
    if isUIOpen then
        SendNUIMessage({
            action = 'update',
            data = data
        })
    end
end)

-- Command
RegisterCommand('${config.name}', function(source, args, rawCommand)
    openUI()
end, false)

-- Key Mapping
RegisterKeyMapping('${config.name}', 'Open ${config.name}', 'keyboard', 'F6')

-- Initialize
CreateThread(function()
    print('^2[${config.name}]^7 NUI client script loaded')
end)
`;

  await fs.writeFile(path.join(targetPath, 'client', 'main.lua'), nuiClientScript);
}

async function processTemplateFiles(targetPath, config) {
  // This function would process template files and replace placeholders
  // For now, we create templates on-the-fly, so this is not needed
  // But you could implement file processing logic here
}

module.exports = {
  getTemplates,
  copyTemplate,
  getTemplatesPath
};
