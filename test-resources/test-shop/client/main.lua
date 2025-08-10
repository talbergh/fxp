-- test-shop Client Script
-- Author: talbergh

local ox_lib = exports.ox_lib

-- Event Handlers
RegisterNetEvent('test-shop:client:example', function(data)
    print('Client event received:', json.encode(data))
end)

-- Key Mapping (Optional)
RegisterKeyMapping('test-shop', 'Open test-shop', 'keyboard', 'F6')

-- Command Handler
RegisterCommand('test-shop', function(source, args, rawCommand)
    -- Your code here
    ox_lib:notify({type = 'info', description = 'Command executed!'})
end, false)

-- Initialize
CreateThread(function()
    print('^2[test-shop]^7 Client script loaded')
end)
