# Bubble.io Plugin Specification

## Overview

This document outlines the technical specification for creating a Bubble.io plugin that integrates @knowcode/doc-builder, enabling Bubble developers to create and manage beautiful documentation directly from their Bubble applications.

## Plugin Architecture

### Core Components

```
bubble-doc-builder/
├── plugin.json              # Plugin manifest
├── elements/
│   ├── DocViewer/          # Main documentation viewer
│   │   ├── element.json    # Element configuration
│   │   ├── preview.js      # Editor preview
│   │   ├── runtime.js      # Runtime behavior
│   │   └── style.css       # Component styling
│   ├── DocSearch/          # Search component
│   └── DocNav/             # Navigation widget
├── actions/
│   ├── generate-docs/      # Generate documentation
│   ├── deploy-to-vercel/   # Deploy documentation
│   ├── update-content/     # Update doc content
│   └── sync-from-bubble/   # Sync Bubble data
├── api/
│   ├── calls/              # API definitions
│   └── shared.js           # Shared utilities
└── assets/
    ├── icons/              # Plugin icons
    └── templates/          # Doc templates
```

## Element Specifications

### 1. DocViewer Element

The main component for displaying documentation within Bubble apps.

#### Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| doc_url | text | "" | URL of hosted documentation |
| theme | dropdown | "light" | Theme selection (light/dark/auto) |
| show_navigation | boolean | true | Show/hide navigation sidebar |
| show_search | boolean | true | Enable search functionality |
| custom_css | text | "" | Custom CSS overrides |
| height | number | 600 | Viewer height in pixels |
| auth_required | boolean | false | Require authentication |
| auth_token | text | "" | Authentication token |

#### States
| State | Type | Description |
|-------|------|-------------|
| is_loading | boolean | Documentation loading state |
| current_page | text | Current page path |
| search_results | list | Search results array |
| error_message | text | Error details if any |

#### Events
- **Documentation Loaded** - Triggered when docs load
- **Page Changed** - Fired on navigation
- **Search Performed** - When user searches
- **Error Occurred** - On loading errors

### 2. DocSearch Element

Standalone search widget for documentation.

#### Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| doc_source | text | "" | Documentation source URL |
| placeholder | text | "Search docs..." | Search placeholder |
| max_results | number | 10 | Maximum results |
| show_preview | boolean | true | Show result previews |

### 3. DocNav Element

Navigation tree component.

#### Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| doc_structure | text | "" | JSON navigation structure |
| collapsible | boolean | true | Allow collapse/expand |
| show_icons | boolean | true | Show file/folder icons |

## Action Specifications

### 1. Generate Documentation

Creates documentation from Bubble app data.

#### Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| source_type | dropdown | Yes | Data source (database/API/page) |
| content_list | list | Yes | List of content to document |
| output_format | dropdown | Yes | Format (markdown/html) |
| include_schemas | boolean | No | Include data schemas |
| template | dropdown | No | Documentation template |

#### Output
- `documentation_url` - Generated documentation URL
- `generation_time` - Time taken in ms
- `page_count` - Number of pages created

### 2. Deploy to Vercel

Deploys documentation to Vercel.

#### Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| project_name | text | Yes | Vercel project name |
| vercel_token | text | Yes | Vercel API token |
| domain | text | No | Custom domain |
| production | boolean | No | Deploy to production |

#### Output
- `deployment_url` - Live documentation URL
- `deployment_id` - Vercel deployment ID
- `status` - Deployment status

### 3. Update Content

Updates specific documentation content.

#### Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page_path | text | Yes | Path to page |
| new_content | text | Yes | Updated content |
| commit_message | text | No | Change description |
| auto_deploy | boolean | No | Auto-deploy changes |

### 4. Sync from Bubble

Synchronizes documentation with Bubble data.

#### Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| sync_type | dropdown | Yes | Manual/automatic/scheduled |
| data_types | list | Yes | Bubble data types to sync |
| sync_interval | number | No | Interval in minutes |
| webhook_url | text | No | Webhook for updates |

## API Integration

### Authentication Flow
```javascript
// Initialize doc-builder API
function initializeDocBuilder(apiKey, bubbleAppId) {
  return {
    baseUrl: 'https://api.doc-builder.io',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'X-Bubble-App-ID': bubbleAppId,
      'Content-Type': 'application/json'
    }
  };
}
```

### Webhook Events
| Event | Payload | Description |
|-------|---------|-------------|
| docs.generated | `{pages, url, timestamp}` | Documentation generated |
| docs.deployed | `{url, version, environment}` | Deployment complete |
| docs.updated | `{changes, author, timestamp}` | Content updated |
| docs.error | `{error, context, timestamp}` | Error occurred |

## Bubble Database Schema

### DocBuilder Config
| Field | Type | Description |
|-------|------|-------------|
| api_key | text | Doc-builder API key |
| vercel_token | text | Vercel deployment token |
| project_name | text | Documentation project name |
| base_url | text | Documentation base URL |
| last_sync | date | Last synchronization |
| auto_sync | boolean | Enable auto-sync |
| sync_interval | number | Sync interval (minutes) |

### Documentation Pages
| Field | Type | Description |
|-------|------|-------------|
| title | text | Page title |
| slug | text | URL slug |
| content | text | Markdown content |
| parent_page | DocPage | Parent for hierarchy |
| order | number | Sort order |
| is_published | boolean | Publication status |
| last_modified | date | Last update |
| author | User | Page author |

### Documentation Templates
| Field | Type | Description |
|-------|------|-------------|
| name | text | Template name |
| description | text | Template description |
| structure | text | JSON structure |
| styles | text | Custom CSS |
| is_default | boolean | Default template |

## Use Cases

### 1. API Documentation
Automatically generate API documentation from Bubble API workflows:
```javascript
// Generate API docs from workflows
generateDocs({
  source_type: 'api_workflows',
  include_schemas: true,
  template: 'api_reference'
});
```

### 2. User Guides
Create user documentation from Bubble pages:
```javascript
// Generate user guide from app pages
generateDocs({
  source_type: 'pages',
  content_list: ['dashboard', 'settings', 'profile'],
  template: 'user_guide'
});
```

### 3. Database Documentation
Document data types and fields:
```javascript
// Document database structure
generateDocs({
  source_type: 'database',
  include_schemas: true,
  template: 'data_dictionary'
});
```

## Implementation Roadmap

### Phase 1: MVP (2 weeks)
- [ ] Basic DocViewer element
- [ ] Generate documentation action
- [ ] Simple deployment to Vercel
- [ ] Supabase authentication integration

### Phase 2: Enhanced Features (2 weeks)
- [ ] DocSearch element
- [ ] DocNav element
- [ ] Update content action
- [ ] Webhook integration

### Phase 3: Advanced Integration (2 weeks)
- [ ] Auto-sync from Bubble
- [ ] Custom templates
- [ ] Multi-language support
- [ ] Analytics integration

### Phase 4: Polish & Launch (1 week)
- [ ] Performance optimization
- [ ] Error handling
- [ ] Documentation
- [ ] Marketplace submission

## Plugin Settings

### General Settings
```json
{
  "name": "Doc Builder for Bubble",
  "description": "Create beautiful documentation from your Bubble app",
  "categories": ["data", "visual elements", "analytics"],
  "plugin_version": "1.0.0",
  "documentation_url": "https://doc-builder.io/bubble-plugin",
  "support_email": "support@doc-builder.io"
}
```

### API Connections
```json
{
  "api_connections": [
    {
      "name": "DocBuilder API",
      "base_url": "https://api.doc-builder.io/v1",
      "authentication": "bearer_token",
      "shared_headers": {
        "X-Plugin-Version": "1.0.0",
        "X-Platform": "bubble"
      }
    }
  ]
}
```

## Security Considerations

### API Key Management
- Store API keys encrypted in Bubble database
- Use Bubble's privacy rules for key access
- Implement key rotation mechanism
- Log all API key usage

### Content Security
- Sanitize all user-generated content
- Implement CSP headers for embedded docs
- Use iframe sandboxing for viewer
- Validate all webhook signatures

### Access Control
- Integrate with Bubble's user roles
- Implement document-level permissions
- Support SSO for enterprise users
- Audit trail for all actions

## Performance Optimization

### Caching Strategy
- Cache generated documentation (1 hour)
- CDN integration for static assets
- Lazy load documentation sections
- Progressive enhancement

### Resource Management
- Limit concurrent API calls
- Implement request queuing
- Optimize large documentation sets
- Background processing for heavy tasks

## Pricing Model for Plugin

### Free Tier
- Up to 10 documentation pages
- Basic templates
- Community support
- Bubble.io branding

### Pro Tier ($19/month)
- Unlimited pages
- Custom templates
- Priority support
- White-label option

### Team Tier ($49/month)
- Everything in Pro
- Team collaboration
- Advanced analytics
- API access

## Success Metrics

### Usage Metrics
- Plugin installations
- Active users (MAU)
- Documentation pages created
- Deployments per month

### Performance Metrics
- API response time (<200ms)
- Documentation load time (<2s)
- Search response time (<100ms)
- Uptime (99.9%)

### Business Metrics
- Conversion rate (free to paid)
- Customer lifetime value
- Monthly recurring revenue
- Support ticket volume

---

## Document History

| Date | Author | Changes |
|------|--------|---------|
| 2025-07-22 | System | Initial plugin specification |