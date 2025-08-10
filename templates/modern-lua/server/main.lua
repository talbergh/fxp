-- Modern FiveM server with latest features
local resourceName = GetCurrentResourceName()

print(('🚀 %s server started'):format(resourceName))

-- Example: Modern chat command with permissions
lib.addCommand('spawn_test_ped', {
    help = 'Spawn a test ped near you',
    restricted = 'group.admin'
}, function(source)
    TriggerClientEvent(resourceName .. ':spawnTestPed', source)
end)

-- Example: Database interaction (assuming oxmysql)
-- local function savePlayerData(source, data)
--     local identifier = GetPlayerIdentifier(source, 0)
--     MySQL.insert('INSERT INTO player_data (identifier, data) VALUES (?, ?) ON DUPLICATE KEY UPDATE data = VALUES(data)', {
--         identifier, json.encode(data)
--     })
-- end

-- Example: Server-side notification trigger
RegisterNetEvent(resourceName .. ':requestNotification', function(message)
    local source = source
    TriggerClientEvent(resourceName .. ':showNotification', source, {
        title = 'Server Message',
        message = message,
        type = 'info'
    })
end)

-- Example: Player connecting event
AddEventHandler('playerConnecting', function(name, setKickReason, deferrals)
    local source = source
    local identifier = GetPlayerIdentifier(source, 0)
    
    deferrals.defer()
    deferrals.update('Checking player data...')
    
    -- Simulate async check
    CreateThread(function()
        Wait(1000) -- Simulate database lookup
        deferrals.done()
        print(('Player %s (%s) connected'):format(name, identifier))
    end)
end)

-- Example: Modern exports
exports('getResourceConfig', function()
    return Config
end)

-- Cleanup on resource restart
AddEventHandler('onResourceStop', function(resource)
    if resource == resourceName then
        print(('🛑 %s server stopped'):format(resourceName))
    end
end)
