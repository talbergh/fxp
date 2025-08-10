-- test-ui NUI Client Script
-- Author: talbergh

local isUIOpen = false

-- NUI Callbacks
RegisterNUICallback('close', function(data, cb)
    closeUI()
    cb('ok')
end)

RegisterNUICallback('example-action', function(data, cb)
    print('Example action triggered:', json.encode(data))
    
    -- Handle the action here
    TriggerServerEvent('test-ui:server:example', data)
    
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
RegisterNetEvent('test-ui:client:openUI', function(data)
    openUI(data)
end)

RegisterNetEvent('test-ui:client:closeUI', function()
    closeUI()
end)

RegisterNetEvent('test-ui:client:updateUI', function(data)
    if isUIOpen then
        SendNUIMessage({
            action = 'update',
            data = data
        })
    end
end)

-- Command
RegisterCommand('test-ui', function(source, args, rawCommand)
    openUI()
end, false)

-- Key Mapping
RegisterKeyMapping('test-ui', 'Open test-ui', 'keyboard', 'F6')

-- Initialize
CreateThread(function()
    print('^2[test-ui]^7 NUI client script loaded')
end)
