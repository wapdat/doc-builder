#!/bin/bash

echo "🧹 Cache Busting Test for doc-builder"
echo "===================================="

# Step 1: Clean everything
echo "1. Removing old build artifacts..."
rm -rf html/
rm -rf node_modules/
rm -rf .cache/

# Step 2: Clear npm cache
echo "2. Clearing npm cache..."
npm cache clean --force

# Step 3: Install latest version
echo "3. Installing latest doc-builder..."
npm install @knowcode/doc-builder@latest

# Step 4: Show version
echo "4. Installed version:"
npm list @knowcode/doc-builder

# Step 5: Build fresh
echo "5. Building documentation..."
npx @knowcode/doc-builder build

# Step 6: Check CSS content
echo "6. Checking if CSS has latest changes..."
echo "   Looking for 'margin: 0; /* Left aligned'..."
grep -n "margin: 0; /\* Left aligned" html/css/notion-style.css || echo "NOT FOUND!"

echo "   Looking for 'position: fixed; /* Use fixed'..."
grep -n "position: fixed; /\* Use fixed" html/css/notion-style.css || echo "NOT FOUND!"

echo ""
echo "✅ If you see the CSS changes above, the package is working correctly!"
echo "🚨 If not found, there's a build issue we need to investigate."
echo ""
echo "Next steps:"
echo "1. Deploy with: vercel --prod --force"
echo "2. Open in incognito/private browsing"
echo "3. Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)"