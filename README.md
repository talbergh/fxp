# FXP CLI

**Professional CLI Tool for FiveM & RedM Modders**

[![Version](https://img.shields.io/github/v/release/talbergh/fxp)](https://github.com/talbergh/fxp/releases)
[![Downloads](https://img.shields.io/github/downloads/talbergh/fxp/total)](https://github.com/talbergh/fxp/releases)
[![License](https://img.shields.io/github/license/talbergh/fxp)](LICENSE)

FXP is a modern, fast and user-friendly command-line tool designed specifically for FiveM & RedM modders. Create professional resource templates, manage your projects, and streamline your development workflow.

## 🚀 Features

- **📦 Resource Templates** - Pre-built templates for ESX, QB-Core, RedM and more
- **🎨 Modern NUI** - Beautiful, responsive interfaces with dark theme
- **🔄 Auto-Updates** - Automatically stays up-to-date via GitHub releases
- **🌐 Global Install** - Install once, use anywhere on your system
- **⚡ Fast & Lightweight** - Standalone binary, no Node.js required
- **🛠️ Framework Support** - ESX, QB-Core, QBox, RedM/RSG compatible
- **📱 Modern UI** - CEF-optimized interfaces that work perfectly in-game

## 📦 Installation

### Quick Install (Recommended)

Download the latest binary for your platform from [releases](https://github.com/talbergh/fxp/releases):

**Windows:**
```bash
# Download fxp-win.exe and run:
fxp-win.exe install
```

**Linux:**
```bash
# Download fxp-linux and run:
chmod +x fxp-linux
./fxp-linux install
```

### Development Install

```bash
git clone https://github.com/talbergh/fxp.git
cd fxp
npm install
npm link
```

## 🎯 Quick Start

```bash
# Create a new ESX shop resource
fxp create my-shop --template esx-shop

# Create a QB-Core job system
fxp create taxi-job --template qb-job --framework qb-core

# List all available templates
fxp list

# Update to latest version
fxp update
```

## 📋 Available Templates

### FiveM Templates
- **basic-fivem** - Simple standalone resource
- **esx-basic** - ESX framework integration
- **esx-shop** - Complete shop system for ESX
- **qb-basic** - QB-Core framework integration
- **qb-job** - Complete job system for QB-Core
- **ui-nui** - Modern NUI interface template

### RedM Templates
- **redm-basic** - Basic RedM resource structure
- **redm-rsg** - RSG framework compatible resource

## 🔧 Commands

### Create Resources
```bash
fxp create [name] [options]

Options:
  -t, --template <type>      Template type (basic, esx, qb, etc.)
  -f, --framework <fw>       Framework (esx, qb-core, standalone)
  --no-install              Skip npm install
```

### List Templates
```bash
fxp list [options]

Options:
  -f, --framework <fw>       Filter by framework
```

### System Management
```bash
fxp install                 # Install globally
fxp uninstall              # Remove from system
fxp update [--force]       # Update to latest version
```

### Help
```bash
fxp help [command]         # Show help for specific command
fxp --version              # Show version
fxp --verbose              # Enable verbose logging
```

## 🏗️ Project Structure

When you create a resource, FXP generates a clean, professional structure:

```
my-resource/
├── fxmanifest.lua         # Resource manifest
├── config.lua             # Configuration file
├── client/
│   └── main.lua           # Client-side scripts
├── server/
│   └── main.lua           # Server-side scripts
├── html/                  # NUI files (if applicable)
│   ├── index.html
│   ├── style.css
│   └── script.js
├── locales/
│   └── en.json            # Localization files
└── README.md              # Documentation
```

## 🎨 Modern UI Guidelines

FXP templates follow modern design principles:

- **Dark Theme** - Optimized for gaming environments
- **Responsive Design** - Works on all screen resolutions
- **CEF Compatible** - No unsupported CSS features
- **Performance Focused** - Minimal resource usage
- **Accessibility** - Keyboard navigation support

## 🔧 Development

### Building from Source

```bash
# Clone repository
git clone https://github.com/talbergh/fxp.git
cd fxp

# Install dependencies
npm install

# Development mode
npm run dev

# Build binaries
npm run build

# Build specific platform
npm run build:win     # Windows
npm run build:linux   # Linux
```

### Project Structure

```
fxp/
├── src/
│   ├── commands/          # CLI commands
│   ├── utils/             # Utility functions
│   └── index.js           # Main entry point
├── templates/             # Resource templates
├── bin/                   # CLI binary wrapper
├── dist/                  # Built binaries
└── docs/                  # Documentation
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Documentation**: [GitHub Wiki](https://github.com/talbergh/fxp/wiki)
- **Bug Reports**: [GitHub Issues](https://github.com/talbergh/fxp/issues)
- **Feature Requests**: [GitHub Discussions](https://github.com/talbergh/fxp/discussions)
- **Discord**: [FiveM Development Community](https://discord.gg/fivem)

## 🙏 Acknowledgments

- FiveM Community for inspiration and feedback
- ESX & QB-Core teams for framework integration
- All contributors who help improve FXP

---

**Made with ❤️ for the FiveM & RedM community**

*Happy Modding! 🚀*
