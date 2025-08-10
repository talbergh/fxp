-- Shared configuration for NUI resource
Config = {}

Config.Debug = true
Config.Version = '0.1.0'
Config.ResourceName = GetCurrentResourceName and GetCurrentResourceName() or '__RESOURCE_NAME__'

-- NUI Settings
Config.NUI = {
    DefaultKeybind = 'F6',
    CloseOnEscape = true,
    EnableSounds = true,
    MaxUpdateInterval = 1000 -- ms
}

-- UI Themes
Config.Themes = {
    dark = {
        primary = '#228be6',
        background = '#141517',
        text = '#C1C2C5'
    },
    light = {
        primary = '#1c7ed6',
        background = '#ffffff',
        text = '#333333'
    }
}

-- Permissions
Config.Permissions = {
    UseNUI = 'all', -- 'all', 'admin', 'moderator', etc.
    AdminCommands = 'admin'
}

-- Utility functions
function Config.Log(message, ...)
    if not Config.Debug then return end
    
    local prefix = ('🎨 [%s NUI]'):format(Config.ResourceName)
    local msg = string.format(message, ...)
    print(('%s %s'):format(prefix, msg))
end

function Config.HasPermission(source, permission)
    -- Implement your permission system here
    -- This is a basic example
    if permission == 'all' then
        return true
    elseif permission == 'admin' then
        -- Check if player is admin
        return IsPlayerAceAllowed(source, 'command')
    end
    return false
end

-- Export config
if IsDuplicityVersion() then
    -- Server side
    exports('GetNUIConfig', function()
        return Config
    end)
else
    -- Client side
    exports('GetNUIConfig', function()
        return Config
    end)
end

Config.Log('NUI configuration loaded for %s v%s', Config.ResourceName, Config.Version)
