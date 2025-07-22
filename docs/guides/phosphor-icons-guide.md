# Phosphor Icons Integration Guide

**Generated**: 2025-07-22 11:00 UTC  
**Status**: Complete  
**Verified**: ✅

## Overview

@knowcode/doc-builder automatically converts Unicode emojis in your markdown files to beautiful Phosphor icons in the generated HTML. This provides professional, consistent icon rendering across all platforms while keeping your markdown files readable with familiar emojis.

## How It Works

### Automatic Conversion
When you write emojis in your markdown:
```markdown
✅ Task completed
❌ Issue found
🚀 Launching feature
```

They are automatically converted to Phosphor icons in HTML:
- ✅ → Check circle icon
- ❌ → X circle icon  
- 🚀 → Rocket launch icon

### Benefits
- **Professional appearance** - Consistent icon style across your documentation
- **Better performance** - Icons load as web fonts, not Unicode characters
- **Cross-platform consistency** - Same appearance on all devices
- **Accessibility** - All icons include proper aria-labels
- **No source changes needed** - Keep using emojis in your markdown

## Configuration

Enable Phosphor Icons in your `doc-builder.config.js`:

```javascript
module.exports = {
  features: {
    phosphorIcons: true,        // Enable/disable icon conversion
    phosphorWeight: 'regular',  // Icon style: thin, light, regular, bold, fill, duotone
    phosphorSize: '1.2em'       // Icon size relative to text
  }
};
```

### Icon Weights

Phosphor offers different visual weights:
- **thin** - Delicate, minimal style
- **light** - Subtle, refined appearance
- **regular** - Balanced, default weight (recommended)
- **bold** - Strong, prominent style
- **fill** - Solid filled icons
- **duotone** - Two-tone style with accent color

## Supported Emoji Mappings

### Status & Validation
| Emoji | Icon | Description |
|-------|------|-------------|
| ✅ | Check circle | Success, completed, verified |
| ❌ | X circle | Error, failed, incorrect |
| ❓ | Question mark | Unknown, uncertain |
| ⚠️ | Warning circle | Caution, important note |
| 🚫 | Prohibit | Not allowed, forbidden |

### Development & Tech
| Emoji | Icon | Description |
|-------|------|-------------|
| 💻 | Laptop | Development, coding |
| 🔧 | Wrench | Configuration, settings |
| 🐛 | Bug | Issues, debugging |
| 🚀 | Rocket | Launch, deploy, release |
| ⚡ | Lightning | Performance, speed |

### Documents & Content
| Emoji | Icon | Description |
|-------|------|-------------|
| 📝 | Note pencil | Edit, write |
| 📚 | Books | Documentation, guides |
| 📁 | Folder | Directory, category |
| 🔗 | Link | URL, connection |

### Communication
| Emoji | Icon | Description |
|-------|------|-------------|
| 💬 | Chat circle | Comments, discussion |
| 📧 | Envelope | Email, message |
| 🔔 | Bell | Notification, alert |

### Complete Mapping
The system supports 200+ emoji-to-icon mappings covering:
- Status indicators
- Development tools
- File types
- Actions
- Nature elements
- People & activities
- Objects & symbols

## Usage Examples

### In Markdown Headers
```markdown
## 🚀 Getting Started
## 🔧 Configuration
## 📚 API Reference
## ❌ Common Errors
```

### In Lists
```markdown
- ✅ Feature implemented
- 🚧 Work in progress
- ❌ Deprecated
- 💡 Pro tip
```

### In Tables
```markdown
| Status | Feature | Notes |
|--------|---------|-------|
| ✅ | Search | Ready |
| 🚧 | Auth | In progress |
| ❌ | Legacy API | Deprecated |
```

## Customization

### Custom Icon Sizes
Override icon size for specific use cases:

```css
/* In your custom CSS */
.content h1 .ph {
  font-size: 1.5em;
}

.content li .ph {
  font-size: 1.1em;
}
```

### Custom Icon Colors
Icons inherit text color by default, but can be styled:

```css
.ph-check-circle {
  color: #10b981; /* Green for success */
}

.ph-x-circle {
  color: #ef4444; /* Red for errors */
}
```

## Performance Considerations

- Icons are loaded via CDN with long cache headers
- Only the selected weight (e.g., regular) is loaded
- Web font format ensures fast rendering
- Approximately 300KB for a full icon set

## Accessibility

All converted icons include:
- Proper `aria-label` attributes
- Semantic HTML (`<i>` tags)
- Screen reader friendly descriptions
- Keyboard navigation support

## Troubleshooting

### Icons Not Showing
1. Check if `phosphorIcons: true` in config
2. Verify internet connection (CDN access)
3. Check browser console for errors
4. Try clearing browser cache

### Wrong Icon Weight
Update config and rebuild:
```javascript
features: {
  phosphorWeight: 'bold' // Change to desired weight
}
```

### Emoji Not Converting
- Ensure emoji is in the supported mapping list
- Some complex emojis may not have icon equivalents
- File an issue for missing emoji mappings

## Best Practices

1. **Use semantic emojis** - Choose emojis that match their purpose
2. **Be consistent** - Use the same emoji for the same meaning
3. **Don't overuse** - Icons should enhance, not clutter
4. **Test rendering** - Preview how icons look in your docs
5. **Consider context** - Some emojis work better as icons than others

## Technical Details

### Implementation
- Post-processes HTML after markdown conversion
- Uses regex pattern matching for efficiency
- Preserves all other HTML intact
- Falls back gracefully if CDN fails

### Browser Support
Phosphor Icons work in all modern browsers:
- Chrome/Edge 88+
- Firefox 78+
- Safari 14+
- Mobile browsers

## Future Enhancements

Planned improvements:
- Custom emoji-to-icon mappings
- Multiple icon libraries support
- Icon search/picker tool
- Animation support
- SVG icon option

## Resources

- [Phosphor Icons](https://phosphoricons.com/) - Browse all available icons
- [Icon Weights Demo](https://phosphoricons.com/?weight=regular) - Compare different weights
- [GitHub Repository](https://github.com/phosphor-icons/web) - Source code and issues

---

*This feature enhances the visual consistency of your documentation while maintaining the simplicity of writing with emojis.*