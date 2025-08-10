fx_version 'cerulean'
game 'gta5'

author 'Talbergh'
description 'NUI Resource __RESOURCE_NAME__ with modern web interface'
version '0.1.0'

lua54 'yes'
use_experimental_fxv2_oal 'yes'

client_scripts {
  'shared/config.lua',
  'client/*.lua'
}

server_scripts {
  'shared/config.lua',
  'server/*.lua'
}

-- NUI files
files {
  'web/**/*'
}

ui_page 'web/index.html'
