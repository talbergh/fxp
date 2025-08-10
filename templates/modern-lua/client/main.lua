-- Modern FiveM client with latest natives and best practices
local resourceName = GetCurrentResourceName()

CreateThread(function()
    lib.print.info(('%s client loaded'):format(resourceName))
end)

-- Example: Modern key mapping with ox_lib
lib.addKeybind({
    name = 'test_command',
    description = 'Test command for ' .. resourceName,
    defaultKey = 'F5',
    onPressed = function()
        lib.notify({
            title = resourceName,
            description = 'Test command executed!',
            type = 'success'
        })
    end
})

-- Example: Using latest natives
RegisterNetEvent(resourceName .. ':showNotification', function(data)
    -- Modern notification with ox_lib
    lib.notify({
        title = data.title or resourceName,
        description = data.message,
        type = data.type or 'info',
        duration = data.duration or 5000
    })
end)

-- Example: Modern ped spawning with proper cleanup
local spawnedPeds = {}

local function spawnTestPed()
    local playerPed = PlayerPedId()
    local coords = GetEntityCoords(playerPed)
    local heading = GetEntityHeading(playerPed)
    
    -- Request model
    local model = `a_m_y_business_01`
    lib.requestModel(model, 10000)
    
    -- Spawn ped
    local ped = CreatePed(4, model, coords.x + 2.0, coords.y, coords.z, heading, false, true)
    SetEntityAsMissionEntity(ped, true, true)
    SetPedRandomComponentVariation(ped, false)
    
    -- Store for cleanup
    spawnedPeds[#spawnedPeds + 1] = ped
    
    lib.notify({
        title = resourceName,
        description = 'Test ped spawned',
        type = 'success'
    })
end

-- Cleanup on resource stop
AddEventHandler('onResourceStop', function(resource)
    if resource == resourceName then
        for i = 1, #spawnedPeds do
            DeleteEntity(spawnedPeds[i])
        end
    end
end)
