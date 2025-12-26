# NPM Package Deployment Guide

A comprehensive guide for deploying and publishing npm packages with automated workflows, based on the @knowcode/doc-builder implementation.

## Prerequisites

Before you start, ensure you have:

1. **NPM Account**
   - Create account at https://www.npmjs.com
   - Verify your email address

2. **NPM Authentication**
   ```bash
   npm login
   npm whoami  # Verify you're logged in
   ```

3. **Git Repository**
   - GitHub account
   - Repository with proper `.gitignore`
   - Clean working directory

4. **Package Configuration**
   - Valid `package.json`
   - Proper version numbering (semver)
   - Correct file inclusions

## Package.json Configuration

### Essential Fields

```json
{
  "name": "@yourorg/package-name",
  "version": "1.0.0",
  "description": "Clear description of what your package does",
  "main": "index.js",
  "bin": {
    "package-name": "cli.js"
  },
  "scripts": {
    "test": "node cli.js build && echo \"Build test passed\"",
    "build": "node cli.js build"
  },
  "keywords": [
    "relevant",
    "searchable",
    "keywords"
  ],
  "author": "Your Name or Organization",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/username/repo.git"
  },
  "bugs": {
    "url": "https://github.com/username/repo/issues"
  },
  "homepage": "https://github.com/username/repo#readme",
  "files": [
    "cli.js",
    "index.js",
    "lib/**/*",
    "assets/**/*",
    "scripts/**/*",
    "templates/**/*",
    "README.md",
    "LICENSE",
    "CHANGELOG.md"
  ],
  "engines": {
    "node": ">=14.0.0"
  }
}
```

### Key Configuration Points

1. **files field** - Only include necessary files to reduce package size
2. **engines** - Specify minimum Node.js version
3. **scripts.test** - GitHub Actions will run this
4. **scripts.build** - Required for CI/CD workflows

## Deployment Process

### Simple Manual Deployment

This is the recommended approach for most projects:

```bash
# 1. Update version in package.json
# Manually edit package.json or use npm version

# 2. Commit your changes
git add .
git commit -m "feat: Add new feature description"

# 3. Publish to npm
npm publish

# 4. Push to GitHub
git push
```

### Automated Deployment Script

If you want automation, create `deploy.sh`:

```bash
#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting deployment process..."

# Check if working directory is clean
if [ -n "$(git status --porcelain)" ]; then
  echo "❌ Working directory is not clean. Commit your changes first."
  exit 1
fi

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo "Current version: $CURRENT_VERSION"

# Ask for new version
echo "Enter new version (or press Enter to keep $CURRENT_VERSION):"
read NEW_VERSION

if [ -n "$NEW_VERSION" ]; then
  # Update version in package.json
  npm version $NEW_VERSION --no-git-tag-version
  echo "✅ Version updated to $NEW_VERSION"
else
  NEW_VERSION=$CURRENT_VERSION
  echo "ℹ️  Keeping version $CURRENT_VERSION"
fi

# Get commit message
echo "Enter commit message:"
read COMMIT_MSG

if [ -z "$COMMIT_MSG" ]; then
  echo "❌ Commit message required"
  exit 1
fi

# Commit changes
git add .
git commit -m "$COMMIT_MSG"
echo "✅ Changes committed"

# Publish to npm
npm publish
echo "✅ Published to npm"

# Push to GitHub
git push
echo "✅ Pushed to GitHub"

echo "🎉 Deployment complete! Version $NEW_VERSION published."
```

Make it executable:
```bash
chmod +x deploy.sh
```

## GitHub Actions CI/CD Setup

Create `.github/workflows/test.yml`:

```yaml
name: Test

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
    - uses: actions/checkout@v4

    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}

    - name: Install dependencies
      run: npm ci

    - name: Run tests
      run: npm test

    - name: Build project
      run: npm run build

    - name: Check code style
      run: npm run lint --if-present
```

### Important CI/CD Notes

1. **npm ci vs npm install**: Use `npm ci` in CI/CD for clean, reproducible builds
2. **package-lock.json**: Commit this file to ensure consistent dependencies
3. **Test script**: Must exit with code 0 for tests to pass
4. **Build script**: Must be defined in package.json

## Version Numbering (Semantic Versioning)

Follow [semver](https://semver.org/) principles:

- **MAJOR.MINOR.PATCH** (e.g., 1.10.2)

### When to Increment

**MAJOR** (1.0.0 → 2.0.0)
- Breaking changes
- Incompatible API changes
- Major rewrites

**MINOR** (1.0.0 → 1.1.0)
- New features (backward compatible)
- New functionality
- Deprecations (not removals)

**PATCH** (1.0.0 → 1.0.1)
- Bug fixes
- Performance improvements
- Documentation updates

### NPM Version Commands

```bash
# Automatically increment and update package.json
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.0 → 1.1.0
npm version major  # 1.0.0 → 2.0.0

# Or specify exact version
npm version 1.2.3
```

## Pre-Publishing Checklist

Before publishing, verify:

- [ ] Version number updated in package.json
- [ ] CHANGELOG.md updated with changes
- [ ] README.md is current and accurate
- [ ] All tests passing (`npm test`)
- [ ] Build successful (`npm run build`)
- [ ] No sensitive data in repository
- [ ] `.gitignore` excludes unnecessary files
- [ ] `package.json` "files" field only includes needed files
- [ ] Clean git status (all changes committed)
- [ ] Logged into npm (`npm whoami`)

## Publishing Process

### First Time Publishing

```bash
# 1. Login to npm
npm login

# 2. Verify package.json is correct
cat package.json | grep -E "name|version|main"

# 3. Do a dry run (shows what will be published)
npm pack
# This creates a .tgz file - inspect it to verify contents

# 4. Publish
npm publish

# For scoped packages (@org/name), make public:
npm publish --access public
```

### Subsequent Releases

```bash
# 1. Update version
npm version patch  # or minor, or major

# 2. Commit
git add package.json
git commit -m "chore: Bump version to $(node -p "require('./package.json').version")"

# 3. Publish
npm publish

# 4. Push
git push
```

## Common Issues and Solutions

### Issue: "You must verify your email"

**Solution:**
```bash
# Check npm settings
npm config get email

# Update if needed
npm config set email "your@email.com"

# Verify email on npmjs.com
```

### Issue: "Package already published"

**Solution:**
```bash
# Check current version
npm view @yourorg/package-name version

# Update your version to be higher
npm version patch
npm publish
```

### Issue: "No permission to publish"

**Solution:**
```bash
# Verify you're logged in
npm whoami

# Verify package name is available
npm search @yourorg/package-name

# For scoped packages, use --access public
npm publish --access public
```

### Issue: "GitHub Actions test failing"

**Solution:**
```bash
# Ensure scripts exist in package.json
"scripts": {
  "test": "echo 'Running tests' && exit 0",
  "build": "echo 'Building' && exit 0"
}

# Or implement actual tests/build
"scripts": {
  "test": "node cli.js build && echo 'Build test passed'",
  "build": "node cli.js build"
}
```

## Best Practices

### 1. Use Conventional Commits

Structure commits for better changelogs:

```bash
git commit -m "feat: Add new deployment feature"
git commit -m "fix: Correct homepage priority logic"
git commit -m "docs: Update installation guide"
git commit -m "perf: Optimize memory usage by 50%"
git commit -m "chore: Update dependencies"
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

### 2. Maintain a CHANGELOG.md

```markdown
# Changelog

## [1.10.2] - 2025-01-16

### Fixed
- Homepage priority now correctly prefers index.md over README.md

## [1.10.1] - 2025-01-16

### Fixed
- Added npm test and build scripts for CI/CD compatibility

## [1.10.0] - 2025-01-16

### Changed
- Major performance improvements: 50-70% memory reduction
- 30-40% faster builds
```

### 3. Test Before Publishing

```bash
# Install your package locally
npm pack
npm install -g knowcode-doc-builder-1.10.2.tgz

# Test the installed version
doc-builder --version
doc-builder build

# Uninstall when done
npm uninstall -g @knowcode/doc-builder
```

### 4. Use .npmignore or package.json "files"

**.npmignore** (blacklist approach):
```
node_modules/
.git/
.github/
test/
*.test.js
.env
.DS_Store
```

**package.json "files"** (whitelist approach - recommended):
```json
{
  "files": [
    "lib/",
    "cli.js",
    "index.js",
    "README.md"
  ]
}
```

### 5. Security Best Practices

```bash
# Check for vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Never commit:
- API keys
- Passwords
- Private keys
- .env files
- node_modules/
```

## Deployment Workflow Example

Complete workflow from development to published package:

```bash
# 1. Make changes to your code
vim lib/core-builder.js

# 2. Test locally
npm test

# 3. Update version
npm version patch  # 1.10.1 → 1.10.2

# 4. Commit changes
git add .
git commit -m "fix: Correct homepage priority logic"

# 5. Publish to npm
npm publish

# 6. Push to GitHub
git push

# 7. Verify publication
npm view @knowcode/doc-builder version
# Should show your new version

# 8. Check GitHub Actions
# Visit https://github.com/username/repo/actions
# Verify tests are passing
```

## Automation Script for Another Project

To implement this in a new project:

```bash
# 1. Initialize npm package
npm init --scope=@yourorg

# 2. Create necessary files
touch README.md CHANGELOG.md LICENSE
mkdir -p .github/workflows

# 3. Copy GitHub Actions workflow
cp path/to/doc-builder/.github/workflows/test.yml .github/workflows/

# 4. Update package.json
# Add scripts, files, engines fields

# 5. Create deployment script (optional)
cat > deploy.sh << 'EOF'
#!/bin/bash
set -e
npm version patch
git add .
git commit -m "chore: Release new version"
npm publish
git push
EOF
chmod +x deploy.sh

# 6. First publish
npm login
npm publish --access public

# 7. Verify
npm view @yourorg/your-package
```

## Quick Reference Commands

```bash
# Version management
npm version patch              # Increment patch version
npm version minor              # Increment minor version
npm version major              # Increment major version

# Publishing
npm login                      # Login to npm
npm whoami                     # Check who you're logged in as
npm publish                    # Publish package
npm publish --access public    # Publish scoped package publicly

# Testing
npm pack                       # Create tarball to inspect
npm test                       # Run tests
npm run build                  # Run build

# Git operations
git add .                      # Stage all changes
git commit -m "message"        # Commit changes
git push                       # Push to remote

# Verification
npm view @org/package version  # Check published version
gh run list --limit 3          # Check GitHub Actions status
```

## Resources

- **NPM Documentation**: https://docs.npmjs.com/
- **Semantic Versioning**: https://semver.org/
- **Conventional Commits**: https://www.conventionalcommits.org/
- **GitHub Actions**: https://docs.github.com/en/actions
- **Package.json Fields**: https://docs.npmjs.com/cli/v10/configuring-npm/package-json

## Example: Real Deployment from @knowcode/doc-builder

This is exactly how we deployed v1.10.2:

```bash
# 1. Made code changes to fix homepage priority
vim lib/core-builder.js

# 2. Tested the changes
node cli.js build

# 3. Updated version in package.json
# Changed from 1.10.1 to 1.10.2

# 4. Committed changes
git add package.json lib/core-builder.js
git commit -m "fix: Correct homepage priority - index.md now properly overrides README.md"

# 5. Published to npm (already logged in)
npm publish

# 6. Pushed to GitHub
git push

# 7. Verified
npm view @knowcode/doc-builder version
# Output: 1.10.2 ✅

# GitHub Actions automatically ran tests and passed ✅
```

That's it! Simple, straightforward, and reliable.
