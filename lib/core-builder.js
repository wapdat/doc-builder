const fs = require('fs-extra');
const path = require('path');
const marked = require('marked');
const chalk = require('chalk');
const matter = require('gray-matter');
const SupabaseAuth = require('./supabase-auth');
const { 
  generateMetaTags, 
  generateJSONLD, 
  generateDescription,
  extractKeywords,
  generateBreadcrumbs,
  generateSitemap,
  generateRobotsTxt
} = require('./seo');
const { replaceEmojisWithIcons } = require('./emoji-mapper');

// Configure marked options
marked.setOptions({
  highlight: function(code, lang) {
    return `<code class="language-${lang}">${escapeHtml(code)}</code>`;
  },
  breaks: true,
  gfm: true
});

// Helper function to normalize titles
function normalizeTitle(title) {
  if (!title) return title;
  
  // Check if title is all caps (more than 50% uppercase letters)
  const upperCount = (title.match(/[A-Z]/g) || []).length;
  const letterCount = (title.match(/[a-zA-Z]/g) || []).length;
  const isAllCaps = letterCount > 0 && (upperCount / letterCount) > 0.5;
  
  if (isAllCaps) {
    // Convert to title case
    return title.toLowerCase()
      .split(' ')
      .map(word => {
        // Keep small words lowercase unless they're first
        const smallWords = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'from', 
                          'in', 'into', 'of', 'on', 'or', 'the', 'to', 'with'];
        if (smallWords.includes(word.toLowerCase()) && word !== title.split(' ')[0]) {
          return word.toLowerCase();
        }
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
  }
  
  return title;
}

// Helper function to escape HTML
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Helper function to check if filename contains non-printable characters
function hasNonPrintableChars(filename) {
  // Check for non-printable ASCII characters (0x00-0x1F, 0x7F-0x9F)
  // Exclude common allowed control chars like tab (0x09), newline (0x0A), carriage return (0x0D)
  return /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/.test(filename);
}

// Helper function to sanitize filename for safe processing
function sanitizeFilename(filename) {
  // Remove non-printable characters
  return filename.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '');
}

// Helper function to smartly capitalize text while preserving existing capitalization
function smartCapitalize(text) {
  if (!text) return text;
  
  return text
    .replace(/[-_]/g, ' ') // Replace hyphens and underscores with spaces
    .split(' ')
    .map(word => {
      if (!word) return word;
      
      // If word has any uppercase letters (like "AI", "API", "iPhone"), preserve it
      if (/[A-Z]/.test(word)) {
        return word;
      }
      
      // If word is all lowercase, capitalize first letter
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

// Detect document status from content and front matter
function detectDocumentStatus(content, frontMatter = {}) {
  // Check front matter first
  if (frontMatter.status) {
    return frontMatter.status.toLowerCase();
  }
  
  // Check content for status indicators (case insensitive)
  const contentLower = content.toLowerCase();
  
  const statusIndicators = {
    'draft': ['🚧', 'draft', 'work in progress', 'wip', 'under construction'],
    'complete': ['✅', 'completed', 'verified', 'ready', '✓'],
    'warning': ['⚠️', '❗', 'warning', 'caution', 'attention'],
    'error': ['❌', '🚨', 'error', 'failed', 'broken'],
    'planning': ['📋', 'planning', 'todo', 'roadmap', 'brainstorm'],
    'deprecated': ['🗑️', 'deprecated', 'obsolete', 'archived']
  };
  
  for (const [status, indicators] of Object.entries(statusIndicators)) {
    for (const indicator of indicators) {
      if (contentLower.includes(indicator)) {
        return status;
      }
    }
  }
  
  // Special cases based on file name patterns
  if (frontMatter.title || content.includes('# ')) {
    const title = (frontMatter.title || content.match(/^#\s+(.+)$/m)?.[1] || '').toLowerCase();
    
    if (title.includes('readme') || title.includes('overview')) return 'readme';
    if (title.includes('guide') || title.includes('tutorial')) return 'guide';
    if (title.includes('troubleshoot') || title.includes('problem')) return 'troubleshoot';
    if (title.includes('api') || title.includes('reference')) return 'reference';
  }
  
  return 'default';
}

// Get icon for document status with subtle styling
function getIconForStatus(status, isFolder = false, config = {}) {
  if (isFolder) {
    return '<i class="ph ph-folder"></i>';
  }
  
  // Check if dynamic icons are enabled (default: true)
  const dynamicIcons = config.features?.dynamicNavIcons !== false;
  const subtleColors = config.features?.subtleColors !== false && dynamicIcons;
  
  if (!dynamicIcons) {
    return '<i class="ph ph-file-text"></i>';
  }
  
  const statusIcons = {
    'draft': {
      icon: 'ph ph-pencil-simple',
      color: subtleColors ? '#d97706' : undefined  // More subtle amber
    },
    'complete': {
      icon: 'ph ph-check-circle',
      color: subtleColors ? (config.isStaticOutput ? '#2563eb' : '#059669') : undefined  // Blue for static, green for normal
    },
    'warning': {
      icon: 'ph ph-warning',
      color: subtleColors ? '#ea580c' : undefined  // More subtle orange
    },
    'error': {
      icon: 'ph ph-x-circle',
      color: subtleColors ? '#dc2626' : undefined  // More subtle red
    },
    'planning': {
      icon: 'ph ph-list-checks',
      color: subtleColors ? '#7c3aed' : undefined  // More subtle violet
    },
    'deprecated': {
      icon: 'ph ph-archive',
      color: subtleColors ? '#6b7280' : undefined  // Subtle gray
    },
    'guide': {
      icon: 'ph ph-book-open',
      color: subtleColors ? '#2563eb' : undefined  // More subtle blue
    },
    'readme': {
      icon: 'ph ph-house',
      color: subtleColors ? '#059669' : undefined  // More subtle emerald
    },
    'troubleshoot': {
      icon: 'ph ph-wrench',
      color: subtleColors ? '#dc2626' : undefined  // More subtle red
    },
    'reference': {
      icon: 'ph ph-book',
      color: subtleColors ? '#7c3aed' : undefined  // More subtle violet
    },
    'default': {
      icon: 'ph ph-file-text',
      color: undefined
    }
  };
  
  const statusConfig = statusIcons[status] || statusIcons.default;
  const colorStyle = statusConfig.color ? ` style="color: ${statusConfig.color};"` : '';
  
  return `<i class="${statusConfig.icon}"${colorStyle}></i>`;
}

// Extract summary from markdown content for tooltips
function extractSummary(content, maxLength = 150) {
  // Remove front matter
  content = content.replace(/^---[\s\S]*?---\n/, '');
  
  // First, try to find Overview or Summary sections
  const overviewMatch = content.match(/##\s+(Overview|Summary)\s*\n+([\s\S]*?)(?=\n##|\n#[^#]|$)/i);
  if (overviewMatch) {
    // Extract the content under Overview/Summary section
    let summaryContent = overviewMatch[2];
    
    // Clean up the extracted content
    summaryContent = summaryContent.replace(/```[\s\S]*?```/g, ''); // Remove code blocks
    summaryContent = summaryContent.replace(/`[^`]+`/g, ''); // Remove inline code
    summaryContent = summaryContent.replace(/!\[[^\]]*\]\([^)]*\)/g, ''); // Remove images
    summaryContent = summaryContent.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1'); // Convert links to text
    summaryContent = summaryContent.replace(/<[^>]+>/g, ''); // Remove HTML
    summaryContent = summaryContent.replace(/\*\*([^*]+)\*\*/g, '$1'); // Remove bold
    summaryContent = summaryContent.replace(/\*([^*]+)\*/g, '$1'); // Remove italic
    summaryContent = summaryContent.replace(/__([^_]+)__/g, '$1'); // Remove bold alt
    summaryContent = summaryContent.replace(/_([^_]+)_/g, '$1'); // Remove italic alt
    summaryContent = summaryContent.replace(/~~([^~]+)~~/g, '$1'); // Remove strikethrough
    summaryContent = summaryContent.replace(/^>\s*/gm, ''); // Remove blockquotes
    summaryContent = summaryContent.replace(/^[-*+]\s+/gm, ''); // Remove list markers
    summaryContent = summaryContent.replace(/^\d+\.\s+/gm, ''); // Remove numbered lists
    summaryContent = summaryContent.replace(/^---+$/gm, ''); // Remove horizontal rules
    summaryContent = summaryContent.replace(/^\*\*\*+$/gm, ''); // Remove horizontal rules alt
    
    // Normalize whitespace
    summaryContent = summaryContent.trim().replace(/\s+/g, ' ');
    
    // Get the first sentence or paragraph
    const sentences = summaryContent.split(/\.\s+/);
    if (sentences.length > 0 && sentences[0].trim().length > 10) {
      summaryContent = sentences[0].trim();
      if (!summaryContent.endsWith('.')) {
        summaryContent += '.';
      }
      
      // Truncate if needed
      if (summaryContent.length > maxLength) {
        const cutIndex = summaryContent.lastIndexOf(' ', maxLength);
        summaryContent = summaryContent.substring(0, cutIndex > 0 ? cutIndex : maxLength).trim() + '...';
      }
      
      return summaryContent;
    }
  }
  
  // Fallback to original logic if no Overview/Summary section found
  // Remove headers but keep their text
  content = content.replace(/^#+\s+(.+)$/gm, '$1. ');
  
  // Remove code blocks
  content = content.replace(/```[\s\S]*?```/g, '');
  content = content.replace(/`[^`]+`/g, '');
  
  // Remove images
  content = content.replace(/!\[[^\]]*\]\([^)]*\)/g, '');
  
  // Convert links to just their text
  content = content.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
  
  // Remove HTML tags
  content = content.replace(/<[^>]+>/g, '');
  
  // Remove markdown formatting
  content = content.replace(/\*\*([^*]+)\*\*/g, '$1'); // Bold
  content = content.replace(/\*([^*]+)\*/g, '$1'); // Italic
  content = content.replace(/__([^_]+)__/g, '$1'); // Bold
  content = content.replace(/_([^_]+)_/g, '$1'); // Italic
  content = content.replace(/~~([^~]+)~~/g, '$1'); // Strikethrough
  
  // Remove blockquotes
  content = content.replace(/^>\s*/gm, '');
  
  // Remove list markers
  content = content.replace(/^[-*+]\s+/gm, '');
  content = content.replace(/^\d+\.\s+/gm, '');
  
  // Remove horizontal rules
  content = content.replace(/^---+$/gm, '');
  content = content.replace(/^\*\*\*+$/gm, '');
  
  // Remove extra whitespace and normalize
  content = content.trim().replace(/\s+/g, ' ');
  
  // Skip common metadata patterns at the start
  content = content.replace(/^(Generated|Status|Verified|Date|Author|Version|Updated|Created):\s*[^\n]+\s*/gi, '');
  
  // Find the first meaningful content paragraph
  const paragraphs = content.split(/\.\s+/).filter(p => p.trim().length > 20);
  if (paragraphs.length > 0) {
    content = paragraphs[0].trim();
    if (!content.endsWith('.')) {
      content += '.';
    }
  }
  
  // Truncate if needed
  if (content.length > maxLength) {
    // Try to cut at a word boundary
    const cutIndex = content.lastIndexOf(' ', maxLength);
    content = content.substring(0, cutIndex > 0 ? cutIndex : maxLength).trim() + '...';
  }
  
  return content || 'No description available';
}

// Process markdown content
function processMarkdownContent(content, config = {}) {
  // Convert mermaid code blocks to mermaid divs with titles
  // Process before markdown parsing to prevent breaking up the content
  const mermaidBlocks = [];
  let processedContent = content.replace(/```mermaid\n([\s\S]*?)```/g, (match, mermaidContent) => {
    // Try to extract title from mermaid content
    let title = 'Diagram';
    
    // Look for title in various mermaid formats
    const titlePatterns = [
      /title\s+([^\n]+)/i,                    // gantt charts: title My Title
      /graph\s+\w+\[["']([^"']+)["']\]/,     // graph TD["My Title"]
      /flowchart\s+\w+\[["']([^"']+)["']\]/, // flowchart TD["My Title"]
      /---\s*title:\s*([^\n]+)\s*---/,       // frontmatter style
    ];
    
    for (const pattern of titlePatterns) {
      const match = mermaidContent.match(pattern);
      if (match) {
        title = match[1].trim();
        break;
      }
    }
    
    // Store the mermaid block and return a placeholder
    const placeholder = `MERMAID_BLOCK_${mermaidBlocks.length}`;
    mermaidBlocks.push(`<div class="mermaid-wrapper">
      <div class="mermaid">${mermaidContent.trim()}</div>
    </div>`);
    return placeholder;
  });
  
  // Parse the markdown
  let html = marked.parse(processedContent);
  
  // Replace placeholders with actual mermaid blocks
  mermaidBlocks.forEach((block, index) => {
    html = html.replace(`<p>MERMAID_BLOCK_${index}</p>`, block);
    html = html.replace(`MERMAID_BLOCK_${index}`, block);
  });
  
  // Replace emojis with Phosphor icons if enabled
  html = replaceEmojisWithIcons(html, config);
  
  return html;
}

/**
 * Generate favicon tag based on config
 */
function generateFaviconTag(favicon) {
  // If it's a single character (emoji), use SVG data URI
  if (favicon && favicon.length <= 2) {
    return `<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${favicon}</text></svg>">`;
  }
  // Otherwise assume it's a path to an image file
  return `<link rel="icon" href="${favicon}">`;
}

// Generate static HTML (without authentication and with relative paths)
function generateStaticHTML(title, content, navigation, currentPath = '', config = {}, originalContent = '', frontMatter = {}) {
  // Use regular generateHTML but force disable auth features and use relative paths
  const staticConfig = {
    ...config,
    features: {
      ...config.features,
      authentication: false,
      privateDirectoryAuth: false
    },
    // Special flag to indicate this is static output (for relative paths)
    isStaticOutput: true
  };
  
  return generateHTML(title, content, navigation, currentPath, staticConfig, originalContent, frontMatter);
}

// Generate HTML from template
function generateHTML(title, content, navigation, currentPath = '', config = {}, originalContent = '', frontMatter = {}) {
  // For normal output, use standard depth calculation
  const pathParts = currentPath.split('/').filter(p => p);
  let depth = pathParts.length;
  let relativePath = depth > 0 ? '../'.repeat(depth) : '';
  
  // For static output, calculate depth differently (exclude the filename)
  if (config.isStaticOutput) {
    depth = pathParts.length > 1 ? pathParts.length - 1 : 0;
    relativePath = depth > 0 ? '../'.repeat(depth) : '';
  }
  
  // For static output, use relative paths; for normal output, use absolute paths
  const resourcePath = config.isStaticOutput ? relativePath : '/';
  
  const siteName = config.siteName || 'Documentation';
  const siteDescription = config.siteDescription || 'Documentation site';
  
  // Get doc-builder version from package.json
  const packageJson = require('../package.json');
  const docBuilderVersion = packageJson.version;

  // Extract source metadata if available
  const sourceMetadata = config._sourceMetadata || {};
  const sourcePath = sourceMetadata.sourcePath || '';
  const generatedAt = sourceMetadata.generatedAt || new Date().toISOString();

  // SEO preparation
  let seoTags = '';
  let jsonLd = '';
  let finalSeoTitle = `${title} - ${siteName}`;
  let pageDescription = frontMatter.description || 
                       generateDescription(originalContent || content, config.seo?.descriptionFallback) || 
                       siteDescription;
  
  if (config.seo?.enabled && config.seo?.siteUrl) {
    // Generate page URL
    const pageUrl = `${config.seo.siteUrl}/${currentPath}`;
    
    // Extract keywords - priority: front matter > content extraction + global
    const contentKeywords = config.seo?.autoKeywords !== false ? 
                          extractKeywords(originalContent || content, config.seo?.keywordLimit || 7) : 
                          [];
    const pageKeywords = frontMatter.keywords || [];
    const keywords = [...new Set([...(config.seo.keywords || []), ...pageKeywords, ...contentKeywords])]
                     .slice(0, config.seo?.keywordLimit || 7);
    
    // Generate breadcrumbs
    const breadcrumbs = generateBreadcrumbs(currentPath, config.seo.siteUrl, siteName);
    
    // Generate SEO-optimized title
    const titleTemplate = config.seo?.titleTemplate || '{pageTitle} | {siteName}';
    const seoTitle = titleTemplate
      .replace('{pageTitle}', title)
      .replace('{siteName}', siteName);
    
    // Ensure title is within optimal SEO length (50-60 characters)
    if (seoTitle.length > 60) {
      // Try different approaches to fit within limits
      if (title.length <= 50) {
        // If page title fits, just use that
        finalSeoTitle = title;
      } else if (title.length > 50) {
        // Truncate page title but keep meaningful part
        const truncatedTitle = title.substring(0, 47) + '...';
        finalSeoTitle = truncatedTitle;
      } else {
        finalSeoTitle = seoTitle.substring(0, 57) + '...';
      }
    } else {
      finalSeoTitle = seoTitle;
    }
    
    // Generate meta tags
    seoTags = generateMetaTags({
      title: finalSeoTitle,
      description: pageDescription,
      url: pageUrl,
      author: config.seo.author,
      keywords: keywords,
      twitterHandle: config.seo.twitterHandle,
      ogImage: config.seo.ogImage,
      siteName: siteName,
      language: config.seo.language,
      type: 'article',
      customMetaTags: config.seo.customMetaTags || []
    });
    
    // Generate JSON-LD
    const now = new Date().toISOString();
    jsonLd = generateJSONLD({
      title: title,
      description: pageDescription,
      url: pageUrl,
      author: config.seo.author,
      siteName: siteName,
      datePublished: now,
      dateModified: now,
      breadcrumbs: breadcrumbs,
      organization: config.seo.organization,
      type: 'TechArticle'
    });
  }
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${escapeHtml(pageDescription || generateDescription(originalContent || content) || siteDescription)}">
    <title>${escapeHtml(finalSeoTitle || `${title} - ${siteName}`)}</title>

    <!-- Source metadata -->
    ${sourcePath ? `<meta name="md-source" content="${escapeHtml(sourcePath)}">` : ''}
    <meta name="doc-generated" content="${escapeHtml(generatedAt)}">

${seoTags}
    
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    
    <!-- Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    ${config.features?.phosphorIcons ? `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.1/src/${config.features?.phosphorWeight || 'regular'}/style.css">` : ''}
    
    <!-- Mermaid -->
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10.6.1/dist/mermaid.min.js"></script>
    
    <!-- Styles -->
    <link rel="stylesheet" href="${resourcePath}css/notion-style.css">
    
    ${config.isStaticOutput ? `
    <!-- Blue theme and white background overrides for static output -->
    <style>
      /* Override green colors with blue */
      :root {
        --primary: #2563eb;
        --primary-dark: #1d4ed8;
        --primary-light: #dbeafe;
        --accent: #3b82f6;
        --color-accent-green: #2563eb;
        --color-accent-emerald: #3b82f6;
        
        /* White backgrounds for cleaner appearance */
        --color-bg-secondary: #FFFFFF;
        --color-bg-tertiary: #FAFAFA;
        --color-bg-hover: #F8F9FA;
      }
      
      /* Override green status colors with blue variants */
      .nav-item.active {
        background-color: #dbeafe !important;
        color: #1d4ed8 !important;
      }
      
      .nav-item:hover {
        background-color: #eff6ff !important;
      }
      
      /* Override complete/success icons to blue */
      .ph-check-circle[style*="color: #059669"] {
        color: #2563eb !important;
      }
      
      /* Override README/home icon color */
      .ph-house[style*="color: #059669"] {
        color: #2563eb !important;
      }
      
      /* Override links */
      a {
        color: #2563eb;
      }
      
      a:hover {
        color: #1d4ed8;
      }
      
      /* Override buttons and interactive elements */
      .theme-toggle:hover,
      .menu-toggle:hover {
        background-color: #dbeafe;
        color: #1d4ed8;
      }
      
      /* Override nav title hover */
      .nav-title:hover {
        background-color: #eff6ff;
      }
      
      /* White backgrounds for sidebar and navigation */
      body:not(.dark-mode) .sidebar {
        background: #FFFFFF !important;
        background-color: #FFFFFF !important;
        border-right: 1px solid #E5E7EB !important;
      }
      
      body:not(.dark-mode) .nav-section {
        background: #FFFFFF !important;
        background-color: #FFFFFF !important;
      }
      
      body:not(.dark-mode) .nav-content {
        background: #FFFFFF !important;
        background-color: #FFFFFF !important;
      }
      
      body:not(.dark-mode) .navigation {
        background: #FFFFFF !important;
        background-color: #FFFFFF !important;
      }
      
      /* Subtle separation for nav sections */
      body:not(.dark-mode) .nav-section + .nav-section {
        border-top: 1px solid #F3F4F6;
      }
      
      /* Adjust hover states for white backgrounds */
      body:not(.dark-mode) .nav-item:hover {
        background-color: #F8F9FA !important;
      }
      
      body:not(.dark-mode) .nav-title.collapsible:hover {
        background-color: #F8F9FA !important;
      }
      
      /* Header stays white (already is) but ensure consistency */
      body:not(.dark-mode) .header {
        background: #FFFFFF !important;
        background-color: #FFFFFF !important;
        border-bottom: 1px solid #E5E7EB !important;
      }
      
      /* Ensure search box looks good on white */
      body:not(.dark-mode) .filter-input,
      body:not(.dark-mode) .sidebar-search {
        background: #F8F9FA !important;
        background-color: #F8F9FA !important;
        border: 1px solid #E5E7EB !important;
      }
      
      body:not(.dark-mode) .filter-input:focus,
      body:not(.dark-mode) .sidebar-search:focus {
        background: #FFFFFF !important;
        background-color: #FFFFFF !important;
        border-color: #2563eb !important;
      }
      
      /* Override breadcrumbs */
      .breadcrumbs a {
        color: #2563eb;
      }
      
      .breadcrumbs a:hover {
        color: #1d4ed8;
        background-color: #dbeafe;
      }
      
      /* Override filter icon */
      .filter-icon {
        color: #2563eb;
      }
      
      /* Override deployment info on hover */
      .deployment-date:hover {
        color: #2563eb;
      }
      
      /* Dark mode adjustments */
      body.dark-mode {
        --primary: #3b82f6;
        --primary-dark: #2563eb;
        --primary-light: #1e3a8a;
        --accent: #60a5fa;
      }
      
      body.dark-mode .nav-item.active {
        background-color: rgba(59, 130, 246, 0.1) !important;
        color: #60a5fa !important;
      }
      
      body.dark-mode .nav-item:hover {
        background-color: rgba(59, 130, 246, 0.05) !important;
      }
      
      body.dark-mode a {
        color: #60a5fa;
      }
      
      body.dark-mode a:hover {
        color: #93bbfc;
      }
    </style>
    ` : ''}
    
    ${(config.features?.authentication === 'supabase' || config.features?.privateDirectoryAuth === true) ? `
    <!-- Hide content until auth check -->
    <style>
      body { 
        visibility: hidden; 
        opacity: 0; 
        transition: opacity 0.3s ease;
      }
      body.authenticated { 
        visibility: visible; 
        opacity: 1; 
      }
      /* Show login/logout pages immediately */
      body.auth-page {
        visibility: visible;
        opacity: 1;
      }
      /* Style auth button consistently */
      .auth-btn {
        background: none;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 0.5rem;
        transition: all 0.2s;
        font-size: 1.1rem;
      }
      .auth-btn:hover {
        background: var(--bg-secondary);
        color: var(--text-primary);
      }
    </style>
    ` : ''}
    
    <!-- Favicon -->
    ${generateFaviconTag(config.favicon || '✨')}
    
    ${jsonLd}
</head>
<body>
    ${!config.isStaticOutput ? `
    <!-- Header -->
    <header class="header">
        <div class="header-content">
            <a href="${config.isStaticOutput ? relativePath + 'index.html' : '/index.html'}" class="logo">${siteName}</a>
            
            <div class="header-actions">
                <div class="deployment-info">
                    <span class="deployment-date" title="Built with doc-builder v${docBuilderVersion}">Last updated: ${new Date().toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        timeZone: 'UTC'
                    })} UTC</span>
                </div>
                
                ${(config.features?.authentication === 'supabase' || config.features?.privateDirectoryAuth === true) ? `
                <a href="${relativePath}login.html" class="auth-btn" title="Login/Logout">
                    <i class="fas fa-sign-in-alt"></i>
                </a>
                ` : ''}
                
                <button id="theme-toggle" class="theme-toggle" aria-label="Toggle theme">
                    <i class="fas fa-moon"></i>
                </button>
                
                <button id="menu-toggle" class="menu-toggle" aria-label="Toggle menu">
                    <i class="fas fa-bars"></i>
                </button>
            </div>
        </div>
    </header>
    ` : ''}
    
    ${config.banner?.enabled || config.features?.banner ? `
    <!-- Preview Banner -->
    <div id="preview-banner" class="preview-banner banner-${config.banner?.type || 'warning'}">
        <div class="banner-content">
            <i class="${config.banner?.icon || 'fas fa-exclamation-triangle'} banner-icon"></i>
            <span class="banner-text">${config.banner?.text || 'This documentation is a preview version - some content may be incomplete'}</span>
            ${config.banner?.dismissible !== false ? `
            <button id="dismiss-banner" class="banner-dismiss" aria-label="Dismiss banner">
                <i class="fas fa-times"></i>
            </button>
            ` : ''}
        </div>
    </div>
    ` : ''}
    
    <!-- Breadcrumbs -->
    <nav class="breadcrumbs ${config.isStaticOutput ? 'breadcrumbs-static' : ''}" id="breadcrumbs" ${config.isStaticOutput ? `data-build-date="${new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC'
    })} UTC" data-doc-builder-version="${docBuilderVersion}"` : ''}>
        ${config.isStaticOutput ? `
        <!-- Pre-rendered breadcrumb content for static builds -->
        <div class="breadcrumbs-content breadcrumbs-homepage">
          <div class="breadcrumbs-right">
            <span class="breadcrumb-date" title="Built with doc-builder v${docBuilderVersion}">Last updated: ${new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'UTC'
            })} UTC</span>
            <button class="breadcrumb-md-btn" onclick="downloadMarkdown()" title="Download Markdown" aria-label="Download Markdown">
              <i class="fas fa-file-code"></i>
            </button>
            <button class="breadcrumb-pdf-btn" onclick="if(typeof exportToPDF !== 'undefined') exportToPDF(); else window.print();" title="Export to PDF" aria-label="Export to PDF">
              <i class="fas fa-file-pdf"></i>
            </button>
          </div>
        </div>
        ` : '<!-- Breadcrumbs will be generated by JavaScript -->'}
    </nav>
    
    <!-- Main Content -->
    <div class="main-wrapper">
        <!-- Sidebar -->
        <aside class="sidebar">
            <div class="sidebar-header">
                <div class="filter-box">
                    <input type="text" placeholder="Search menu..." class="filter-input" id="nav-filter">
                    <i class="fas fa-search filter-icon"></i>
                </div>
            </div>
            <nav class="navigation">
                ${navigation}
            </nav>
            <div class="resize-handle"></div>
        </aside>
        
        <!-- Content Area -->
        <main class="content">
            <div class="content-inner">
                ${content}
            </div>
        </main>
    </div>
    
    <!-- Scripts -->
    <script>
    // Pass configuration to frontend
    window.docBuilderConfig = {
      features: {
        showPdfDownload: ${config.features?.showPdfDownload !== false},
        menuDefaultOpen: ${config.features?.menuDefaultOpen !== false},
        mermaidEnhanced: ${config.features?.mermaidEnhanced !== false}
      }
    };

    // Source metadata for JS consumers
    window.__DOC_SOURCE__ = {
      mdSource: ${sourcePath ? `"${escapeHtml(sourcePath)}"` : 'null'},
      generatedAt: "${escapeHtml(generatedAt)}",
      docBuilderVersion: "${docBuilderVersion}"
    };
    </script>
    <script src="${resourcePath}js/main.js"></script>
    ${(config.features?.authentication === 'supabase' || config.features?.privateDirectoryAuth === true) ? `<script src="https://unpkg.com/@supabase/supabase-js@2"></script>
    <script src="${resourcePath}js/auth.js"></script>` : ''}
</body>
</html>`;
}

// Define folder descriptions for tooltips
const folderDescriptions = {
  'product-roadmap': 'Strategic vision, timeline, and feature planning',
  'product-requirements': 'Detailed product specifications, requirements documents, and feature definitions',
  'architecture': 'System design, data flows, and technical infrastructure documentation',
  'system-analysis': 'Comprehensive system analysis, functional requirements, and cross-component documentation',
  'bubble': 'Core application platform - business logic, UI/UX, and user workflows',
  'quickbase': 'Database schema, data management, and backend operations',
  'activecampaign': 'Marketing automation integration and lead management system',
  'doc-signer': 'Document signing service for digital signatures and PDF generation',
  'api-deprecated': 'Legacy API documentation (deprecated, for reference only)',
  'postman': 'API testing tools, collections, and test automation',
  'mcp': 'Model Context Protocol integration and configuration',
  'team': 'Team structure, roles, and responsibilities',
  'thought-leadership': 'Strategic insights and industry perspectives',
  'middleware': 'Integration layers and data transformation services',
  'paths': 'User journey flows and process workflows',
  'testing': 'Test strategies, scenarios, and quality assurance processes',
  'api': 'API documentation and integration guides'
};

// Build navigation structure with rich functionality
function buildNavigationStructure(files, currentFile, config = {}) {
  const tree = { files: [], folders: {} };
  
  // Check if authentication is enabled (either global or private directory)
  const isAuthEnabled = config.features?.authentication === 'supabase' || config.features?.privateDirectoryAuth === true;
  
  // Include all files in navigation - we'll use CSS to show/hide based on auth state
  files.forEach(file => {
    
    const parts = file.urlPath.split('/');
    let current = tree;
    
    // Navigate/create folder structure
    for (let i = 0; i < parts.length - 1; i++) {
      const folder = parts[i];
      if (!current.folders[folder]) {
        current.folders[folder] = { files: [], folders: {} };
      }
      current = current.folders[folder];
    }
    
    // Add file to current folder
    current.files.push(file);
  });
  
  // Helper function to check if a node has active child
  const checkActiveChild = (node, currentFile) => {
    // Check files
    if (node.files.some(f => f.urlPath === currentFile)) return true;
    
    // Check folders recursively
    return Object.values(node.folders).some(folder => checkActiveChild(folder, currentFile));
  };
  
  // Helper function to generate file title
  const generateFileTitle = (file, parentDisplayName, level) => {
    // First check for front matter title
    if (file.frontMatter?.title) {
      return file.frontMatter.title;
    }
    
    let title = file.displayName;
    
    if (file.displayName === 'README') {
      return level === 0 ? 'Overview' : `${parentDisplayName} Overview`;
    }
    
    // Clean up title by removing common prefixes and improving formatting
    title = title
      .replace(/^(bubble|system|quickbase|middleware|product-roadmap)-?/, '');
    
    title = smartCapitalize(title);
    
    return title;
  };
  
  // OPTIMIZATION: Helper function to render a section using array joins instead of string concatenation
  const renderSection = (folderName, folderData, level = 0, parentPath = '') => {
    const icons = {
      'root': 'ph ph-caret-down',
      'product-roadmap': 'ph ph-road-horizon',
      'product-requirements': 'ph ph-list-checks',
      'architecture': 'ph ph-tree-structure',
      'system-analysis': 'ph ph-chart-line-up',
      'system': 'ph ph-gear-six',
      'bubble': 'ph ph-circle',
      'quickbase': 'ph ph-database',
      'activecampaign': 'ph ph-envelope',
      'doc-signer': 'ph ph-signature',
      'api-deprecated': 'ph ph-archive',
      'postman': 'ph ph-flask',
      'mcp': 'ph ph-puzzle-piece',
      'team': 'ph ph-users',
      'thought-leadership': 'ph ph-lightbulb',
      'middleware': 'ph ph-stack',
      'paths': 'ph ph-path',
      'testing': 'ph ph-test-tube',
      'api': 'ph ph-plug',
      'documentation-tool': 'ph ph-wrench',
      'guides': 'ph ph-book',
      'private': 'ph ph-lock',
      'launch': 'ph ph-rocket-launch',
      'prompts': 'ph ph-chat-circle-dots'
    };

    const displayName = folderName === 'root' ? 'Documentation' :
                       smartCapitalize(folderName);
    const icon = icons[folderName] || 'ph ph-folder';

    if (!folderData.files.length && !Object.keys(folderData.folders).length) {
      return '';
    }

    // Include parent path in section ID to make it unique
    const pathParts = parentPath ? [parentPath, folderName].join('-') : folderName;
    const sectionId = `nav-${pathParts}-${level}`;
    const isCollapsible = level > 0 || folderName !== 'root';
    const collapseIcon = isCollapsible ? '<i class="ph ph-caret-right collapse-icon"></i>' : '';

    // Check if this folder has a README.md file to link to
    const readmeFile = folderData.files.find(f => f.displayName === 'README');
    const folderLink = readmeFile ?
      `href="${config.isStaticOutput ? readmeFile.urlPath : '/' + readmeFile.urlPath}"` :
      'href="#"';

    // Get folder description for tooltip
    const folderDescription = folderDescriptions[folderName] || '';
    const tooltipAttr = folderDescription ? `data-tooltip="${escapeHtml(folderDescription)}"` : '';

    // Check if this folder has active child or if we're on index page
    const hasActiveChild = checkActiveChild(folderData, currentFile);
    const shouldExpand = hasActiveChild || currentFile === 'index.html' || (currentFile === 'README.html' && level === 1);

    // Check if this is a private folder
    const isPrivateFolder = folderName === 'private' || parentPath.includes('private');
    const privateClass = isPrivateFolder ? ' private-nav' : '';

    // OPTIMIZATION: Use array instead of string concatenation
    const htmlParts = [];
    const isRoot = folderName === 'root' && level === 0;

    if (isRoot) {
      htmlParts.push(`
      <div class="nav-section${privateClass}" data-level="${level}">
        <a class="nav-title toggle-all-nav expanded" href="#" id="nav-toggle-all" title="Collapse/Expand All">
          <i class="ph ph-caret-down" id="toggle-all-icon"></i> ${displayName}
        </a>
        <div class="nav-content">`);
    } else {
      htmlParts.push(`
      <div class="nav-section${privateClass}" data-level="${level}">
        <a class="nav-title${isCollapsible ? ' collapsible' : ''}${shouldExpand ? ' expanded' : ''}" ${folderLink} ${isCollapsible ? `data-target="${sectionId}"` : ''} ${tooltipAttr}>
          ${collapseIcon}<i class="${icon}"></i> ${displayName}
        </a>
        <div class="nav-content${isCollapsible ? (shouldExpand ? '' : ' collapsed') : ''}" ${isCollapsible ? `id="${sectionId}"` : ''}>`);
    }

    // Sort and render files
    const sortedFiles = [...folderData.files].sort((a, b) => {
      if (a.displayName === 'README') return -1;
      if (b.displayName === 'README') return 1;
      return a.displayName.localeCompare(b.displayName);
    });

    sortedFiles.forEach(file => {
      const title = generateFileTitle(file, displayName, level);

      let isActive = '';
      if (currentFile === file.urlPath) {
        isActive = ' active';
      } else if (currentFile === 'index.html' && file.displayName === 'README' && folderName === 'root') {
        isActive = ' active';
      }

      const linkPath = config.isStaticOutput ? file.urlPath : '/' + file.urlPath;
      const tooltip = file.summary ? ` data-tooltip="${escapeHtml(file.summary)}"` : '';
      const icon = getIconForStatus(file.status || 'default', false, config);

      htmlParts.push(`
        <a href="${linkPath}" class="nav-item${isActive}"${tooltip}>${icon} ${title}</a>`);
    });

    htmlParts.push(`</div></div>`);

    // Render subfolders AFTER closing the parent section
    Object.keys(folderData.folders)
      .sort()
      .forEach(subFolder => {
        const currentPath = parentPath ? `${parentPath}-${folderName}` : folderName;
        htmlParts.push(renderSection(subFolder, folderData.folders[subFolder], level + 1, currentPath));
      });

    return htmlParts.join('');
  };
  
  // Check if this is a flat structure
  const hasFolders = Object.keys(tree.folders).length > 0;
  
  if (!hasFolders) {
    // Generate simple flat navigation for all files in root
    return renderSection('root', { files: tree.files, folders: {} }, 0);
  } else {
    // OPTIMIZATION: Use array for hierarchical navigation building
    const navParts = [];

    // 1. First render the root Documentation section with Overview
    const readmeFile = tree.files.find(f => f.displayName === 'README');
    if (readmeFile || tree.files.length > 0) {
      const rootFiles = readmeFile ? [readmeFile] : [];
      navParts.push(renderSection('root', { files: rootFiles, folders: {} }, 0));
    }

    // 2. Then render all folders alphabetically
    Object.keys(tree.folders)
      .sort()
      .forEach(folderName => {
        navParts.push(renderSection(folderName, tree.folders[folderName], 1));
      });

    // 3. Finally, add remaining root files to the Documentation section
    const otherRootFiles = tree.files.filter(f => f.displayName !== 'README');
    if (otherRootFiles.length > 0) {
      const nav = navParts.join('');
      // Find the closing </div></div> of the first nav-section (Documentation)
      const navSections = nav.split('<div class="nav-section"');

      if (navSections.length > 1) {
        const firstSection = navSections[1];
        const contentDivEnd = firstSection.indexOf('</div></div>');

        if (contentDivEnd !== -1) {
          const additionalFilesParts = [];
          otherRootFiles.forEach(file => {
            const title = smartCapitalize(file.displayName);
            let isActive = '';
            if (currentFile === file.urlPath) {
              isActive = ' active';
            }
            const linkPath = config.isStaticOutput ? file.urlPath : '/' + file.urlPath;
            const tooltip = file.summary ? ` data-tooltip="${escapeHtml(file.summary)}"` : '';
            const icon = getIconForStatus(file.status || 'default', false, config);
            additionalFilesParts.push(`
        <a href="${linkPath}" class="nav-item${isActive}"${tooltip}>${icon} ${title}</a>`);
          });

          // Reconstruct with additional files inserted
          navSections[1] = firstSection.slice(0, contentDivEnd) + additionalFilesParts.join('') + firstSection.slice(contentDivEnd);
          return navSections.join('<div class="nav-section"');
        }
      }
    }

    return navParts.join('');
  }
}

// Process single markdown file
async function processMarkdownFile(filePath, outputPath, allFiles, config, useStaticHTML = false) {
  const rawContent = await fs.readFile(filePath, 'utf-8');
  const fileName = path.basename(filePath, '.md');
  const relativePath = path.relative(config.docsDir, filePath);
  // Encode special characters in URL but keep slashes
  const urlPath = relativePath
    .replace(/\.md$/, '.html')
    .replace(/\\/g, '/')
    .split('/')
    .map(segment => encodeURIComponent(segment))
    .join('/');

  // Parse front matter
  const { data: frontMatter, content } = matter(rawContent);

  // Extract title - priority: front matter > H1 > filename
  const h1Match = content.match(/^#\s+(.+)$/m);
  const h1Title = h1Match ? h1Match[1] : null;

  // Normalize title if needed (e.g., convert all-caps to title case)
  const rawTitle = frontMatter.title || h1Title || fileName;
  const title = config.features?.normalizeTitle !== false ? normalizeTitle(rawTitle) : rawTitle;

  // Extract summary for tooltip - priority: front matter > auto-extract
  const summary = frontMatter.description || extractSummary(content);

  // OPTIMIZATION: Update the file entry in allFiles with computed summary and status
  // This allows navigation tooltips to work even though we defer content loading
  const fileEntry = allFiles.find(f => f.path === filePath);
  if (fileEntry) {
    if (!fileEntry.summary) {
      fileEntry.summary = summary;
    }
    if (!fileEntry.status) {
      fileEntry.status = detectDocumentStatus(content, frontMatter);
    }
  }
  
  // Process content
  const htmlContent = processMarkdownContent(content, config);

  // Create config with source metadata for HTML generation
  const generationTimestamp = new Date().toISOString();
  const htmlConfig = {
    ...config,
    _sourceMetadata: {
      sourcePath: relativePath,  // e.g., "docs/technical/local-dev-troubleshooting.md"
      generatedAt: generationTimestamp
    }
  };

  // Build navigation - pass config to handle private file filtering
  // For static HTML, we need to build navigation with relative paths
  const navConfig = useStaticHTML ? { ...htmlConfig, isStaticOutput: true } : htmlConfig;
  const navigation = buildNavigationStructure(allFiles, urlPath, navConfig);

  // Generate full HTML (pass original content and front matter for SEO)
  const html = useStaticHTML
    ? generateStaticHTML(title, htmlContent, navigation, urlPath, htmlConfig, content, frontMatter)
    : generateHTML(title, htmlContent, navigation, urlPath, htmlConfig, content, frontMatter);
  
  // Write file
  await fs.ensureDir(path.dirname(outputPath));
  await fs.writeFile(outputPath, html);

  // Copy source .md file alongside HTML for download
  const mdOutputPath = outputPath.replace(/\.html$/, '.md');
  await fs.copyFile(filePath, mdOutputPath);

  return { title, urlPath, summary, frontMatter };
}

// OPTIMIZATION: Unified directory scanner - scans once for both markdown and attachments
async function scanAllFiles(dir, baseDir = dir, options = {}) {
  const markdownFiles = [];
  const attachmentFiles = [];
  const attachmentTypes = options.attachmentTypes || [];
  const items = await fs.readdir(dir);

  for (const item of items) {
    // Skip files with non-printable characters in their names
    if (hasNonPrintableChars(item)) {
      console.log(chalk.yellow(`⚠️  Skipping file with non-printable characters: ${sanitizeFilename(item)}`));
      continue;
    }

    const fullPath = path.join(dir, item);
    const stat = await fs.stat(fullPath);

    // Skip private directories if excludePrivate is true
    if (stat.isDirectory() && options.excludePrivate && item === 'private') {
      continue;
    }

    if (stat.isDirectory() && !item.startsWith('.') && !item.startsWith('_')) {
      const subResult = await scanAllFiles(fullPath, baseDir, options);
      markdownFiles.push(...subResult.markdownFiles);
      attachmentFiles.push(...subResult.attachmentFiles);
    } else if (item.endsWith('.md') && !item.startsWith('_')) {
      // Process markdown files
      const relativePath = path.relative(baseDir, fullPath);
      const urlPath = relativePath
        .replace(/\.md$/, '.html')
        .replace(/\\/g, '/')
        .split('/')
        .map(segment => encodeURIComponent(segment))
        .join('/');
      const displayName = smartCapitalize(path.basename(item, '.md'));

      // OPTIMIZATION: Only read frontmatter, not full content
      // Read file but only parse frontmatter, defer content processing
      const rawContent = await fs.readFile(fullPath, 'utf-8');
      const { data: frontMatter } = matter(rawContent, { excerpt: false });

      // Use frontmatter description if available, otherwise defer summary extraction
      const summary = frontMatter.description || '';
      const status = frontMatter.status || null;

      const isPrivate = relativePath.split(path.sep)[0] === 'private' ||
                       relativePath.startsWith('private/') ||
                       relativePath.startsWith('private\\');

      if (options.excludePrivate && isPrivate) {
        continue;
      }

      markdownFiles.push({
        path: fullPath,
        relativePath,
        urlPath,
        displayName,
        summary,
        isPrivate,
        status,
        frontMatter,
      });
    } else if (attachmentTypes.length > 0) {
      // Process attachment files
      const ext = path.extname(item).toLowerCase();
      if (attachmentTypes.includes(ext) && !item.startsWith('.')) {
        const relativePath = path.relative(baseDir, fullPath);
        const isPrivate = relativePath.split(path.sep)[0] === 'private' ||
                         relativePath.startsWith('private/') ||
                         relativePath.startsWith('private\\');

        if (options.excludePrivate && isPrivate) {
          continue;
        }

        attachmentFiles.push({
          path: fullPath,
          relativePath,
          size: stat.size
        });
      }
    }
  }

  return { markdownFiles, attachmentFiles };
}

// Get all markdown files (backward compatibility wrapper)
async function getAllMarkdownFiles(dir, baseDir = dir, options = {}) {
  const result = await scanAllFiles(dir, baseDir, options);
  return result.markdownFiles;
}

// Get all attachment files (backward compatibility wrapper)
async function getAllAttachmentFiles(dir, baseDir = dir, attachmentTypes) {
  const result = await scanAllFiles(dir, baseDir, { attachmentTypes });
  return result.attachmentFiles;
}

// Copy attachment files to output directory
async function copyAttachmentFiles(attachmentFiles, docsDir, outputDir) {
  let totalSize = 0;
  let copiedCount = 0;
  
  for (const file of attachmentFiles) {
    try {
      const outputPath = path.join(outputDir, file.relativePath);
      const outputDirPath = path.dirname(outputPath);
      
      // Create directory if it doesn't exist
      await fs.ensureDir(outputDirPath);
      
      // Copy the file
      await fs.copy(file.path, outputPath, { overwrite: true });
      
      totalSize += file.size;
      copiedCount++;
    } catch (error) {
      console.warn(chalk.yellow(`Warning: Could not copy ${file.relativePath}: ${error.message}`));
    }
  }
  
  return { copiedCount, totalSize };
}

// Main build function
async function buildDocumentation(config) {
  const docsDir = path.join(process.cwd(), config.docsDir);
  const outputDir = path.join(process.cwd(), config.outputDir);
  
  // Log version for debugging
  const packageJson = require('../package.json');
  console.log(chalk.blue(`📦 Using @knowcode/doc-builder v${packageJson.version}`));
  
  // Ensure output directory exists
  await fs.ensureDir(outputDir);
  
  // Check and create placeholder README.md if missing
  console.log(chalk.blue('📋 Checking documentation structure...'));
  const readmeGenerated = await createPlaceholderReadme(docsDir, config);
  
  // OPTIMIZATION: Single unified scan for both markdown and attachments
  console.log(chalk.blue('📄 Scanning documentation directory...'));
  const attachmentTypes = config.attachmentTypes || [
    '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.csv', '.ppt', '.pptx', '.txt', '.rtf',
    '.html', '.htm',
    '.zip', '.tar', '.gz', '.7z', '.rar',
    '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico', '.bmp',
    '.json', '.xml', '.yaml', '.yml', '.toml',
    '.mp4', '.mp3', '.wav', '.avi', '.mov'
  ];

  const { markdownFiles: files, attachmentFiles } = await scanAllFiles(docsDir, docsDir, {
    attachmentTypes: config.features?.attachments !== false ? attachmentTypes : []
  });

  console.log(chalk.green(`✅ Found ${files.length} markdown files${readmeGenerated ? ' (including auto-generated README)' : ''}`));
  if (config.features?.attachments !== false && attachmentFiles.length > 0) {
    console.log(chalk.gray(`   Found ${attachmentFiles.length} attachments`));
  }

  // Log the files found
  if (files.length > 0) {
    console.log(chalk.gray('  Found files:'));
    files.forEach(file => {
      console.log(chalk.gray(`  - ${file.relativePath} → ${file.urlPath}`));
    });
  }
  
  console.log(chalk.blue('📝 Processing files...'));
  for (const file of files) {
    const outputPath = path.join(outputDir, file.urlPath);
    await processMarkdownFile(file.path, outputPath, files, config);
    console.log(chalk.green(`✅ Generated: ${outputPath}`));
  }
  
  // Copy assets
  const assetsDir = path.join(__dirname, '../assets');
  const cssSource = path.join(assetsDir, 'css');
  const jsSource = path.join(assetsDir, 'js');
  
  if (fs.existsSync(cssSource)) {
    await fs.copy(cssSource, path.join(outputDir, 'css'), { overwrite: true });
  }
  
  if (fs.existsSync(jsSource)) {
    await fs.copy(jsSource, path.join(outputDir, 'js'), { overwrite: true });
    
    // Generate Supabase auth script if authentication is needed (global or private directory)
    if (config.features?.authentication === 'supabase' || config.features?.privateDirectoryAuth === true) {
      await generateSupabaseAuthFiles(outputDir, config);
    }
  }
  
  // Copy 404.html for handling .md redirects
  const notFoundSource = path.join(assetsDir, '404.html');
  if (fs.existsSync(notFoundSource)) {
    await fs.copy(notFoundSource, path.join(outputDir, '404.html'), { overwrite: true });
    console.log(chalk.green('✅ Copied 404.html for .md link handling'));
  }
  
  // Create index.html with proper priority: index.md > README.md > auto-generated
  const indexPath = path.join(outputDir, 'index.html');
  const readmePath = path.join(outputDir, 'README.html');
  const indexMdPath = path.join(docsDir, 'index.md');

  console.log(chalk.blue('\n📄 Checking for index.html creation...'));
  console.log(chalk.gray(`  - Output directory: ${outputDir}`));
  console.log(chalk.gray(`  - Index path: ${indexPath}`));
  console.log(chalk.gray(`  - README path: ${readmePath}`));
  console.log(chalk.gray(`  - index.md exists: ${fs.existsSync(indexMdPath)}`));
  console.log(chalk.gray(`  - index.html exists: ${fs.existsSync(indexPath)}`));
  console.log(chalk.gray(`  - README.html exists: ${fs.existsSync(readmePath)}`));

  // List all HTML files in output directory
  if (fs.existsSync(outputDir)) {
    const htmlFiles = fs.readdirSync(outputDir)
      .filter(f => !hasNonPrintableChars(f) && f.endsWith('.html'));
    console.log(chalk.gray(`  - HTML files in output: [${htmlFiles.join(', ')}]`));
  } else {
    console.log(chalk.red(`  - ERROR: Output directory does not exist!`));
  }

  // Check if we need to create/replace index.html
  let shouldCreateIndex = false;

  // Priority 1: If index.md exists, index.html was generated from it - keep it
  if (fs.existsSync(indexMdPath) && fs.existsSync(indexPath)) {
    console.log(chalk.gray('ℹ️  index.md exists - index.html was generated from it, keeping as-is'));
    shouldCreateIndex = false;
  } else if (!fs.existsSync(indexPath)) {
    // Priority 2: No index.html exists, need to create it
    console.log(chalk.yellow('⚠️  index.html does not exist, need to create it'));
    shouldCreateIndex = true;
  } else if (fs.existsSync(readmePath) && !fs.existsSync(indexMdPath)) {
    // Priority 3: README.html exists but no index.md, use README as homepage
    console.log(chalk.blue('ℹ️  Regenerating index.html from README.html to ensure current version'));
    shouldCreateIndex = true;
  } else {
    // Check if existing index.html is likely a directory listing or outdated
    const indexStats = fs.statSync(indexPath);
    const indexContent = fs.readFileSync(indexPath, 'utf8');

    // Check if it's a small file (likely directory listing) or contains directory listing markers
    if (indexStats.size < 3000 || indexContent.includes('<title>Documentation</title>') && indexContent.includes('<ul>') && !indexContent.includes('class="navigation"')) {
      console.log(chalk.yellow('⚠️  Existing index.html appears to be a directory listing (size: ' + indexStats.size + ' bytes), will replace it'));
      shouldCreateIndex = true;
    } else if (!indexContent.includes('@knowcode/doc-builder')) {
      console.log(chalk.yellow('⚠️  Existing index.html was not created by doc-builder, will replace it'));
      shouldCreateIndex = true;
    }
  }
  
  if (shouldCreateIndex) {
    if (fs.existsSync(readmePath)) {
      console.log(chalk.blue('  → Found README.html, copying to index.html'));
      try {
        await fs.copy(readmePath, indexPath);
        console.log(chalk.green('✅ Successfully created index.html from README.html'));
        
        // Verify the copy worked
        if (fs.existsSync(indexPath)) {
          const stats = fs.statSync(indexPath);
          console.log(chalk.gray(`  - index.html size: ${stats.size} bytes`));
        } else {
          console.log(chalk.red('  - ERROR: index.html was not created!'));
        }
      } catch (error) {
        console.log(chalk.red(`  - ERROR copying README.html: ${error.message}`));
      }
    } else {
      // No README.html, create informative default page
      console.log(chalk.yellow('⚠️  No README.html found, creating default index.html'));
      try {
        const defaultIndex = await createDefaultIndexPage(outputDir, config, packageJson.version);
        await fs.writeFile(indexPath, defaultIndex);
        console.log(chalk.green('✅ Created default index.html with instructions'));
        
        // Verify the write worked
        if (fs.existsSync(indexPath)) {
          const stats = fs.statSync(indexPath);
          console.log(chalk.gray(`  - index.html size: ${stats.size} bytes`));
        } else {
          console.log(chalk.red('  - ERROR: default index.html was not created!'));
        }
      } catch (error) {
        console.log(chalk.red(`  - ERROR creating default index.html: ${error.message}`));
      }
    }
  } else {
    console.log(chalk.gray('ℹ️  index.html already exists and appears valid'));
    const stats = fs.statSync(indexPath);
    console.log(chalk.gray(`  - Existing index.html size: ${stats.size} bytes`));
    console.log(chalk.gray(`  - Keeping existing index.html (likely from index.md or custom page)`));
  }
  
  // Final verification
  console.log(chalk.blue('\n📋 Final index.html check:'));
  if (fs.existsSync(indexPath)) {
    console.log(chalk.green(`  ✅ index.html exists at: ${indexPath}`));
  } else {
    console.log(chalk.red(`  ❌ index.html is MISSING at: ${indexPath}`));
  }
  
  // Generate SEO files if enabled
  if (config.seo?.enabled && config.seo?.siteUrl) {
    console.log(chalk.blue('\n🔍 Generating SEO files...'));
    
    // Collect all HTML files for sitemap
    const pages = [];
    const walkDir = (dir, baseDir = '') => {
      const items = fs.readdirSync(dir);
      items.forEach(item => {
        // Skip files with non-printable characters
        if (hasNonPrintableChars(item)) {
          return;
        }
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          walkDir(fullPath, path.join(baseDir, item));
        } else if (item.endsWith('.html') && !item.includes('login') && !item.includes('logout')) {
          pages.push({
            path: baseDir ? path.join(baseDir, item) : item,
            modified: stat.mtime
          });
        }
      });
    };
    
    walkDir(outputDir);
    
    // Generate sitemap if enabled
    if (config.seo.generateSitemap) {
      await generateSitemap(pages, config.seo.siteUrl, outputDir);
    }
    
    // Generate robots.txt if enabled
    if (config.seo.generateRobotsTxt) {
      await generateRobotsTxt(config.seo.siteUrl, outputDir, {
        hasAuthentication: config.features?.authentication === 'supabase' || config.features?.privateDirectoryAuth === true
      });
    }
  }
  
  // OPTIMIZATION: Use cached attachment files from initial scan
  if (config.features?.attachments !== false && attachmentFiles.length > 0) {
    console.log(chalk.blue('\n📎 Processing attachments...'));

    try {
      const { copiedCount, totalSize } = await copyAttachmentFiles(attachmentFiles, docsDir, outputDir);

      // Format file size
      const formatSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
      };

      console.log(chalk.green(`✅ Copied ${copiedCount} attachments (${formatSize(totalSize)} total)`));
    } catch (error) {
      console.warn(chalk.yellow(`Warning: Error processing attachments: ${error.message}`));
    }
  } else if (config.features?.attachments !== false) {
    console.log(chalk.gray('  No attachments found to copy'));
  }
  
  // Generate static version if enabled
  if (config.features?.staticOutput !== false) {
    console.log(chalk.blue('\n🌐 Generating static version (no auth, no private content)...'));

    const staticOutputDir = path.join(process.cwd(), config.staticOutputDir || 'html-static');

    // Ensure static output directory exists
    await fs.ensureDir(staticOutputDir);

    // OPTIMIZATION: Filter already-scanned files instead of re-scanning
    const staticFiles = files.filter(f => !f.isPrivate);
    console.log(chalk.gray(`  Found ${staticFiles.length} public files (private files excluded)`));
    
    // Process files for static output
    for (const file of staticFiles) {
      const outputPath = path.join(staticOutputDir, file.urlPath);
      await processMarkdownFile(file.path, outputPath, staticFiles, config, true);
    }
    
    // Copy assets to static directory
    const assetsDir = path.join(__dirname, '../assets');
    const cssSource = path.join(assetsDir, 'css');
    const jsSource = path.join(assetsDir, 'js');
    
    if (fs.existsSync(cssSource)) {
      await fs.copy(cssSource, path.join(staticOutputDir, 'css'), { overwrite: true });
    }
    
    if (fs.existsSync(jsSource)) {
      await fs.copy(jsSource, path.join(staticOutputDir, 'js'), { overwrite: true });
      // Don't generate auth.js for static version
    }
    
    // Copy 404.html for handling .md redirects
    const notFoundSource = path.join(assetsDir, '404.html');
    if (fs.existsSync(notFoundSource)) {
      await fs.copy(notFoundSource, path.join(staticOutputDir, '404.html'), { overwrite: true });
    }
    
    // Create index.html from README.html or generate default
    const staticIndexPath = path.join(staticOutputDir, 'index.html');
    const staticReadmePath = path.join(staticOutputDir, 'README.html');
    
    if (fs.existsSync(staticReadmePath)) {
      await fs.copy(staticReadmePath, staticIndexPath);
    } else if (staticFiles.length > 0) {
      // Generate a default index that lists available pages
      const defaultIndex = await createDefaultIndexPage(staticOutputDir, config, packageJson.version);
      await fs.writeFile(staticIndexPath, defaultIndex);
    }
    
    // OPTIMIZATION: Filter already-scanned attachments instead of re-scanning
    if (config.features?.attachments !== false && attachmentFiles.length > 0) {
      try {
        const staticAttachmentFiles = attachmentFiles.filter(file =>
          !file.relativePath.startsWith('private/') && !file.relativePath.startsWith('private\\')
        );

        if (staticAttachmentFiles.length > 0) {
          await copyAttachmentFiles(staticAttachmentFiles, docsDir, staticOutputDir);
        }
      } catch (error) {
        console.warn(chalk.yellow(`Warning: Error copying attachments to static output: ${error.message}`));
      }
    }
    
    // Generate SEO files for static version if enabled
    if (config.seo?.enabled && config.seo?.siteUrl) {
      // Collect all HTML files for sitemap
      const staticPages = [];
      const walkDir = (dir, baseDir = '') => {
        const items = fs.readdirSync(dir);
        items.forEach(item => {
          // Skip files with non-printable characters
          if (hasNonPrintableChars(item)) {
            return;
          }
          const fullPath = path.join(dir, item);
          const stat = fs.statSync(fullPath);
          if (stat.isDirectory()) {
            walkDir(fullPath, path.join(baseDir, item));
          } else if (item.endsWith('.html')) {
            staticPages.push({
              path: baseDir ? path.join(baseDir, item) : item,
              modified: stat.mtime
            });
          }
        });
      };
      
      walkDir(staticOutputDir);
      
      if (config.seo.generateSitemap) {
        await generateSitemap(staticPages, config.seo.siteUrl, staticOutputDir);
      }
      
      if (config.seo.generateRobotsTxt) {
        await generateRobotsTxt(config.seo.siteUrl, staticOutputDir, {
          hasAuthentication: false
        });
      }
    }
    
    console.log(chalk.green(`✅ Static version generated in ${config.staticOutputDir || 'html-static'}/`));
  }
  
  console.log(chalk.green('\n✅ Documentation build complete!'));
}

// Create placeholder README.md if missing
async function createPlaceholderReadme(docsDir, config) {
  // Create docs directory if it doesn't exist
  if (!fs.existsSync(docsDir)) {
    try {
      await fs.ensureDir(docsDir);
      console.log(chalk.yellow(`📁 Created missing docs directory: ${docsDir}`));
    } catch (error) {
      console.error(chalk.red(`Error creating docs directory: ${error.message}`));
      throw error;
    }
  }
  
  const readmePath = path.join(docsDir, 'README.md');
  const indexPath = path.join(docsDir, 'index.md');
  
  // Check if README.md or index.md already exists
  if (fs.existsSync(readmePath)) {
    console.log(chalk.gray('  ✓ README.md found'));
    return false; // README already exists, no need to create
  }
  
  if (fs.existsSync(indexPath)) {
    console.log(chalk.gray('  ✓ index.md found'));
    return false; // index.md exists, no need for README
  }
  
  const siteName = config.siteName || 'Documentation';
  const currentDate = new Date().toISOString().split('T')[0];
  
  const placeholderContent = `# Welcome to ${siteName}

**Generated**: ${currentDate} UTC
**Status**: Placeholder - Ready for customization
**Verified**: ❓ (Auto-generated content)

## Overview

This documentation site was built with @knowcode/doc-builder. This is an auto-generated placeholder to help you get started.

## Getting Started

1. **Replace this file**: Edit \`docs/README.md\` with your project's actual documentation
2. **Add content**: Create additional markdown files in the \`docs/\` directory
3. **Organize with folders**: Use subfolders to structure your documentation
4. **Rebuild**: Run \`npx @knowcode/doc-builder@latest build\` to regenerate the site

## Documentation Structure

Your documentation can include:

- **Overview**: Main project description (this file)
- **Guides**: Step-by-step tutorials
- **API Reference**: Technical documentation
- **Examples**: Code samples and usage
- **Architecture**: System design and technical details

## Next Steps

1. Edit this README.md file with your project information
2. Create additional markdown files for your content
3. Organize files into logical folders
4. Use Mermaid diagrams for visual explanations
5. Deploy with \`npx @knowcode/doc-builder@latest deploy\`

## Documentation Standards

This project follows structured documentation conventions:

### File Organization
- Use descriptive filenames with hyphens (e.g., \`user-guide.md\`)
- Organize related content in folders
- Include a README.md in each major folder

### Content Format
- Start each document with metadata (Generated date, Status, Verified status)
- Use clear headings and consistent structure
- Include diagrams where helpful to explain concepts
- Mark information as verified (✅) or speculated (❓)

### Mermaid Diagrams
Include visual diagrams to explain complex concepts:

\`\`\`mermaid
graph TD
    A[Start Documentation] --> B{Have Content?}
    B -->|Yes| C[Edit README.md]
    B -->|No| D[Create Content Files]
    C --> E[Build & Deploy]
    D --> E
    E --> F[Share Documentation]
\`\`\`

## Support

For help with @knowcode/doc-builder:
- Check the documentation at your package source
- Use \`npx @knowcode/doc-builder@latest --help\` for CLI options
- Review the generated configuration guide if available
`;

  try {
    await fs.writeFile(readmePath, placeholderContent);
    console.log(chalk.yellow('📄 Auto-generated placeholder README.md - please customize it!'));
    return true; // Successfully created placeholder
  } catch (error) {
    console.warn(chalk.yellow(`Warning: Could not create placeholder README.md: ${error.message}`));
    return false;
  }
}

// Generate all Supabase authentication files
async function generateSupabaseAuthFiles(outputDir, config) {
  // Validate Supabase configuration
  const validationErrors = SupabaseAuth.validateConfig(config);
  if (validationErrors.length > 0) {
    throw new Error(`Supabase authentication configuration errors:\n${validationErrors.join('\n')}`);
  }

  // Use configured credentials (now with defaults from shared-auth-config)
  const authConfig = {
    supabaseUrl: config.auth.supabaseUrl,
    supabaseAnonKey: config.auth.supabaseAnonKey
  };

  // Create Supabase auth instance
  const supabaseAuth = new SupabaseAuth(authConfig);

  // Generate auth script and save to js/auth.js
  const authScript = supabaseAuth.generateAuthScript(config);
  await fs.writeFile(path.join(outputDir, 'js', 'auth.js'), authScript);

  // Also copy to root for backward compatibility
  await fs.writeFile(path.join(outputDir, 'auth.js'), authScript);

  // Generate and write login page
  const loginHTML = supabaseAuth.generateLoginPage(config);
  await fs.writeFile(path.join(outputDir, 'login.html'), loginHTML);

  // Generate and write logout page
  const logoutHTML = supabaseAuth.generateLogoutPage(config);
  await fs.writeFile(path.join(outputDir, 'logout.html'), logoutHTML);

  console.log(chalk.green('✓ Generated Supabase authentication files'));
}


// Create default index page when no documentation exists
async function createDefaultIndexPage(outputDir, config, version) {
  const siteName = config.siteName || 'Documentation';
  const currentDate = new Date().toISOString();
  
  // List all HTML files in the output directory
  const htmlFiles = [];
  async function findHtmlFiles(dir, baseDir = dir) {
    const items = await fs.readdir(dir);
    for (const item of items) {
      // Skip files with non-printable characters
      if (hasNonPrintableChars(item)) {
        continue;
      }
      const fullPath = path.join(dir, item);
      const stat = await fs.stat(fullPath);
      if (stat.isDirectory() && !item.startsWith('.')) {
        await findHtmlFiles(fullPath, baseDir);
      } else if (item.endsWith('.html') && item !== 'index.html' && item !== 'login.html' && item !== 'logout.html') {
        const relativePath = path.relative(baseDir, fullPath);
        htmlFiles.push(relativePath);
      }
    }
  }
  
  await findHtmlFiles(outputDir);
  
  let fileListHtml = '';
  if (htmlFiles.length > 0) {
    fileListHtml = `
    <div class="existing-files">
      <h2>📁 Available Documentation</h2>
      <p>The following documentation files were found:</p>
      <ul>
        ${htmlFiles.map(file => `<li><a href="${file}">${file}</a></li>`).join('\n        ')}
      </ul>
    </div>`;
  }
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to ${siteName}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/css/notion-style.css">
    <style>
      .welcome-container {
        max-width: 800px;
        margin: 50px auto;
        padding: 40px;
        background: var(--bg-secondary);
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }
      .welcome-container h1 {
        color: var(--text-primary);
        margin-bottom: 20px;
      }
      .welcome-container h2 {
        color: var(--text-primary);
        margin-top: 30px;
        margin-bottom: 15px;
      }
      .welcome-container p {
        color: var(--text-secondary);
        line-height: 1.6;
        margin-bottom: 15px;
      }
      .welcome-container pre {
        background: var(--bg-tertiary);
        padding: 20px;
        border-radius: 8px;
        overflow-x: auto;
        margin: 20px 0;
      }
      .welcome-container code {
        font-family: 'JetBrains Mono', monospace;
        font-size: 14px;
      }
      .welcome-container ul {
        margin: 20px 0;
        padding-left: 30px;
      }
      .welcome-container li {
        margin: 8px 0;
      }
      .version-info {
        margin-top: 40px;
        padding-top: 20px;
        border-top: 1px solid var(--border-color);
        font-size: 12px;
        color: var(--text-tertiary);
      }
      .existing-files {
        background: var(--bg-primary);
        padding: 20px;
        border-radius: 8px;
        margin: 30px 0;
      }
      .existing-files a {
        color: var(--link-color);
        text-decoration: none;
      }
      .existing-files a:hover {
        text-decoration: underline;
      }
    </style>
</head>
<body>
    <div class="welcome-container">
      <h1>📚 Welcome to ${siteName}</h1>
      
      <p>This documentation site was generated by <strong>@knowcode/doc-builder</strong>. To add your own content, follow the instructions below.</p>
      
      <h2>🚀 Getting Started</h2>
      
      <p>To create your documentation homepage, create either of these files in your <code>docs/</code> directory:</p>
      
      <ul>
        <li><code>index.md</code> - Primary homepage (highest priority)</li>
        <li><code>README.md</code> - Alternative homepage</li>
      </ul>
      
      <h2>📝 Example Content</h2>
      
      <p>Create <code>docs/index.md</code> with content like:</p>
      
      <pre><code># Welcome to My Project

This is the homepage for my documentation.

## Features

- Feature 1
- Feature 2
- Feature 3

## Getting Started

1. Install the package
2. Configure your settings
3. Start building!</code></pre>
      
      <h2>🔧 Next Steps</h2>
      
      <ol>
        <li>Create <code>docs/index.md</code> or <code>docs/README.md</code></li>
        <li>Add more markdown files for additional pages</li>
        <li>Rebuild: <code>npx @knowcode/doc-builder@latest build</code></li>
        <li>Deploy: <code>npx @knowcode/doc-builder@latest deploy</code></li>
      </ol>
      
      ${fileListHtml}
      
      <div class="version-info">
        <p><strong>Debug Information:</strong></p>
        <ul>
          <li>doc-builder version: ${version}</li>
          <li>Generated: ${currentDate}</li>
          <li>Site name: ${siteName}</li>
          <li>No index.md or README.md found in docs directory</li>
        </ul>
      </div>
    </div>
</body>
</html>`;
}

module.exports = {
  buildDocumentation,
  processMarkdownContent,
  generateHTML,
  generateStaticHTML,
  createPlaceholderReadme,
  createDefaultIndexPage
};