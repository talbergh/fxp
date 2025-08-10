# FXP – FiveM eXperience Pack CLI

**FXP by Talbergh** ist ein modernes Node.js CLI-Tool für FiveM-Modder zum Erstellen, Verwalten und Exportieren von Resources und Projekten.

## 🚀 Features
- **Interaktive Projekt-Erstellung** mit modernen Templates
- **Automatisches Update-System** über GitHub Releases
- **Standalone Binaries** für Windows & Linux (keine Node.js Installation erforderlich)
- **Moderne FiveM Templates** mit neuesten Natives und Best Practices
- **NUI Support** mit vorgefertigten Web-Interfaces
- **Globale Installation** mit install/uninstall Commands

## 📦 Installation

### Option 1: Standalone Binary (empfohlen)
1. Download der neuesten Release von [GitHub Releases](https://github.com/Talbergh/fxp/releases)
2. Binary an gewünschten Ort kopieren
3. Global installieren: `fxp install`

### Option 2: Node.js (Entwicklung)
```bash
git clone https://github.com/Talbergh/fxp.git
cd fxp
npm install
npm link  # Für globale Nutzung
```

## 🎯 Quick Start

```bash
# Neues Projekt erstellen
fxp create my-resource -t modern-lua

# Vorhandenen Ordner initialisieren
cd my-existing-folder
fxp init

# Resource exportieren
fxp export . -o my-resource.zip

# Verfügbare Templates anzeigen
fxp templates

# Updates prüfen
fxp update --check

# Hilfe anzeigen
fxp --help
```

## 📋 Commands

| Command | Beschreibung |
|---------|-------------|
| `fxp create <name>` | Neue Resource von Template erstellen |
| `fxp init` | Ordner als FiveM Resource initialisieren |
| `fxp export [path]` | Resource als ZIP exportieren |
| `fxp templates` | Verfügbare Templates auflisten |
| `fxp install` | FXP global installieren |
| `fxp uninstall` | FXP deinstallieren |
| `fxp update` | Updates prüfen und installieren |

## 🎨 Templates

### basic-lua
Minimales Lua-basiertes Template mit:
- Standard client/server/shared Struktur
- Moderne fxmanifest.lua
- Basis-Starter-Code

### modern-lua
Erweiterte Lua-Resource mit:
- Lua 5.4 Support
- ox_lib Integration
- Moderne FiveM Features
- Umfangreiche Code-Beispiele

### nui-basic
NUI-basierte Resource mit:
- Vollständiges Web-Interface
- Modern Dark Theme (FiveM-kompatibel)
- Client/Server NUI-Handler
- Responsive Design

## 🔧 Development

```bash
# Dependencies installieren
npm install

# Development Server
npm run dev

# Tests ausführen
npm test

# Build erstellen
npm run build

# Release erstellen
npm run release
```

## 🛠️ Build System

Das erweiterte Build-System unterstützt:
- **Standalone Binaries** für Windows/Linux
- **Automatische Asset-Einbettung** (Templates)
- **Checksums** für Integrität
- **Build-Informationen** mit Metadaten
- **Release-Automatisierung** mit Git-Integration

```bash
# Standard Build
npm run build

# Development Build (nur Windows)
npm run build:dev

# Clean Build Artifacts
npm run clean
```

## 🔄 Update System

FXP verfügt über ein eingebautes Update-System:

```bash
# Update-Check
fxp update --check

# Automatisches Update
fxp update
```

Das System:
- Prüft GitHub Releases auf neue Versionen
- Lädt Binaries automatisch herunter
- Zeigt Changelog und Release-Informationen
- Unterstützt plattformspezifische Downloads

## 🎯 FiveM Integration

FXP Templates folgen aktuellen FiveM Best Practices:
- **lua54** Support aktiviert
- **Experimental FXv2 OAL** für bessere Performance
- **ox_lib** Integration wo sinnvoll
- **Moderne Natives** und APIs
- **NUI** mit CEF-kompatiblem Styling
- **Proper Resource Cleanup**

## 📁 Projektstruktur

```
fxp/
├── bin/fxp.js              # CLI Entry Point
├── src/
│   ├── index.js            # Hauptprogramm
│   ├── commands/           # CLI Commands
│   └── utils/              # Hilfsfunktionen
├── scripts/                # Build & Release Scripts
├── templates/              # Resource Templates
│   ├── basic-lua/
│   ├── modern-lua/
│   └── nui-basic/
└── dist/                   # Build Output
```

## 🤝 Contributing

1. Repository forken
2. Feature Branch erstellen
3. Änderungen committen
4. Pull Request erstellen

## 📄 License

MIT License - siehe [LICENSE](LICENSE) für Details.

## 🔗 Links

- [GitHub Repository](https://github.com/Talbergh/fxp)
- [Release Notes](https://github.com/Talbergh/fxp/releases)
- [Issue Tracker](https://github.com/Talbergh/fxp/issues)

---

**FXP by Talbergh** – Modernes Tooling für moderne FiveM Development 🎮
