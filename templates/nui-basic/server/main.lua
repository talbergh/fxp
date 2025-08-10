-- NUI Server-side handler
local resourceName = GetCurrentResourceName()

print(('🖥️ %s NUI server loaded'):format(resourceName))

-- Handle test actions from NUI
RegisterNetEvent(resourceName .. ':testAction', function(data)
    local source = source
    local playerName = GetPlayerName(source)
    
    print(('Player %s (%d) triggered test action: %s'):format(
        playerName, source, data.message or 'No message'
    ))
    
    -- Example: Send back to client
    TriggerClientEvent(resourceName .. ':showNotification', source, {
        title = 'Server Response',
        message = 'Action received by server!',
        type = 'success'
    })
end)

-- Command to open NUI for specific player (admin only)
RegisterCommand(resourceName .. ':open', function(source, args)
    local targetId = tonumber(args[1])
    
    if not targetId then
        targetId = source
    end
    
    if targetId == 0 then -- Console
        print('Cannot open NUI for console')
        return
    end
    
    TriggerClientEvent(resourceName .. ':openNUI', targetId)
    
    if source ~= targetId then
        print(('Opened NUI for player %d'):format(targetId))
    end
end, true) -- Restricted to admins

-- Example: Periodic server data update
CreateThread(function()
    while true do
        Wait(30000) -- Every 30 seconds
        
        local playerCount = #GetPlayers()
        
        -- Send update to all players with NUI open
        TriggerClientEvent(resourceName .. ':serverUpdate', -1, {
            playerCount = playerCount,
            timestamp = os.time()
        })
    end
end)

-- Export functions for other resources
exports('openPlayerNUI', function(playerId)
    TriggerClientEvent(resourceName .. ':openNUI', playerId)
end)

exports('closePlayerNUI', function(playerId)
    TriggerClientEvent(resourceName .. ':closeNUI', playerId)
end)
