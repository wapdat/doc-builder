---
title: "SEO Optimization Guide for @knowcode/doc-builder"
description: "Comprehensive guide to optimizing documentation for search engines. Learn SEO best practices, use built-in features, and improve your rankings."
keywords: ["SEO", "documentation", "optimization", "front matter", "meta tags", "search engines", "doc-builder"]
author: "Doc Builder Team"
date: "2025-07-22"
---

# SEO Optimization Guide

**Generated**: 2025-07-22 09:00 UTC  
**Status**: Complete  
**Verified**: ✅

## Overview

@knowcode/doc-builder includes comprehensive SEO (Search Engine Optimization) features that automatically optimize your documentation for search engines. This guide explains what these features do, how to use them effectively, and provides references to authoritative SEO resources.

## Why SEO Matters for Documentation

Good SEO helps your documentation:
- **Rank higher** in search results (Google, Bing, DuckDuckGo)
- **Get more organic traffic** from developers searching for solutions
- **Improve click-through rates** with compelling titles and descriptions
- **Reach the right audience** with targeted keywords
- **Build domain authority** and credibility

According to [Google's Search Quality Guidelines](https://developers.google.com/search/docs/fundamentals/creating-helpful-content), high-quality technical documentation that helps users is prioritized in search results.

## What Our SEO Features Do

### 1. Automatic Meta Tag Generation

Doc-builder automatically generates essential HTML meta tags for every page:

```html
<!-- Page Title - Shows in browser tabs and search results -->
<title>Your Page Title | Site Name</title>

<!-- Meta Description - The snippet shown in search results -->
<meta name="description" content="Your page description here">

<!-- Keywords - Helps search engines understand topic relevance -->
<meta name="keywords" content="keyword1, keyword2, keyword3">

<!-- Author Information -->
<meta name="author" content="Your Name">

<!-- Canonical URL - Prevents duplicate content issues -->
<link rel="canonical" href="https://yoursite.com/page.html">

<!-- Language and Region -->
<meta property="og:locale" content="en_US">
```

### 2. Open Graph Protocol (Facebook, LinkedIn, Slack)

Ensures your documentation looks professional when shared on social media:

```html
<meta property="og:type" content="article">
<meta property="og:title" content="Page Title">
<meta property="og:description" content="Page description">
<meta property="og:url" content="https://yoursite.com/page.html">
<meta property="og:image" content="https://yoursite.com/og-image.png">
<meta property="og:site_name" content="Your Site Name">
```

Learn more: [Open Graph Protocol Official Documentation](https://ogp.me/)

### 3. Twitter Card Tags

Optimizes how your documentation appears on Twitter/X:

```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@yourhandle">
<meta name="twitter:title" content="Page Title">
<meta name="twitter:description" content="Page description">
<meta name="twitter:image" content="https://yoursite.com/twitter-image.png">
```

Test your cards: [Twitter Card Validator](https://cards-dev.twitter.com/validator)

### 4. Structured Data (JSON-LD)

Helps search engines understand your content structure and display rich snippets:

```json
{
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "headline": "Your Page Title",
  "description": "Your page description",
  "author": {
    "@type": "Person",
    "name": "Author Name"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Your Organization",
    "url": "https://yoursite.com"
  },
  "datePublished": "2025-01-22",
  "dateModified": "2025-01-22",
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [...]
  }
}
```

Validate your structured data: [Google's Rich Results Test](https://search.google.com/test/rich-results)

### 5. Automatic Sitemap Generation

Creates a `sitemap.xml` file that helps search engines discover all your pages:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yoursite.com/index.html</loc>
    <lastmod>2025-01-22</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- More URLs -->
</urlset>
```

Submit your sitemap: [Google Search Console](https://search.google.com/search-console)

### 6. Robots.txt Generation

Controls how search engines crawl your site:

```
User-agent: *
Allow: /
Sitemap: https://yoursite.com/sitemap.xml
```

## Front Matter Support (v1.5.5+)

@knowcode/doc-builder now supports YAML front matter for page-specific SEO customization:

```yaml
---
title: "Complete Guide to Authentication | @knowcode/doc-builder"
description: "Learn how to secure your documentation with password protection. Step-by-step guide with code examples and best practices."
keywords: ["authentication", "security", "password protection", "doc-builder", "documentation"]
---
```

### Priority System

SEO fields are determined by priority:
1. **Title**: Front matter → H1 heading → Filename
2. **Description**: Front matter → Smart extraction → First paragraph
3. **Keywords**: Front matter + Content extraction + Global keywords

## Title Optimization

### Best Practices (2025 Standards)

1. **Length**: Keep titles between 50-60 characters
2. **Keywords First**: Place primary keywords at the beginning
3. **Branding**: Use customizable title templates
4. **Unique**: Each page should have a unique title

### Title Templates

Configure title format in `doc-builder.config.js`:

```javascript
seo: {
  titleTemplate: '{pageTitle} | {siteName}',  // Default
  // or
  titleTemplate: '{pageTitle} - {siteName} Docs',
  // or  
  titleTemplate: '{siteName}: {pageTitle}'
}
```

### Examples

Good titles:
- ✅ "Authentication Guide | Doc Builder" (38 chars)
- ✅ "SEO Best Practices for Documentation | MyDocs" (45 chars)
- ✅ "Quick Start: Deploy to Vercel | Doc Builder" (43 chars)

Bad titles:
- ❌ "Guide" (5 chars - too short)
- ❌ "The Complete Comprehensive Guide to Setting Up Authentication and Security for Your Documentation Website | Doc Builder" (118 chars - too long)
- ❌ "Page Title | Site Name | Category | Subcategory" (keyword stuffing)

## Meta Descriptions

### Best Practices

1. **Length**: 140-160 characters (ideal for 2025)
2. **Action-Oriented**: Include call-to-action
3. **Keywords**: Natural keyword inclusion
4. **Unique**: Avoid duplicate descriptions
5. **Value Proposition**: Explain what users will learn

### Smart Description Extraction

Doc-builder uses intelligent extraction:
1. Checks for front matter description
2. Looks for intro paragraph after H1
3. Falls back to first paragraph
4. Ensures optimal length with word boundaries

### Examples

Good descriptions:
- ✅ "Learn how to implement authentication in your documentation site. Step-by-step guide with code examples and security best practices." (139 chars)
- ✅ "Optimize your documentation for search engines with our comprehensive SEO guide. Covers titles, descriptions, and keyword strategies." (143 chars)

Bad descriptions:
- ❌ "This page is about authentication." (35 chars - too short)
- ❌ "Authentication authentication authentication..." (keyword stuffing)

## Keywords Strategy

### Modern Keyword Approach (2025)

1. **Topic Clusters**: Focus on related topics, not single keywords
2. **User Intent**: Answer specific questions
3. **Long-tail Keywords**: Target conversational phrases
4. **Natural Language**: Write for humans, not algorithms

### Configuration

```javascript
seo: {
  autoKeywords: true,      // Extract from content
  keywordLimit: 7,         // Max per page
  keywords: [              // Global keywords
    "documentation",
    "static site",
    "vercel"
  ]
}
```

### Front Matter Keywords

```yaml
---
keywords: 
  - "authentication guide"
  - "secure documentation"
  - "password protection"
  - "doc-builder security"
---
```

## Using the SEO Check Command (v1.5.8+)

The `seo-check` command analyzes your **generated HTML files** to ensure they're properly optimized:

```bash
# First, build your documentation
doc-builder build

# Then analyze the generated HTML
doc-builder seo-check

# Check specific HTML file
doc-builder seo-check html/guide.html
```

### What It Analyzes in HTML

The command inspects the actual HTML output that search engines see:

- ✅ **Title tags** - Presence and optimal length (50-60 chars)
- ✅ **Meta descriptions** - Quality and character count (140-160)
- ✅ **Keywords meta tag** - Presence of relevant keywords
- ✅ **Canonical URLs** - Prevents duplicate content penalties
- ✅ **H1 tags** - Ensures proper heading structure
- ✅ **Open Graph tags** - Social media optimization
- ✅ **Twitter Card tags** - Twitter/X optimization
- ✅ **Structured data** - JSON-LD implementation

### Example Output

```
🔍 Analyzing SEO in generated HTML files...

📊 SEO Analysis Complete

Analyzed 14 files

❌ Found 2 issues:

  guides/api.html:
    Title too long (75 chars, max 60)
    Suggestion: API Reference Documentation for Doc Build...

  setup.html:
    Missing meta description
    
💡 8 suggestions:

  index.html: Description too short (95 chars, ideal 140-160)
  guides/auth.html: No keywords meta tag found
  api/endpoints.html: Missing canonical URL
  tutorials/intro.html: H1 differs from page title
  guides/deploy.html: Missing Open Graph tags
```

## Advanced Configuration

### Per-Page Customization

Each markdown file can have custom SEO:

```markdown
---
title: "Custom Page Title for SEO"
description: "Override the auto-generated description with this custom one that's perfectly optimized."
keywords: ["specific", "page", "keywords"]
---

# Different H1 for Display

Your content here...
```

### Global SEO Settings

Configure in `doc-builder.config.js`:

```javascript
module.exports = {
  siteName: 'My Documentation',
  siteDescription: 'Default description for all pages',
  
  seo: {
    enabled: true,
    siteUrl: 'https://docs.example.com',
    author: 'Your Name',
    twitterHandle: '@yourhandle',
    language: 'en-US',
    
    // Title customization
    titleTemplate: '{pageTitle} | {siteName}',
    
    // Description settings
    descriptionFallback: 'smart',  // or 'first-paragraph'
    
    // Keywords
    keywords: ['documentation', 'guides'],
    autoKeywords: true,
    keywordLimit: 7,
    
    // Organization
    organization: {
      name: 'Your Company',
      url: 'https://example.com',
      logo: 'https://example.com/logo.png'
    },
    
    // Social
    ogImage: '/og-default.png',
    
    // Technical
    generateSitemap: true,
    generateRobotsTxt: true,
    customMetaTags: []
  }
};
```

## Common SEO Mistakes to Avoid

### 1. Duplicate Content
- ❌ Same description on multiple pages
- ✅ Unique descriptions for each page

### 2. Keyword Stuffing
- ❌ "Guide guide documentation guide tutorial guide"
- ✅ Natural keyword usage in context

### 3. Ignoring Mobile
- ❌ Long titles that get cut off on mobile
- ✅ Test how titles appear on different devices

### 4. Missing Descriptions
- ❌ Leaving description blank
- ✅ Always provide meaningful descriptions

### 5. Generic Titles
- ❌ "Documentation", "Guide", "Page 1"
- ✅ Specific, descriptive titles

## SEO Checklist

Before publishing, ensure:

- [ ] All pages have unique titles (50-60 chars)
- [ ] All pages have meta descriptions (140-160 chars)
- [ ] Important pages have front matter SEO
- [ ] Run `doc-builder seo-check` and fix issues
- [ ] Set `seo.siteUrl` in config for proper URLs
- [ ] Verify Google site ownership with `google-verify`
- [ ] Submit sitemap.xml to Google Search Console
- [ ] Test mobile appearance

## Best Practices for 2025

### AI and Semantic Search
- Write for topic clusters, not just keywords
- Focus on user intent and questions
- Use natural, conversational language
- Structure content with clear hierarchies

### Technical Excellence
- Ensure fast page load times
- Use structured data (automatic with doc-builder)
- Implement proper heading hierarchy
- Include alt text for images

### Content Quality
- Write comprehensive, valuable content
- Update regularly to maintain freshness
- Include examples and practical applications
- Link to related documentation

## Monitoring and Improvement

### Track Performance
1. Set up Google Search Console
2. Monitor search impressions and clicks
3. Track ranking positions
4. Analyze user queries

### Continuous Optimization
1. Update titles based on performance
2. A/B test different descriptions
3. Expand content for high-value pages
4. Build internal links between related docs

## External SEO Tools and Resources

### Essential SEO Tools

#### 1. **Google Search Console** - [search.google.com/search-console](https://search.google.com/search-console)
- Monitor your documentation's search performance
- Submit sitemaps for faster indexing
- Find crawl errors and indexing issues
- See which queries bring users to your docs
- **Free tool from Google**

#### 2. **Google PageSpeed Insights** - [pagespeed.web.dev](https://pagespeed.web.dev)
- Test page load performance
- Get specific optimization suggestions
- Check Core Web Vitals scores
- Mobile and desktop analysis
- **Free tool**

#### 3. **Ahrefs Webmaster Tools** - [ahrefs.com/webmaster-tools](https://ahrefs.com/webmaster-tools)
- Free SEO health monitoring
- Backlink analysis
- Keyword rankings
- Site audit features
- **Free version available**

#### 4. **Schema Markup Validator** - [validator.schema.org](https://validator.schema.org)
- Validate your structured data
- Test JSON-LD implementation
- Find schema errors
- **Free tool**

#### 5. **Open Graph Debugger** - [opengraph.xyz](https://www.opengraph.xyz)
- Preview how your docs appear on social media
- Debug Open Graph tags
- Test different URLs
- **Free tool**

### SEO Learning Resources

#### Beginner Resources

1. **Google SEO Starter Guide** - [developers.google.com/search/docs/fundamentals/seo-starter-guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
   - Official guide from Google
   - Covers all SEO basics
   - Best practices straight from the source

2. **Moz Beginner's Guide to SEO** - [moz.com/beginners-guide-to-seo](https://moz.com/beginners-guide-to-seo)
   - Comprehensive 7-chapter guide
   - Visual explanations
   - Industry-standard resource

#### Advanced Resources

3. **Ahrefs SEO Guide** - [ahrefs.com/seo](https://ahrefs.com/seo)
   - Data-driven strategies
   - Advanced techniques
   - Case studies and examples

4. **Search Engine Journal** - [searchenginejournal.com](https://searchenginejournal.com)
   - Latest SEO news and updates
   - Algorithm change analysis
   - Expert insights

5. **Technical SEO Guide** - [developers.google.com/search/docs/advanced/guidelines](https://developers.google.com/search/docs/advanced/guidelines)
   - Google's technical requirements
   - Crawling and indexing details
   - Advanced implementation

### Keyword Research Tools

1. **Google Keyword Planner** - [ads.google.com/keywordplanner](https://ads.google.com/keywordplanner)
   - Free with Google Ads account
   - Search volume data
   - Keyword suggestions

2. **Ubersuggest** - [neilpatel.com/ubersuggest](https://neilpatel.com/ubersuggest)
   - Free keyword research
   - Content ideas
   - Competitor analysis

3. **Answer The Public** - [answerthepublic.com](https://answerthepublic.com)
   - Find questions people ask
   - Visual keyword research
   - Great for documentation topics

4. **Google Trends** - [trends.google.com](https://trends.google.com)
   - Track keyword popularity over time
   - Compare search terms
   - Find rising topics

### Performance Testing

1. **GTmetrix** - [gtmetrix.com](https://gtmetrix.com)
   - Detailed performance reports
   - Waterfall charts
   - Historical tracking

2. **WebPageTest** - [webpagetest.org](https://webpagetest.org)
   - Advanced performance testing
   - Multiple location testing
   - Video capture of page load

3. **Lighthouse** (Built into Chrome DevTools)
   - Performance, SEO, and accessibility audits
   - Actionable recommendations
   - CLI version available

### Documentation-Specific SEO Tips

According to [Google's Documentation Best Practices](https://developers.google.com/style/seo):

1. **Use descriptive URLs** - `/guides/authentication` not `/page1`
2. **Create comprehensive content** - Answer the full question
3. **Use code examples** - Show, don't just tell
4. **Keep content fresh** - Update regularly
5. **Internal linking** - Connect related topics

## Quick Reference

### Front Matter Template

```yaml
---
title: "Your SEO Optimized Title Here | Brand"
description: "A compelling 140-160 character description that includes keywords and encourages clicks from search results."
keywords: ["primary keyword", "secondary keyword", "long-tail phrase"]
author: "Your Name"
date: "2025-01-22"
---
```

### CLI Commands

```bash
# Build your documentation
doc-builder build

# Check SEO of generated HTML
doc-builder seo-check

# Add Google verification
doc-builder google-verify YOUR_CODE

# Deploy with SEO optimization
doc-builder deploy
```

### SEO Checklist

Before publishing:
- [ ] Run `doc-builder build` to generate HTML
- [ ] Run `doc-builder seo-check` to find issues
- [ ] Fix any critical SEO problems
- [ ] Add front matter to important pages
- [ ] Set production URL in config
- [ ] Generate and submit sitemap
- [ ] Set up Google Search Console
- [ ] Add Google Analytics (optional)
- [ ] Test social media previews
- [ ] Check page load speed

## Monitoring Success

### Key Metrics to Track

1. **Organic Traffic** - Visitors from search engines
2. **Search Impressions** - How often you appear in results
3. **Click-Through Rate (CTR)** - Percentage who click
4. **Average Position** - Where you rank for keywords
5. **Page Load Time** - Speed affects rankings

### Tools for Monitoring

- **Google Analytics 4** - [analytics.google.com](https://analytics.google.com)
- **Google Search Console** - Track search performance
- **Ahrefs/SEMrush** - Competitive analysis
- **Custom dashboards** - Combine multiple data sources

## Next Steps

1. **Immediate Actions**:
   - Add front matter to your top 10 pages
   - Run `seo-check` and fix critical issues
   - Set up Google Search Console

2. **This Week**:
   - Optimize all page titles and descriptions
   - Submit sitemap to search engines
   - Test and fix page load speed

3. **Ongoing**:
   - Monitor search performance weekly
   - Update content based on user queries
   - Build internal links between related docs
   - Keep content fresh and accurate

---

For more help, see the [Google Site Verification Guide](./google-site-verification-guide.md) or join the [doc-builder community](https://github.com/knowcode/doc-builder/discussions).