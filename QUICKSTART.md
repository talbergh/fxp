# Quick Start Guide

## Installation

### Windows
```bash
curl -L https://raw.githubusercontent.com/talbergh/fxp/main/install.bat -o install.bat && install.bat
```

### Linux/macOS
```bash
curl -L https://raw.githubusercontent.com/talbergh/fxp/main/install.sh | bash
```

### Manual Installation
1. Download the binary for your platform from [releases](https://github.com/talbergh/fxp/releases)
2. Place it in a directory in your PATH
3. Make it executable (Linux/macOS): `chmod +x fxp-linux`

## Usage Examples

### Create Resources
```bash
# Interactive creation
fxp create

# Quick creation with template
fxp create my-shop --template esx-shop

# Framework-specific
fxp create bank-job --template qb-job --framework qb-core

# With custom settings
fxp create ui-resource --template ui-nui --framework standalone
```

### List Templates
```bash
# All templates
fxp list

# Framework-specific
fxp list --framework esx
fxp list --framework qb-core
```

### System Management
```bash
# Install globally
fxp install

# Update to latest
fxp update

# Remove from system
fxp uninstall
```

### Getting Help
```bash
# General help
fxp --help

# Command-specific help
fxp help create
fxp help list
```

## Templates Overview

### FiveM Templates
- **basic-fivem**: Simple standalone resource
- **esx-basic**: ESX framework integration
- **esx-shop**: Complete shop system
- **qb-basic**: QB-Core framework integration
- **qb-job**: Complete job system
- **ui-nui**: Modern NUI interface

### RedM Templates
- **redm-basic**: Basic RedM resource
- **redm-rsg**: RSG framework integration

## Development Workflow

1. **Create** a new resource with FXP
2. **Customize** the generated code for your needs
3. **Test** in your FiveM/RedM server
4. **Deploy** to production

## Best Practices

- Always use the latest version: `fxp update`
- Check available templates: `fxp list`
- Use framework-specific templates for better integration
- Follow the generated project structure
- Read the generated README.md files

## Support

- **Documentation**: [GitHub Wiki](https://github.com/talbergh/fxp/wiki)
- **Issues**: [GitHub Issues](https://github.com/talbergh/fxp/issues)
- **Discussions**: [GitHub Discussions](https://github.com/talbergh/fxp/discussions)
