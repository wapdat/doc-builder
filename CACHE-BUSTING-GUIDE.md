# Cache Busting Guide for @knowcode/doc-builder

If you're not seeing updates after upgrading to a new version, it's likely due to caching. Follow these steps:

## 1. Clean Everything Locally

```bash
# Remove old build artifacts
rm -rf html/

# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules
npm install

# Make sure you have the latest version
npm install @knowcode/doc-builder@latest
```

## 2. Rebuild with Fresh Files

```bash
# Build fresh documentation
npx @knowcode/doc-builder build
```

## 3. Deploy with Force Flag

```bash
# Force Vercel to ignore cache
vercel --prod --force
```

## 4. Clear Browser Cache

- **Chrome/Edge**: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
- **Firefox**: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
- **Safari**: Cmd+Option+R
- Or use Incognito/Private browsing mode

## 5. Clear Vercel/CDN Cache (if applicable)

If using Vercel:
1. Go to your project dashboard
2. Settings → Functions → Purge Cache
3. Or redeploy with a different domain temporarily

## 6. Add Cache Busting to Your Build

Edit your `doc-builder.config.js` to add version query strings:

```javascript
module.exports = {
  // ... other config
  cacheBust: true, // This will add ?v=timestamp to CSS/JS files
};
```

## Common Issues

- **"I updated but nothing changed"** - It's cache. Follow all steps above.
- **"Tooltips still don't work"** - Clear browser cache and check console for errors
- **"Spacing is still wrong"** - The CSS is cached. Hard refresh the page.

## Verify You Have The Right Version

Check the version in your package.json:
```bash
npm list @knowcode/doc-builder
```

Should show: `@knowcode/doc-builder@1.3.13` or higher.

## Still Not Working?

1. Open browser DevTools
2. Go to Network tab
3. Check "Disable cache" checkbox
4. Refresh the page
5. Look at the CSS/JS files being loaded - they should not show "(from cache)"