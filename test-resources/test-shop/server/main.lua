-- test-shop Server Script
-- Author: talbergh



-- Event Handlers
RegisterNetEvent('test-shop:server:example', function(data)
    local source = source
    print('Server event received from player:', source, json.encode(data))
    
    -- Trigger client event back
    TriggerClientEvent('test-shop:client:example', source, {
        message = 'Response from server'
    })
end)

-- Server Commands
RegisterCommand('test-shopadmin', function(source, args, rawCommand)
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
        print('^2[test-shop]^7 Server script loaded')
        
        -- No database setup
    end
end)
