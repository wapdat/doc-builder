const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

/**
 * SEO Utilities for @knowcode/doc-builder
 * Handles meta tags, structured data, sitemaps, and robots.txt
 */

/**
 * Extract keywords from markdown content
 */
function extractKeywords(content, maxKeywords = 10) {
  // Remove markdown syntax
  const plainText = content
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]*`/g, '') // Remove inline code
    .replace(/#+\s/g, '') // Remove headers
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Extract link text
    .replace(/[*_~]/g, '') // Remove emphasis
    .toLowerCase();
  
  // Common words to exclude
  const stopWords = new Set([
    'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but',
    'in', 'with', 'to', 'for', 'of', 'as', 'by', 'that', 'this',
    'it', 'from', 'be', 'are', 'been', 'was', 'were', 'being'
  ]);
  
  // Extract words
  const words = plainText.match(/\b[a-z]{3,}\b/g) || [];
  
  // Count word frequency
  const wordCount = {};
  words.forEach(word => {
    if (!stopWords.has(word)) {
      wordCount[word] = (wordCount[word] || 0) + 1;
    }
  });
  
  // Sort by frequency and return top keywords
  return Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxKeywords)
    .map(([word]) => word);
}

/**
 * Generate meta description from content
 */
function generateDescription(content, maxLength = 160) {
  // Remove markdown syntax and get first paragraph
  const plainText = content
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/#+\s(.+)/g, '$1. ') // Convert headers to sentences
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Extract link text
    .replace(/[*_~]/g, '') // Remove emphasis
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim();
  
  // Find first sentence or use first maxLength characters
  const firstSentence = plainText.match(/^[^.!?]+[.!?]/);
  let description = firstSentence ? firstSentence[0] : plainText;
  
  // Truncate if needed
  if (description.length > maxLength) {
    description = description.substring(0, maxLength - 3) + '...';
  }
  
  return description;
}

/**
 * Generate meta tags for a page
 */
function generateMetaTags(options) {
  const {
    title,
    description,
    url,
    author,
    keywords,
    twitterHandle,
    ogImage,
    siteName,
    language = 'en-US',
    type = 'article',
    customMetaTags = []
  } = options;
  
  const tags = [];
  
  // Basic meta tags
  if (author) {
    tags.push(`    <meta name="author" content="${escapeHtml(author)}">`);
  }
  
  if (keywords && keywords.length > 0) {
    const keywordString = Array.isArray(keywords) ? keywords.join(', ') : keywords;
    tags.push(`    <meta name="keywords" content="${escapeHtml(keywordString)}">`);
  }
  
  tags.push(`    <meta name="robots" content="index, follow">`);
  
  if (url) {
    tags.push(`    <link rel="canonical" href="${url}">`);
  }
  
  // Open Graph tags
  tags.push(`    \n    <!-- Open Graph / Facebook -->`);
  tags.push(`    <meta property="og:type" content="${type}">`);
  
  if (url) {
    tags.push(`    <meta property="og:url" content="${url}">`);
  }
  
  if (title) {
    tags.push(`    <meta property="og:title" content="${escapeHtml(title)}">`);
  }
  
  if (description) {
    tags.push(`    <meta property="og:description" content="${escapeHtml(description)}">`);
  }
  
  if (ogImage) {
    const imageUrl = ogImage.startsWith('http') ? ogImage : (url ? new URL(ogImage, url).href : ogImage);
    tags.push(`    <meta property="og:image" content="${imageUrl}">`);
  }
  
  if (siteName) {
    tags.push(`    <meta property="og:site_name" content="${escapeHtml(siteName)}">`);
  }
  
  tags.push(`    <meta property="og:locale" content="${language.replace('-', '_')}">`);
  
  // Twitter Card tags
  if (twitterHandle || ogImage) {
    tags.push(`    \n    <!-- Twitter Card -->`);
    tags.push(`    <meta name="twitter:card" content="summary_large_image">`);
    
    if (twitterHandle) {
      const handle = twitterHandle.startsWith('@') ? twitterHandle : '@' + twitterHandle;
      tags.push(`    <meta name="twitter:site" content="${handle}">`);
      tags.push(`    <meta name="twitter:creator" content="${handle}">`);
    }
    
    if (title) {
      tags.push(`    <meta name="twitter:title" content="${escapeHtml(title)}">`);
    }
    
    if (description) {
      tags.push(`    <meta name="twitter:description" content="${escapeHtml(description)}">`);
    }
    
    if (ogImage) {
      const imageUrl = ogImage.startsWith('http') ? ogImage : (url ? new URL(ogImage, url).href : ogImage);
      tags.push(`    <meta name="twitter:image" content="${imageUrl}">`);
    }
  }
  
  // Add custom meta tags
  if (customMetaTags && customMetaTags.length > 0) {
    tags.push(`    \n    <!-- Custom Meta Tags -->`);
    customMetaTags.forEach(tag => {
      if (tag.name && tag.content) {
        tags.push(`    <meta name="${escapeHtml(tag.name)}" content="${escapeHtml(tag.content)}">`);
      } else if (tag.property && tag.content) {
        tags.push(`    <meta property="${escapeHtml(tag.property)}" content="${escapeHtml(tag.content)}">`);
      }
    });
  }
  
  return tags.join('\n');
}

/**
 * Generate JSON-LD structured data
 */
function generateJSONLD(options) {
  const {
    title,
    description,
    url,
    author,
    siteName,
    datePublished,
    dateModified,
    breadcrumbs,
    organization,
    type = 'TechArticle'
  } = options;
  
  const jsonld = {
    '@context': 'https://schema.org',
    '@type': type,
    headline: title,
    description: description
  };
  
  if (author) {
    jsonld.author = {
      '@type': 'Person',
      name: author
    };
  }
  
  if (organization) {
    jsonld.publisher = {
      '@type': 'Organization',
      name: organization.name,
      url: organization.url
    };
    
    if (organization.logo) {
      jsonld.publisher.logo = {
        '@type': 'ImageObject',
        url: organization.logo
      };
    }
  }
  
  if (datePublished) {
    jsonld.datePublished = datePublished;
  }
  
  if (dateModified) {
    jsonld.dateModified = dateModified;
  }
  
  if (url) {
    jsonld.mainEntityOfPage = {
      '@type': 'WebPage',
      '@id': url
    };
  }
  
  // Add breadcrumb if provided
  if (breadcrumbs && breadcrumbs.length > 0) {
    jsonld.breadcrumb = {
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: crumb.url
      }))
    };
  }
  
  return `<script type="application/ld+json">\n${JSON.stringify(jsonld, null, 2)}\n</script>`;
}

/**
 * Generate sitemap.xml
 */
async function generateSitemap(pages, siteUrl, outputDir) {
  console.log(chalk.blue('🗺️  Generating sitemap.xml...'));
  
  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  ];
  
  const now = new Date().toISOString();
  
  pages.forEach(page => {
    const priority = page.path === 'index.html' ? '1.0' : 
                    page.path.includes('guide') ? '0.8' : '0.6';
    const changefreq = page.path === 'index.html' ? 'weekly' : 'monthly';
    
    sitemap.push('  <url>');
    sitemap.push(`    <loc>${siteUrl}/${page.path}</loc>`);
    sitemap.push(`    <lastmod>${now}</lastmod>`);
    sitemap.push(`    <changefreq>${changefreq}</changefreq>`);
    sitemap.push(`    <priority>${priority}</priority>`);
    sitemap.push('  </url>');
  });
  
  sitemap.push('</urlset>');
  
  const sitemapPath = path.join(outputDir, 'sitemap.xml');
  await fs.writeFile(sitemapPath, sitemap.join('\n'));
  console.log(chalk.green(`✅ Generated sitemap.xml with ${pages.length} URLs`));
  
  return sitemapPath;
}

/**
 * Generate robots.txt
 */
async function generateRobotsTxt(siteUrl, outputDir, options = {}) {
  console.log(chalk.blue('🤖 Generating robots.txt...'));
  
  const robots = [
    'User-agent: *',
    'Allow: /',
    '',
    '# Sitemap location',
    `Sitemap: ${siteUrl}/sitemap.xml`
  ];
  
  // Add disallow for auth pages if authentication is enabled
  if (options.hasAuthentication) {
    robots.push('', '# Authentication pages');
    robots.push('Disallow: /login.html');
    robots.push('Disallow: /logout.html');
  }
  
  // Add custom rules if provided
  if (options.customRules) {
    robots.push('', '# Custom rules');
    robots.push(...options.customRules);
  }
  
  robots.push('');
  
  const robotsPath = path.join(outputDir, 'robots.txt');
  await fs.writeFile(robotsPath, robots.join('\n'));
  console.log(chalk.green('✅ Generated robots.txt'));
  
  return robotsPath;
}

/**
 * Escape HTML special characters
 */
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Generate breadcrumbs from file path
 */
function generateBreadcrumbs(filePath, siteUrl, siteName) {
  const parts = filePath.split('/').filter(p => p && p !== 'index.html');
  const breadcrumbs = [
    { name: siteName || 'Home', url: siteUrl }
  ];
  
  let currentPath = '';
  parts.forEach((part, index) => {
    currentPath += (currentPath ? '/' : '') + part;
    const name = part
      .replace('.html', '')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
    
    breadcrumbs.push({
      name: name,
      url: `${siteUrl}/${currentPath}${part.endsWith('.html') ? '' : '/'}`
    });
  });
  
  return breadcrumbs;
}

module.exports = {
  extractKeywords,
  generateDescription,
  generateMetaTags,
  generateJSONLD,
  generateSitemap,
  generateRobotsTxt,
  generateBreadcrumbs,
  escapeHtml
};