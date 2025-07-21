# Vercel CLI Setup Guide

**Generated**: 2025-07-21 20:30 UTC  
**Status**: Complete  
**Verified**: ✅

## Overview

This guide provides comprehensive instructions for installing and configuring the Vercel CLI across different operating systems and environments. The Vercel CLI enables you to deploy projects, manage deployments, and configure projects directly from your terminal.

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

## Initial Setup

### 1. Verify Installation

```bash
vercel --version
```

### 2. Login to Vercel

```bash
vercel login
```

This will open your browser for authentication or provide email-based login options.

**Authentication Guide**: https://vercel.com/docs/cli#commands/login

### 3. Check Authentication Status

```bash
vercel whoami
```

## Configuration

### Global Configuration

The Vercel CLI stores configuration in:
- **macOS/Linux**: `~/.vercel/`
- **Windows**: `%USERPROFILE%\.vercel\`

**Configuration Documentation**: https://vercel.com/docs/cli#configuration

### Project Configuration

Create `vercel.json` in your project root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

**Project Configuration Guide**: https://vercel.com/docs/project-configuration

## Common Commands

### Deploy Commands

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Deploy with specific name
vercel --name my-project
```

**Deployment Documentation**: https://vercel.com/docs/cli#commands/deploy

### Project Management

```bash
# List all projects
vercel project ls

# Create new project
vercel project add

# Remove project
vercel project rm <project-name>
```

**Project Commands**: https://vercel.com/docs/cli#commands/project

### Environment Variables

```bash
# Add environment variable
vercel env add

# List environment variables
vercel env ls

# Remove environment variable
vercel env rm <variable-name>
```

**Environment Variables Guide**: https://vercel.com/docs/concepts/projects/environment-variables

## Troubleshooting

### Common Issues

#### 1. Command Not Found

If `vercel` command is not found after installation:

**Solution**: Add npm global bin to PATH
```bash
# Find npm bin location
npm bin -g

# Add to PATH (bash/zsh)
export PATH="$(npm bin -g):$PATH"
```

**PATH Configuration Guide**: https://vercel.com/docs/cli#installation/troubleshooting

#### 2. Authentication Issues

If login fails or tokens expire:

```bash
# Logout and login again
vercel logout
vercel login
```

**Authentication Troubleshooting**: https://vercel.com/docs/cli#authentication/troubleshooting

#### 3. Permission Errors

For npm permission errors during global install:

**Option 1**: Use npm's official guide
https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally

**Option 2**: Use Node Version Manager (nvm)
https://github.com/nvm-sh/nvm

#### 4. Proxy Configuration

For corporate environments:

```bash
# Set proxy
vercel --proxy http://proxy.company.com:8080

# Or use environment variables
export HTTP_PROXY=http://proxy.company.com:8080
export HTTPS_PROXY=http://proxy.company.com:8080
```

**Proxy Documentation**: https://vercel.com/docs/cli#using-behind-a-proxy

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

## CI/CD Integration

### GitHub Actions

```yaml
- name: Install Vercel CLI
  run: npm install -g vercel

- name: Deploy to Vercel
  run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

**GitHub Actions Guide**: https://vercel.com/guides/how-can-i-use-github-actions-with-vercel

### GitLab CI

```yaml
deploy:
  script:
    - npm install -g vercel
    - vercel --prod --token=$VERCEL_TOKEN
```

**GitLab CI Guide**: https://vercel.com/docs/concepts/deployments/git/gitlab

## Advanced Configuration

### Custom Build Commands

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev"
}
```

### Monorepo Support

```bash
# Deploy from subdirectory
vercel --cwd ./apps/web
```

**Monorepo Guide**: https://vercel.com/docs/concepts/monorepos

### Team Collaboration

```bash
# Switch team context
vercel switch

# Invite team member
vercel team invite <email>
```

**Team Management**: https://vercel.com/docs/cli#commands/teams

## Security Best Practices

### 1. Token Management

- **Never commit tokens** to version control ✅
- **Use environment variables** for CI/CD ✅
- **Rotate tokens regularly** ✅

**Security Guide**: https://vercel.com/docs/security

### 2. Scoped Tokens

Create scoped tokens for specific projects:
https://vercel.com/account/tokens

### 3. Two-Factor Authentication

Enable 2FA on your Vercel account:
https://vercel.com/docs/accounts/team-members/two-factor-authentication

## Additional Resources

### Official Documentation
- **Main CLI Documentation**: https://vercel.com/docs/cli
- **API Reference**: https://vercel.com/docs/rest-api
- **Examples Repository**: https://github.com/vercel/examples

### Community Resources
- **Discord Community**: https://vercel.com/discord
- **GitHub Discussions**: https://github.com/vercel/vercel/discussions
- **Stack Overflow**: https://stackoverflow.com/questions/tagged/vercel

### Video Tutorials
- **Official YouTube Channel**: https://www.youtube.com/c/VercelHQ
- **Getting Started Playlist**: https://vercel.com/docs/getting-started-with-vercel

## Version History

| Version | Release Date | Notes |
|---------|-------------|--------|
| Latest | Check npm | https://www.npmjs.com/package/vercel |
| Changelog | All versions | https://github.com/vercel/vercel/releases |

## Support

### Getting Help
- **Documentation**: https://vercel.com/docs
- **Support Portal**: https://vercel.com/support
- **Status Page**: https://www.vercel-status.com/

### Reporting Issues
- **GitHub Issues**: https://github.com/vercel/vercel/issues
- **Feature Requests**: https://github.com/vercel/vercel/discussions/categories/ideas

---

This guide provides comprehensive coverage of Vercel CLI setup and configuration. For the most up-to-date information, always refer to the official Vercel documentation at https://vercel.com/docs.