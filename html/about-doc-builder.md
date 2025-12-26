# About @knowcode/doc-builder

*This documentation site was built with @knowcode/doc-builder - a zero-configuration documentation generator that transforms markdown files into beautiful static sites.*

---

## 🚀 What is @knowcode/doc-builder?

**@knowcode/doc-builder** is a modern documentation generator that creates stunning, Notion-inspired static websites from your markdown files. Built by **Knowcode Ltd**, it eliminates the complexity of traditional documentation tools while providing enterprise-grade features.

### ✨ Core Features

| Feature | Description |
|---------|-------------|
| 🚀 **Zero Configuration** | Works out of the box - no setup files or complex configuration |
| 📝 **Markdown Native** | Full GitHub Flavored Markdown support with syntax highlighting |
| 🎨 **Beautiful Design** | Notion-inspired theme with dark mode and responsive layout |
| ☁️ **One-Click Deploy** | Deploy to Vercel with a single command using their generous free tier |
| 📊 **Mermaid Diagrams** | Enhanced styling with rounded corners & Notion-inspired themes |
| 🖼️ **Image Modals** | Click any image for full-screen viewing |
| 🔍 **SEO Ready** | Automatic meta tags, structured data, and search engine optimization |

## 🔐 Enterprise Security & Authentication

**@knowcode/doc-builder** includes enterprise-grade security powered by **Supabase**, providing bank-level protection for your documentation.

### 🛡️ Security Features

- **🔒 JWT Authentication**: Industry-standard secure token-based authentication
- **🏗️ Zero Configuration**: Built-in Supabase credentials - just enable and deploy
- **🌐 Domain-Based Access**: Automatic access control using your deployment domain
- **📁 Private Directories**: `/private/` folders automatically protected
- **🔄 Session Management**: Auto-refresh tokens with persistent sessions
- **👥 Multi-User Support**: Unlimited users with fine-grained access control
- **🛡️ Row Level Security**: Database-level access control policies
- **🔐 Password Security**: bcrypt hashing with salt for password storage

### 🏢 Authentication Modes

| Mode | Use Case | Implementation |
|------|----------|----------------|
| **🌍 Global Auth** | Entire site requires login | `authentication: 'supabase'` |
| **📁 Private Directory** | Public docs + private sections | Create `/private/` folder |
| **🔄 Hybrid** | Complex access requirements | Combine both modes |

### 🚀 Quick Authentication Setup

```bash
# Create private documentation - authentication automatically enabled
mkdir docs/private
echo "# Confidential Documentation" > docs/private/admin.md
npx @knowcode/doc-builder deploy
```

**That's it!** Your site now has enterprise authentication with beautiful login pages.

## 🏗️ How It Works

1. **📖 Scan**: Automatically discovers markdown files in your project
2. **🔄 Convert**: Transforms markdown to HTML with syntax highlighting
3. **🎨 Style**: Applies beautiful Notion-inspired design
4. **🗂️ Navigate**: Generates navigation from your folder structure
5. **🔐 Secure**: Protects private content with Supabase authentication
6. **🚀 Deploy**: One-command deployment to Vercel's global CDN

## 🛠️ Getting Started

### Installation & Usage

```bash
# Generate documentation from markdown files
npx @knowcode/doc-builder@latest build

# Deploy to Vercel with one command
npx @knowcode/doc-builder@latest deploy

# Start local development server
npx @knowcode/doc-builder@latest dev
```

### Project Structure

```
docs/
├── README.md              # Homepage content
├── guides/                # Organized documentation
│   ├── getting-started.md
│   └── advanced-usage.md
├── private/               # 🔐 Requires authentication
│   └── admin-guide.md
└── assets/                # Images and attachments
    └── logo.png
```

## 👨‍💻 Created by Knowcode Ltd

**Knowcode Ltd** is a software consultancy and product development company specializing in intelligent automation and developer tools. We build products for both clients and internal use, with a focus on reducing complexity while maintaining enterprise-grade capabilities.

### 🎯 Our Philosophy

> *"Beautiful documentation should be accessible to everyone, without worrying about hosting costs or complex server management."*

We believe that great documentation shouldn't require a PhD in DevOps. That's why @knowcode/doc-builder works with zero configuration and deploys to Vercel's generous free tier.

## 🔗 Learn More

### 📚 Documentation & Resources

- **📦 NPM Package**: [npmjs.com/package/@knowcode/doc-builder](https://www.npmjs.com/package/@knowcode/doc-builder)
- **🌐 Live Demo**: [doc-builder-delta.vercel.app](https://doc-builder-delta.vercel.app)
- **📖 GitHub Repository**: [github.com/wapdat/doc-builder](https://github.com/wapdat/doc-builder)
- **🔐 Authentication Guide**: [Complete Supabase Setup](https://doc-builder-delta.vercel.app/guides/supabase-authentication-complete-guide.html)

### 🆘 Support & Community

- **🐛 Issue Tracker**: [GitHub Issues](https://github.com/wapdat/doc-builder/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/wapdat/doc-builder/discussions)
- **📧 Enterprise Support**: Contact Knowcode Ltd for custom implementations

## 📊 Why Choose @knowcode/doc-builder?

### 🆚 Comparison with Other Tools

| Feature | @knowcode/doc-builder | GitBook | Notion | Confluence |
|---------|----------------------|---------|--------|------------|
| **Setup Time** | 0 minutes | 30+ minutes | Manual work | Hours |
| **Hosting Cost** | Free (Vercel) | $99+/month | $8+/user | $5+/user |
| **Authentication** | Enterprise (Supabase) | Premium only | Basic | Enterprise |
| **Customization** | Full control | Limited | None | Complex |
| **Markdown Support** | Native | Partial | Import only | Plugin |
| **Version Control** | Git native | Limited | None | Plugin |

### 🎯 Perfect For

- **📋 Project Documentation**: API references, user guides, developer docs
- **🏢 Internal Knowledge Bases**: Company wikis, process documentation
- **🔐 Secure Documentation**: Confidential guides, admin documentation  
- **🚀 Startup Teams**: Fast-moving teams who need docs without overhead
- **🤖 AI-Assisted Workflows**: Optimized for Claude Code and AI development

## 🚀 Ready to Get Started?

Transform your markdown files into beautiful documentation in under 2 minutes:

```bash
npx @knowcode/doc-builder@latest deploy
```

*Experience the power of zero-configuration documentation with enterprise-grade security.*

---

<div style="text-align: center; padding: 2rem; background: var(--bg-secondary); border-radius: 8px; margin: 2rem 0;">

**Generated with [@knowcode/doc-builder](https://www.npmjs.com/package/@knowcode/doc-builder)**  
*Beautiful documentation with the least effort possible*

**Created by [Knowcode Ltd](https://github.com/wapdat)** | **[Try it now →](https://doc-builder-delta.vercel.app)**

</div>