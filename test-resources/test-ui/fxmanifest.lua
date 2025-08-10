fx_version 'cerulean'
game 'gta5'

name 'test-ui'
description 'A NUI Interface resource for FiveM/RedM'
author 'talbergh'
version '1.0.0'

ui_page 'html/index.html'

files {
    'html/index.html',
    'html/style.css',
    'html/script.js',
    'html/assets/*'
}

shared_scripts {
    '@ox_lib/init.lua',
}

client_scripts {
    'client/*.lua'
}

server_scripts {
    'server/*.lua'
}

lua54 'yes'
