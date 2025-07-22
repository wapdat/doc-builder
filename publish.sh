#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Icons
CHECK="✓"
CROSS="✗"
ARROW="→"
INFO="ℹ"
WARN="⚠"

# Function to print colored output
print_info() {
    echo -e "${BLUE}${INFO}${NC} $1"
}

print_success() {
    echo -e "${GREEN}${CHECK}${NC} $1"
}

print_error() {
    echo -e "${RED}${CROSS}${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}${WARN}${NC} $1"
}

print_step() {
    echo -e "${CYAN}${ARROW}${NC} $1"
}

# Header
echo ""
echo -e "${BLUE}┌─────────────────────────────────────────┐${NC}"
echo -e "${BLUE}│       📦 NPM Publishing Script          │${NC}"
echo -e "${BLUE}│         @knowcode/doc-builder           │${NC}"
echo -e "${BLUE}└─────────────────────────────────────────┘${NC}"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found! Are you in the project root?"
    exit 1
fi

# Get package info
PACKAGE_NAME=$(node -p "require('./package.json').name")
CURRENT_VERSION=$(node -p "require('./package.json').version")

print_info "Package: ${PACKAGE_NAME}"
print_info "Current version: ${CURRENT_VERSION}"
echo ""

# Check if user is logged into npm
print_step "Checking npm login status..."
if ! npm whoami &> /dev/null; then
    print_error "You are not logged into npm!"
    print_info "Please run: npm login"
    exit 1
else
    NPM_USER=$(npm whoami)
    print_success "Logged in as: ${NPM_USER}"
fi
echo ""

# Check for uncommitted changes
print_step "Checking for uncommitted changes..."
if ! git diff-index --quiet HEAD --; then
    print_warning "You have uncommitted changes!"
    echo ""
    git status --short
    echo ""
    read -p "Do you want to continue anyway? (y/N) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_info "Publishing cancelled."
        exit 1
    fi
else
    print_success "Working directory is clean"
fi
echo ""

# Check if version exists on npm
print_step "Checking if version ${CURRENT_VERSION} is already published..."
if npm view "${PACKAGE_NAME}@${CURRENT_VERSION}" version &> /dev/null; then
    print_error "Version ${CURRENT_VERSION} is already published!"
    echo ""
    
    # Show last few published versions
    print_info "Recent versions:"
    npm view "${PACKAGE_NAME}" versions --json | tail -5 | sed 's/,$//' | sed 's/^/  /'
    echo ""
    
    # Suggest next version
    LATEST_VERSION=$(npm view "${PACKAGE_NAME}" version)
    print_info "Latest published version: ${LATEST_VERSION}"
    
    # Calculate next versions
    PATCH_VERSION=$(npx semver ${LATEST_VERSION} -i patch)
    MINOR_VERSION=$(npx semver ${LATEST_VERSION} -i minor)
    MAJOR_VERSION=$(npx semver ${LATEST_VERSION} -i major)
    
    print_info "Suggested next versions:"
    echo "  1) Patch: ${PATCH_VERSION} (bug fixes)"
    echo "  2) Minor: ${MINOR_VERSION} (new features)"
    echo "  3) Major: ${MAJOR_VERSION} (breaking changes)"
    echo ""
    
    # Ask user to choose
    read -p "Would you like to auto-increment the version? (1/2/3/N) " -n 1 -r
    echo ""
    
    case $REPLY in
        1)
            NEW_VERSION=$PATCH_VERSION
            VERSION_TYPE="patch"
            ;;
        2)
            NEW_VERSION=$MINOR_VERSION
            VERSION_TYPE="minor"
            ;;
        3)
            NEW_VERSION=$MAJOR_VERSION
            VERSION_TYPE="major"
            ;;
        *)
            print_info "Please update the version in package.json manually."
            exit 1
            ;;
    esac
    
    print_step "Updating version to ${NEW_VERSION}..."
    
    # Update package.json
    npm version ${VERSION_TYPE} --no-git-tag-version > /dev/null
    
    # Update CHANGELOG.md if it exists
    if [ -f "CHANGELOG.md" ]; then
        print_step "Updating CHANGELOG.md..."
        
        # Create new changelog entry
        DATE=$(date +%Y-%m-%d)
        NEW_ENTRY="## [${NEW_VERSION}] - ${DATE}\n\n### Changed\n- \n\n"
        
        # Insert after the header (assuming standard changelog format)
        sed -i.bak "/^## \[/i\\
${NEW_ENTRY}" CHANGELOG.md
        rm CHANGELOG.md.bak
        
        print_warning "Please edit CHANGELOG.md to add your changes"
        print_info "Opening CHANGELOG.md in default editor..."
        
        # Open in default editor if available
        if command -v code &> /dev/null; then
            code CHANGELOG.md
        elif command -v nano &> /dev/null; then
            nano CHANGELOG.md
        elif command -v vim &> /dev/null; then
            vim CHANGELOG.md
        fi
        
        echo ""
        read -p "Press enter when you've updated the CHANGELOG..." -r
        echo ""
    fi
    
    # Commit the version bump
    print_step "Committing version bump..."
    git add package.json package-lock.json CHANGELOG.md 2>/dev/null
    git commit -m "chore: bump version to ${NEW_VERSION}" > /dev/null
    print_success "Version bumped to ${NEW_VERSION}"
    
    # Update current version for the rest of the script
    CURRENT_VERSION=$NEW_VERSION
else
    print_success "Version ${CURRENT_VERSION} is not yet published"
fi
echo ""

# Build the project
print_step "Building documentation..."
if node cli.js build > /dev/null 2>&1; then
    print_success "Build completed successfully"
else
    print_error "Build failed!"
    print_info "Run 'node cli.js build' to see the error"
    exit 1
fi
echo ""

# Run npm pack to preview
print_step "Creating package preview..."
PACK_FILE=$(npm pack --dry-run 2>&1 | grep -E "^[a-zA-Z0-9@/._-]+\.tgz$" | tail -1)
print_success "Package will be created as: ${PACK_FILE}"

# Show what will be published
print_info "Files to be included:"
npm pack --dry-run 2>&1 | grep -E "^npm notice.*[0-9]+B" | head -10 | sed 's/npm notice/  /'
TOTAL_FILES=$(npm pack --dry-run 2>&1 | grep -E "^npm notice total files:" | sed 's/npm notice total files://')
print_info "Total files:${TOTAL_FILES}"
echo ""

# Final confirmation
echo -e "${YELLOW}┌─────────────────────────────────────────┐${NC}"
echo -e "${YELLOW}│          READY TO PUBLISH               │${NC}"
echo -e "${YELLOW}├─────────────────────────────────────────┤${NC}"
echo -e "${YELLOW}│${NC} Package:  ${PACKAGE_NAME}"
echo -e "${YELLOW}│${NC} Version:  ${CURRENT_VERSION}"
echo -e "${YELLOW}│${NC} User:     ${NPM_USER}"
echo -e "${YELLOW}│${NC} Registry: https://registry.npmjs.org/"
echo -e "${YELLOW}└─────────────────────────────────────────┘${NC}"
echo ""

read -p "Do you want to publish to npm? (y/N) " -n 1 -r
echo ""
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Publishing cancelled by user"
    exit 0
fi

# Publish to npm
print_step "Publishing to npm..."
echo ""

if npm publish; then
    echo ""
    print_success "Successfully published ${PACKAGE_NAME}@${CURRENT_VERSION}!"
    echo ""
    
    # Show post-publish info
    echo -e "${GREEN}┌─────────────────────────────────────────┐${NC}"
    echo -e "${GREEN}│         🎉 PUBLISHED SUCCESSFULLY!      │${NC}"
    echo -e "${GREEN}└─────────────────────────────────────────┘${NC}"
    echo ""
    
    print_info "View on npm:"
    echo "  https://www.npmjs.com/package/${PACKAGE_NAME}"
    echo ""
    
    print_info "Install command:"
    echo "  npm install ${PACKAGE_NAME}@${CURRENT_VERSION}"
    echo ""
    
    print_info "Or use with npx:"
    echo "  npx ${PACKAGE_NAME}@latest"
    echo ""
    
    # Automatically create and push git tag
    print_step "Creating git tag v${CURRENT_VERSION}..."
    if git tag "v${CURRENT_VERSION}" 2>/dev/null; then
        print_success "Git tag created"
        
        echo ""
        read -p "Push tag to origin? (Y/n) " -n 1 -r
        echo ""
        
        if [[ ! $REPLY =~ ^[Nn]$ ]]; then
            print_step "Pushing tag to origin..."
            if git push origin "v${CURRENT_VERSION}"; then
                print_success "Tag pushed successfully"
            else
                print_warning "Failed to push tag. Run manually: git push origin v${CURRENT_VERSION}"
            fi
        fi
    else
        print_warning "Tag v${CURRENT_VERSION} already exists"
    fi
    
    echo ""
    print_info "Next steps:"
    echo "  1. Create a GitHub release at: https://github.com/knowcode/doc-builder/releases/new"
    echo "  2. Deploy example site: npx @knowcode/doc-builder@latest deploy"
    echo ""
else
    echo ""
    print_error "Publishing failed!"
    print_info "Check the error message above for details"
    exit 1
fi