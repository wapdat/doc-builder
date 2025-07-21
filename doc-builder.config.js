module.exports = {
  // Site info
  siteName: 'Doc Builder',
  siteDescription: 'Beautiful documentation with the least effort possible',
  
  // Directories
  docsDir: 'docs',
  outputDir: 'html',
  
  // Production URL
  productionUrl: 'https://doc-builder-delta.vercel.app',
  
  // Features
  features: {
    authentication: false,
    changelog: true,
    mermaid: true,
    darkMode: true
  },
  
  // SEO configuration
  seo: {
    enabled: true,
    siteUrl: 'https://doc-builder-delta.vercel.app',
    author: 'Lindsay Smith',
    twitterHandle: '@planbbackups',
    language: 'en-US',
    keywords: ['documentation', 'markdown', 'static site generator', 'vercel', 'notion-style'],
    organization: {
      name: 'KnowCode',
      url: 'https://knowcode.com'
    },
    ogImage: '/og-default.png',
    generateSitemap: true,
    generateRobotsTxt: true,
    customMetaTags: []
  }
};