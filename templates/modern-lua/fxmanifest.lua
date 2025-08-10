fx_version 'cerulean'
game 'gta5'

author 'Talbergh'
description 'Modern __RESOURCE_NAME__ with latest FiveM features'
version '0.1.0'

-- Modern FiveM features
lua54 'yes'
use_experimental_fxv2_oal 'yes'

client_scripts {
  'shared/config.lua',
  'client/**/*.lua'
}

server_scripts {
  'shared/config.lua',
  'server/**/*.lua'
}

-- Dependencies
dependencies {
  'ox_lib'
}
