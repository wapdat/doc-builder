# GitHub Repository Setup Instructions

This guide will walk you through setting up the doc-builder project on GitHub.

## Prerequisites

- GitHub account
- Git installed locally
- Command line access

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository settings:
   - **Repository name**: `doc-builder`
   - **Description**: `Transform markdown into beautiful documentation sites with one-command Vercel deployment`
   - **Public** repository (for open source)
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)

3. Click "Create repository"

## Step 2: Update Local Git Configuration

First, let's check the current remote:

```bash
git remote -v
```

You'll see it points to a local directory. We need to change this to GitHub.

## Step 3: Add GitHub as Remote

Since your repository is at https://github.com/wapdat/doc-builder:

```bash
# Remove the existing remote
git remote remove origin

# Add GitHub as the new origin
git remote add origin https://github.com/wapdat/doc-builder.git

# Verify the change
git remote -v
```

## Step 4: Push to GitHub

```bash
# Push all branches and tags
git push -u origin main
git push --tags
```

## Step 5: Configure Repository Settings

On GitHub, go to Settings and configure:

### General Settings
- **Features**: Enable Issues, Projects, and Discussions
- **Pull Requests**: Allow merge commits, squash merging, and rebase merging

### Branch Protection (Settings → Branches)
For the `main` branch:
- [ ] Require pull request reviews before merging
- [ ] Dismiss stale pull request approvals
- [ ] Require status checks to pass
- [ ] Include administrators

### Pages (optional, for documentation)
- Source: Deploy from a branch
- Branch: main
- Folder: /docs

### Topics
Add these topics to help people discover your project:
- `documentation`
- `markdown`
- `static-site-generator`
- `vercel`
- `notion`
- `developer-tools`
- `nodejs`
- `npm-package`

## Step 6: Add Badges to README

Update your README.md to include GitHub badges:

```markdown
[![npm version](https://img.shields.io/npm/v/@knowcode/doc-builder)](https://www.npmjs.com/package/@knowcode/doc-builder)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/wapdat/doc-builder)](https://github.com/wapdat/doc-builder/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/wapdat/doc-builder)](https://github.com/wapdat/doc-builder/issues)
```

## Step 7: Create Initial Release

1. Go to https://github.com/wapdat/doc-builder/releases
2. Click "Create a new release"
3. Tag version: `v1.5.21`
4. Release title: `v1.5.21 - Stable Release`
5. Description:
   ```markdown
   ## Doc Builder v1.5.21
   
   First public release of Doc Builder on GitHub!
   
   ### Features
   - ✨ Notion-inspired design
   - 🚀 One-command Vercel deployment
   - 🔍 Built-in search functionality
   - 🌓 Dark mode support
   - 📊 Mermaid diagram integration
   - 🔐 Password protection option
   
   ### Installation
   ```bash
   npm install -g @knowcode/doc-builder
   ```
   
   ### Quick Start
   ```bash
   npx @knowcode/doc-builder@latest deploy
   ```
   ```
6. Click "Publish release"

## Step 8: Set Up GitHub Actions (Optional)

Create `.github/workflows/npm-publish.yml`:

```yaml
name: Publish to NPM

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm test
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{secrets.NPM_TOKEN}}
```

To use this:
1. Get npm token from https://www.npmjs.com/settings/YOUR_NPM_USERNAME/tokens
2. Add as secret in GitHub: Settings → Secrets → Actions → New repository secret
3. Name: `NPM_TOKEN`

## Step 9: Update Package.json

Add GitHub repository info to package.json:

```json
"repository": {
  "type": "git",
  "url": "git+https://github.com/wapdat/doc-builder.git"
},
"bugs": {
  "url": "https://github.com/wapdat/doc-builder/issues"
},
"homepage": "https://github.com/wapdat/doc-builder#readme"
```

## Step 10: Announce the Repository

Once everything is set up:

1. Update the demo site to link to GitHub
2. Update npm package to include repository link
3. Share on social media
4. Submit to awesome lists
5. Post in relevant communities

## Maintenance Tips

- Respond to issues promptly
- Review pull requests within a week
- Keep dependencies updated
- Tag releases consistently
- Maintain a clear roadmap
- Acknowledge contributors

## Next Steps

1. [ ] Create a GitHub Project board for roadmap
2. [ ] Set up GitHub Discussions for community
3. [ ] Add GitHub Sponsors if desired
4. [ ] Create GitHub Wiki for extended docs
5. [ ] Set up automated testing with GitHub Actions

The repository is configured for https://github.com/wapdat/doc-builder