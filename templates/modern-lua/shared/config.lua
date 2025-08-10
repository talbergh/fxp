-- Shared configuration and utilities
Config = {}

Config.Debug = true
Config.Version = '0.1.0'
Config.ResourceName = GetCurrentResourceName and GetCurrentResourceName() or '__RESOURCE_NAME__'

-- Modern FiveM settings
Config.Framework = {
    UseOxLib = true,
    UseOxTarget = false,
    UseQBCore = false,
    UseESX = false
}

-- Example configuration
Config.Settings = {
    MaxDistance = 10.0,
    DefaultTimeout = 5000,
    EnableNotifications = true
}

-- Utility functions
function Config.Log(level, message, ...)
    if not Config.Debug and level == 'debug' then return end
    
    local prefix = ('🔧 [%s]'):format(Config.ResourceName)
    local msg = message
    
    if select('#', ...) > 0 then
        msg = string.format(message, ...)
    end
    
    if level == 'error' then
        print(('%s ❌ %s'):format(prefix, msg))
    elseif level == 'warn' then
        print(('%s ⚠️ %s'):format(prefix, msg))
    elseif level == 'info' then
        print(('%s ℹ️ %s'):format(prefix, msg))
    else
        print(('%s 🐛 %s'):format(prefix, msg))
    end
end

-- Modern vector math utilities
function Config.GetDistance(pos1, pos2)
    if type(pos1) == 'vector3' and type(pos2) == 'vector3' then
        return #(pos1 - pos2)
    else
        return math.sqrt(
            (pos1.x - pos2.x)^2 + 
            (pos1.y - pos2.y)^2 + 
            (pos1.z - pos2.z)^2
        )
    end
end

-- Validation helpers
function Config.IsValidCoords(coords)
    return coords and 
           type(coords.x) == 'number' and 
           type(coords.y) == 'number' and 
           type(coords.z) == 'number'
end

-- Export config for other resources
if IsDuplicityVersion() then
    -- Server side
    exports('GetConfig', function()
        return Config
    end)
else
    -- Client side  
    exports('GetConfig', function()
        return Config
    end)
end

Config.Log('info', 'Configuration loaded for %s v%s', Config.ResourceName, Config.Version)
