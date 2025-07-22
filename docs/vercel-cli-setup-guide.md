# Vercel CLI Setup Guide

**Generated**: 2025-07-22 UTC  
**Status**: Complete  
**Verified**: ✅

## Overview

This guide provides comprehensive instructions for installing the Vercel CLI across different operating systems. While `@knowcode/doc-builder` handles most deployment complexity for you, understanding Vercel CLI installation and advanced features can be helpful for power users.

## Prerequisites

- **Node.js**: Version 14.x or higher ✅
- **npm** or **yarn**: Package manager ✅
- **Git**: For version control (optional but recommended) ✅

## Installation Methods

### Method 1: npm (Recommended)

```bash
npm install -g vercel
```

**Official Documentation**: https://vercel.com/docs/cli#installing-vercel-cli

### Method 2: yarn

```bash
yarn global add vercel
```

### Method 3: pnpm

```bash
pnpm add -g vercel
```

### Method 4: Homebrew (macOS/Linux)

```bash
brew install vercel-cli
```

**Homebrew Formula**: https://formulae.brew.sh/formula/vercel-cli

### Method 5: Standalone Binary

Download directly from: https://vercel.com/download

## Quick Start for doc-builder Users

If you're using `@knowcode/doc-builder`, you only need to:

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel** (one-time setup):
   ```bash
   vercel login
   ```

3. **Deploy with doc-builder**:
   ```bash
   npx @knowcode/doc-builder deploy
   ```

That's it! doc-builder handles all the configuration for you.

## Detailed Installation Instructions

## Understanding Vercel CLI

### What Gets Installed

The Vercel CLI stores configuration in:
- **macOS/Linux**: `~/.vercel/`
- **Windows**: `%USERPROFILE%\.vercel\`

### Authentication

```bash
# Check who you're logged in as
vercel whoami

# Log out
vercel logout

# Log in again
vercel login
```

**Note**: doc-builder automatically generates the necessary `vercel.json` configuration for you, so you don't need to create it manually.

## Advanced Vercel CLI Commands

While doc-builder handles deployment, you might want to use these Vercel CLI commands directly:

### Project Management

```bash
# List your projects
vercel project ls

# View project details
vercel project <project-name>

# Remove a project
vercel project rm <project-name>
```

### Domain Management

```bash
# List domains
vercel domains ls

# Add a domain to a project
vercel domains add <domain> <project>

# Remove a domain
vercel domains rm <domain>
```

### Deployment Management

```bash
# List recent deployments
vercel ls

# Inspect a deployment
vercel inspect <deployment-url>

# Remove a deployment
vercel rm <deployment-url>
```

### Environment Variables

```bash
# Add environment variable
vercel env add <name>

# List environment variables
vercel env ls

# Remove environment variable
vercel env rm <name>
```

## Troubleshooting

### Common Installation Issues

#### Command Not Found

If `vercel` command is not found after installation:

```bash
# Find npm global bin location
npm bin -g

# Add to PATH (add to your ~/.bashrc or ~/.zshrc)
export PATH="$(npm bin -g):$PATH"
```

#### Permission Errors

If you get EACCES errors during installation:

```bash
# Option 1: Use npx instead (recommended)
npx vercel

# Option 2: Fix npm permissions
# See: https://docs.npmjs.com/resolving-eacces-permissions-errors

# Option 3: Use a Node version manager like nvm
# See: https://github.com/nvm-sh/nvm
```

#### Authentication Issues

```bash
# If login fails, try:
vercel logout
vercel login

# For corporate proxies:
export HTTP_PROXY=http://proxy.company.com:8080
export HTTPS_PROXY=http://proxy.company.com:8080
```

## Platform-Specific Instructions

### macOS

1. **Install via Homebrew** (recommended):
   ```bash
   brew install vercel-cli
   ```

2. **Verify Xcode Command Line Tools**:
   ```bash
   xcode-select --install
   ```

**macOS Guide**: https://vercel.com/docs/cli#macos-installation

### Windows

1. **Install Node.js** from https://nodejs.org/
2. **Use PowerShell as Administrator**:
   ```powershell
   npm install -g vercel
   ```

3. **Windows-specific issues**: https://vercel.com/docs/cli#windows-installation

### Linux

1. **Install Node.js via package manager**:
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install nodejs npm

   # Fedora
   sudo dnf install nodejs npm

   # Arch
   sudo pacman -S nodejs npm
   ```

2. **Install Vercel CLI**:
   ```bash
   sudo npm install -g vercel
   ```

**Linux Guide**: https://vercel.com/docs/cli#linux-installation

## Using Vercel CLI with doc-builder

### Deploying to Production

While doc-builder handles deployment, you can also use Vercel CLI directly:

```bash
# From your html output directory
cd html
vercel --prod
```

### Working with Teams

```bash
# Switch between personal and team accounts
vercel switch

# Deploy to a specific team
vercel --scope team-name
```

### CI/CD Integration

For automated deployments:

```yaml
# GitHub Actions example
- name: Deploy Documentation
  run: |
    npm install -g @knowcode/doc-builder vercel
    doc-builder build
    vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## Key Resources

### Official Documentation
- **Vercel CLI Docs**: https://vercel.com/docs/cli
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Support**: https://vercel.com/support

### For doc-builder Users
- **First-Time Setup Guide**: [vercel-first-time-setup-guide.md](./vercel-first-time-setup-guide.md)
- **Troubleshooting Guide**: [troubleshooting-guide.md](./troubleshooting-guide.md)
- **doc-builder Documentation**: https://www.npmjs.com/package/@knowcode/doc-builder

---

This guide covers Vercel CLI installation and advanced usage. For most doc-builder users, the simplified deployment process handles everything automatically. See the [First-Time Setup Guide](./vercel-first-time-setup-guide.md) for the streamlined deployment experience.