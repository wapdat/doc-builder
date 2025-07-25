module.exports = {
  siteName: '✨ Test Documentation',
  siteDescription: 'Public documentation site',
  favicon: '✨',
  footer: {
    copyright: 'Test Documentation',
    links: []
  },
  docsDir: 'test-docs',
  outputDir: 'public-html',
  // No authentication configured - this is a public site
  features: {
    authentication: false,
    darkMode: true,
    mermaid: true,
    changelog: false,
    normalizeTitle: true,
    showPdfDownload: true,
    menuDefaultOpen: true,
    phosphorIcons: true
  }
};