---
title: "SEO Optimization Guide for @knowcode/doc-builder"
description: "Learn how to optimize your documentation for search engines with front matter, smart titles, and keyword strategies for better rankings."
keywords: ["SEO", "documentation", "optimization", "front matter", "meta tags", "search engines", "doc-builder"]
---

# SEO Optimization Guide

This guide explains how to optimize your documentation for search engines using @knowcode/doc-builder's advanced SEO features.

## Overview

Good SEO helps your documentation:
- Rank higher in search results
- Get more organic traffic
- Improve click-through rates
- Reach the right audience
- Build domain authority

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

## Using the SEO Check Command

Analyze your documentation's SEO:

```bash
# Check all pages
doc-builder seo-check

# Check specific page
doc-builder seo-check docs/guide.md

# Auto-fix issues (coming soon)
doc-builder seo-check --fix
```

### What It Checks

- ✓ Title length and optimization
- ✓ Description length and quality
- ✓ Keywords presence
- ✓ Front matter usage
- ✓ Duplicate content

### Example Output

```
🔍 Analyzing SEO...

📊 SEO Analysis Complete

Analyzed 10 files

❌ Found 2 issues:

  guides/api.md:
    Title too long (75 chars, max 60)
    Suggestion: API Reference Documentation for Doc Build...

💡 5 suggestions:

  README.md: No keywords defined in front matter
  guides/setup.md: Description might be too short (95 chars, ideal 140-160)
  guides/deploy.md: No SEO front matter found
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

## Quick Reference

### Front Matter Template

```yaml
---
title: "Your SEO Optimized Title Here | Brand"
description: "A compelling 140-160 character description that includes keywords and encourages clicks from search results."
keywords: ["primary keyword", "secondary keyword", "long-tail phrase"]
---
```

### CLI Commands

```bash
# Check SEO
doc-builder seo-check

# Add Google verification
doc-builder google-verify YOUR_CODE

# Build with SEO
doc-builder build
```

## Next Steps

1. Add front matter to your important pages
2. Run `seo-check` to identify issues
3. Configure global SEO settings
4. Set up Google Search Console
5. Monitor and optimize based on data

---

For more help, see the [Google Site Verification Guide](./google-site-verification-guide.md) or run `doc-builder --help`.