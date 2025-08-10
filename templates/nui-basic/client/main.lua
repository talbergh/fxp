-- NUI Client-side handler
local resourceName = GetCurrentResourceName()
local isNuiOpen = false

-- Initialize
CreateThread(function()
    print(('🎨 %s NUI client loaded'):format(resourceName))
end)

-- Key mapping to open NUI
RegisterKeyMapping(resourceName .. ':toggle', 'Toggle ' .. resourceName .. ' Interface', 'keyboard', 'F6')

-- Command handler
RegisterCommand(resourceName .. ':toggle', function()
    toggleNUI()
end, false)

-- Functions
function toggleNUI()
    isNuiOpen = not isNuiOpen
    
    if isNuiOpen then
        openNUI()
    else
        closeNUI()
    end
end

function openNUI()
    local playerData = getPlayerData()
    
    SetNuiFocus(true, true)
    
    SendNUIMessage({
        action = 'show',
        data = {
            playerInfo = playerData
        }
    })
    
    isNuiOpen = true
end

function closeNUI()
    SetNuiFocus(false, false)
    
    SendNUIMessage({
        action = 'hide'
    })
    
    isNuiOpen = false
end

function getPlayerData()
    local playerPed = PlayerPedId()
    local playerId = PlayerId()
    local playerName = GetPlayerName(playerId)
    
    return {
        id = GetPlayerServerId(playerId),
        name = playerName,
        coords = GetEntityCoords(playerPed),
        health = GetEntityHealth(playerPed),
        armor = GetPedArmour(playerPed)
    }
end

-- NUI Callbacks
RegisterNUICallback('setNuiFocus', function(data, cb)
    SetNuiFocus(data.hasFocus, data.hasCursor)
    if not data.hasFocus then
        isNuiOpen = false
    end
    cb('ok')
end)

RegisterNUICallback('testAction', function(data, cb)
    local message = data.message or 'Test action triggered'
    
    -- Trigger notification
    TriggerEvent('chat:addMessage', {
        color = { 0, 255, 0 },
        multiline = true,
        args = { resourceName, message }
    })
    
    -- Optionally notify server
    TriggerServerEvent(resourceName .. ':testAction', data)
    
    cb('ok')
end)

RegisterNUICallback('getPlayerInfo', function(data, cb)
    local playerData = getPlayerData()
    
    SendNUIMessage({
        action = 'updatePlayerInfo',
        data = playerData
    })
    
    cb('ok')
end)

-- Server events
RegisterNetEvent(resourceName .. ':openNUI', function(data)
    if not isNuiOpen then
        openNUI()
    end
end)

RegisterNetEvent(resourceName .. ':closeNUI', function()
    if isNuiOpen then
        closeNUI()
    end
end)

-- Cleanup
AddEventHandler('onResourceStop', function(resource)
    if resource == resourceName and isNuiOpen then
        SetNuiFocus(false, false)
    end
end)
