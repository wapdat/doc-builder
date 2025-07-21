# Vercel First-Time Setup Guide - Complete Prompt-by-Prompt Walkthrough

**Generated**: 2025-07-21 20:45 UTC  
**Status**: Complete  
**Verified**: ✅

## Overview

This guide provides a detailed explanation of every prompt you'll encounter during the first-time Vercel setup process when using `@knowcode/doc-builder deploy`. Understanding these prompts helps avoid common configuration errors and ensures successful deployment.

## Pre-Setup Prompts (doc-builder specific)

Before Vercel CLI starts, doc-builder asks several configuration questions:

### 1. Project Name Prompt

```
? What is your project name? › my-docs
```

**What it means**: ✅
- This becomes your Vercel project identifier
- It will form part of your deployment URL: `project-name.vercel.app`
- Must be lowercase, alphanumeric with hyphens only
- Auto-generated from your site name with special characters removed

**Best practice**: 
- Keep it short and memorable
- Use hyphens instead of spaces
- Example: `my-docs`, `company-docs`, `api-reference`

### 2. Custom Production URL

```
? Custom production URL (optional)? › 
```

**What it means**: ✅
- Leave empty for auto-detection (recommended for new projects)
- Or enter your custom domain/alias if you already have one
- Can be a full URL or just the domain

**Examples**:
- Empty (press Enter) - Vercel will auto-assign
- `docs.mycompany.com` - Custom domain
- `my-docs-v2.vercel.app` - Specific Vercel subdomain

### 3. Framework Preset

```
? Which framework preset? › - Use arrow-keys. Return to submit.
❯   Other (Static HTML)
    Next.js
    Vite
```

**What it means**: ✅
- Determines build settings and optimizations
- **ALWAYS choose "Other (Static HTML)"** for doc-builder
- This ensures Vercel treats your docs as pre-built static files

**Why this matters**:
- Wrong selection can trigger unwanted build processes
- May cause deployment failures or missing files

### 4. Public Access

```
? Make the deployment publicly accessible? › (Y/n)
```

**What it means**: ✅
- **Yes (Y)**: Anyone with the URL can view your docs
- **No (n)**: Only team members can access (requires Vercel login)

**Considerations**:
- Choose Yes for public documentation
- Choose No for internal/private docs
- Can be changed later in Vercel dashboard

## Vercel CLI Link Process

After the initial configuration, Vercel CLI takes over with its own prompts:

### 5. Directory Confirmation

```
? Set up and deploy "~/Documents/.../html"? [Y/n]
```

**What it means**: ✅
- Vercel is asking to deploy from the current directory
- This should show your `html` output directory path
- **ALWAYS answer YES**

**Common mistake**: 
- If you see a different path, you may be running from wrong directory
- Should be run from project root, not from inside `html` folder

### 6. Scope Selection

```
? Which scope should contain your project? › 
❯   Lindsay Smith (lindsay-smith)
    Another Team (team-slug)
```

**What it means**: ✅
- Determines which account/team owns the project
- Personal accounts show as "Your Name (username)"
- Team accounts show as "Team Name (team-slug)"
- **Select your personal account for individual projects**

**When to use teams**:
- Collaborative projects
- Company/organization deployments
- Shared billing and permissions

### 7. Existing Project Detection

```
? Found project "lindsay-1340s-projects/html". Link to it? [Y/n]
```

**What it means**: ✅
- Vercel found a project with similar name/path
- This is often a **false match** - generic names like "html" are common
- **ALWAYS answer NO unless you're 100% sure it's YOUR project**

**Why this happens**:
- Vercel searches for projects with matching directory names
- Common folder names (html, docs, dist) often match other projects
- The suggested project usually belongs to someone else

### 8. Link to Different Project

```
? Link to different existing project? [Y/n]
```

**What it means**: ✅
- **Yes (Y)**: You have an existing Vercel project to connect to
- **No (n)**: Create a brand new project

**When to answer YES**:
- You've deployed before and want to update existing project
- You created a project in Vercel dashboard first
- You're reconnecting after deleting `.vercel` folder

**When to answer NO**:
- First time deploying this documentation
- Want a fresh project with new URL
- Previous project had configuration issues

### 9A. Existing Project Name (if answered YES to #8)

```
? What's the name of your existing project? › 
```

**What it means**: ✅
- Enter the exact name of your existing Vercel project
- Must match the project name in your Vercel dashboard
- Case-sensitive

**How to find project name**:
1. Go to https://vercel.com/dashboard
2. Look for your project in the list
3. Use the exact name shown

### 9B. New Project Name (if answered NO to #8)

```
? What is your project name? › my-docs
```

**What it means**: ✅
- Creates a new project with this name
- Will become your default URL: `project-name.vercel.app`
- Must be unique across all Vercel projects

**Best practices**:
- Use same name as initial prompt for consistency
- Keep it descriptive but concise
- Avoid generic names like "docs" or "html"

## Critical Post-Setup Configuration

### Root Directory Warning

After linking, you may see an error about "html/html does not exist". This means Vercel incorrectly set the Root Directory.

**The Problem**: ❌
- Vercel sometimes auto-sets Root Directory to "html"
- But we're already deploying FROM the html directory
- This creates a path like `html/html` which doesn't exist

**The Solution**: ✅
1. Go to your project settings: `https://vercel.com/[your-project]/settings`
2. Find "Root Directory" under "Build & Development Settings"
3. **DELETE any value** - leave it completely empty
4. Click "Save"

### Build Settings Configuration

Vercel may also auto-detect build commands that interfere with static deployment.

**Check these settings**:
- **Build Command**: Should be empty
- **Output Directory**: Should be empty or "./"
- **Install Command**: Should be empty
- **Development Command**: Should be empty

**If any have values**:
1. Clear them completely
2. Save changes
3. Redeploy

## Deployment Protection Settings

For public documentation:

1. Navigate to **Project Settings > General**
2. Find **"Deployment Protection"** under Security
3. Set to **"Disabled"** for public access
4. Or configure password protection if needed

## Common Issues and Solutions

### Issue 1: "Cannot read properties of null"

**Cause**: Build settings conflict
**Solution**: Clear all build settings in Vercel dashboard

### Issue 2: "Directory html/html does not exist"

**Cause**: Root Directory misconfiguration
**Solution**: Remove "html" from Root Directory setting

### Issue 3: "404 errors on deployment"

**Cause**: Files not in correct location
**Solution**: Ensure you ran `doc-builder build` before deploying

### Issue 4: "Permission denied"

**Cause**: Not logged into Vercel
**Solution**: Run `vercel login` first

## Quick Reference Checklist

```
✅ 1. Project name? → your-project-name
✅ 2. Custom URL? → [Leave empty or enter domain]
✅ 3. Framework? → Other (Static HTML)
✅ 4. Public? → Yes (for public docs)
✅ 5. Set up ~/html? → YES
✅ 6. Which scope? → Your account
✅ 7. Found project "xyz/html"? → NO
✅ 8. Link to different project? → YES/NO (your choice)
✅ 9. Project name? → [Based on #8 answer]
✅ 10. Check Root Directory → Must be EMPTY
```

## Pro Tips

1. **Save your answers**: Document your choices for future reference
2. **Verify URLs**: Always check the deployment URL matches expectations
3. **Use unique names**: Avoid conflicts with generic project names
4. **Check settings**: Always verify Vercel dashboard settings after setup
5. **Keep it simple**: Don't add build commands for static sites

## Next Steps

After successful setup:
1. Your docs are live at `https://[project-name].vercel.app`
2. Future deploys just need: `npx @knowcode/doc-builder deploy`
3. Add custom domain in Vercel dashboard if needed
4. Configure team access if required

---

This guide covers every prompt in the Vercel first-time setup process. For additional help, refer to the main [Vercel CLI Setup Guide](./vercel-cli-setup-guide.md).