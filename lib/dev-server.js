const http = require('http');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

/**
 * Simple development server
 */
async function startDevServer(config, port = 3000) {
  const outputDir = path.join(process.cwd(), config.outputDir);
  
  if (!fs.existsSync(outputDir)) {
    console.log(chalk.yellow('Output directory not found. Building first...'));
    const { build } = require('./builder');
    await build(config);
  }
  
  const server = http.createServer((req, res) => {
    let filePath = path.join(outputDir, req.url === '/' ? 'index.html' : req.url);
    
    // Add .html extension if not present and not a file with extension
    if (!path.extname(filePath) && !filePath.endsWith('/')) {
      filePath += '.html';
    }
    
    // Serve index.html for directories
    if (filePath.endsWith('/')) {
      filePath += 'index.html';
    }
    
    fs.readFile(filePath, (err, content) => {
      if (err) {
        if (err.code === 'ENOENT') {
          res.writeHead(404);
          res.end('404 Not Found');
        } else {
          res.writeHead(500);
          res.end(`Server Error: ${err.code}`);
        }
      } else {
        // Determine content type
        const ext = path.extname(filePath);
        let contentType = 'text/html';
        switch (ext) {
          case '.js':
            contentType = 'text/javascript';
            break;
          case '.css':
            contentType = 'text/css';
            break;
          case '.json':
            contentType = 'application/json';
            break;
          case '.png':
            contentType = 'image/png';
            break;
          case '.jpg':
            contentType = 'image/jpg';
            break;
        }
        
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      }
    });
  });
  
  server.listen(port, () => {
    console.log(chalk.green(`\n📡 Development server running at: ${chalk.cyan(`http://localhost:${port}`)}\n`));
    console.log(chalk.gray('Press Ctrl+C to stop'));
  });
  
  // Watch for changes (basic implementation)
  if (config.watch !== false) {
    const docsDir = path.join(process.cwd(), config.docsDir);
    console.log(chalk.gray(`Watching for changes in ${config.docsDir}...`));
    
    // Simple file watcher - in production, use chokidar
    fs.watch(docsDir, { recursive: true }, async (eventType, filename) => {
      if (filename && filename.endsWith('.md')) {
        console.log(chalk.yellow(`\n🔄 ${filename} changed, rebuilding...`));
        try {
          const { build } = require('./builder');
          await build(config);
          console.log(chalk.green('✅ Rebuild complete'));
        } catch (error) {
          console.error(chalk.red(`❌ Rebuild failed: ${error.message}`));
        }
      }
    });
  }
}

module.exports = {
  startDevServer
};