# SEO Guide for @knowcode/doc-builder

**Generated**: 2025-01-21 10:00 UTC  
**Status**: Complete  
**Version**: 1.0

## Overview

@knowcode/doc-builder includes comprehensive SEO (Search Engine Optimization) features to help your documentation rank better in search results and look great when shared on social media. This guide covers all SEO features and how to configure them.

## Quick Start

Run the SEO setup wizard to configure all SEO settings interactively:

```bash
npx @knowcode/doc-builder setup-seo
```

## SEO Features

### 1. Meta Tags
Every generated HTML page includes comprehensive meta tags:

- **Author** - Document author attribution
- **Keywords** - Relevant keywords (auto-extracted or manual)
- **Description** - Page description (auto-generated or custom)
- **Canonical URL** - Prevents duplicate content issues
- **Robots** - Search engine crawling instructions
- **Language** - Content language specification

### 2. Open Graph Tags
For rich social media previews on:
- Facebook
- LinkedIn
- Slack
- Teams
- Discord

Includes:
- `og:title` - Page title
- `og:description` - Page description
- `og:image` - Preview image
- `og:url` - Canonical URL
- `og:type` - Content type (article)
- `og:site_name` - Your site name
- `og:locale` - Language/region

### 3. Twitter Card Tags
Optimized Twitter sharing with:
- `twitter:card` - Large image preview
- `twitter:site` - Your Twitter handle
- `twitter:creator` - Content creator
- `twitter:title` - Tweet title
- `twitter:description` - Tweet description
- `twitter:image` - Preview image

### 4. JSON-LD Structured Data
Schema.org structured data for better search understanding:

- **TechArticle** - For technical documentation
- **BreadcrumbList** - Navigation hierarchy
- **Organization** - Publisher information
- **WebPage** - Page metadata

### 5. Automatic Sitemap Generation
- `sitemap.xml` generated during build
- Includes all HTML pages
- Priority and change frequency
- Automatic lastmod dates

### 6. Robots.txt
- Crawler instructions
- Sitemap location
- Authentication page exclusions
- Custom rules support

## Configuration

### Using the Setup Wizard

The easiest way to configure SEO is using the interactive wizard:

```bash
npx @knowcode/doc-builder setup-seo
```

You'll be prompted for:
1. **Site URL** - Your production URL (e.g., https://docs.example.com)
2. **Author Name** - Default author for pages
3. **Twitter Handle** - Your Twitter username
4. **Site Language** - Content language (default: en-US)
5. **Organization Name** - Your company/project name
6. **Default OG Image** - Social media preview image
7. **Keywords** - Default keywords for all pages
8. **Sitemap Generation** - Enable/disable sitemap.xml
9. **Robots.txt Generation** - Enable/disable robots.txt

### Manual Configuration

Add SEO settings to your `doc-builder.config.js`:

```javascript
module.exports = {
  // ... other config ...
  
  seo: {
    enabled: true,
    siteUrl: 'https://docs.example.com',
    author: 'Your Name',
    twitterHandle: '@yourhandle',
    language: 'en-US',
    keywords: ['documentation', 'api', 'guide'],
    organization: {
      name: 'Your Company',
      url: 'https://example.com',
      logo: 'https://example.com/logo.png'
    },
    ogImage: '/og-default.png',
    generateSitemap: true,
    generateRobotsTxt: true,
    customMetaTags: [
      '<meta name="custom-tag" content="value">'
    ]
  }
}
```

### Configuration Options

| Option | Type | Description | Default |
|--------|------|-------------|---------|
| `enabled` | boolean | Enable/disable all SEO features | `true` |
| `siteUrl` | string | Your production URL (required) | - |
| `author` | string | Default author name | - |
| `twitterHandle` | string | Twitter username (with or without @) | - |
| `language` | string | Content language code | `'en-US'` |
| `keywords` | array | Default keywords for all pages | `[]` |
| `organization` | object | Company/project information | - |
| `ogImage` | string | Default Open Graph image URL/path | - |
| `generateSitemap` | boolean | Generate sitemap.xml | `true` |
| `generateRobotsTxt` | boolean | Generate robots.txt | `true` |
| `customMetaTags` | array | Additional meta tags | `[]` |

## Best Practices

### 1. Open Graph Images
- **Recommended size**: 1200×630 pixels
- **Format**: PNG or JPG
- **Content**: Include your logo and site name
- **Location**: Place in `/html` directory

### 2. Keywords
- Use 5-10 relevant keywords
- Include product names, technologies
- Avoid keyword stuffing
- Keywords are auto-extracted from content if not specified

### 3. Descriptions
- Keep under 160 characters
- Make them compelling and accurate
- Auto-generated from first paragraph if not specified

### 4. Site URL
- Always use HTTPS
- Include trailing slash for consistency
- Must match your production deployment

### 5. Twitter Handle
- Include the @ symbol or not (both work)
- Use your official account
- Helps with attribution and engagement

## Per-Page SEO

While doc-builder provides site-wide SEO settings, you can override them per page using frontmatter (coming in future version):

```markdown
---
title: Custom Page Title
description: Custom meta description for this page
keywords: [custom, keywords, for, this, page]
author: Different Author
---

# Page Content
```

## Verification

### 1. Build with SEO
```bash
npx @knowcode/doc-builder build
```

You'll see SEO generation in the output:
```
🗺️  Generating sitemap.xml...
✅ Generated sitemap.xml with 23 URLs
🤖 Generating robots.txt...
✅ Generated robots.txt
```

### 2. Check Generated Files
- View `html/sitemap.xml` for all page URLs
- View `html/robots.txt` for crawler instructions
- Inspect any HTML file to see meta tags

### 3. Test Your SEO

Use these tools to verify your SEO implementation:

- **[Meta Tags Preview](https://metatags.io)** - Preview social media cards
- **[Twitter Card Validator](https://cards-dev.twitter.com/validator)** - Test Twitter cards
- **[Facebook Debugger](https://developers.facebook.com/tools/debug/)** - Test Open Graph tags
- **[Google Rich Results Test](https://search.google.com/test/rich-results)** - Test structured data

### 4. View Page Source

Check any generated HTML page for:
```html
<!-- Look for these sections -->
<!-- Open Graph / Facebook -->
<!-- Twitter Card -->
<script type="application/ld+json">
```

## Sitemap Submission

After deployment, submit your sitemap to search engines:

### Google Search Console
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your site property
3. Navigate to Sitemaps
4. Enter: `sitemap.xml`
5. Click Submit

### Bing Webmaster Tools
1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Add your site
3. Submit sitemap URL

## Troubleshooting

### SEO Not Generating
- Ensure `seo.enabled: true` in config
- Check that `siteUrl` is set
- Run `setup-seo` command again

### Wrong URLs in Sitemap
- Verify `siteUrl` matches your deployment
- Don't include `/html` in the URL
- Use production URL, not localhost

### Missing Meta Tags
- Check browser DevTools for errors
- Ensure build completed successfully
- Verify config file syntax

### Social Preview Not Working
- Image must be publicly accessible
- Use absolute URLs for images
- Clear social media cache (use debugger tools)

## Example Output

Here's what doc-builder generates for each page:

```html
<!-- Standard Meta Tags -->
<meta name="author" content="Lindsay Smith">
<meta name="keywords" content="documentation, markdown, static site">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://doc-builder-delta.vercel.app/guides/seo-guide.html">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="article">
<meta property="og:url" content="https://doc-builder-delta.vercel.app/guides/seo-guide.html">
<meta property="og:title" content="SEO Guide - Documentation">
<meta property="og:description" content="Complete guide to SEO features in doc-builder">
<meta property="og:image" content="https://doc-builder-delta.vercel.app/og-default.png">
<meta property="og:site_name" content="Documentation">
<meta property="og:locale" content="en_US">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@planbbackups">
<meta name="twitter:creator" content="@planbbackups">
<meta name="twitter:title" content="SEO Guide - Documentation">
<meta name="twitter:description" content="Complete guide to SEO features in doc-builder">
<meta name="twitter:image" content="https://doc-builder-delta.vercel.app/og-default.png">

<!-- JSON-LD Structured Data -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "headline": "SEO Guide",
  "description": "Complete guide to SEO features in doc-builder",
  "author": {
    "@type": "Person",
    "name": "Lindsay Smith"
  },
  "publisher": {
    "@type": "Organization",
    "name": "KnowCode",
    "url": "https://knowcode.com"
  },
  "datePublished": "2025-01-21T10:00:00Z",
  "dateModified": "2025-01-21T10:00:00Z",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://doc-builder-delta.vercel.app/guides/seo-guide.html"
  }
}
</script>
```

## Future Enhancements

Planned SEO features for future versions:
- Page-specific SEO via frontmatter
- Automatic Open Graph image generation
- Multiple language support (hreflang)
- Video metadata support
- FAQ schema for Q&A sections
- How-to schema for tutorials
- Search box schema
- Local business schema support

## Conclusion

With @knowcode/doc-builder's SEO features, your documentation will:
- Rank better in search results
- Look professional when shared
- Be properly indexed by search engines
- Provide rich previews on social media

Run `npx @knowcode/doc-builder setup-seo` to get started!