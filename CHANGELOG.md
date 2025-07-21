# Changelog

All notable changes to @knowcode/doc-builder will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.3] - 2025-07-20

### Fixed
- Restored tooltip functionality by adding back the extractSummary function
- Added data-tooltip attributes to navigation items showing document summaries
- Removed unwanted Home link from sidebar breadcrumbs section
- Navigation items now display helpful summaries on hover

### Technical Details
- extractSummary function extracts first 150 characters of meaningful content
- Tooltips are properly escaped for HTML safety
- Sidebar header simplified by removing redundant breadcrumb navigation

## [1.4.2] - 2025-01-20

### Fixed
- Fixed excessive left padding on content area by removing JavaScript margin-left assignments
- Content layout now properly uses flexbox spacing without manual margin adjustments
- The JavaScript was adding inline `style="margin-left: 200px;"` which was causing the issue

## [1.4.1] - 2025-07-20

### Fixed
- **Critical CSS layout fix** - Content no longer appears too far right when sidebar is hidden
- Removed incorrect `margin-left: var(--sidebar-width)` from `.content` class
- Fixed responsive layout issues where content had excessive right spacing
- Simplified responsive styles to match original working version
- Fixed mobile padding to use single value `var(--space-4)` instead of directional padding

### Technical Details
- Content now uses flexbox `flex: 1` without margin-left
- Removed unnecessary `transition: margin-left` from content
- Mobile styles simplified to only adjust padding, no margin overrides needed
- Layout now properly responds when sidebar is hidden on mobile/tablet

## [1.4.0] - 2025-07-20

### Added
- **Tooltip functionality restored** - Added summary extraction from markdown files
- Tooltips now appear on hover for navigation items showing content preview
- `extractSummary()` function looks for Overview/Summary sections or first paragraph
- Summaries are collected in first pass and added as `data-tooltip` attributes

### Fixed
- **CSS layout restored to match original** - Reverted all layout changes to original values
- Header height restored to 64px (was 56px)
- Main wrapper uses margin-top approach (not absolute positioning)
- Content uses original padding values (var(--space-6) var(--space-8))
- Content-inner uses centered layout (margin: 0 auto)
- Navigation padding restored to all sides

### Removed
- Removed unused style.css file - only notion-style.css is used
- Eliminated dual CSS file confusion

### Technical Details
- Summary extraction matches original build.js implementation
- Navigation generation passes summaries through recursive renderSection calls
- Tooltips use same CSS implementation as original with fixed positioning

## [1.3.14] - 2025-07-20

### Fixed
- Fixed excessive gap between breadcrumb and content area
- Changed `.main-wrapper` from using `margin-top` to `padding-top` to eliminate double spacing
- Reduced content top padding from `var(--space-4)` (16px) to `var(--space-2)` (8px)
- Removed duplicate `.sidebar-header` CSS definition
- Fixed mobile responsive padding to match desktop changes

### Changed
- Main wrapper now uses `height: 100vh` with `padding-top` instead of calculated height
- Content padding changed to `8px 32px 16px` for tighter vertical spacing
- Consistent padding reduction across all responsive breakpoints

## [1.3.13] - 2025-07-19

### Fixed
- Made content body left-aligned instead of centered
- Made navigation menu top-aligned by removing top padding
- Simplified layout for better compatibility

### Changed
- `.content-inner` now uses `margin: 0` instead of `margin: 0 auto` for left alignment
- `.navigation` padding changed from all sides to only bottom/left/right
- Removed unnecessary centering that was causing layout issues

## [1.3.12] - 2025-07-19

### Fixed
- Fixed tooltip positioning by using `position: fixed` to match original implementation
- Updated tooltip JavaScript to match simpler original approach
- Fixed content-inner wrapper already present in HTML generation
- Improved tooltip initialization with console logging for debugging

### Technical Details
- Tooltips now use fixed positioning with CSS variables for placement
- Simplified event handling for tooltip hover events
- Added debug logging to help diagnose tooltip initialization issues
- Content structure matches original with proper content-inner wrapper

## [1.3.11] - 2025-07-19

### Fixed
- **CRITICAL FIX**: Removed duplicate CSS file loading that was causing style conflicts
- Now only loads `notion-style.css` matching the original working build
- This fixes both tooltip functionality and spacing issues

### Root Cause
- The npm package was loading both `notion-style.css` AND `style.css`
- The `style.css` file was overriding proper styles from `notion-style.css`
- This caused spacing conflicts and broke tooltip positioning
- The original cybersolstice build only loads `notion-style.css`

### Impact
- Tooltips now work correctly with proper positioning
- Navigation spacing matches the original design
- No more CSS variable conflicts between themes
- Consistent styling throughout the application

## [1.3.10] - 2025-07-19

### Fixed
- Reduced excessive top spacing in content area (changed from 40px to 16px)
- Fixed tooltip implementation with event delegation for better performance
- Added native `title` attribute as fallback for tooltips
- Applied spacing fixes to both default and notion themes

### Improved
- Content now starts closer to the header/breadcrumb area
- Tooltips use simpler event delegation instead of individual listeners
- Better tooltip support with both custom CSS tooltips and native browser tooltips
- Removed unnecessary MutationObserver for cleaner code

### Technical Details
- Content padding reduced from 40px to var(--space-lg) (16px) 
- Event delegation on navigation container captures all tooltip events
- Native title attributes ensure tooltips work even if CSS/JS fails
- More efficient event handling with capture phase listeners

## [1.3.9] - 2025-07-19

### Fixed
- Fixed tooltip JavaScript positioning implementation
- Removed invalid getComputedStyle call on pseudo-elements
- Added mouseleave handler to clean up CSS variables
- Fixed tooltip arrow positioning with proper transform
- Added event listener cleanup to prevent duplicates
- Added console logging for tooltip debugging

### Improved
- Tooltips now properly use fixed positioning as per lessons learned
- Added MutationObserver to handle dynamically updated navigation
- Better event handling with proper cleanup on element replacement
- More robust tooltip initialization that works with dynamic content

### Technical Details
- JavaScript now correctly sets `--tooltip-left` and `--tooltip-top` CSS variables
- Fixed positioning allows tooltips to escape overflow containers
- Event listeners are properly cleaned up to prevent memory leaks
- Console logging helps debug tooltip initialization issues

## [1.3.8] - 2025-07-19

### Fixed
- Added missing tooltip styles to default theme (style.css)
- Tooltips now appear on hover for navigation folders with descriptions
- Matched tooltip styling between default and notion themes

### Added
- Complete tooltip CSS implementation for default theme
- Tooltip arrow for better visual connection
- Dark mode tooltip styling
- Mobile tooltip suppression (disabled on screens < 768px)

### Technical Details
- Tooltips use fixed positioning to escape overflow containers
- High z-index (10000) ensures tooltips appear above all content
- JavaScript positioning via CSS custom properties (--tooltip-left, --tooltip-top)
- Smooth fade transitions for professional appearance

## [1.3.7] - 2025-07-19

### Fixed
- Fixed content area not collapsing when sidebar is hidden on mobile
- Content now properly takes full width when sidebar is closed
- Added !important to margin-left: 0 for mobile breakpoints to ensure proper override
- Fixed issue where content appeared too far right on mobile devices

### Improved
- Content area now properly responds to sidebar state on all screen sizes
- Better use of available screen space on mobile devices
- Consistent behavior across both default and notion-style themes

## [1.3.6] - 2025-07-19

### Fixed
- Fixed responsive menu toggle button not being visible on mobile devices
- Added mobile overlay for sidebar with proper click-to-close functionality
- Improved sidebar z-index stacking for proper mobile display
- Added smooth transitions and shadow effects for mobile sidebar
- Fixed body scroll prevention when mobile menu is open
- Menu toggle button now shows close icon (X) when menu is open
- Sidebar properly closes when clicking navigation items on mobile
- Escape key now properly closes mobile menu and overlay

### Added
- Semi-transparent overlay background when sidebar is open on mobile
- Visual feedback for menu toggle button state (hamburger/close icon)
- Box shadow on mobile sidebar for better depth perception
- Proper ARIA attributes for accessibility

### Improved
- Better mobile user experience with standard mobile navigation patterns
- Consistent behavior across different mobile breakpoints
- Smoother animations and transitions for mobile menu
- Applied fixes to both default and notion-style themes

## [1.3.5] - 2025-07-19

### Fixed
- Restored proper header and breadcrumb heights for better visual hierarchy
- Header height increased from 40px to 56px
- Breadcrumb height restored from 0px to 40px
- Removed duplicate "Home" link from sidebar to eliminate confusion
- Cleaned up orphaned CSS styles for removed sidebar breadcrumbs

### Improved
- Better spacing and visual weight for header components
- Cleaner sidebar with single-purpose filter input
- More professional appearance with proper proportions

## [1.3.4] - 2025-07-19

### Fixed
- Properly fixed spacing between breadcrumb and filter box in sidebar
- Increased sidebar-breadcrumbs margin-bottom to 24px for better separation
- Removed unnecessary margin from sidebar-header elements
- Applied consistent spacing across both style themes

## [1.3.3] - 2025-07-19

### Fixed
- Added spacing between breadcrumb and filter box in sidebar
- Added margin-bottom to sidebar-header for better visual separation
- Improved sidebar navigation layout with consistent spacing

## [1.3.2] - 2025-07-19

### Added
- New `claude-hints` command to generate Claude.md documentation standards
- Comprehensive guide for Claude AI to produce consistent markdown documentation
- Support for both markdown and plain text output formats
- Option to save hints directly to a file

### Fixed
- Further reduced top spacing to exactly 40px from the horizontal bar
- Adjusted header height from 50px to 40px
- Removed breadcrumb height entirely (0px) for minimal spacing
- Set content top padding to fixed 40px for precise control

### Features
- Document structure standards with metadata requirements
- Naming conventions for different document types
- Mermaid diagram best practices
- Information verification standards (✅/❓)
- File organization patterns
- Git commit practices
- Markdown formatting guidelines
- Security and maintenance considerations

### Usage
```bash
doc-builder claude-hints                  # Display to console
doc-builder claude-hints -o CLAUDE.md     # Save to file
doc-builder claude-hints --format text    # Plain text format
```

## [1.3.1] - 2025-07-19

### Fixed
- Reduced excessive top spacing from ~104px to 80px total
- Adjusted header height from 64px to 50px
- Adjusted breadcrumb height from 40px to 30px
- Applied changes to both style.css and notion-style.css for consistency

### Improved
- More compact header design for better content visibility
- Better use of vertical space on all screen sizes

## [1.3.0] - 2025-07-19

### BREAKING CHANGE
- **Default behavior changed**: Running `npx @knowcode/doc-builder` without arguments now shows help instead of building and deploying
- To deploy, explicitly use: `npx @knowcode/doc-builder deploy`

### Changed
- Updated TL;DR in help text to show `npx @knowcode/doc-builder deploy`
- Reordered commands in help to show deploy as the recommended action
- Updated README.md to reflect the new default behavior

### Why this change?
- Prevents accidental deployments when users just want to see available commands
- Makes the tool more predictable - no actions without explicit commands
- Aligns with standard CLI tool behavior

## [1.2.12] - 2025-07-19

### Added
- Support for alternative config file formats (site.title → siteName mapping)
- Support for input/output directory mapping in config files
- Debug logging for site name configuration

### Fixed
- Header now properly displays the project name from config instead of generic "Documentation"
- Config loader now handles both old and new config formats

### Documentation
- Updated GasWorld config to use correct format with siteName: 'GasWorld'

## [1.2.11] - 2025-07-19

### Fixed
- Reduced excessive top spacing in content area by adjusting padding from 1.5rem to 1rem
- Improved visual layout by reducing the gap between header and content

### Changed
- Content area now uses asymmetric padding (1rem top, 2rem sides, 1.5rem bottom) for better visual balance

## [1.2.10] - 2025-07-19

### Fixed
- **Critical fix**: Now properly replaces old directory listing index.html files
- Detects and replaces index.html if it's under 3KB (likely a directory listing)
- Detects and replaces index.html if it doesn't contain doc-builder markers
- Fixes the issue where gasworld.vercel.app showed a directory listing instead of documentation

### Added
- Smart detection of outdated or non-doc-builder index.html files
- Automatic replacement of directory listing pages with proper documentation
- Clear logging when replacing an existing index.html file

## [1.2.9] - 2025-07-19

### Added
- Comprehensive console logging for debugging index.html creation
- Detailed file existence checks with paths and sizes
- File copy verification with size comparison
- List of HTML files found during build and deployment
- Error handling with detailed error messages
- Final verification step to confirm index.html exists

### Improved
- Much more verbose output to help diagnose deployment issues
- Clear indication of what files are being processed
- Better error reporting when file operations fail

## [1.2.8] - 2025-07-19

### Changed
- Removed all JUNO references from documentation and code
- Renamed `cybersolstice` preset to `notion-inspired`
- Updated folder descriptions to be more generic
- Changed default username from 'juno' to 'admin' in preset
- Removed `juno-docs` binary alias from package.json
- Updated keywords to remove 'juno' and add 'notion-style'
- Cleaned up all internal references to use @knowcode/doc-builder

### Fixed
- Documentation now correctly references @knowcode/doc-builder instead of @juno/doc-builder
- Updated GitHub URLs to use knowcode organization

## [1.2.7] - 2025-07-19

### Added
- Comprehensive debugging output showing package version and file existence checks
- Support for `index.md` as primary source for index.html (higher priority than README.md)
- Informative default index.html page when no README.md or index.md exists
- List of available HTML files in default index page
- Version and debug information in generated pages

### Fixed
- Fixed infinite redirect loop in deploy.js when no README.html exists
- Improved index.html creation reliability with better file detection
- Better error messages and guidance when documentation is missing

### Changed
- Enhanced logging throughout build and deploy processes
- Redirect to first available HTML file instead of infinite loop
- More descriptive console output during index.html creation

## [1.2.6] - 2025-07-19

### Fixed
- **Index.html creation** - Fixed root URL not serving documentation by creating index.html from README.html
- Added index.html creation in both build and deploy processes for reliability

## [1.2.5] - 2025-07-19

### Fixed
- **Breadcrumbs** - Fixed URL-encoded characters showing in breadcrumb navigation (spaces showing as %20)
- **Root redirect** - Fixed index.html redirect to use JavaScript window.location.replace for better Vercel compatibility
- Breadcrumbs now properly decode URL segments before displaying

### Improved
- Root page redirect is now more reliable with JavaScript-based redirection
- Better fallback link in case JavaScript is disabled

## [1.2.4] - 2025-07-19

### Fixed
- Removed test-auth directory from npm package
- Updated .npmignore to exclude test-auth directory

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