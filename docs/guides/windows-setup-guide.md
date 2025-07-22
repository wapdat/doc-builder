# Windows Setup Guide for Claude Code & @knowcode/doc-builder

**Generated**: 2025-01-22 UTC  
**Status**: Complete  
**Verified**: ✅

## Overview

This guide helps Windows users set up the complete AI-powered documentation workflow using Claude Code, @knowcode/doc-builder, and Vercel. Based on real troubleshooting experience, this guide addresses common Windows-specific challenges and provides clear solutions.

## Quick Prerequisites Overview

**Required Accounts:**
- ✅ **Claude Pro or Max** subscription ($20-200/month) - [claude.ai](https://claude.ai)
- ✅ **Vercel** account (free Hobby plan) - [vercel.com](https://vercel.com)
- ⭐ **GitHub** account (optional but recommended) - [github.com](https://github.com)

**Required Software:**
- ✅ Windows 10/11 with Administrator access
- ✅ Node.js 14+ and npm - [nodejs.org](https://nodejs.org)
- ✅ Git for Windows - [gitforwindows.org](https://gitforwindows.org)
- ✅ PowerShell 5.1+ (included with Windows)
- ⭐ Visual Studio Code (recommended) - [code.visualstudio.com](https://code.visualstudio.com)

## Understanding Claude vs Claude Code

### What's the Difference?

**Claude.ai** (Web Interface):
- Browser-based chat interface
- General-purpose AI assistant
- Good for conversations and one-off tasks
- Limited file handling capabilities

**Claude Code** (Command-Line Tool):
- Terminal/command-line interface
- Specialized for software development
- Direct file system access
- Can read, write, and modify multiple files
- Integrated with your development workflow
- Requires Pro or Max subscription

### Why Claude Code for Documentation?

Claude Code excels at:
- Reading entire codebases
- Generating multiple markdown files
- Updating existing documentation
- Creating consistent formatting
- Working directly in your project folder

## The Three-Part System

Understanding the conceptual separation is crucial:

<table>
<tr>
<td width="33%">

### 1. Claude Code
**Purpose**: Create markdown content  
**What it does**: AI-powered content generation  
**Output**: `.md` files with documentation

</td>
<td width="33%">

### 2. doc-builder
**Purpose**: Convert MD to HTML  
**What it does**: Beautiful static site generation  
**Output**: Styled HTML website

</td>
<td width="33%">

### 3. Vercel
**Purpose**: Host the website  
**What it does**: Free web hosting  
**Output**: Live URL for your docs

</td>
</tr>
</table>

## Complete Prerequisites Summary

### Required Accounts

| Service | Purpose | Requirements | Sign Up Link |
|---------|---------|--------------|--------------|
| **Claude** | AI content generation | Pro ($20/mo) or Max ($200/mo) plan required | [claude.ai](https://claude.ai) |
| **GitHub** | Version control | Free account (required for Vercel) | [github.com](https://github.com) |
| **Vercel** | Free web hosting | Free Hobby account sufficient | [vercel.com](https://vercel.com) |

### Software Requirements

| Software | Version | Purpose | Required? |
|----------|---------|---------|-----------|
| **Windows** | 10 or 11 | Operating system | ✅ Required |
| **Node.js** | 14.0+ | JavaScript runtime | ✅ Required |
| **npm** | (included) | Package manager | ✅ Required |
| **Git** | Latest | Version control | ✅ Required |
| **PowerShell** | 5.1+ | Command line | ✅ Required |
| **VS Code** | Latest | Code editor | ⭐ Recommended |

### Administrative Requirements

- **Administrator access** on Windows (for PowerShell execution policy)
- **Internet connection** for downloading tools and deploying
- **Email address** for account creation

### Installation Order

| Step | Component | Required For | Download Link |
|------|-----------|--------------|---------------|
| 1 | Node.js & npm | doc-builder | [Download Node.js](https://nodejs.org/en/download/) |
| 2 | Git for Windows | Claude Code | [Download Git](https://gitforwindows.org/) |
| 3 | Visual Studio Code | Development | [Download VS Code](https://code.visualstudio.com/) |
| 4 | Claude Code CLI | AI content | Via npm (see below) |
| 5 | Vercel CLI | Deployment | Via npm (see below) |

### Account Setup Checklist

- [ ] **Claude Account**
  - [ ] Sign up at [claude.ai](https://claude.ai)
  - [ ] Subscribe to Pro ($20/mo) or Max ($200/mo) plan
  - [ ] Verify email
  - [ ] Note: Free plan does NOT include Claude Code access
  
- [ ] **GitHub Account** (Required)
  - [ ] Sign up at [github.com](https://github.com)
  - [ ] Configure username and email
  - [ ] Enable 2FA (recommended)
  - [ ] Required for Vercel deployment
  
- [ ] **Vercel Account**
  - [ ] Sign up at [vercel.com](https://vercel.com) using GitHub
  - [ ] Choose Hobby (free) plan
  - [ ] Authorize Vercel to access GitHub

## Step 1: Enable PowerShell Script Execution

**⚠️ IMPORTANT**: This must be done FIRST as Administrator

### Open PowerShell as Administrator

1. Press `Windows + X`
2. Select **Terminal (Admin)** or **Windows PowerShell (Admin)**
3. Click **Yes** when prompted by User Account Control

### Enable Script Execution

Run this command in the Administrator PowerShell:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

When prompted, type `Y` and press Enter.

### Verify the Change

```powershell
Get-ExecutionPolicy
```

Should return: `RemoteSigned`

## Step 2: Install Node.js and npm

### Download and Install

1. Go to [Node.js Downloads](https://nodejs.org/en/download/)
2. Download the **Windows Installer (.msi)** for your system (64-bit recommended)
3. Run the installer with these settings:
   - ✅ Accept the license agreement
   - ✅ Default installation location
   - ✅ **IMPORTANT**: Ensure "npm package manager" is checked
   - ✅ Add to PATH (should be checked by default)
   - ✅ Automatically install necessary tools (optional but recommended)

### Verify Installation

Open a **new** PowerShell window (not as admin) and run:

```powershell
node -v
npm -v
```

You should see version numbers for both commands.

### Troubleshooting npm Issues

If you get "running scripts is disabled" error:

1. You didn't enable PowerShell execution policy (go back to Step 1)
2. You need to close and reopen PowerShell after installing Node.js
3. Try running PowerShell as Administrator

## Step 3: Install Git for Windows

### Download and Install

1. Go to [Git for Windows](https://gitforwindows.org/)
2. Download the installer
3. Run with these recommended settings:
   - ✅ Use Visual Studio Code as default editor
   - ✅ Git from the command line and also from 3rd-party software
   - ✅ Use bundled OpenSSH
   - ✅ Checkout Windows-style, commit Unix-style line endings
   - ✅ Use Windows' default console window

### Verify Installation

```powershell
git --version
```

## Step 4: Set Up Claude Code

### Understanding Claude Plans

Claude Code requires a Claude Pro or Team plan subscription:

| Plan | Price | Claude Code Access | Best For |
|------|-------|-------------------|----------|
| **Free** | $0/month | ❌ No access | Basic chat only |
| **Pro** | $20/month | ✅ Full access | Individual developers |
| **Max** | $200/month | ✅ Full access | Power users, higher limits |

**Important**: Only Pro and Max plans include Claude Code access. The free Claude.ai plan does NOT support Claude Code. See [Using Claude Code with Pro/Max Plans](https://support.anthropic.com/en/articles/11145838-using-claude-code-with-your-pro-or-max-plan)

### Install Claude Code CLI

```powershell
npm install -g @anthropic/claude-code
```

### Initialize Claude Code

```powershell
claude
```

Follow the prompts:
1. Choose **Dark mode** or **Light mode**
2. Select **Login with Claude account**
3. Authorize in your browser
4. Return to terminal when complete

### Verify Setup

```powershell
claude --version
```

## Step 5: Install @knowcode/doc-builder

### Global Installation (Recommended)

```powershell
npm install -g @knowcode/doc-builder@latest
```

### Verify Installation

```powershell
doc-builder --version
```

### Create Project Folder

```powershell
cd Documents
mkdir my-docs-project
cd my-docs-project
```

## Step 6: Set Up Vercel

### Understanding Vercel Plans

| Plan | Price | Features | Best For |
|------|-------|----------|----------|
| **Hobby** | Free | Unlimited static sites, HTTPS, Global CDN | Personal projects, documentation |
| **Pro** | $20/month | Team features, analytics, support | Professional use |

The free Hobby plan is perfect for documentation sites!

### Create GitHub Account First

1. Go to [GitHub](https://github.com)
2. Click **Sign Up**
3. Create username and verify email
4. Complete account setup

### Create Vercel Account (Requires GitHub)

1. Go to [Vercel](https://vercel.com)
2. Click **Sign Up**
3. Choose **Continue with GitHub** (recommended)
4. Authorize Vercel to access your GitHub
5. Select **Hobby** plan (free)

### Install Vercel CLI

```powershell
npm install -g vercel@latest
```

### Login to Vercel

```powershell
vercel login
```

This will open your browser for authentication.

## Step 7: Complete Workflow Example

### 1. Create Documentation with Claude Code

In Visual Studio Code terminal:

```powershell
claude
```

Then ask Claude to create documentation:
```
Create a comprehensive technical documentation for my API including authentication, endpoints, and examples
```

### 2. Build HTML with doc-builder

```powershell
doc-builder build
```

### 3. Deploy to Vercel

```powershell
doc-builder deploy
```

#### First Deployment Setup Questions

You'll be prompted with several questions. Here's what each one means:

**1. "Set up and deploy?"** → Type `Y` (Yes)
   - This confirms you want to deploy your documentation to Vercel

**2. "What is your project name?"** → Example: `my-api-docs`
   - This becomes your URL: `https://my-api-docs.vercel.app`
   - Also used as the project identifier in Vercel dashboard
   
   **Naming Requirements:**
   - Must be **lowercase** only
   - Up to 100 characters long
   - Can include: letters, numbers, `.` `_` `-`
   - Cannot contain: `---` (three consecutive hyphens)
   - Must start with a letter
   
   **Good examples:** `my-docs`, `api-docs-v2`, `team_handbook`
   **Bad examples:** `My-Docs` (uppercase), `123-docs` (starts with number), `my---docs` (triple hyphen)

**3. "Which scope do you want to deploy to?"** → Select your account
   - Choose your personal account or team name

**4. "Link to existing project?"** → Type `N` (No) for first time
   - Choose `Y` only if you've already created this project before

**5. "What's the name of your existing project?"** → Skip if you chose No above

**6. "In which directory is your code located?"** → Press Enter (accepts `./`)
   - doc-builder already handles this correctly

**7. "Want to modify these settings?"** → Type `N` (No)
   - The default settings are configured correctly by doc-builder

### 4. Make Site Public

After deployment:
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click your project
3. Go to **Settings** → **Deployment Protection**
4. Set **Vercel Authentication** to **Disabled**
5. Click **Save**

Your documentation is now live at `https://your-project.vercel.app`!

## Common Windows Issues & Solutions

### PowerShell Execution Policy Error

**Error**: "running scripts is disabled on this system"

**Solution**:
```powershell
# Run PowerShell as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
```

See detailed guide: [Resolving npm Execution Policy Error](https://dev.to/jackfd120/resolving-npm-execution-policy-error-in-powershell-a-step-by-step-guide-for-developers-32ip)

### npm Command Not Found

**Causes**:
1. Node.js not installed properly
2. PATH not updated
3. Need to restart PowerShell

**Solution**:
1. Reinstall Node.js using the official installer
2. Ensure "Add to PATH" is checked during installation
3. Close all PowerShell windows and open new ones

### Git Bash Required Error

**Error**: "Claude Code requires Git bash"

**Solution**:
Install Git for Windows from [gitforwindows.org](https://gitforwindows.org/)

### Vercel CLI Authentication Issues

**Error**: "Please login to Vercel"

**Solution**:
```powershell
vercel logout
vercel login
```

### Vercel Project Naming Errors

**Error**: "Invalid project name" or deployment fails

**Common Causes**:
1. Project name contains uppercase letters
2. Project name starts with a number
3. Project name contains invalid characters
4. Project name contains `---` (three hyphens)

**Solution**:
Use a valid project name following these rules:
- **Lowercase only**: `my-docs` ✅, `My-Docs` ❌
- **Start with letter**: `api-docs` ✅, `123-docs` ❌
- **Valid characters**: Letters, numbers, `.`, `_`, `-`
- **No triple hyphens**: `my-cool-docs` ✅, `my---docs` ❌

**Examples of valid names**:
- `my-documentation`
- `api-docs-v2`
- `team_handbook`
- `docs.myproject`

## Best Practices

### Folder Structure

```
Documents/
├── my-projects/
│   ├── project1-docs/
│   │   ├── docs/           # Markdown files
│   │   ├── html/           # Generated HTML
│   │   └── doc-builder.config.js
│   └── project2-docs/
```

### Workflow Tips

1. **Use Visual Studio Code** - Better terminal integration
2. **Create separate folders** for each documentation project
3. **Use @latest** - Always use `@latest` to avoid npm cache issues
4. **Regular commits** - Use Git to track changes

### Security Notes

1. **Run as Admin only when required** - Only for PowerShell policy changes
2. **Keep credentials secure** - Don't share Claude or Vercel tokens
3. **Use .gitignore** - Exclude sensitive files from Git

## Quick Reference Commands

### Daily Workflow

```powershell
# 1. Create/edit content
claude

# 2. Build HTML
doc-builder build

# 3. Deploy updates
doc-builder deploy --prod
```

### Troubleshooting Commands

```powershell
# Check installations
node -v
npm -v
git --version
claude --version
vercel --version

# Update tools
npm update -g @knowcode/doc-builder@latest
npm update -g vercel@latest

# Clear npm cache
npm cache clean --force
```

## Additional Resources

### Official Documentation
- [Node.js on Windows Guide](https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [Claude Code with Pro/Max Plans](https://support.anthropic.com/en/articles/11145838-using-claude-code-with-your-pro-or-max-plan)
- [@knowcode/doc-builder on npm](https://www.npmjs.com/package/@knowcode/doc-builder)

### Troubleshooting Guides
- [PowerShell Execution Policy](https://dev.to/jackfd120/resolving-npm-execution-policy-error-in-powershell-a-step-by-step-guide-for-developers-32ip)
- [Git for Windows Setup](https://gitforwindows.org/)

## Conclusion

With this setup, you can create professional documentation in minutes:
1. **Claude Code** generates the content
2. **doc-builder** makes it beautiful
3. **Vercel** shares it with the world

The initial setup takes about 30 minutes, but once configured, you can create and deploy documentation sites in under 5 minutes!

---

**Need help?** File issues at the respective project repositories or check the troubleshooting sections above.