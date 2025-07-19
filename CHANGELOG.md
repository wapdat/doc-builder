# Changelog

All notable changes to @knowcode/doc-builder will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.3] - 2025-07-19

### Fixed
- **Authentication system** - Fixed credentials mismatch between auth.js and config
- Changed cookie name from 'juno-auth' to 'doc-auth' for consistency
- Authentication now properly uses credentials from config file
- Added comprehensive CSS styles for login/logout pages

### Added
- Complete authentication page styling with dark mode support
- Form validation and error message display
- Professional login/logout page design
- Security notice in auth.js about client-side limitations

### Improved
- Authentication token validation is now more flexible
- Better error handling for invalid credentials
- Consistent cookie management across all auth operations

### Verified
- All JavaScript features confirmed working:
  - Breadcrumbs generation
  - Navigation filtering
  - Collapsible navigation sections
  - Preview banner with localStorage
  - Theme switching
  - Sidebar resizing

## [1.2.2] - 2025-07-19

### Fixed
- Removed accidentally included temp-test directory from npm package
- Added .npmignore file to prevent test directories from being published

## [1.2.1] - 2025-07-19

### Added
- **Auto-generated README.md** - System now automatically creates a helpful placeholder README.md when missing
- Comprehensive placeholder content with getting started guide and documentation standards
- Clear instructions for users on how to customize their documentation
- Built-in Mermaid diagram example in generated README
- Documentation structure recommendations and best practices

### Fixed
- **Eliminated ugly file listing** on index page when no README exists
- Improved first-time user experience with welcoming placeholder content
- Better guidance for documentation creation and organization

### Changed
- Simplified deployment logic - removed complex HTML file listing generation
- Build process now checks and creates README.md before scanning files
- Deploy process simplified since README.html will always exist

### Technical Improvements
- Added `createPlaceholderReadme()` function to core-builder.js
- Integrated README generation into main build workflow
- Enhanced build logging to show when placeholder is generated
- Exported new function for potential external usage

## [1.2.0] - 2025-07-19

### Added (MAJOR FEATURE RELEASE)
- **Complete feature parity** with original JUNO documentation system
- **Preview banner** with dismissible functionality and localStorage
- **Breadcrumb navigation** automatically generated from URL structure
- **Advanced sidebar** with filter/search functionality
- **Hierarchical navigation** with collapsible folders and proper icons
- **Rich tooltip system** with folder descriptions and hover information
- **Resize handle** for adjustable sidebar width
- **Icon mapping** for different content types and folders
- **Folder descriptions** for better UX and navigation
- **Logical folder ordering** (strategic content first, technical content later)

### Enhanced Navigation Features
- **Smart folder detection** and hierarchical structuring
- **Active section auto-expansion** for current page context
- **Collapsible navigation sections** with smooth animations
- **File type icons** (documents, folders, special content types)
- **Improved file naming** and title generation
- **README.md as folder overviews** with proper linking
- **Filter/search** through navigation items

### Layout Improvements
- **Complete layout restructure** matching original design
- **Fixed positioning** for banner, breadcrumbs, and sidebar
- **Responsive design** with mobile-friendly collapsible layout
- **Proper content area** with max-width and centered layout
- **Smooth transitions** and hover effects throughout
- **Dark mode support** for all new components

### Technical Enhancements
- **Rich HTML structure** with semantic navigation
- **CSS Grid and Flexbox** layout system
- **Modern CSS variables** and consistent spacing
- **Optimized mobile experience** with adaptive layouts
- **Performance optimized** animations and transitions

## [1.1.12] - 2025-07-19

### Fixed (MAJOR)
- **Fixed sidebar layout** - Navigation now appears as fixed-width left sidebar instead of above content
- Added proper flexbox container layout with fixed sidebar positioning
- Navigation is now 280px fixed width on left side with proper scrolling
- Content area properly offset to account for sidebar width

### Added
- Container flexbox layout for proper sidebar + content structure
- Fixed navigation positioning with proper z-index and boundaries
- Mobile responsive layout - sidebar becomes horizontal bar on mobile
- Proper scrolling for both navigation and content areas

### Visual Changes
- Navigation background set to secondary color with right border
- Content area now takes full remaining width after sidebar
- Proper spacing and padding for both sidebar and content
- Mobile layout stacks navigation above content

## [1.1.11] - 2025-07-19

### Fixed (MAJOR)
- **Fixed navigation completely** - HTML structure now matches JavaScript expectations
- Replaced incompatible nav-folder structure with nav-section/nav-content structure
- Navigation now works for both flat and nested folder structures
- Fixed JavaScript initialization issues with navigation elements

### Changed
- Complete rewrite of navigation HTML generation to match main.js expectations
- Updated CSS to work with new nav-section structure
- Removed conflicting nav-flat classes in favor of universal nav-item approach

### Technical Details
- HTML now generates `.nav-section` + `.nav-content` instead of `.nav-folder` + `.nav-folder-content`
- JavaScript can now find and initialize navigation elements properly
- Collapsible navigation works for nested structures
- Simple navigation works for flat file structures

## [1.1.10] - 2025-07-19

### Fixed
- Fixed navigation for flat file structures (no folders)
- Added proper CSS styling for flat navigation layouts
- Navigation now works correctly when all files are in root directory

### Added
- Flat navigation detection and handling
- Specific CSS classes for flat vs collapsible navigation
- Improved navigation styling for simple project structures

### Improved
- Better navigation experience for projects without folder hierarchies
- Consistent navigation styling across all project structures

## [1.1.9] - 2025-07-19

### Fixed
- Fixed "outputPath is not defined" error in deploy command
- Corrected variable scope issue introduced in 1.1.8

## [1.1.8] - 2025-07-19

### Changed
- Deploy command now always builds documentation first
- Removed `--no-build` option to ensure fresh builds before deployment
- Simplified deployment workflow - `deploy` now automatically includes build step

### Improved
- Guaranteed that deployed documentation is always up-to-date
- Eliminated confusion about when to build vs when to deploy
- Streamlined user experience with single deploy command

## [1.1.7] - 2025-07-19

### Fixed
- Fixed CSS and JS assets not loading on deployed Vercel sites
- Changed all asset paths from relative to absolute URLs (/css/, /js/)
- Fixed missing styling on deployed documentation
- Corrected asset path resolution for Vercel's static hosting

### Changed
- All HTML templates now use absolute paths for CSS and JS files
- Logo links now use absolute paths for consistent navigation
- Index.html generation uses absolute asset paths

## [1.1.6] - 2025-01-19

### Fixed
- Fixed missing CSS and JS styling in deployed documentation
- Corrected relative paths for assets (css/style.css instead of ./css/style.css)
- Added proper styling to fallback index.html
- Enhanced index.html with beautiful grid layout when no README exists

### Added
- Cache headers for CSS and JS files in vercel.json
- Proper meta tags and viewport settings in generated index files
- Beautiful card-based layout for documentation listing

### Improved
- Index.html now uses the same Notion-inspired styling as other pages
- Better visual consistency across all generated pages

## [1.1.5] - 2025-01-19

### Added
- Clear explanation of Vercel URLs after deployment
- Shows permanent production URL (e.g., gasworld.vercel.app)
- Explains the difference between production and preview URLs
- Better post-deployment messaging

### Improved
- Deployment success message now shows both URLs clearly
- Production URL is highlighted as the one to share
- Preview URL is explained as deployment-specific

## [1.1.4] - 2025-01-19

### Fixed
- Removed deprecated --no-clipboard option
- Fixed 404 errors with better index.html handling
- Added fallback index.html when README.html doesn't exist
- Production deployment now correctly uses --prod flag

### Added
- Auto-generated index.html with file listing if no README
- Better logging during deployment preparation
- Console messages when creating index.html

### Changed
- Simplified deployment arguments
- Cleaner deployment command without unnecessary flags

## [1.1.3] - 2025-01-19

### Fixed
- Real-time output from Vercel CLI during deployment
- Fixed 404 errors by adding cleanUrls configuration
- Deployment now shows progress as it happens

### Added
- cleanUrls: true in vercel.json for proper URL handling
- trailingSlash: false to prevent redirect issues
- Real-time streaming of Vercel deployment output

### Changed
- Switched from execSync to spawn for live deployment output
- Better URL extraction from deployment output

## [1.1.2] - 2025-01-19

### Changed
- Simplified deployment output - removed Root Directory warnings
- Cleaner deployment experience with just essential information
- Shows simple "Starting deployment" message instead of warnings

### Removed
- Pre-deployment Root Directory check and warnings
- Project ID display during deployment
- Verbose deployment preparation messages

## [1.1.1] - 2025-01-19

### Added
- TL;DR section at the top of CLI help for quick understanding
- Clear production deployment behavior explanation in help
- Visual indicators for v1.1.0+ deployment changes
- Examples showing production URLs vs preview URLs

### Improved
- Help text now prominently shows default production deployment
- Added emoji and color highlights for important changes
- Clearer deployment behavior section

## [1.1.0] - 2025-01-19

### Changed (BREAKING)
- **Deploy command now defaults to production deployment**
- Use `--no-prod` flag for preview deployments
- Default action (no command) deploys to production
- This ensures documentation is always published to main URL

### Updated
- All help text and examples reflect production default
- CLI description clarifies production deployment
- Example files use simplified deploy command

### Migration
- Previous: `npx @knowcode/doc-builder deploy --prod`
- Now: `npx @knowcode/doc-builder deploy`
- For preview: `npx @knowcode/doc-builder deploy --no-prod`

## [1.0.11] - 2025-01-19

### Added
- Comprehensive troubleshooting for "buildCommand" errors in help
- Troubleshooting for "Project was deleted" errors
- "Delete and Start Fresh" section in deployment help
- Enhanced reset-vercel command documentation

### Improved
- Clearer instructions for handling deleted projects
- Better organization of troubleshooting scenarios
- Added specific commands for each error type

## [1.0.10] - 2025-01-19

### Fixed
- Fixed persistent "buildCommand should be string,null" error
- vercel.json now explicitly sets buildCommand to empty string
- Added explicit build environment variables to deployment
- Added specific error handling for buildCommand conflicts

### Added
- Better error messages for build settings conflicts
- Instructions to clear Vercel project settings
- Alternative reset instructions when settings conflict

### Changed
- Deploy command now includes build skip flags
- All build-related fields explicitly set to empty strings

## [1.0.9] - 2025-01-19

### Fixed
- Fixed "buildCommand should be string,null" error
- Simplified vercel.json to minimal configuration
- Removed unnecessary buildCommand and installCommand fields
- Only include outputDirectory in vercel.json

## [1.0.8] - 2025-01-19

### Added
- Extremely prominent Root Directory warnings throughout setup
- Red background critical warnings before setup begins
- Clear post-setup instructions with visual formatting
- Step-by-step Root Directory fix instructions after linking
- Warning in help text about Root Directory configuration

### Improved
- Made Root Directory warnings impossible to miss
- Added visual boxes and colors to critical warnings
- Enhanced setup flow with pre-deployment warnings
- Better formatting of post-setup instructions

### Changed
- All setup flows now show Root Directory warning first
- Both deploy command and default flow show warnings

## [1.0.7] - 2025-01-19

### Added
- New `reset-vercel` command to fix deployment issues
- Pre-deployment warning about Root Directory settings
- Automatic detection of "html/html does not exist" error with clear fix instructions
- Visual deployment status with project information
- Better error messages that extract and show the settings URL

### Improved
- Enhanced error handling with specific instructions for Root Directory issues
- Clear visual separation for deployment warnings
- More prominent pre-deployment checks
- Direct links to Vercel project settings

### Fixed
- Better handling of the common "html/html" path error
- Clearer recovery instructions when deployment fails

## [1.0.6] - 2025-01-19

### Added
- Much more prominent and helpful Vercel setup instructions
- Step-by-step visual guide with numbered steps and emojis
- Warning about common "username/html" project linking mistake
- Detection and warning for existing project deployments
- Comprehensive troubleshooting for "html/html does not exist" error
- Clear instructions for fixing Root Directory settings

### Improved
- Enhanced visual formatting for Vercel prompts with boxes and colors
- Added critical warnings about NOT linking to generic "html" projects
- Better error detection and user guidance
- More helpful project settings URLs

### Fixed
- Updated vercel.json to use empty strings instead of false values
- Added installCommand to vercel.json for better compatibility

## [1.0.5] - 2025-01-19

### Fixed
- Fixed "vercel.json file should be inside of the provided root directory" error
- Deploy commands now run from the output directory (html/) instead of project root
- Vercel link command runs from correct directory during setup
- vercel.json is now created in the output directory where it belongs

### Changed
- Simplified vercel.json configuration for static sites
- Updated deployment flow to work correctly with Vercel's expectations
- Vercel project detection now checks in output directory

## [1.0.4] - 2025-01-19

### Added
- Comprehensive Vercel CLI prompt explanations in help text
- Step-by-step answers for all Vercel setup questions
- Hints in prompts to guide users through setup
- Pre-deployment guidance showing what Vercel will ask
- Better project name sanitization for Vercel URLs

### Improved
- More detailed deployment help with exact answers to provide
- Clearer instructions for first-time vs. subsequent deployments
- Visual question/answer format in help documentation

## [1.0.3] - 2025-01-19

### Fixed
- Fixed "path argument must be string" error in deploy command
- Improved Vercel CLI detection with helpful installation instructions
- Made config loading more lenient for missing directories
- Auto-build documentation if not already built before deployment
- Better error messages with stack traces for debugging

### Added
- Automatic preparation of deployment files (index.html redirect)
- Check for Vercel CLI before attempting deployment
- Build documentation automatically if output directory doesn't exist
- More robust vercel.json generation for static sites

## [1.0.2] - 2025-01-19

### Fixed
- Fixed remaining JUNO references in CLI help text
- Enhanced help documentation with detailed Vercel CLI setup instructions
- Added comprehensive deployment troubleshooting guide
- Improved Quick Start section with step-by-step instructions
- Added "What gets created" explanations for init command

### Added
- Requirements section in main help
- Example for creating docs from scratch
- Vercel installation options (npm and Homebrew)
- Clear instructions for disabling Vercel deployment protection

## [1.0.1] - 2025-01-19

### Fixed
- Made package completely self-contained - no longer requires cybersolstice project
- Embedded full build logic into the package
- Fixed "Build script not found" error when running in other projects

## [1.0.0] - 2025-01-19

### Added
- Initial release of @knowcode/doc-builder
- Zero-configuration documentation builder
- Markdown to HTML conversion with Notion-inspired theme
- Automatic navigation generation from folder structure
- Mermaid diagram support with title extraction
- Syntax highlighting for code blocks
- Dark mode support
- Optional authentication system
- Automatic changelog generation
- Live reload development server
- One-command Vercel deployment
- CLI with build, dev, deploy, and init commands
- Example documentation generator
- Cybersolstice preset for backward compatibility
- Programmatic API for Node.js integration

### Features
- Works immediately with `npx @knowcode/doc-builder`
- No installation or configuration required
- Self-contained package with all dependencies
- Intelligent defaults for common use cases
- Full customization available via config file

### Technical
- Built on marked for markdown parsing
- Commander.js for CLI framework
- Supports Node.js 14+
- CommonJS module system for compatibility

## Future Releases

### [1.1.0] - Planned
- Plugin system for extensibility
- Custom theme support
- Multiple language support
- Search functionality
- PDF export

### [2.0.0] - Planned
- Full refactor of build system
- ESM modules support
- TypeScript rewrite
- Performance improvements