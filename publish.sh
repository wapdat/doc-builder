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
    print_info "Please update the version in package.json first."
    echo ""
    
    # Show last few published versions
    print_info "Recent versions:"
    npm view "${PACKAGE_NAME}" versions --json | tail -5 | sed 's/,$//' | sed 's/^/  /'
    echo ""
    
    # Suggest next version
    LATEST_VERSION=$(npm view "${PACKAGE_NAME}" version)
    print_info "Latest published version: ${LATEST_VERSION}"
    print_info "Suggested next versions:"
    echo "  - Patch: $(npx semver ${LATEST_VERSION} -i patch)"
    echo "  - Minor: $(npx semver ${LATEST_VERSION} -i minor)"
    echo "  - Major: $(npx semver ${LATEST_VERSION} -i major)"
    exit 1
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
    
    # Suggest next steps
    print_info "Next steps:"
    echo "  1. Create a git tag: git tag v${CURRENT_VERSION}"
    echo "  2. Push the tag: git push origin v${CURRENT_VERSION}"
    echo "  3. Create a GitHub release"
    echo "  4. Update CHANGELOG.md for the next version"
    echo ""
else
    echo ""
    print_error "Publishing failed!"
    print_info "Check the error message above for details"
    exit 1
fi