const fs = require('fs-extra');
const path = require('path');
const marked = require('marked');
const chalk = require('chalk');

// Configure marked options
marked.setOptions({
  highlight: function(code, lang) {
    return `<code class="language-${lang}">${escapeHtml(code)}</code>`;
  },
  breaks: true,
  gfm: true
});

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

// Extract summary from markdown content for tooltips
function extractSummary(content, maxLength = 150) {
  // Remove front matter
  content = content.replace(/^---[\s\S]*?---\n/, '');
  
  // Remove headers
  content = content.replace(/^#+\s+.+$/gm, '');
  
  // Remove code blocks
  content = content.replace(/```[\s\S]*?```/g, '');
  content = content.replace(/`[^`]+`/g, '');
  
  // Remove images and links
  content = content.replace(/!\[[^\]]*\]\([^)]*\)/g, '');
  content = content.replace(/\[[^\]]*\]\([^)]*\)/g, '');
  
  // Remove HTML tags
  content = content.replace(/<[^>]+>/g, '');
  
  // Remove extra whitespace
  content = content.trim().replace(/\s+/g, ' ');
  
  // Truncate if needed
  if (content.length > maxLength) {
    content = content.substring(0, maxLength).trim() + '...';
  }
  
  return content || 'No description available';
}

// Process markdown content
function processMarkdownContent(content) {
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
      <div class="mermaid-title">${escapeHtml(title)}</div>
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
  
  return html;
}

// Generate HTML from template
function generateHTML(title, content, navigation, currentPath = '', config = {}) {
  const depth = currentPath.split('/').filter(p => p).length;
  const relativePath = depth > 0 ? '../'.repeat(depth) : '';
  
  const siteName = config.siteName || 'Documentation';
  const siteDescription = config.siteDescription || 'Documentation site';
  
  // Get doc-builder version from package.json
  const packageJson = require('../package.json');
  const docBuilderVersion = packageJson.version;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${siteDescription}">
    <title>${title} - ${siteName}</title>
    
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    
    <!-- Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    
    <!-- Mermaid -->
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10.6.1/dist/mermaid.min.js"></script>
    
    <!-- Styles -->
    <link rel="stylesheet" href="/css/notion-style.css">
    
    <!-- Favicon -->
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📚</text></svg>">
</head>
<body>
    <!-- Header -->
    <header class="header">
        <div class="header-content">
            <a href="/index.html" class="logo">${siteName}</a>
            
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
                
                ${config.features?.authentication ? `
                <a href="${relativePath}logout.html" class="logout-btn" title="Logout">
                    <i class="fas fa-sign-out-alt"></i>
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
    
    <!-- Preview Banner -->
    <div id="preview-banner" class="preview-banner">
        <div class="banner-content">
            <i class="fas fa-exclamation-triangle banner-icon"></i>
            <span class="banner-text">This documentation is a preview version - some content may be incomplete</span>
            <button id="dismiss-banner" class="banner-dismiss" aria-label="Dismiss banner">
                <i class="fas fa-times"></i>
            </button>
        </div>
    </div>
    
    <!-- Breadcrumbs -->
    <nav class="breadcrumbs" id="breadcrumbs">
        <!-- Breadcrumbs will be generated by JavaScript -->
    </nav>
    
    <!-- Main Content -->
    <div class="main-wrapper">
        <!-- Sidebar -->
        <aside class="sidebar">
            <div class="sidebar-header">
                <div class="filter-box">
                    <input type="text" placeholder="Filter items..." class="filter-input" id="nav-filter">
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
    <script src="/js/main.js"></script>
    ${config.features?.authentication ? `<script src="/js/auth.js"></script>` : ''}
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
function buildNavigationStructure(files, currentFile) {
  const tree = { files: [], folders: {} };
  
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
    let title = file.displayName;
    
    if (file.displayName === 'README') {
      return level === 0 ? 'Overview' : `${parentDisplayName} Overview`;
    }
    
    // Clean up title by removing common prefixes and improving formatting
    title = title
      .replace(/^(bubble|system|quickbase|middleware|product-roadmap)-?/, '')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
    
    return title;
  };
  
  // Helper function to render a section
  const renderSection = (folderName, folderData, level = 0, parentPath = '') => {
    const icons = {
      'root': 'fas fa-home',
      'product-roadmap': 'fas fa-road',
      'product-requirements': 'fas fa-clipboard-list',
      'architecture': 'fas fa-sitemap',
      'system-analysis': 'fas fa-chart-line',
      'system': 'fas fa-cogs',
      'bubble': 'fas fa-circle',
      'quickbase': 'fas fa-database',
      'activecampaign': 'fas fa-envelope',
      'doc-signer': 'fas fa-signature',
      'api-deprecated': 'fas fa-archive',
      'postman': 'fas fa-flask',
      'mcp': 'fas fa-puzzle-piece',
      'team': 'fas fa-users',
      'thought-leadership': 'fas fa-lightbulb',
      'middleware': 'fas fa-layer-group',
      'paths': 'fas fa-route',
      'testing': 'fas fa-vial',
      'api': 'fas fa-plug',
      'documentation-tool': 'fas fa-tools'
    };
    
    const displayName = folderName === 'root' ? 'Documentation' : 
                       folderName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const icon = icons[folderName] || 'fas fa-folder';
    
    if (!folderData.files.length && !Object.keys(folderData.folders).length) {
      return '';
    }
    
    // Include parent path in section ID to make it unique
    const pathParts = parentPath ? [parentPath, folderName].join('-') : folderName;
    const sectionId = `nav-${pathParts}-${level}`;
    const isCollapsible = level > 0 || folderName !== 'root';
    const collapseIcon = isCollapsible ? '<i class="fas fa-chevron-right collapse-icon"></i>' : '';
    
    // Check if this folder has a README.md file to link to
    const readmeFile = folderData.files.find(f => f.displayName === 'README');
    const folderLink = readmeFile ? `href="/${readmeFile.urlPath}"` : 'href="#"';
    
    // Get folder description for tooltip
    const folderDescription = folderDescriptions[folderName] || '';
    const tooltipAttr = folderDescription ? `data-tooltip="${escapeHtml(folderDescription)}"` : '';
    
    // Check if this folder has active child or if we're on index page
    const hasActiveChild = checkActiveChild(folderData, currentFile);
    // Expand all folders by default on initial page load (index.html or root README)
    const shouldExpand = hasActiveChild || currentFile === 'index.html' || (currentFile === 'README.html' && level === 1);
    
    let html = `
      <div class="nav-section" data-level="${level}">
        <a class="nav-title${isCollapsible ? ' collapsible' : ''}${shouldExpand ? ' expanded' : ''}" ${folderLink} ${isCollapsible ? `data-target="${sectionId}"` : ''} ${tooltipAttr}>
          ${collapseIcon}<i class="${icon}"></i> ${displayName}
        </a>
        <div class="nav-content${isCollapsible ? (shouldExpand ? '' : ' collapsed') : ''}" ${isCollapsible ? `id="${sectionId}"` : ''}>`;
    
    // Sort and render files
    const sortedFiles = [...folderData.files].sort((a, b) => {
      if (a.displayName === 'README') return -1;
      if (b.displayName === 'README') return 1;
      return a.displayName.localeCompare(b.displayName);
    });
    
    sortedFiles.forEach(file => {
      const title = generateFileTitle(file, displayName, level);
      
      // Check if this file is active
      let isActive = '';
      if (currentFile === file.urlPath) {
        isActive = ' active';
      } else if (currentFile === 'index.html' && file.displayName === 'README' && folderName === 'root') {
        // Mark root README as active when viewing index.html
        isActive = ' active';
      }
      
      const linkPath = '/' + file.urlPath;
      const tooltip = file.summary ? ` data-tooltip="${escapeHtml(file.summary)}"` : '';
      
      html += `
        <a href="${linkPath}" class="nav-item${isActive}"${tooltip}><i class="fas fa-file-alt"></i> ${title}</a>`;
    });
    
    html += `</div></div>`;
    
    // Render subfolders AFTER closing the parent section
    Object.keys(folderData.folders)
      .sort()
      .forEach(subFolder => {
        // Build the path for the subfolder including current folder
        const currentPath = parentPath ? `${parentPath}-${folderName}` : folderName;
        html += renderSection(subFolder, folderData.folders[subFolder], level + 1, currentPath);
      });
    
    return html;
  };
  
  // Check if this is a flat structure
  const hasFolders = Object.keys(tree.folders).length > 0;
  
  if (!hasFolders) {
    // Generate simple flat navigation for all files in root
    return renderSection('root', { files: tree.files, folders: {} }, 0);
  } else {
    // Generate hierarchical navigation
    let nav = '';
    
    // Render root files first
    if (tree.files.length > 0) {
      nav += renderSection('root', { files: tree.files, folders: {} }, 0);
    }
    
    // Add other top-level folders in logical order
    const folderOrder = [
      'product-roadmap',
      'product-requirements', 
      'architecture',
      'system-analysis',
      'bubble',
      'quickbase',
      'activecampaign',
      'doc-signer',
      'api-deprecated',
      'postman',
      'mcp',
      'team',
      'thought-leadership',
      'documentation-tool'
    ];
    
    folderOrder.forEach(folderName => {
      if (tree.folders[folderName]) {
        nav += renderSection(folderName, tree.folders[folderName], 1);
        delete tree.folders[folderName]; // Remove so we don't render it again
      }
    });
    
    // Render any remaining folders not in the predefined order
    Object.keys(tree.folders)
      .sort()
      .forEach(folderName => {
        nav += renderSection(folderName, tree.folders[folderName], 1);
      });
    
    return nav;
  }
}

// Process single markdown file
async function processMarkdownFile(filePath, outputPath, allFiles, config) {
  const content = await fs.readFile(filePath, 'utf-8');
  const fileName = path.basename(filePath, '.md');
  const relativePath = path.relative(config.docsDir, filePath);
  const urlPath = relativePath.replace(/\.md$/, '.html').replace(/\\/g, '/');
  
  // Extract title from content
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : fileName;
  
  // Extract summary for tooltip
  const summary = extractSummary(content);
  
  // Process content
  const htmlContent = processMarkdownContent(content);
  
  // Build navigation
  const navigation = buildNavigationStructure(allFiles, urlPath);
  
  // Generate full HTML
  const html = generateHTML(title, htmlContent, navigation, urlPath, config);
  
  // Write file
  await fs.ensureDir(path.dirname(outputPath));
  await fs.writeFile(outputPath, html);
  
  return { title, urlPath, summary };
}

// Get all markdown files
async function getAllMarkdownFiles(dir, baseDir = dir) {
  const files = [];
  const items = await fs.readdir(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = await fs.stat(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.')) {
      const subFiles = await getAllMarkdownFiles(fullPath, baseDir);
      files.push(...subFiles);
    } else if (item.endsWith('.md')) {
      const relativePath = path.relative(baseDir, fullPath);
      const urlPath = relativePath.replace(/\.md$/, '.html').replace(/\\/g, '/');
      const displayName = path.basename(item, '.md')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
      
      // Read file to extract summary
      const content = await fs.readFile(fullPath, 'utf-8');
      const summary = extractSummary(content);
      
      files.push({
        path: fullPath,
        relativePath,
        urlPath,
        displayName,
        summary
      });
    }
  }
  
  return files;
}

// Main build function
async function buildDocumentation(config) {
  const docsDir = path.join(process.cwd(), config.docsDir);
  const outputDir = path.join(process.cwd(), config.outputDir);
  
  // Log version for debugging
  const packageJson = require('../package.json');
  console.log(chalk.blue(`📦 Using @knowcode/doc-builder v${packageJson.version}`));
  
  // Check and create placeholder README.md if missing
  console.log(chalk.blue('📋 Checking documentation structure...'));
  const readmeGenerated = await createPlaceholderReadme(docsDir, config);
  
  console.log(chalk.blue('📄 Scanning for markdown files...'));
  const files = await getAllMarkdownFiles(docsDir);
  console.log(chalk.green(`✅ Found ${files.length} markdown files${readmeGenerated ? ' (including auto-generated README)' : ''}`));
  
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
    
    // Copy auth.js to root if authentication is enabled
    if (config.features?.authentication) {
      const authSource = path.join(jsSource, 'auth.js');
      const authDest = path.join(outputDir, 'auth.js');
      if (fs.existsSync(authSource)) {
        await fs.copy(authSource, authDest, { overwrite: true });
      }
    }
  }
  
  // Create auth pages if needed
  if (config.features?.authentication) {
    await createAuthPages(outputDir, config);
  }
  
  // Create index.html from index.html, README.html, or generate default
  const indexPath = path.join(outputDir, 'index.html');
  const indexSourcePath = path.join(outputDir, 'index.html'); // from index.md
  const readmePath = path.join(outputDir, 'README.html');
  
  console.log(chalk.blue('\n📄 Checking for index.html creation...'));
  console.log(chalk.gray(`  - Output directory: ${outputDir}`));
  console.log(chalk.gray(`  - Index path: ${indexPath}`));
  console.log(chalk.gray(`  - README path: ${readmePath}`));
  console.log(chalk.gray(`  - index.html exists: ${fs.existsSync(indexPath)}`));
  console.log(chalk.gray(`  - README.html exists: ${fs.existsSync(readmePath)}`));
  
  // List all HTML files in output directory
  if (fs.existsSync(outputDir)) {
    const htmlFiles = fs.readdirSync(outputDir).filter(f => f.endsWith('.html'));
    console.log(chalk.gray(`  - HTML files in output: [${htmlFiles.join(', ')}]`));
  } else {
    console.log(chalk.red(`  - ERROR: Output directory does not exist!`));
  }
  
  // Check if we need to create/replace index.html
  let shouldCreateIndex = false;
  
  if (!fs.existsSync(indexPath)) {
    console.log(chalk.yellow('⚠️  index.html does not exist, need to create it'));
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
  
  console.log(chalk.green('✅ Documentation build complete!'));
}

// Create placeholder README.md if missing
async function createPlaceholderReadme(docsDir, config) {
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
4. **Rebuild**: Run \`npx @knowcode/doc-builder build\` to regenerate the site

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
5. Deploy with \`npx @knowcode/doc-builder deploy\`

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
- Use \`npx @knowcode/doc-builder --help\` for CLI options
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

// Create login/logout pages
async function createAuthPages(outputDir, config) {
  // Login page
  const loginHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - ${config.siteName}</title>
    <link rel="stylesheet" href="css/notion-style.css">
</head>
<body>
    <div class="auth-container">
        <div class="auth-box">
            <h1>Login to ${config.siteName}</h1>
            <form id="login-form">
                <div class="form-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" name="username" required>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <button type="submit" class="auth-button">Login</button>
            </form>
            <div id="error-message" class="error-message"></div>
        </div>
    </div>
    <script>
        document.getElementById('login-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Validate credentials
            if (username === '${config.auth.username}' && password === '${config.auth.password}') {
                // Set auth cookie
                const token = btoa(username + ':' + password);
                document.cookie = 'doc-auth=' + token + '; path=/';
                
                // Redirect
                const params = new URLSearchParams(window.location.search);
                const redirect = params.get('redirect') || '/';
                window.location.href = redirect;
            } else {
                document.getElementById('error-message').textContent = 'Invalid username or password';
            }
        });
    </script>
</body>
</html>`;

  await fs.writeFile(path.join(outputDir, 'login.html'), loginHTML);

  // Logout page
  const logoutHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Logged Out - ${config.siteName}</title>
    <link rel="stylesheet" href="css/notion-style.css">
</head>
<body>
    <div class="auth-container">
        <div class="auth-box">
            <h1>You have been logged out</h1>
            <p>Thank you for using ${config.siteName}.</p>
            <a href="login.html" class="auth-button">Login Again</a>
        </div>
    </div>
</body>
</html>`;

  await fs.writeFile(path.join(outputDir, 'logout.html'), logoutHTML);
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
        <li>Rebuild: <code>npx @knowcode/doc-builder build</code></li>
        <li>Deploy: <code>npx @knowcode/doc-builder deploy</code></li>
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
  createPlaceholderReadme,
  createDefaultIndexPage
};