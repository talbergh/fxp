#!/bin/bash

# FXP CLI - Quick Installation Script
# Author: talbergh
# Repository: https://github.com/talbergh/fxp

set -e

REPO="talbergh/fxp"
INSTALL_DIR="$HOME/.local/bin"
BINARY_NAME="fxp"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Detect OS and architecture
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)

case $OS in
  linux*)
    OS_NAME="linux"
    BINARY_EXT=""
    ;;
  darwin*)
    OS_NAME="macos"
    BINARY_EXT=""
    ;;
  msys*|cygwin*|mingw*)
    OS_NAME="win"
    BINARY_EXT=".exe"
    ;;
  *)
    echo -e "${RED}❌ Unsupported operating system: $OS${NC}"
    exit 1
    ;;
esac

BINARY_FILE="fxp-${OS_NAME}${BINARY_EXT}"

echo -e "${BLUE}🚀 FXP CLI Installation${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "📦 Installing FXP CLI for ${YELLOW}$OS_NAME${NC}..."
echo -e "📁 Install directory: ${YELLOW}$INSTALL_DIR${NC}"
echo ""

# Create install directory
mkdir -p "$INSTALL_DIR"

# Download latest release
echo -e "${BLUE}📥 Downloading latest release...${NC}"
DOWNLOAD_URL="https://github.com/$REPO/releases/latest/download/$BINARY_FILE"

if command -v curl >/dev/null 2>&1; then
  curl -L -o "$INSTALL_DIR/$BINARY_NAME$BINARY_EXT" "$DOWNLOAD_URL"
elif command -v wget >/dev/null 2>&1; then
  wget -O "$INSTALL_DIR/$BINARY_NAME$BINARY_EXT" "$DOWNLOAD_URL"
else
  echo -e "${RED}❌ Neither curl nor wget found. Please install one of them.${NC}"
  exit 1
fi

# Make executable
chmod +x "$INSTALL_DIR/$BINARY_NAME$BINARY_EXT"

# Add to PATH if not already there
case ":$PATH:" in
  *":$INSTALL_DIR:"*) 
    PATH_ADDED=true
    ;;
  *)
    PATH_ADDED=false
    ;;
esac

if [ "$PATH_ADDED" = false ]; then
  echo -e "${YELLOW}⚠️  Adding $INSTALL_DIR to PATH...${NC}"
  
  # Add to shell profile
  for shell_profile in "$HOME/.bashrc" "$HOME/.zshrc" "$HOME/.profile"; do
    if [ -f "$shell_profile" ]; then
      if ! grep -q "$INSTALL_DIR" "$shell_profile"; then
        echo "export PATH=\"$INSTALL_DIR:\$PATH\"" >> "$shell_profile"
        echo -e "${GREEN}✅ Added to $shell_profile${NC}"
      fi
    fi
  done
  
  # Export for current session
  export PATH="$INSTALL_DIR:$PATH"
fi

echo ""
echo -e "${GREEN}✅ FXP CLI installed successfully!${NC}"
echo ""
echo -e "${BLUE}🚀 Quick Start:${NC}"
echo -e "   ${GREEN}fxp create my-resource${NC}"
echo -e "   ${GREEN}fxp list${NC}"
echo -e "   ${GREEN}fxp --help${NC}"
echo ""
echo -e "${BLUE}📚 Documentation:${NC}"
echo -e "   https://github.com/$REPO"
echo ""

if [ "$PATH_ADDED" = false ]; then
  echo -e "${YELLOW}💡 Restart your terminal or run:${NC}"
  echo -e "   ${GREEN}source ~/.bashrc${NC} (or your shell profile)"
  echo ""
fi

# Test installation
if command -v fxp >/dev/null 2>&1; then
  echo -e "${GREEN}🎉 Installation verified! FXP CLI is ready to use.${NC}"
  fxp --version
else
  echo -e "${YELLOW}⚠️  Installation complete, but 'fxp' command not found in PATH.${NC}"
  echo -e "   Try restarting your terminal or running the full path:"
  echo -e "   ${GREEN}$INSTALL_DIR/$BINARY_NAME$BINARY_EXT --version${NC}"
fi

echo ""
echo -e "${BLUE}Happy modding! 🎮${NC}"
