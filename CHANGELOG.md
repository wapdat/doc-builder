# Changelog

All notable changes to @knowcode/doc-builder will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.5.20] - 2025-07-22

### Fixed
- Force table cells to top-align with !important CSS
- Added !important to vertical-align: top for th and td elements
- Added explicit table th/td rules with !important
- Added rules for nested elements in table cells
- Fixes issue where table cells were center-aligned instead of top-aligned

## [1.5.19] - 2025-07-22

### Fixed
- Force table cells to top-align with !important CSS (version was already published)

## [1.5.18] - 2025-07-22

### Documentation
- Enhanced Claude + CLAUDE.md Documentation Workflow Guide with comprehensive examples
- Expanded Project-Level CLAUDE.md section with complete template and best practices
- Added detailed document structure, naming conventions, and content requirements
- Included information verification standards with ✅/❓ marks
- Expanded Global CLAUDE.md best practices with real-world examples
- Enhanced project-specific instructions for API, testing, and deployment docs
- Updated best practices summary with detailed guidelines for documentation maintenance

## [1.5.17] - 2025-07-22

### Changed
- CSS table alignment now defaults to top-aligned instead of center-aligned
- Updated Windows Setup Guide with improved Vercel project setup section
- Added detailed explanations for each Vercel setup prompt
- Added comprehensive Vercel project naming requirements and examples
- Updated deploy.js with clearer project name hint showing URL format

### Documentation
- Created comprehensive Windows Setup Guide for Claude Code and doc-builder
- Added explanation of Claude vs Claude Code differences
- Updated to clarify GitHub is required for Vercel
- Added details that Pro/Max plan is required for Claude Code

## [1.5.16] - 2025-07-22

### Changed
- Simplified Mermaid diagram display by removing unnecessary UI elements
- Removed "Copy to Mermaid" button from diagram toolbar
- Removed "Copy SVG" button from diagram toolbar
- Removed "Diagram" heading from Mermaid diagram wrapper
- Removed "Mermaid Diagram" text label from toolbar

### Improved
- Cleaner, less cluttered presentation of Mermaid diagrams
- Full Screen button remains available for better diagram viewing

## [1.5.15] - 2025-07-22

### Fixed
- Improved Phosphor icon vertical alignment using more aggressive CSS positioning
- Icons now use `vertical-align: text-top` with `top: 0.2em` offset for better x-height alignment
- Reduced line-height to 0.8 to prevent icons from affecting line spacing

### Changed
- Enhanced icon CSS to ensure proper alignment across different text contexts
- Icons now properly align with the text baseline in all scenarios

## [1.5.14] - 2025-07-22

### Fixed
- Fixed vertical alignment of Phosphor icons - they now properly center with text
- Added CSS rules for proper icon positioning in different contexts (headings, lists, tables)
- Icons no longer appear too high relative to the text baseline

### Changed
- Added comprehensive Phosphor icon CSS alignment rules at the end of notion-style.css
- Fine-tuned icon positioning with `vertical-align: middle` and slight top offset adjustment

## [1.5.13] - 2025-07-22

### Added
- **Phosphor Icons Integration** - Automatically convert Unicode emojis to beautiful Phosphor icons in generated HTML
- Comprehensive emoji-to-icon mapping with 200+ supported emojis
- Configurable icon weights (thin, light, regular, bold, fill, duotone)
- Configurable icon size relative to text
- Accessibility support with proper aria-labels for all icons
- New `phosphor-icons-guide.md` documentation

### Changed
- HTML template now includes Phosphor Icons CDN when feature is enabled
- Post-processing step to replace emojis with icon tags after markdown parsing

### Technical Details
- Added `lib/emoji-mapper.js` with comprehensive emoji mappings
- Updated `core-builder.js` to process emojis during HTML generation
- Added configuration options: `phosphorIcons`, `phosphorWeight`, `phosphorSize`
- Icons inherit text color and can be styled with CSS

## [1.5.12] - 2025-07-22

### Documentation
- 📚 **Updated all Vercel documentation** for the simplified setup process
- ✨ **Rewrote vercel-first-time-setup-guide.md** with streamlined 6-step process
- 🔧 **Updated vercel-cli-setup-guide.md** to focus on installation and advanced usage
- 📝 **Simplified README.md deployment section** to 4 clear steps
- 🐛 **Updated troubleshooting-guide.md** with new deployment solutions
- 🎯 **Removed references to complex prompts** and confusing options
- 📖 **Added 'What Changed' section** highlighting improvements

### Documentation Improvements
- No more confusing "Found project xyz/html" prompts
- No more root directory confusion
- Clear, straightforward deployment flow
- Better error messages and solutions

## [1.5.11] - 2025-07-22

### Fixed
- Fixed Vercel deployment error: "routes cannot be present with rewrites"
- Replaced deprecated `routes` configuration with modern `rewrites` in vercel.json
- Deployment now works correctly with Vercel's latest API

### Improved
- Dramatically simplified deployment prompts and warnings
- Reduced verbosity of console output during deployment
- Made setup instructions clearer and less intimidating
- Removed redundant and scary "CRITICAL WARNING" messages
- Streamlined the first-time deployment experience

### Changed
- vercel.json now uses `rewrites` instead of deprecated `routes` property
- Cleaner, more professional console output throughout deployment process
- Better error messages that are helpful rather than alarming

## [1.5.10] - 2025-07-22

### Fixed
- Automatically create missing docs directory when running build, dev, or deploy commands
- No longer fails with "ENOENT: no such file or directory" when docs folder is missing
- Creates placeholder README.md in newly created docs directory
- Removed duplicate warning messages about missing docs directory

### Improved
- Better handling of empty projects - just run `doc-builder build` and it creates everything needed
- Cleaner console output without redundant warnings
- Ensures output directory exists before building

## [1.5.9] - 2025-07-22

### Added
- Comprehensive SEO Optimization Guide with extensive external resources
- Detailed explanations of all SEO features and how they work
- References to 20+ external SEO tools and learning resources
- Keyword research tools and performance testing recommendations
- SEO monitoring strategies and success metrics
- Actionable SEO checklist for documentation projects

### Documentation
- Created detailed guide explaining automatic meta tag generation
- Added sections on Open Graph Protocol and Twitter Cards
- Included structured data (JSON-LD) explanations
- Referenced Google's official SEO guidelines and best practices
- Added links to free SEO tools and validators

## [1.5.8] - 2025-07-22

### Changed
- **BREAKING**: `seo-check` command now analyzes generated HTML files instead of markdown source files
- Completely rewrote SEO analysis to inspect actual HTML output that search engines see
- Added comprehensive checks for all SEO elements in HTML including:
  - Title tags and optimal length
  - Meta descriptions and character limits
  - Keywords meta tags
  - Canonical URLs
  - H1 tags and consistency with titles
  - Open Graph tags for social media
  - Twitter Card tags
  - Structured data (JSON-LD)
- Updated help text and examples to reflect HTML analysis
- Improved error messages to guide users to build HTML first

### Why This Change?
- SEO analysis should check what search engines actually see (the generated HTML)
- Provides more accurate and comprehensive SEO insights
- Can verify that all meta tags are properly generated
- Ensures Open Graph and Twitter Cards are working correctly

## [1.5.7] - 2025-07-22

### Fixed
- Fixed "path argument must be string" error when running seo-check via npx
- Properly pass options to loadConfig in seo-check command
- Added validation to check if docs directory exists before running SEO analysis
- Improved error messages when docs directory is missing

## [1.5.6] - 2025-07-22

### Fixed
- Fixed missing gray-matter import in cli.js causing seo-check command to fail
- Resolved "path argument must be string" error when running seo-check

## [1.5.5] - 2025-07-22

### Added
- **Front Matter Support**: Parse YAML front matter for page-specific SEO customization
- **SEO Check Command**: New `seo-check` command to analyze and report SEO issues
- **Smart Description Extraction**: Intelligent extraction of intro paragraphs for better descriptions
- **Enhanced Title Generation**: SEO-optimized titles with customizable templates
- **Page-specific Keywords**: Support for front matter keywords plus auto-extraction
- **Comprehensive SEO Guide**: Detailed documentation for SEO optimization

### Changed
- Improved `generateDescription` with smart mode for better meta descriptions
- Title generation now respects 50-60 character limit with smart truncation
- Keywords can be defined per-page via front matter
- SEO configuration expanded with new options

### Features
- **Front Matter SEO**: Add custom title, description, and keywords per page
- **Title Templates**: Configure title format with `{pageTitle} | {siteName}` patterns
- **Auto Keywords**: Automatically extract relevant keywords from content
- **SEO Analysis**: Run `doc-builder seo-check` to find and fix SEO issues
- **Smart Defaults**: Intelligent fallbacks for missing SEO data

### Configuration
```javascript
seo: {
  titleTemplate: '{pageTitle} | {siteName}',
  autoKeywords: true,
  keywordLimit: 7,
  descriptionFallback: 'smart'
}
```

## [1.5.4] - 2025-07-22

### Added
- New CLI command `google-verify` to add Google site verification meta tags
- Support for custom meta tags in the SEO configuration
- Comprehensive guide for Google Search Console verification
- Ability to update existing verification codes

### Changed
- Extended `generateMetaTags` function to support custom meta tags
- Updated config structure to include `seo.customMetaTags` array

### Features
- Run `doc-builder google-verify YOUR_CODE` to add verification
- Verification meta tag automatically added to all generated pages
- Support for multiple custom meta tags (Google, Bing, Yandex, etc.)
- Safe to commit verification codes to repositories

## [1.5.3] - 2025-07-22

### Fixed
- Fixed mobile menu not being visible when scrolled down by changing sidebar from absolute to fixed positioning
- Increased sidebar z-index to 1002 to ensure it appears above header and other elements
- Made floating menu button always visible on mobile (removed scroll-based visibility)
- Added overlay backdrop when mobile menu is open for better UX
- Fixed overlay and menu state synchronization across different toggle methods

### Changed
- Mobile sidebar now uses `position: fixed` instead of `position: absolute`
- Floating menu button is now always visible on mobile for consistent access
- Added semi-transparent overlay when mobile menu is open
- Improved click-outside behavior to properly close menu and overlay

## [1.5.2] - 2025-07-22

### Added
- Floating menu button for mobile devices that appears when scrolling down
- Scroll detection to show/hide floating menu button based on scroll position
- Smooth animations and transitions for floating button appearance
- Icon changes between hamburger and close based on sidebar state

### Fixed
- Fixed mobile menu inaccessibility when scrolled down the page
- Menu toggle button in header was scrolling off-screen, preventing sidebar access
- Mobile users can now always access the navigation menu regardless of scroll position

### Background
- Users reported being unable to open the sidebar menu on mobile when scrolled down
- Implemented floating action button (FAB) pattern common in mobile apps
- Button appears when user scrolls past the header and disappears when scrolling back up

## [1.5.1] - 2025-07-21

### Added
- Automatic redirect from .md URLs to their corresponding .html files
- Client-side JavaScript to intercept clicks on .md links and redirect to .html
- Custom 404.html page with automatic redirect logic for direct .md URL navigation
- Enhanced vercel.json generation to include 404 page routing

### Fixed
- Fixed 404 errors when clicking or navigating to .md links
- Links like `claude-workflow-guide.md` now automatically redirect to `claude-workflow-guide.html`

### Background
- Users reported that links to .md files resulted in 404 errors
- Implemented client-side solution to handle both link clicks and direct navigation
- Works seamlessly with Vercel's cleanUrls configuration

## [1.5.0] - 2025-07-21

### Added
- Comprehensive SEO features including meta tags, Open Graph, Twitter Cards
- JSON-LD structured data for better search engine understanding
- Automatic sitemap.xml and robots.txt generation
- Interactive `setup-seo` CLI command to configure SEO settings
- SEO configuration options in doc-builder.config.js
- Production URL configuration with `set-production-url` command
- Support for custom production URLs via config file, CLI command, or deployment flag

### Improved
- Better deployment URL detection with multiple fallback methods
- Enhanced meta tag generation with author, keywords, and canonical URLs
- Social media preview support with customizable images and descriptions

### Documentation
- Added comprehensive SEO guide explaining all features and configuration
- Updated troubleshooting guide with npx cache clearing instructions

## [1.4.26] - 2025-07-21

### Improved
- Clarified Vercel setup instructions to show both paths for question #5
- Now clearly indicates what prompt users see based on their answer to question #4
- Added "If you answered YES/NO to #4" conditional guidance
- Shows appropriate project name prompts for both existing and new projects

### Background
- Users were confused about what happens after answering NO to "Link to different existing project?"
- The instructions now clearly show both scenarios:
  - YES: "What's the name of your existing project?"
  - NO: "What is your project name?" (for creating new project)
- This matches the actual Vercel CLI flow more accurately

## [1.4.25] - 2025-07-21

### Fixed
- Improved production URL detection with multiple fallback methods
- Tries to extract project name and construct standard Vercel URL
- Better handling of different Vercel URL formats

### Background
- Previous version didn't correctly parse Vercel's output
- Now uses multiple methods to determine the production URL
- Extracts project name from deployment URL as fallback

## [1.4.24] - 2025-07-21

### Fixed
- Deployment now shows the correct production URL from Vercel
- Uses Vercel CLI to fetch the actual production alias
- Shows clean URL like `doc-builder-delta.vercel.app` instead of deployment URL

### Background
- Previously showed deployment URLs like `doc-builder-i02vs7dur-lindsay-1340s-projects.vercel.app`
- Now queries `vercel project ls` to get the actual production URL
- Falls back to deployment URL if production URL cannot be determined

## [1.4.23] - 2025-07-21

### Added
- Added npx cache clearing instructions to CLI help
- Added troubleshooting section to README
- Created comprehensive troubleshooting guide
- Documented `npx clear-npx-cache` solution prominently

### Background
- Users frequently encounter npx cache issues causing old versions to run
- The npx cache doesn't automatically update when new versions are published
- This causes confusion when bug fixes or new features don't appear
- Clear documentation helps users resolve this common issue quickly

## [1.4.22] - 2025-07-21

### Fixed
- Fixed incorrect production URL display after deployment
- Deployment now shows the actual Vercel URL instead of truncated version

### Background
- The regex pattern was only capturing text before the first hyphen
- For `doc-builder-delta.vercel.app` it showed `doc.vercel.app`
- Now properly displays the full production URL returned by Vercel
- Also handles preview URLs with random suffixes correctly

## [1.4.21] - 2025-07-21

### Fixed
- Fixed hidden sidebar still taking up vertical space on mobile
- Made sidebar absolutely positioned on mobile to remove it from document flow
- Eliminated the gap that matched the collapsed menu height

### Background
- Sidebar was hidden with translateX but still occupied 250px in the flex column
- This created a gap exactly the height of the collapsed menu
- Now sidebar is position: absolute on mobile, completely removing it from layout

## [1.4.20] - 2025-07-21

### Fixed
- Properly fixed the persistent white gap at 768px breakpoint
- Resolved conflicting media query styles
- Kept breadcrumbs in fixed position on mobile

### Background
- Multiple 768px media queries were conflicting with each other
- Last media query was changing breadcrumbs to relative positioning
- This caused double spacing (margin + breadcrumb height)
- Now breadcrumbs remain fixed and margin-top properly accounts for both elements

## [1.4.19] - 2025-07-21

### Fixed
- Fixed large white gap appearing at 768px breakpoint
- Removed duplicate CSS definitions for breadcrumbs
- Corrected margin-top calculation for mobile layout

### Background
- Duplicate breadcrumb CSS definitions were causing conflicts
- Main wrapper had incorrect margin-top on mobile (80px instead of 40px)
- Now properly accounts for only the fixed header height on mobile

## [1.4.18] - 2025-07-21

### Fixed
- Fixed responsive breakpoint - sidebar now remains visible on tablets (768px-1024px)
- Removed large gap above content on mobile devices
- Improved mobile layout consistency

### Background
- Sidebar was disappearing at 1024px instead of 768px
- Mobile layout had excessive padding causing large gaps
- Now follows proper responsive design patterns for tablets vs mobile

## [1.4.17] - 2025-07-21

### Improved
- Enhanced tooltip extraction to show content from Overview/Summary sections
- Tooltips now display the actual overview text from documents
- Provides more meaningful previews when hovering over menu items

### Background
- Previously tooltips showed just the first few words from documents
- Now extracts content specifically from "Overview" or "Summary" sections
- Falls back to first paragraph if no Overview/Summary section exists
- Provides better context about what each document contains

## [1.4.16] - 2025-07-21

### Improved
- Enhanced menu tooltips to show clean text previews instead of raw markdown
- Tooltips now display properly formatted text with markdown syntax removed
- Better preview experience for document summaries

### Background
- Previously tooltips showed raw markdown including asterisks, links, etc.
- Now provides clean, readable text excerpts from document content
- Improves user experience when hovering over menu items

## [1.4.15] - 2025-07-21

### Fixed
- Fixed index.html not being regenerated with current doc-builder version
- index.html is now always regenerated from README.html to ensure version consistency
- This prevents stale version numbers from being shown in deployed documentation

### Background
- Previously, index.html was preserved if it existed and looked valid
- This caused version numbers to be stuck at older versions
- Now ensures index.html always reflects the current build version

## [1.4.14] - 2025-07-21

### Fixed
- Fixed subdirectories not showing on initial page load
- Folders now expand by default when viewing index.html or root README
- Improved navigation visibility for better user experience

### Background
- Previously, folders only expanded if they contained the active page
- This caused subdirectories to be hidden on initial page load
- Now folders expand automatically for better content discovery

## [1.4.13] - 2025-07-21

### Added
- Created comprehensive DOCUMENT-STANDARDS.md defining documentation conventions
- Added documentation index file for better navigation
- Established docs/guides/ directory structure for organized documentation

### Documentation
- Document standards cover naming conventions, content guidelines, and quality standards
- Includes templates for different document types (features, technical guides, API docs)
- Defines metadata requirements and verification indicators (✅/❓)
- Establishes changelog maintenance practices

## [1.4.12] - 2025-07-21

### Fixed
- Fixed h1 title alignment to extend full width above the navigation menu
- Added negative margins to h1 to counteract content padding
- Adjusted mobile styles to maintain proper alignment on smaller screens

### Background
- The h1 title was appearing offset from the left due to content area padding
- Now h1 elements extend to the full width of the content area for better visual hierarchy

## [1.4.11] - 2025-07-21

### Added
- Added live example site link to npm README.md (https://doc-builder-delta.vercel.app)
- Users can now preview what their documentation will look like before building

## [1.4.10] - 2025-07-21

### Fixed
- Fixed mermaid diagram rendering by preventing HTML escaping of diagram content
- Implemented placeholder system to protect mermaid blocks from markdown parser interference
- Mermaid diagrams now render correctly without "Syntax error" messages

### Background
- Mermaid content was being HTML-escaped (e.g., `-->` became `--&gt;`)
- Markdown parser was breaking up mermaid blocks by interpreting indented lines as code blocks
- Fixed by processing mermaid blocks before markdown parsing and using placeholders

## [1.4.9] - 2025-07-21

### Fixed
- Fixed sidebar resizing issue where menu overlapped content instead of pushing it
- Changed sidebar from `position: fixed` to `position: relative` to work properly with flexbox layout
- Added `flex-shrink: 0` to sidebar to prevent shrinking
- Removed unnecessary banner-specific positioning adjustments

### Background
- The sidebar was using fixed positioning which took it out of document flow
- This caused the resize handle to only change sidebar width without affecting content position
- With relative positioning and flexbox, the content now properly adjusts when sidebar is resized

## [1.4.8] - 2025-07-21

### Fixed
- Fixed excessive spacing between breadcrumbs and navigation menu
- Changed breadcrumb default positioning from `calc(var(--header-height) + 3.5rem)` to `var(--header-height)`
- Removed duplicate `.sidebar` and `.main-wrapper` CSS definitions causing layout conflicts

### Background
- The breadcrumb bar was incorrectly adding banner height (3.5rem) even when no banner was visible
- Duplicate CSS definitions for `.main-wrapper` were using conflicting spacing approaches (padding vs margin)
- This fixes the final spacing issue in the CSS cleanup series from v1.4.5-v1.4.7

## [1.4.7] - 2025-07-21

### Fixed
- Removed excess spacing above navigation menu by setting sidebar-header margin-bottom to 0
- Cleaned up duplicate `.sidebar-header` CSS definitions that were causing conflicts

### Background
- Previous CSS fixes exposed duplicate `.sidebar-header` definitions with conflicting margins
- The extra spacing was introduced by `margin-bottom: var(--space-4)` on the sidebar header
- This completes the CSS cleanup started in v1.4.5 and v1.4.6

## [1.4.6] - 2025-07-21

### Fixed
- Restored breadcrumb height from 0px to 40px to fix visibility issue
- Removed duplicate CSS rules that were causing filter icon overlap
- Cleaned up duplicate `.filter-box`, `.filter-icon`, and `.sidebar-breadcrumbs` definitions

### Background
- The removal of style.css in v1.4.5 exposed pre-existing CSS conflicts
- Duplicate CSS rules were causing the filter icon to render incorrectly
- Breadcrumb height of 0px (set in v1.3.2) made the breadcrumb bar invisible

## [1.4.5] - 2025-07-21

### Fixed
- Removed all references to non-existent style.css file
- Fixed CSS rendering issues where root page appeared different from other pages
- Updated CSS existence check in deploy.js to verify notion-style.css instead

### Background
- style.css was removed in v1.4.0 but code references remained
- This caused 404 errors and potential CSS loading failures
- All pages now correctly load only notion-style.css as intended

## [1.4.4] - 2025-07-21

### Added
- Added doc-builder version tooltip to "Last updated" text in header
- When hovering over the deployment date, users now see which version of doc-builder was used
- Version is dynamically loaded from package.json during build

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