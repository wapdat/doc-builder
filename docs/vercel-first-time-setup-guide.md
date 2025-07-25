# Vercel First-Time Setup Guide

## Overview

This guide walks you through the Vercel deployment process when using `@knowcode/doc-builder deploy`.

## The Deployment Process

### Step 1: Run the Deploy Command

```bash
npx @knowcode/doc-builder@latest deploy
```

### Step 2: doc-builder Configuration

The tool will ask a few simple questions:

#### Project Name
```
? What is your project name? › my-docs
```
- This becomes your Vercel project identifier
- Will be part of your URL: `project-name.vercel.app`
- Use lowercase letters, numbers, and hyphens only

#### Custom Production URL (Optional)
```
? Custom production URL (optional)? › 
```
- Press Enter to skip (recommended for first-time setup)
- Or enter your custom domain if you have one

### Step 3: Vercel CLI Takes Over

The Vercel CLI will guide you through the following prompts:

#### Deploy Confirmation
```
Vercel CLI 28.0.0
? Set up and deploy "~/path/to/your/project/html"? [Y/n]
```
- Answer **Yes** to proceed
- This confirms you want to deploy the current directory

#### Account Selection
```
? Which scope do you want to deploy to? › 
  ○ Your Name
  ○ Your Team (if applicable)
```
- Select your personal account or team
- Use arrow keys to navigate, Enter to select

#### Project Name Confirmation
```
? What's your project's name? (my-docs)
```
- Vercel suggests the name you provided earlier
- Press Enter to accept or type a new name

#### Framework Detection
```
? In which directory is your code located? ./
```
- Vercel automatically detects this is a static site
- Usually defaults to `./` which is correct
- Press Enter to accept

### Step 4: Deployment Begins

That's it! Vercel will now:
1. Upload your files
2. Deploy to their global CDN
3. Provide your live URL

```
✓ Production: https://my-docs.vercel.app [copied to clipboard]
```

## Post-Deployment Configuration

### Making Your Docs Public

By default, Vercel may protect your deployment. To make docs publicly accessible:

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project
3. Navigate to **Settings → Deployment Protection**
4. Set **Vercel Authentication** to **Disabled**
5. Click **Save**

### SEO Optimization

Once deployed, optimize your documentation for search engines:

1. **Check SEO Status**:
   ```bash
   npx @knowcode/doc-builder@latest seo-check
   ```

2. **Configure SEO Settings**:
   ```bash
   npx @knowcode/doc-builder@latest setup-seo
   ```

3. **Review the SEO Guide**: See our comprehensive [SEO Optimization Guide](./guides/seo-optimization-guide.md) for best practices

### Google Search Console Setup

Make your documentation discoverable on Google:

1. **Add Verification**:
   ```bash
   npx @knowcode/doc-builder@latest google-verify YOUR_VERIFICATION_CODE
   ```

2. **Submit Sitemap**: 
   - Your sitemap is automatically generated at `/sitemap.xml`
   - Submit it in Google Search Console

3. **Full Instructions**: See the [Search Engine Verification Guide](./guides/search-engine-verification-guide.md)

### Custom Domain (Optional)

To add a custom domain:
1. Go to **Settings → Domains**
2. Add your domain
3. Follow DNS configuration instructions
4. Update your sitemap URL in Google Search Console

### Environment Variables (If Using Authentication)

If you enabled authentication in doc-builder:
1. Go to **Settings → Environment Variables**
2. Add your auth credentials
3. Redeploy to apply changes

## Troubleshooting

### "Vercel CLI not found"

If you see this error, install Vercel CLI:
```bash
npm install -g vercel
```

### "404 Not Found" After Deployment

Make sure you:
1. Ran the deploy command from your project root
2. Have markdown files in your `docs/` folder
3. Didn't modify the build output

### "Authentication Required" Error

Your deployment is protected. Follow the "Making Your Docs Public" steps above.

### Deployment Fails

Check that:
1. You're using the latest version: `npx @knowcode/doc-builder@latest deploy`
2. Your `docs/` folder contains `.md` files
3. You have internet connection

## Quick Checklist

```
✅ 1. Run: npx @knowcode/doc-builder@latest deploy
✅ 2. Enter project name (e.g., my-docs)
✅ 3. Skip custom URL (press Enter)
✅ 4. Confirm deployment when Vercel asks
✅ 5. Select your account/scope
✅ 6. Accept suggested project name
✅ 7. Get your live URL!
```

## Best Practices

1. **First Time**: Just accept all defaults
2. **Project Names**: Use descriptive names like `company-api-docs`
3. **Custom Domains**: Add them after successful deployment
4. **Updates**: Future deploys are even simpler - just run the same command

## Next Steps

After successful deployment:
1. Visit your live docs at the provided URL
2. Make your docs public in Vercel settings if needed
3. Add a custom domain if desired
4. Share your documentation with the world!

## Getting Help

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Vercel Support**: https://vercel.com/support
- **doc-builder Issues**: File on GitHub or npm

---

For additional Vercel CLI configuration options, see the [Vercel CLI Setup Guide](./vercel-cli-setup-guide.md).