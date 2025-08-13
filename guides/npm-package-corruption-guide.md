# NPM Package Corruption Prevention Guide

## Overview

This guide documents common npm package corruption issues and how to prevent them. These issues can cause packages to be unpublishable, undownloadable, or excessively large.

## Common Issues and Solutions

### 1. Circular Dependencies

**Problem**: Package depending on itself in `package.json`
```json
{
  "name": "@knowcode/doc-builder",
  "dependencies": {
    "@knowcode/doc-builder": "^1.4.21"  // ❌ Circular dependency!
  }
}
```

**Solution**: Remove self-referential dependencies
```json
{
  "name": "@knowcode/doc-builder",
  "dependencies": {
    // ✅ No self-reference
  }
}
```

### 2. Missing or Incorrect Files Configuration

**Problem**: No control over what gets included in the package

**Solution**: Use either `files` field in `package.json` or `.npmignore` (or both)

#### Using `files` field (Recommended - Whitelist approach)
```json
{
  "files": [
    "cli.js",
    "index.js",
    "lib/**/*",
    "assets/**/*",
    "scripts/**/*",
    "README.md",
    "LICENSE",
    "CHANGELOG.md"
  ]
}
```

#### Using `.npmignore` (Blacklist approach)
```bash
# Output directories
html/
html-static/
dist/
build/

# Development files
*.sql
*.png
*.jpg
Screenshot*

# Configuration backups
*.backup.*
doc-builder.config.js*

# Local settings
.claude/
.vscode/
```

### 3. Excessive Package Size

**Symptoms**:
- Package size > 1MB for a simple tool
- Hundreds of files in the package
- SQL files, images, or test data included

**How to check**:
```bash
# See what would be included (dry run)
npm pack --dry-run

# Check actual package size
npm pack
ls -lh *.tgz

# See package contents
tar -tzf package-name-version.tgz
```

**Common culprits**:
- Generated HTML directories
- Screenshot files
- Database dumps (.sql files)
- Configuration backup files
- Test data directories
- Local development files

### 4. Package Verification Checklist

Before publishing, always verify:

```bash
# 1. Check what files will be included
npm pack --dry-run | head -50

# 2. Look for red flags:
#    - More than 50 files for a simple package
#    - .sql, .png, .jpg files
#    - html/ or dist/ directories
#    - backup files (*.backup.*)

# 3. Create test package
npm pack

# 4. Verify size (should be < 500KB for most tools)
ls -lh *.tgz

# 5. Test installation locally
npm install ./package-name-version.tgz
```

## Best Practices

### 1. Always use `files` field in package.json
This is the safest approach - explicitly list what should be included.

### 2. Keep package lean
- Only include runtime necessities
- Exclude all development, test, and documentation files
- No images unless absolutely necessary

### 3. Regular cleanup
```bash
# Remove old package files
rm -f *.tgz

# Clean npm cache if having issues
npm cache clean --force
```

### 4. Version management
- Increment version for every publish
- Use semantic versioning (major.minor.patch)
- Document changes in CHANGELOG.md

## Emergency Recovery

If you've published a corrupt package:

1. **Unpublish quickly** (within 72 hours):
```bash
npm unpublish @package-name@version
```

2. **Fix the issues**:
- Remove circular dependencies
- Add proper files configuration
- Clean up unnecessary files

3. **Publish new version**:
```bash
npm version patch  # or minor/major
npm publish
```

## Example: doc-builder Fix

The @knowcode/doc-builder package had all these issues:
- **Before**: 2.9MB, 217 files, circular dependency
- **After**: 111KB, 20 files, clean dependencies

Fix applied:
1. Removed self-dependency from package.json
2. Added explicit `files` field
3. Updated .npmignore to exclude unnecessary files
4. Removed screenshots from scripts directory
5. Published clean version

## Testing Your Package

Create a test script to verify your package:

```bash
#!/bin/bash
# test-package.sh

echo "Testing npm package..."

# Pack and check size
npm pack
SIZE=$(ls -lh *.tgz | awk '{print $5}')
FILES=$(npm pack --dry-run 2>&1 | grep "total files" | awk '{print $3}')

echo "Package size: $SIZE"
echo "Total files: $FILES"

if [ "$FILES" -gt 50 ]; then
  echo "⚠️  Warning: Package contains $FILES files (>50)"
fi

# Check for unwanted files
npm pack --dry-run 2>&1 | grep -E "\.(sql|png|jpg|backup)" && \
  echo "⚠️  Warning: Package contains unwanted files"

echo "✅ Package check complete"
```

## Conclusion

Package corruption often stems from including unnecessary files or having configuration errors. Regular verification using `npm pack --dry-run` and maintaining proper `files`/`.npmignore` configuration prevents these issues.