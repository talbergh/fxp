fx_version 'cerulean'
game 'gta5'

name 'test-shop'
description 'A ESX Shop resource for FiveM/RedM'
author 'talbergh'
version '1.0.0'

shared_scripts {
    '@ox_lib/init.lua',
}

client_scripts {
    'client/*.lua'
}

server_scripts {
    
    'server/*.lua'
}

files {
    'locales/*.json'
}

lua54 'yes'
