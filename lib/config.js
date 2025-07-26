const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

/**
 * Default configuration
 */
const defaultConfig = {
  // Source and output directories
  docsDir: 'docs',
  outputDir: 'html',
  
  // Site metadata
  siteName: 'Documentation',
  siteDescription: 'Documentation site built with @knowcode/doc-builder',
  
  // Favicon - can be an emoji or a path to an image file
  favicon: '✨',
  
  // Features
  features: {
    authentication: false,  // false (no auth) or 'supabase' (secure auth)
    changelog: true,
    mermaid: true,
    tooltips: true,
    search: false,
    darkMode: true,
    phosphorIcons: true,
    phosphorWeight: 'regular', // Options: thin, light, regular, bold, fill, duotone
    phosphorSize: '1.2em',     // Relative to text size
    normalizeTitle: true,      // Auto-normalize all-caps titles to title case
    showPdfDownload: true,     // Show PDF download icon in header
    menuDefaultOpen: true,     // Menu/sidebar open by default
    attachments: true          // Copy attachments (Excel, PDF, etc.) to output
  },
  
  // Authentication - Supabase only (basic auth removed for security)
  auth: {
    supabaseUrl: '',
    supabaseAnonKey: '',
    siteId: ''
  },
  
  // Changelog settings
  changelog: {
    daysBack: 14,
    enabled: true
  },
  
  // Navigation configuration
  folderOrder: [],
  folderDescriptions: {},
  folderIcons: {},
  
  // Deployment
  deployment: {
    platform: 'vercel',
    outputDirectory: 'html'
  },
  
  // SEO configuration
  seo: {
    enabled: true,
    siteUrl: '',  // Required for proper SEO
    author: '',
    twitterHandle: '',
    language: 'en-US',
    keywords: [],
    titleTemplate: '{pageTitle} | {siteName}',  // Customizable title format
    autoKeywords: true,  // Extract keywords from content
    keywordLimit: 7,  // Max keywords per page
    descriptionFallback: 'smart',  // 'smart' or 'first-paragraph'
    organization: {
      name: '',
      url: '',
      logo: ''
    },
    ogImage: '',  // Default Open Graph image
    generateSitemap: true,
    generateRobotsTxt: true,
    customMetaTags: []
  },
  
  // Attachment file types to copy
  attachmentTypes: [
    // Documents
    '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.csv', '.ppt', '.pptx', '.txt', '.rtf',
    // Archives
    '.zip', '.tar', '.gz', '.7z', '.rar',
    // Images
    '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico', '.bmp',
    // Data files
    '.json', '.xml', '.yaml', '.yml', '.toml',
    // Other
    '.mp4', '.mp3', '.wav', '.avi', '.mov'
  ]
};

/**
 * Notion-inspired preset - clean, modern documentation style
 */
const notionInspiredPreset = {
  docsDir: 'docs',
  outputDir: 'html',
  siteName: 'Documentation',  // Clean default name
  siteDescription: 'Transforming complex sales through intelligent automation',
  
  features: {
    authentication: false,  // Default to no auth - can be enabled with 'supabase'
    changelog: true,
    mermaid: true,
    tooltips: true,
    search: false,
    darkMode: true,
    phosphorIcons: true,
    phosphorWeight: 'regular',
    phosphorSize: '1.2em',
    normalizeTitle: true,
    showPdfDownload: true,
    menuDefaultOpen: true,
    attachments: true
  },
  
  auth: {
    supabaseUrl: process.env.SUPABASE_URL || '',
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
    siteId: process.env.DOC_SITE_ID || ''
  },
  
  changelog: {
    daysBack: 14,
    enabled: true
  },
  
  // Folder descriptions from existing code
  folderDescriptions: {
    'product-roadmap': 'Strategic vision, timeline, and feature planning',
    'product-requirements': 'Detailed product specifications, requirements documents, and feature definitions',
    'architecture': 'System design, data flows, and technical infrastructure documentation',
    'system-analysis': 'Comprehensive system analysis, functional requirements, and cross-component documentation',
    'bubble': 'Core application platform - business logic, UI/UX, and user workflows',
    'quickbase': 'Database schema, data management, and backend operations',
    'activecampaign': 'Marketing automation integration and lead management system',
    'juno-signer': 'Document signing service for digital signatures and PDF generation',
    'juno-api-deprecated': 'Legacy API documentation (deprecated, for reference only)',
    'postman': 'API testing tools, collections, and test automation',
    'mcp': 'Model Context Protocol setup and configuration guides',
    'team': 'Team roles, responsibilities, and task assignments',
    'thought-leadership': 'Strategic thinking, industry insights, and future vision',
    'paths': 'Dynamic pathway routing system for insurance applications',
    'testing': 'Testing procedures, checklists, and quality assurance',
    'technical': 'Technical documentation and implementation details',
    'application': 'Application components, data types, and workflows'
  },
  
  folderIcons: {
    'root': 'fas fa-home',
    'product-roadmap': 'fas fa-road',
    'product-requirements': 'fas fa-clipboard-list',
    'architecture': 'fas fa-sitemap',
    'system-analysis': 'fas fa-analytics',
    'system': 'fas fa-cogs',
    'bubble': 'fas fa-bubble',
    'quickbase': 'fas fa-database',
    'activecampaign': 'fas fa-envelope',
    'juno-signer': 'fas fa-signature',
    'juno-api-deprecated': 'fas fa-archive',
    'postman': 'fas fa-flask',
    'mcp': 'fas fa-puzzle-piece',
    'team': 'fas fa-users',
    'thought-leadership': 'fas fa-lightbulb',
    'middleware': 'fas fa-layer-group',
    'paths': 'fas fa-route',
    'testing': 'fas fa-vial',
    'juno-api': 'fas fa-plug'
  },
  
  folderOrder: [
    'product-roadmap',
    'product-requirements',
    'architecture',
    'system-analysis',
    'bubble',
    'quickbase',
    'activecampaign',
    'juno-signer',
    'juno-api-deprecated',
    'postman',
    'mcp',
    'team',
    'thought-leadership'
  ],
  
  // SEO configuration for notion preset
  seo: {
    enabled: true,
    siteUrl: '',
    author: '',
    twitterHandle: '',
    language: 'en-US',
    keywords: ['documentation', 'api', 'guide'],
    organization: {
      name: '',
      url: '',
      logo: ''
    },
    ogImage: '',
    generateSitemap: true,
    generateRobotsTxt: true,
    customMetaTags: []
  }
};

/**
 * Load configuration
 */
async function loadConfig(configPath, options = {}) {
  let config = { ...defaultConfig };
  
  // Apply preset if specified
  if (options.preset === 'notion-inspired') {
    config = { ...config, ...notionInspiredPreset };
  }
  
  // Load custom config file if it exists
  const customConfigPath = path.join(process.cwd(), configPath);
  if (fs.existsSync(customConfigPath)) {
    try {
      const customConfig = require(customConfigPath);
      config = { ...config, ...customConfig };
      
      // Handle alternative config formats
      if (customConfig.site) {
        // Map site.title to siteName
        if (customConfig.site.title) {
          config.siteName = customConfig.site.title;
          console.log(chalk.gray(`  Using site name: ${config.siteName}`));
        }
        if (customConfig.site.description) {
          config.siteDescription = customConfig.site.description;
        }
      }
      
      // Map input/output to docsDir/outputDir
      if (customConfig.input) {
        config.docsDir = customConfig.input;
      }
      if (customConfig.output) {
        config.outputDir = customConfig.output;
      }
      
      console.log(chalk.gray(`Loaded config from ${configPath}`));
    } catch (error) {
      console.warn(chalk.yellow(`Warning: Failed to load config file: ${error.message}`));
    }
  } else if (!options.preset && !options.legacy) {
    console.log(chalk.gray('No config file found, using defaults'));
  }
  
  // Apply CLI options (these override config file)
  if (options.input) {
    config.docsDir = options.input;
  }
  if (options.output) {
    config.outputDir = options.output;
  }
  if (options.auth === false) {
    config.features.authentication = false;
  }
  if (options.changelog === false) {
    config.features.changelog = false;
    config.changelog.enabled = false;
  }
  if (options.pdf === false) {
    config.features.showPdfDownload = false;
  }
  if (options.menuClosed === true) {
    config.features.menuDefaultOpen = false;
  }
  if (options.attachments === false) {
    config.features.attachments = false;
  }
  
  // Legacy mode - auto-detect structure
  if (options.legacy) {
    const docsPath = path.join(process.cwd(), 'docs');
    const htmlPath = path.join(process.cwd(), 'html');
    
    if (fs.existsSync(docsPath) && fs.existsSync(htmlPath)) {
      console.log(chalk.gray('Legacy mode: detected docs/ and html/ structure'));
      config.docsDir = 'docs';
      config.outputDir = 'html';
    }
  }
  
  // Validate paths - but be lenient for commands that will create directories
  const docsPath = path.join(process.cwd(), config.docsDir);
  if (!fs.existsSync(docsPath)) {
    // Only show warning for commands that don't auto-create the directory
    // The build command will create it automatically
    if (!options || !['build', 'dev', 'deploy'].includes(options.command)) {
      console.warn(chalk.yellow(`Warning: Documentation directory not found: ${config.docsDir}`));
      console.log(chalk.gray(`Create it with: mkdir ${config.docsDir} && echo "# Documentation" > ${config.docsDir}/README.md`));
    }
    // Don't throw error - let commands handle missing directories appropriately
  } else {
    // Check for private directory and auto-enable authentication if found
    const privatePath = path.join(docsPath, 'private');
    if (fs.existsSync(privatePath) && fs.statSync(privatePath).isDirectory()) {
      // Only auto-enable if not already configured
      if (!config.features.authentication) {
        console.log(chalk.blue('🔐 Found private directory - automatically enabling Supabase authentication'));
        config.features.authentication = 'supabase';
        config.features.autoAuthEnabled = true; // Track that this was auto-enabled
        
        // Check if Supabase credentials are configured
        if (!config.auth.supabaseUrl || !config.auth.supabaseAnonKey || !config.auth.siteId) {
          console.warn(chalk.yellow('⚠️  Supabase credentials not configured. Private directory found but authentication will not work.'));
          console.warn(chalk.yellow('   To enable authentication, set the following in your config:'));
          console.warn(chalk.yellow('   - auth.supabaseUrl'));
          console.warn(chalk.yellow('   - auth.supabaseAnonKey'));
          console.warn(chalk.yellow('   - auth.siteId'));
          console.warn(chalk.yellow(''));
          console.warn(chalk.yellow('   Or disable authentication by removing the private directory.'));
          // Disable authentication if credentials are missing
          config.features.authentication = false;
        }
      }
    }
  }
  
  return config;
}

/**
 * Create default configuration
 */
async function createDefaultConfig() {
  const answers = await require('prompts')([
    {
      type: 'text',
      name: 'siteName',
      message: 'Site name:',
      initial: 'My Documentation'
    },
    {
      type: 'text',
      name: 'siteDescription',
      message: 'Site description:',
      initial: 'Documentation for my project'
    },
    {
      type: 'confirm',
      name: 'authentication',
      message: 'Enable Supabase authentication?',
      initial: false
    }
  ]);
  
  const config = { ...defaultConfig };
  config.siteName = answers.siteName;
  config.siteDescription = answers.siteDescription;
  config.features.authentication = answers.authentication ? 'supabase' : false;
  
  return config;
}

module.exports = {
  defaultConfig,
  notionInspiredPreset,
  loadConfig,
  createDefaultConfig
};