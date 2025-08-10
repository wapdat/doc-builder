# Project Rename Strategy: @knowcode/doc-builder → sasha-publish

## Overview

This document outlines the comprehensive strategy for renaming the @knowcode/doc-builder project to "sasha-publish", including all package references, repository changes, and deployment configurations.

## Scope of Changes

### 1. Package and Repository Renaming

#### NPM Package
- **Current**: `@knowcode/doc-builder`
- **New**: `sasha-publish`
- **Registry**: Will become unscoped package on npmjs.com
- **Version**: Continue from current version (1.9.14+)

#### GitHub Repository
- **Current**: `github.com/wapdat/doc-builder`
- **New**: `github.com/wapdat/sasha-publish`
- **Organization**: Remains under `wapdat`

#### Domain Configuration
- **Current**: `doc-builder-delta.vercel.app`
- **New**: `sasha-publish.knowcode.tech`
- **DNS**: CNAME to `8e9ce731edbb385c.vercel-dns-017.com`
- **SSL**: Automatic via Vercel

### 2. File Analysis & Changes Required

#### Core Package Files (4 files)
- `package.json` - Update name, description, repository URLs
- `package-lock.json` - Will regenerate automatically
- `README.md` - Update all references, installation commands
- `CLAUDE.md` - Update project name and NPM package references

#### Configuration Files (2 files)
- `doc-builder.config.js` - Rename to `sasha-publish.config.js`
- `lib/config.js` - Update default descriptions and meta generator tag

#### Script Files (2 files)
- `scripts/npx-runner.js` - Update binary name from `doc-builder` to `sasha-publish`
- `scripts/setup.js` - Update any package name references

#### Documentation Files (25+ files)
All files in `docs/` directory requiring updates:
- Installation commands (`npx @knowcode/doc-builder` → `npx sasha-publish`)
- Package references
- Repository URLs
- Domain references

#### Generated HTML Files (50+ files)
All files in `html/` directory requiring updates:
- Meta generator tags
- Package references in footers
- Installation examples

#### Source Code Files (6 files)
- `lib/seo.js` - Update meta generator tag
- `lib/core-builder.js` - Update any package references
- `lib/supabase-auth.js` - Update any package references
- `lib/emoji-mapper.js` - Update any comments/references
- `index.js` - Update any package references
- Any other lib files with embedded references

### 3. Reference Pattern Analysis

#### Text Patterns to Replace
- `@knowcode/doc-builder` → `sasha-publish` (500+ occurrences)
- `doc-builder` → `sasha-publish` (in appropriate contexts)
- `github.com/wapdat/doc-builder` → `github.com/wapdat/sasha-publish`
- `doc-builder-delta.vercel.app` → `sasha-publish.knowcode.tech`
- Binary name: `doc-builder` → `sasha-publish`

#### Contexts Requiring Manual Review
- Configuration file names
- Binary command names
- Documentation examples
- Error messages and logging
- Comments and documentation strings

### 4. NPM Transition Strategy

#### Phase 1: Deprecation of Old Package
```bash
# Mark old package as deprecated
npm deprecate @knowcode/doc-builder "Package renamed to 'sasha-publish'. Please update your dependencies."
```

#### Phase 2: Publish New Package
```bash
# After all changes are complete
npm publish
```

#### Phase 3: Version Alignment
- New package starts at version matching current version
- Maintain semantic versioning
- Include migration notes in changelog

### 5. GitHub Repository Transition

#### Steps
1. **Create new repository**: `github.com/wapdat/sasha-publish`
2. **Transfer all content**: Complete git history preservation
3. **Update repository settings**: Description, topics, website URL
4. **Archive old repository**: Mark as archived with redirect notice
5. **Update issue templates**: Reference new repository

#### Branch Strategy
- Maintain current branch structure
- Update default branch name if needed
- Preserve all git history and tags

### 6. Domain and Deployment Updates

#### Vercel Configuration
1. **Add custom domain**: `sasha-publish.knowcode.tech`
2. **Configure DNS**: CNAME to `8e9ce731edbb385c.vercel-dns-017.com`
3. **SSL certificate**: Automatic provisioning
4. **Redirect old domain**: `doc-builder-delta.vercel.app` → new domain

#### DNS Management
- Add CNAME record in Knowcode Ltd DNS management
- Verify propagation globally
- Test SSL certificate installation

### 7. Documentation Updates

#### Installation Instructions
Update all instances of:
```bash
# Old
npx @knowcode/doc-builder@latest build
npx @knowcode/doc-builder@latest deploy
npx @knowcode/doc-builder@latest dev

# New  
npx sasha-publish@latest build
npx sasha-publish@latest deploy
npx sasha-publish@latest dev
```

#### Package.json Dependencies
Update any self-references:
```json
{
  "dependencies": {
    "sasha-publish": "^1.9.14"
  }
}
```

### 8. Testing Strategy

#### Pre-Rename Testing
- Full test suite execution
- Integration testing with current package
- Documentation build verification

#### Post-Rename Testing
- NPM package installation testing
- Binary command execution
- Documentation generation
- Deployment to Vercel
- Authentication flow testing
- All feature verification

#### Verification Checklist
- [ ] NPM package installs correctly
- [ ] Binary commands work (`sasha-publish build`, etc.)
- [ ] Documentation generates without errors
- [ ] Vercel deployment succeeds
- [ ] Custom domain resolves correctly
- [ ] SSL certificate is valid
- [ ] Authentication systems function
- [ ] All links and references updated

### 9. Communication Plan

#### Developer Communication
- Update all internal documentation
- Notify team of package name change
- Update any CI/CD references

#### User Communication
- Deprecation notice on old package
- Migration guide for existing users
- Changelog entry explaining rename

### 10. Rollback Strategy

#### Emergency Rollback Plan
1. **Revert repository name**: If critical issues discovered
2. **NPM package handling**: Old package can be un-deprecated
3. **Domain rollback**: DNS changes can be reverted
4. **Documentation**: Git history allows easy reversion

#### Risk Mitigation
- Complete testing before public announcement
- Staged rollout to minimize user impact
- Backup of all current configurations

### 11. Timeline Estimate

#### Preparation Phase (2-3 hours)
- File analysis and change planning
- Repository and domain setup
- Testing environment preparation

#### Execution Phase (3-4 hours)
- Mass find/replace operations
- Configuration updates
- Testing and verification

#### Deployment Phase (1-2 hours)
- NPM publishing
- Vercel configuration
- DNS propagation monitoring

#### Total Estimated Time: 6-9 hours

### 12. Success Criteria

#### Technical Criteria
- [ ] New package publishes successfully to NPM
- [ ] All binary commands function correctly
- [ ] Documentation builds without errors
- [ ] Vercel deployment completes successfully
- [ ] Custom domain resolves with valid SSL
- [ ] All authentication flows work
- [ ] No broken links or references

#### Business Criteria
- [ ] Old package properly deprecated
- [ ] User migration path is clear
- [ ] No service interruption
- [ ] Brand transition is complete

## Implementation Notes

This rename represents a significant brand transition that touches every aspect of the project. The strategy prioritizes maintaining functionality while ensuring a clean migration path for existing users.

The new name "sasha-publish" reflects the tool's core purpose while maintaining the professional standards established by the original package.

All changes should be thoroughly tested in a staging environment before execution to ensure zero downtime for existing users.