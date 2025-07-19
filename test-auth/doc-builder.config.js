module.exports = {
  siteName: 'Protected Documentation',
  siteDescription: 'Test site with authentication',
  
  features: {
    authentication: true,  // Enable authentication
    changelog: false,
    mermaid: true,
    darkMode: true
  },
  
  auth: {
    username: 'testuser',
    password: 'testpass123'
  }
};