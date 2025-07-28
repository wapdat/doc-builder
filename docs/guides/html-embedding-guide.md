# HTML Embedding Guide

@knowcode/doc-builder now supports embedding custom HTML files in your documentation, enabling you to include interactive demos, widgets, and other web content using iframes.

## Overview

Starting from version 1.9.2, doc-builder treats HTML files (`.html` and `.htm`) as attachments that are automatically copied to your output directory during the build process. This allows you to:

- 🌐 Include interactive demos and examples
- 📊 Embed custom visualizations or dashboards  
- 🔧 Add third-party widgets or tools
- 🎮 Create interactive tutorials or games
- 📱 Include responsive web applications

## How It Works

1. **Place HTML files** anywhere in your `docs` directory
2. **Build your documentation** using `npx @knowcode/doc-builder build`
3. **Reference the HTML files** in your markdown using iframes or direct links

The HTML files maintain their relative paths from the docs directory, making it easy to organize and reference them.

## Basic Usage

### Step 1: Create Your HTML File

Create an HTML file in your docs directory:

```
docs/
├── README.md
├── guides/
│   └── html-embedding-guide.md
└── examples/
    └── interactive-demo.html
```

### Step 2: Embed in Markdown

Use an iframe to embed the HTML file in your markdown documentation:

```html
<iframe src="/examples/interactive-demo.html" 
        width="100%" 
        height="600" 
        frameborder="0"
        style="border: 1px solid #e5e7eb; border-radius: 8px;">
</iframe>
```

### Step 3: Build and Deploy

Run the build command:

```bash
npx @knowcode/doc-builder build
```

The HTML file will be copied to `html/examples/interactive-demo.html` and will be accessible when you deploy your documentation.

## Live Example

Here's an embedded interactive demo:

<iframe src="/examples/interactive-demo.html" 
        width="100%" 
        height="700" 
        frameborder="0"
        style="border: 1px solid #e5e7eb; border-radius: 8px; margin: 20px 0;">
</iframe>

## Advanced Usage

### Responsive Iframes

Make your embedded content responsive using a wrapper div:

```html
<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
  <iframe src="/examples/dashboard.html" 
          style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;">
  </iframe>
</div>
```

### Direct Links

You can also link directly to HTML files:

```markdown
[Open Interactive Demo](/examples/interactive-demo.html)
```

### Multiple HTML Files

Organize complex projects with multiple HTML files:

```
docs/
├── demos/
│   ├── chart-demo.html
│   ├── form-demo.html
│   └── assets/
│       ├── demo.css
│       └── demo.js
└── widgets/
    ├── calculator.html
    └── converter.html
```

## Security Considerations

When embedding HTML content, consider these security best practices:

1. **Trust Your Content**: Only embed HTML files from trusted sources
2. **Sandbox Iframes**: Use the `sandbox` attribute for additional security:
   ```html
   <iframe src="/examples/demo.html" 
           sandbox="allow-scripts allow-same-origin">
   </iframe>
   ```
3. **HTTPS Only**: Ensure your documentation is served over HTTPS
4. **Content Security Policy**: Consider implementing CSP headers on your server

## Best Practices

### 1. Keep It Lightweight
- Minimize external dependencies in your HTML files
- Optimize images and assets
- Use inline styles and scripts when possible

### 2. Make It Responsive
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### 3. Match Your Theme
Use CSS that complements your documentation's design:

```css
body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background-color: #f5f5f5;
    color: #333;
}
```

### 4. Provide Fallbacks
Include a message for users who can't view iframes:

```html
<iframe src="/examples/demo.html">
  <p>Your browser doesn't support iframes. 
     <a href="/examples/demo.html">View the demo directly</a>.</p>
</iframe>
```

## Common Use Cases

### Interactive Code Playgrounds
Embed code editors or REPLs for hands-on learning:

```html
<iframe src="/playground/javascript-basics.html" 
        width="100%" height="500">
</iframe>
```

### API Documentation
Include interactive API explorers:

```html
<iframe src="/api-explorer/rest-api.html" 
        width="100%" height="600">
</iframe>
```

### Data Visualizations
Embed charts, graphs, or dashboards:

```html
<iframe src="/visualizations/sales-dashboard.html" 
        width="100%" height="400">
</iframe>
```

### Form Examples
Show working form implementations:

```html
<iframe src="/forms/contact-form.html" 
        width="100%" height="500">
</iframe>
```

## Troubleshooting

### HTML File Not Found
- Ensure the HTML file is in your `docs` directory
- Check the file path in your iframe `src` attribute
- Verify the file was copied during build (check `html` output directory)

### Styling Issues
- Use viewport meta tag for mobile compatibility
- Test in both light and dark themes
- Consider iframe border and padding

### Performance Concerns
- Lazy load iframes that are below the fold
- Minimize external resource requests
- Optimize images and assets

## Limitations

- HTML files are copied as-is without processing
- Relative links in HTML files should account for the output structure
- Large HTML files may impact build time
- Some hosting providers may have iframe restrictions

## Summary

HTML embedding support in @knowcode/doc-builder provides a powerful way to enhance your documentation with interactive content. By treating HTML files as attachments, you can easily include demos, widgets, and custom web content while maintaining the simplicity of markdown-based documentation.

Remember to:
- ✅ Place HTML files in your docs directory
- ✅ Use iframes to embed content
- ✅ Follow security best practices
- ✅ Test responsive behavior
- ✅ Keep performance in mind

This feature opens up endless possibilities for creating rich, interactive documentation that goes beyond static content!