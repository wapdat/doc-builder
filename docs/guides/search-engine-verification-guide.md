# Search Engine Verification Guide

This guide explains how to verify your documentation site with Google Search Console and Bing Webmaster Tools using @knowcode/doc-builder.

## Overview

Search engine verification provides access to powerful webmaster tools:

### Google Search Console
- Monitor your site's performance in Google Search
- Submit sitemaps for better indexing
- View search analytics and keywords
- Identify and fix crawl errors
- Receive alerts about site issues

### Bing Webmaster Tools
- Track your site's performance in Bing and Yahoo
- Submit sitemaps and monitor indexing
- Analyze search keywords and backlinks
- Identify SEO opportunities
- Get crawl error reports

## Prerequisites

- @knowcode/doc-builder v1.5.23 or higher (v1.5.4+ for Google only)
- Access to Google Search Console and/or Bing Webmaster Tools
- A deployed documentation site

## Google Search Console Verification

### Step 1: Get Your Google Verification Code

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click "Add property" and enter your documentation site URL
3. Choose the "HTML tag" verification method
4. Copy the verification code from the meta tag:
   ```html
   <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
   ```
5. You only need the content value (e.g., `FtzcDTf5BQ9K5EfnGazQkgU2U4FiN3ITzM7gHwqUAqQ`)

### Step 2: Add Google Verification

```bash
doc-builder google-verify YOUR_VERIFICATION_CODE
```

Example:
```bash
doc-builder google-verify FtzcDTf5BQ9K5EfnGazQkgU2U4FiN3ITzM7gHwqUAqQ
```

## Bing Webmaster Tools Verification

### Step 1: Get Your Bing Verification Code

1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Sign in with your Microsoft account
3. Add your site URL
4. Choose the "HTML Meta Tag" verification method
5. Copy the verification code from the meta tag:
   ```html
   <meta name="msvalidate.01" content="YOUR_VERIFICATION_CODE" />
   ```
6. You only need the content value (e.g., `B2D8C4C12C530D47AA962B24CAA09630`)

### Step 2: Add Bing Verification

```bash
doc-builder bing-verify YOUR_VERIFICATION_CODE
```

Example:
```bash
doc-builder bing-verify B2D8C4C12C530D47AA962B24CAA09630
```

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

You can verify with multiple search engines:

```bash
# Google verification
doc-builder google-verify YOUR_GOOGLE_CODE

# Bing verification
doc-builder bing-verify YOUR_BING_CODE
```

This creates the following configuration:

```javascript
seo: {
  customMetaTags: [
    {
      name: "google-site-verification",
      content: "YOUR_GOOGLE_CODE"
    },
    {
      name: "msvalidate.01",
      content: "YOUR_BING_CODE"
    }
  ]
}
```

You can also add other search engines manually:

```javascript
seo: {
  customMetaTags: [
    {
      name: "google-site-verification",
      content: "GOOGLE_CODE"
    },
    {
      name: "msvalidate.01",
      content: "BING_CODE"
    },
    {
      name: "yandex-verification",
      content: "YANDEX_CODE"
    },
    {
      name: "pinterest-site-verification",
      content: "PINTEREST_CODE"
    }
  ]
}
```

## Updating Verification Codes

To update an existing verification code, simply run the command again with the new code:

```bash
# Update Google verification
doc-builder google-verify NEW_GOOGLE_CODE

# Update Bing verification
doc-builder bing-verify NEW_BING_CODE
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

### For Google Search Console:
1. Submit your sitemap at `/sitemap.xml`
2. Set up email alerts for crawl errors
3. Monitor Core Web Vitals
4. Review mobile usability reports

### For Bing Webmaster Tools:
1. Submit your sitemap URL
2. Configure crawl control settings
3. Use the SEO analyzer tool
4. Set up email notifications

## Comparison: Google vs Bing

| Feature | Google Search Console | Bing Webmaster Tools |
|---------|----------------------|---------------------|
| Market Share | ~92% global | ~3% global (includes Yahoo) |
| Verification Methods | HTML tag, DNS, File upload, Analytics | HTML tag, XML file, DNS |
| Data Freshness | 2-3 days delay | Near real-time |
| API Access | Yes | Yes |
| Mobile Testing | Yes | Limited |
| International Targeting | Yes | Yes |

---

## Resources

- [Google Search Console Documentation](https://support.google.com/webmasters)
- [Bing Webmaster Tools Help](https://www.bing.com/webmasters/help/)
- [doc-builder SEO Guide](/guides/seo-optimization-guide)