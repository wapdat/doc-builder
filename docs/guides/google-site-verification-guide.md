# Google Site Verification Guide

This guide explains how to verify your documentation site with Google Search Console using @knowcode/doc-builder.

## Overview

Google Search Console verification allows you to:
- Monitor your site's performance in Google Search
- Submit sitemaps for better indexing
- View search analytics and keywords
- Identify and fix crawl errors
- Receive alerts about site issues

## Prerequisites

- @knowcode/doc-builder v1.5.4 or higher
- Access to Google Search Console
- A deployed documentation site

## Step 1: Get Your Verification Code

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click "Add property" and enter your documentation site URL
3. Choose the "HTML tag" verification method
4. Copy the verification code from the meta tag:
   ```html
   <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
   ```
5. You only need the content value (e.g., `FtzcDTf5BQ9K5EfnGazQkgU2U4FiN3ITzM7gHwqUAqQ`)

## Step 2: Add Verification to Your Site

Use the doc-builder CLI to add the verification meta tag:

```bash
doc-builder google-verify YOUR_VERIFICATION_CODE
```

Example:
```bash
doc-builder google-verify FtzcDTf5BQ9K5EfnGazQkgU2U4FiN3ITzM7gHwqUAqQ
```

This command will:
- Update your `doc-builder.config.js` file
- Add the verification meta tag to the SEO configuration
- Show confirmation of the added tag

## Step 3: Rebuild and Deploy

After adding the verification code, rebuild and deploy your documentation:

```bash
# Rebuild the documentation
doc-builder build

# Deploy to production
doc-builder deploy
```

## Step 4: Complete Verification

1. Return to Google Search Console
2. Click "Verify" on the verification page
3. Google will check for the meta tag on your site
4. Once verified, you'll have access to all Search Console features

## Configuration Details

The verification code is stored in your config file under `seo.customMetaTags`:

```javascript
module.exports = {
  // ... other config
  seo: {
    enabled: true,
    customMetaTags: [
      {
        name: "google-site-verification",
        content: "YOUR_VERIFICATION_CODE"
      }
    ]
  }
};
```

## Multiple Verifications

You can add multiple verification codes or other custom meta tags:

```javascript
seo: {
  customMetaTags: [
    {
      name: "google-site-verification",
      content: "GOOGLE_CODE"
    },
    {
      name: "bing-site-verification",
      content: "BING_CODE"
    },
    {
      name: "yandex-verification",
      content: "YANDEX_CODE"
    }
  ]
}
```

## Updating Verification Code

To update an existing verification code, simply run the command again with the new code:

```bash
doc-builder google-verify NEW_VERIFICATION_CODE
```

## Troubleshooting

### Verification Failed

If Google can't verify your site:

1. **Check deployment status**: Ensure your site is deployed and accessible
2. **View page source**: Verify the meta tag appears in the `<head>` section
3. **Clear cache**: If using a CDN, clear the cache and wait a few minutes
4. **Check URL**: Ensure you're verifying the exact URL (with or without www)

### Meta Tag Not Appearing

If the meta tag doesn't appear in your HTML:

1. Rebuild your documentation: `doc-builder build`
2. Check your config file for syntax errors
3. Ensure SEO is enabled in your configuration
4. Verify the deployment includes the latest changes

### Manual Configuration

You can also manually add the verification to your config:

1. Open `doc-builder.config.js`
2. Add or update the SEO section:
   ```javascript
   seo: {
     enabled: true,
     customMetaTags: [
       {
         name: "google-site-verification",
         content: "YOUR_VERIFICATION_CODE"
       }
     ]
   }
   ```
3. Save and rebuild your documentation

## Best Practices

1. **Keep verification active**: Don't remove the meta tag after verification
2. **Add site URL**: Configure `seo.siteUrl` in your config for better SEO
3. **Submit sitemap**: After verification, submit your sitemap.xml
4. **Monitor regularly**: Check Search Console weekly for issues
5. **Multiple owners**: Add team members as additional owners in Search Console

## Related Features

- **Sitemap generation**: Automatically generated at `/sitemap.xml`
- **robots.txt**: Automatically generated with proper directives
- **SEO optimization**: Built-in meta tags and structured data
- **Production URL**: Set with `doc-builder set-production-url`

## Security Note

Your verification code is specific to your Google account and domain. It's safe to commit to your repository as it only grants access to Search Console data, not your Google account.

## Next Steps

After verification:
1. Submit your sitemap in Search Console
2. Set up email alerts for crawl errors
3. Monitor search performance and impressions
4. Use the data to improve your documentation SEO

---

For more information about Google Search Console, visit the [official documentation](https://support.google.com/webmasters).