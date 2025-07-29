// Documentation Builder - Main JavaScript

// Preview Banner Management
// Set up banner state immediately to prevent flash
const bannerDismissed = localStorage.getItem('banner-dismissed') === 'true';

// Apply styles immediately if banner should be visible
if (!bannerDismissed) {
  document.documentElement.style.setProperty('--banner-offset', '3.5rem');
} else {
  document.documentElement.style.setProperty('--banner-offset', '0rem');
}

document.addEventListener('DOMContentLoaded', function() {
  const banner = document.getElementById('preview-banner');
  const dismissButton = document.getElementById('dismiss-banner');
  const mainWrapper = document.querySelector('.main-wrapper');
  const sidebar = document.querySelector('.sidebar');
  const breadcrumbs = document.querySelector('.breadcrumbs');
  
  if (bannerDismissed) {
    banner.classList.add('hidden');
  } else {
    // Show banner and adjust layout
    banner.classList.add('visible');
    mainWrapper.classList.add('banner-visible');
    sidebar.classList.add('banner-visible');
    breadcrumbs?.classList.add('banner-visible');
  }
  
  // Handle banner dismissal
  if (dismissButton) {
    dismissButton.addEventListener('click', function() {
      banner.classList.remove('visible');
      banner.classList.add('hidden');
      mainWrapper.classList.remove('banner-visible');
      sidebar.classList.remove('banner-visible');
      breadcrumbs?.classList.remove('banner-visible');
      document.documentElement.style.setProperty('--banner-offset', '0rem');
      
      // Remember that the banner was dismissed
      localStorage.setItem('banner-dismissed', 'true');
    });
  }
  
  // Handle Escape key to dismiss banner
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && banner.classList.contains('visible')) {
      dismissButton.click();
    }
  });

  // Initialize Mermaid Full Screen Functionality
  initializeMermaidFullScreen();
});

// Mermaid Full Screen Viewer
function initializeMermaidFullScreen() {
  // Wait for Mermaid to initialize
  if (typeof mermaid === 'undefined') {
    setTimeout(initializeMermaidFullScreen, 100);
    return;
  }

  // Find all Mermaid diagrams and wrap them with full-screen controls
  const mermaidDivs = document.querySelectorAll('.mermaid');
  
  mermaidDivs.forEach((mermaidDiv, index) => {
    // Skip if already processed
    if (mermaidDiv.closest('.mermaid-container')) {
      return;
    }

    // Create container
    const container = document.createElement('div');
    container.className = 'mermaid-container';
    
    // Create toolbar
    const toolbar = document.createElement('div');
    toolbar.className = 'mermaid-toolbar';
    
    const actions = document.createElement('div');
    actions.className = 'mermaid-actions';
    
    // Full screen button
    const fullScreenBtn = document.createElement('button');
    fullScreenBtn.className = 'mermaid-btn';
    fullScreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
    fullScreenBtn.title = 'Full Screen';
    fullScreenBtn.addEventListener('click', () => openMermaidFullScreen(mermaidDiv, index));
    
    actions.appendChild(fullScreenBtn);
    
    toolbar.appendChild(actions);
    
    // Create wrapper for the diagram
    const wrapper = document.createElement('div');
    wrapper.className = 'mermaid-wrapper';
    
    // Insert container before mermaid div
    mermaidDiv.parentNode.insertBefore(container, mermaidDiv);
    
    // Move mermaid div into wrapper
    wrapper.appendChild(mermaidDiv);
    
    // Assemble container
    container.appendChild(toolbar);
    container.appendChild(wrapper);
  });

  // Create fullscreen modal (only once)
  if (!document.getElementById('mermaid-fullscreen-modal')) {
    createMermaidFullScreenModal();
  }
}

function createMermaidFullScreenModal() {
  const modal = document.createElement('div');
  modal.id = 'mermaid-fullscreen-modal';
  modal.className = 'mermaid-fullscreen';
  
  modal.innerHTML = `
    <div class="mermaid-fullscreen-toolbar">
      <div class="mermaid-fullscreen-title">Mermaid Diagram - Full Screen View</div>
      <div class="mermaid-fullscreen-controls">
        <div class="mermaid-zoom-controls">
          <button class="mermaid-zoom-btn" id="zoom-out">
            <i class="fas fa-minus"></i>
          </button>
          <div class="mermaid-zoom-level" id="zoom-level">100%</div>
          <button class="mermaid-zoom-btn" id="zoom-in">
            <i class="fas fa-plus"></i>
          </button>
          <button class="mermaid-zoom-btn" id="zoom-reset">
            <i class="fas fa-expand-arrows-alt"></i>
          </button>
        </div>
        <button class="mermaid-close-btn" id="close-fullscreen">
          <i class="fas fa-times"></i> Close
        </button>
      </div>
    </div>
    <div class="mermaid-fullscreen-content">
      <div class="mermaid-fullscreen-wrapper" id="fullscreen-wrapper">
        <div class="mermaid-fullscreen-diagram" id="fullscreen-diagram">
          <!-- Diagram will be inserted here -->
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Set up event listeners - store zoom in modal element
  modal.currentZoom = 1;
  const wrapper = document.getElementById('fullscreen-wrapper');
  const zoomLevel = document.getElementById('zoom-level');
  
  function updateZoom() {
    const currentZoom = modal.currentZoom || 1;
    wrapper.style.transform = `scale(${currentZoom})`;
    zoomLevel.textContent = `${Math.round(currentZoom * 100)}%`;
    
    if (currentZoom > 1) {
      wrapper.classList.add('zoomed');
    } else {
      wrapper.classList.remove('zoomed');
    }
  }
  
  // Zoom controls
  document.getElementById('zoom-in').addEventListener('click', () => {
    modal.currentZoom = Math.min((modal.currentZoom || 1) + 0.25, 3);
    updateZoom();
  });
  
  document.getElementById('zoom-out').addEventListener('click', () => {
    modal.currentZoom = Math.max((modal.currentZoom || 1) - 0.25, 0.25);
    updateZoom();
  });
  
  document.getElementById('zoom-reset').addEventListener('click', () => {
    modal.currentZoom = 1;
    updateZoom();
  });
  
  // Close functionality
  document.getElementById('close-fullscreen').addEventListener('click', closeMermaidFullScreen);
  
  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeMermaidFullScreen();
    }
  });
  
  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeMermaidFullScreen();
    }
  });
}

function openMermaidFullScreen(mermaidDiv, index) {
  const modal = document.getElementById('mermaid-fullscreen-modal');
  const diagramContainer = document.getElementById('fullscreen-diagram');
  const wrapper = document.getElementById('fullscreen-wrapper');
  const zoomLevel = document.getElementById('zoom-level');
  
  // Reset zoom to 100% when opening new diagram
  modal.currentZoom = 1;
  wrapper.style.transform = `scale(${modal.currentZoom})`;
  zoomLevel.textContent = `${Math.round(modal.currentZoom * 100)}%`;
  wrapper.classList.remove('zoomed');
  
  // Clone the mermaid diagram
  const clonedDiagram = mermaidDiv.cloneNode(true);
  
  // Reset all styles that might interfere
  clonedDiagram.style.cssText = '';
  
  // Find the SVG and make it scale properly
  const svg = clonedDiagram.querySelector('svg');
  if (svg) {
    // Store original dimensions for reference
    const originalWidth = svg.getAttribute('width');
    const originalHeight = svg.getAttribute('height');
    const originalViewBox = svg.getAttribute('viewBox');
    
    // Reset SVG styles
    svg.style.cssText = '';
    
    // Ensure we have a proper viewBox for scaling
    if (!originalViewBox && originalWidth && originalHeight) {
      svg.setAttribute('viewBox', `0 0 ${originalWidth} ${originalHeight}`);
    }
    
    // Remove fixed dimensions to enable responsive scaling
    svg.removeAttribute('width');
    svg.removeAttribute('height');
    
    // Set responsive attributes
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    
    // Apply CSS for proper scaling
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.maxWidth = '100%';
    svg.style.maxHeight = '100%';
    svg.style.display = 'block';
  }
  
  // Apply proper styles to the cloned diagram
  clonedDiagram.style.width = '100%';
  clonedDiagram.style.height = '100%';
  clonedDiagram.style.display = 'flex';
  clonedDiagram.style.justifyContent = 'center';
  clonedDiagram.style.alignItems = 'center';
  
  // Clear previous content and add new diagram
  diagramContainer.innerHTML = '';
  diagramContainer.appendChild(clonedDiagram);
  
  // Show modal
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Update title
  const title = document.querySelector('.mermaid-fullscreen-title');
  const container = mermaidDiv.closest('.mermaid-container');
  const originalTitle = container ? container.querySelector('.mermaid-toolbar div').textContent : 'Mermaid Diagram';
  title.textContent = `${originalTitle} - Full Screen View`;
  
  // Debug logging
  console.log('Fullscreen opened with diagram:', clonedDiagram);
  console.log('SVG found:', svg);
  if (svg) {
    console.log('SVG viewBox:', svg.getAttribute('viewBox'));
    console.log('SVG dimensions:', svg.getBoundingClientRect());
  }
}

function closeMermaidFullScreen() {
  const modal = document.getElementById('mermaid-fullscreen-modal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
  
  // Clear diagram content
  setTimeout(() => {
    const diagramContainer = document.getElementById('fullscreen-diagram');
    diagramContainer.innerHTML = '';
  }, 300);
}

function copyMermaidSVG(mermaidDiv) {
  try {
    const svg = mermaidDiv.querySelector('svg');
    if (svg) {
      const svgString = new XMLSerializer().serializeToString(svg);
      
      // Try to use the modern clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(svgString).then(() => {
          showCopySuccess('SVG copied to clipboard!');
        }).catch(() => {
          fallbackCopy(svgString, 'SVG');
        });
      } else {
        fallbackCopy(svgString, 'SVG');
      }
    }
  } catch (error) {
    console.error('Error copying SVG:', error);
    showCopyError();
  }
}

function copyMermaidSource(mermaidDiv) {
  try {
    // Find the original Mermaid source code
    let mermaidSource = '';
    
    // Try to get from data attribute first
    if (mermaidDiv.dataset.mermaidSource) {
      mermaidSource = mermaidDiv.dataset.mermaidSource;
    } else {
      // Try to find in the page content - look for the nearest pre code block
      const container = mermaidDiv.closest('.content');
      if (container) {
        const codeBlocks = container.querySelectorAll('pre code');
        for (const block of codeBlocks) {
          if (block.textContent.includes('flowchart') || block.textContent.includes('graph')) {
            mermaidSource = block.textContent;
            break;
          }
        }
      }
      
      // Fallback: extract from the SVG if available
      if (!mermaidSource) {
        const svg = mermaidDiv.querySelector('svg');
        if (svg) {
          // Try to reconstruct basic Mermaid from SVG elements
          mermaidSource = reconstructMermaidFromSVG(svg);
        }
      }
    }
    
    if (mermaidSource) {
      // Try to use the modern clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(mermaidSource).then(() => {
          showCopySuccess('Mermaid source copied to clipboard!');
        }).catch(() => {
          fallbackCopy(mermaidSource, 'Mermaid');
        });
      } else {
        fallbackCopy(mermaidSource, 'Mermaid');
      }
    } else {
      showCopyError('Could not find Mermaid source');
    }
  } catch (error) {
    console.error('Error copying Mermaid source:', error);
    showCopyError();
  }
}

function reconstructMermaidFromSVG(svg) {
  // Basic reconstruction - this is a fallback method
  let mermaidCode = 'flowchart TD\n';
  
  // Try to extract node information from SVG
  const nodes = svg.querySelectorAll('g.node');
  const edges = svg.querySelectorAll('g.edgePath');
  
  // Add nodes
  nodes.forEach((node, index) => {
    const label = node.querySelector('span, text, foreignObject');
    if (label) {
      const nodeText = label.textContent.trim();
      const nodeId = `N${index + 1}`;
      
      if (nodeText.includes('?')) {
        mermaidCode += `    ${nodeId}{{"${nodeText}"}}\n`;
      } else {
        mermaidCode += `    ${nodeId}["${nodeText}"]\n`;
      }
    }
  });
  
  mermaidCode += '\n    %% Note: This is a reconstructed version - original source may differ\n';
  
  return mermaidCode;
}

function fallbackCopy(text, type = 'content') {
  // Fallback for older browsers
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.select();
  
  try {
    document.execCommand('copy');
    showCopySuccess(`${type} copied to clipboard!`);
  } catch (error) {
    showCopyError(`Failed to copy ${type.toLowerCase()}`);
  }
  
  document.body.removeChild(textArea);
}

function showCopySuccess(message = 'Content copied to clipboard!') {
  // Create temporary success message
  const messageDiv = document.createElement('div');
  messageDiv.textContent = message;
  messageDiv.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--success);
    color: white;
    padding: 1rem 2rem;
    border-radius: 0.5rem;
    z-index: 10001;
    font-size: 0.875rem;
    box-shadow: var(--shadow-lg);
    max-width: 300px;
    text-align: center;
  `;
  
  document.body.appendChild(messageDiv);
  
  setTimeout(() => {
    messageDiv.remove();
  }, 2000);
}

function showCopyError(message = 'Failed to copy content') {
  // Create temporary error message
  const messageDiv = document.createElement('div');
  messageDiv.textContent = message;
  messageDiv.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--danger);
    color: white;
    padding: 1rem 2rem;
    border-radius: 0.5rem;
    z-index: 10001;
    font-size: 0.875rem;
    box-shadow: var(--shadow-lg);
    max-width: 300px;
    text-align: center;
  `;
  
  document.body.appendChild(messageDiv);
  
  setTimeout(() => {
    messageDiv.remove();
  }, 2000);
}

// Theme Management
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// Check for saved theme preference or default to 'light'
const currentTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
  const newTheme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
  const icon = themeToggle.querySelector('i');
  if (icon) {
    icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
  }
}

// Mobile Menu Toggle
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.querySelector('.sidebar');

// Set initial menu state based on configuration
const menuDefaultOpen = window.docBuilderConfig?.features?.menuDefaultOpen !== false;
if (sidebar && window.innerWidth > 768) {
  if (!menuDefaultOpen) {
    sidebar.classList.add('closed');
    // Add class to body to show menu toggle on desktop when menu starts closed
    document.body.classList.add('menu-starts-closed');
  }
}

// Create overlay element for mobile
let overlay = document.querySelector('.sidebar-overlay');
if (!overlay && window.innerWidth <= 768) {
  overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  document.body.appendChild(overlay);
}

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      // Mobile: toggle 'open' class
      sidebar.classList.toggle('open');
    } else {
      // Desktop: toggle 'closed' class
      sidebar.classList.toggle('closed');
      // Update visibility of menu toggle based on sidebar state
      updateMenuToggleVisibility();
    }
    if (overlay) {
      overlay.classList.toggle('active');
    }
  });
}

// Function to update menu toggle visibility
function updateMenuToggleVisibility() {
  if (window.innerWidth > 768) {
    if (!menuDefaultOpen || sidebar.classList.contains('closed')) {
      document.body.classList.add('show-menu-toggle');
    } else {
      document.body.classList.remove('show-menu-toggle');
    }
  }
}

// Initial check
updateMenuToggleVisibility();

// Update on window resize
window.addEventListener('resize', updateMenuToggleVisibility);

// Close menu when clicking overlay
if (overlay) {
  overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
  });
}

// Floating Menu Button for Mobile
function initFloatingMenuButton() {
  // Only initialize on mobile
  if (window.innerWidth > 768) return;
  
  // Check if button already exists
  if (document.getElementById('floating-menu-toggle')) return;
  
  // Create floating button
  const floatingButton = document.createElement('button');
  floatingButton.id = 'floating-menu-toggle';
  floatingButton.className = 'floating-menu-toggle';
  floatingButton.setAttribute('aria-label', 'Toggle menu');
  floatingButton.innerHTML = '<i class="fas fa-bars"></i>';
  floatingButton.style.display = 'flex'; // Always visible on mobile
  floatingButton.classList.add('visible'); // Start visible
  
  // Add to body
  document.body.appendChild(floatingButton);
  
  // Toggle sidebar on click
  floatingButton.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    
    // Handle overlay
    let overlay = document.querySelector('.sidebar-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'sidebar-overlay';
      document.body.appendChild(overlay);
      
      // Add overlay click handler
      overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
        floatingButton.querySelector('i').className = 'fas fa-bars';
      });
    }
    
    if (overlay) {
      overlay.classList.toggle('active');
    }
    
    // Update icon based on state
    const icon = floatingButton.querySelector('i');
    if (sidebar.classList.contains('open')) {
      icon.className = 'fas fa-times';
    } else {
      icon.className = 'fas fa-bars';
    }
  });
  
  // Remove scroll-based visibility - button is always visible on mobile
  
  // Update icon when sidebar state changes from other sources
  const observer = new MutationObserver(() => {
    const icon = floatingButton.querySelector('i');
    if (sidebar.classList.contains('open')) {
      icon.className = 'fas fa-times';
    } else {
      icon.className = 'fas fa-bars';
    }
  });
  
  observer.observe(sidebar, {
    attributes: true,
    attributeFilter: ['class']
  });
}

// Initialize floating button on load and resize
document.addEventListener('DOMContentLoaded', initFloatingMenuButton);
window.addEventListener('resize', () => {
  const existingButton = document.getElementById('floating-menu-toggle');
  if (window.innerWidth > 768 && existingButton) {
    existingButton.remove();
  } else if (window.innerWidth <= 768 && !existingButton) {
    initFloatingMenuButton();
  }
});

// Prevent sidebar from closing when clicking nav items
// Only close when clicking outside the sidebar or the close button
document.addEventListener('click', (e) => {
  // Check if we're on mobile
  if (window.innerWidth <= 768) {
    const isClickInsideSidebar = sidebar && sidebar.contains(e.target);
    const isMenuToggle = e.target.closest('#menu-toggle');
    const isFloatingButton = e.target.closest('#floating-menu-toggle');
    const isNavItem = e.target.closest('.nav-item, .nav-title');
    const overlay = document.querySelector('.sidebar-overlay');
    
    // Close sidebar only if clicking outside AND not on menu toggle AND not on nav items
    if (!isClickInsideSidebar && !isMenuToggle && !isFloatingButton && !isNavItem && sidebar?.classList.contains('open')) {
      sidebar.classList.remove('open');
      if (overlay) {
        overlay.classList.remove('active');
      }
      // Update floating button icon if it exists
      const floatingBtn = document.getElementById('floating-menu-toggle');
      if (floatingBtn) {
        floatingBtn.querySelector('i').className = 'fas fa-bars';
      }
    }
  }
});

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const href = this.getAttribute('href');
    // Skip if href is just '#' (prevents querySelector error)
    if (href && href !== '#') {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
});

// Active Navigation Highlighting
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-item');

function highlightNavigation() {
  const scrollY = window.pageYOffset;

  sections.forEach(section => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 100;
    const sectionId = section.getAttribute('id');

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${sectionId}`) {
          item.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', highlightNavigation);

// Search Functionality (Basic Implementation)
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');

if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    
    if (query.length < 2) {
      searchResults.style.display = 'none';
      return;
    }
    
    // This would be replaced with actual search logic
    performSearch(query);
  });
  
  // Close search results when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-box')) {
      searchResults.style.display = 'none';
    }
  });
}

function performSearch(query) {
  // Placeholder for search functionality
  // In a real implementation, this would search through all content
  searchResults.innerHTML = `
    <div class="search-result-item">
      <strong>Search results for "${query}"</strong>
      <p>Search functionality will be implemented here...</p>
    </div>
  `;
  searchResults.style.display = 'block';
}

// Copy Code Blocks
document.querySelectorAll('pre').forEach(block => {
  const wrapper = document.createElement('div');
  wrapper.className = 'code-block-wrapper';
  block.parentNode.insertBefore(wrapper, block);
  wrapper.appendChild(block);
  
  const button = document.createElement('button');
  button.className = 'copy-button';
  button.textContent = 'Copy';
  wrapper.appendChild(button);
  
  button.addEventListener('click', () => {
    const code = block.textContent;
    navigator.clipboard.writeText(code).then(() => {
      button.textContent = 'Copied!';
      setTimeout(() => {
        button.textContent = 'Copy';
      }, 2000);
    });
  });
});

// Table of Contents Generation
function generateTableOfContents() {
  const toc = document.getElementById('table-of-contents');
  if (!toc) return;
  
  const headings = document.querySelectorAll('.content h2, .content h3');
  const tocList = document.createElement('ul');
  tocList.className = 'toc-list';
  
  headings.forEach(heading => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${heading.id}`;
    a.textContent = heading.textContent;
    a.className = heading.tagName.toLowerCase() === 'h3' ? 'toc-h3' : 'toc-h2';
    li.appendChild(a);
    tocList.appendChild(li);
  });
  
  toc.appendChild(tocList);
}

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
  // Cmd/Ctrl + K for search
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    searchInput?.focus();
  }
  
  // Escape to close mobile menu
  if (e.key === 'Escape') {
    sidebar?.classList.remove('open');
  }
});

// Fade-in Animation on Scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.feature-card, .timeline-item, .metric-card').forEach(el => {
  observer.observe(el);
});

// Sidebar Resizing
function initSidebarResize() {
  const sidebar = document.querySelector('.sidebar');
  const resizeHandle = document.querySelector('.resize-handle');
  const content = document.querySelector('.content');
  
  if (!sidebar || !resizeHandle || !content) return;
  
  let isResizing = false;
  let startX = 0;
  let startWidth = 0;
  
  // Restore saved width on load
  const savedWidth = localStorage.getItem('sidebarWidth');
  if (savedWidth && savedWidth >= 200 && savedWidth <= 500) {
    sidebar.style.width = `${savedWidth}px`;
    // Don't set margin-left - flexbox handles the layout
  }
  
  // Mouse down on resize handle
  resizeHandle.addEventListener('mousedown', (e) => {
    isResizing = true;
    startX = e.clientX;
    startWidth = parseInt(document.defaultView.getComputedStyle(sidebar).width, 10);
    
    // Add global event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Prevent text selection during resize
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';
    
    e.preventDefault();
  });
  
  function handleMouseMove(e) {
    if (!isResizing) return;
    
    const width = startWidth + e.clientX - startX;
    
    // Constrain width between 200px and 500px
    const constrainedWidth = Math.max(200, Math.min(500, width));
    
    sidebar.style.width = `${constrainedWidth}px`;
    // Don't set margin-left - flexbox handles the layout
    
    e.preventDefault();
  }
  
  function handleMouseUp() {
    if (!isResizing) return;
    
    isResizing = false;
    
    // Remove global event listeners
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    
    // Restore normal cursor and text selection
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
    
    // Save the current width
    const currentWidth = parseInt(document.defaultView.getComputedStyle(sidebar).width, 10);
    localStorage.setItem('sidebarWidth', currentWidth);
  }
  
  // Touch events for mobile support
  resizeHandle.addEventListener('touchstart', (e) => {
    isResizing = true;
    startX = e.touches[0].clientX;
    startWidth = parseInt(document.defaultView.getComputedStyle(sidebar).width, 10);
    
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
    
    e.preventDefault();
  });
  
  function handleTouchMove(e) {
    if (!isResizing) return;
    
    const width = startWidth + e.touches[0].clientX - startX;
    const constrainedWidth = Math.max(200, Math.min(500, width));
    
    sidebar.style.width = `${constrainedWidth}px`;
    // Don't set margin-left - flexbox handles the layout
    
    e.preventDefault();
  }
  
  function handleTouchEnd() {
    if (!isResizing) return;
    
    isResizing = false;
    
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
    
    // Save the current width
    const currentWidth = parseInt(document.defaultView.getComputedStyle(sidebar).width, 10);
    localStorage.setItem('sidebarWidth', currentWidth);
  }
}

// Collapsible Navigation
function initCollapsibleNavigation() {
  // Debug: Log initial state
  console.log('[Navigation] Initializing collapsible navigation');
  const allNavSections = document.querySelectorAll('.nav-section');
  console.log(`[Navigation] Found ${allNavSections.length} nav sections`);
  
  // First, ensure sections with active items are expanded on page load
  expandActiveNavSections();
  
  // Also run it again after a short delay to handle any timing issues
  setTimeout(() => {
    console.log('[Navigation] Running delayed expandActiveNavSections');
    expandActiveNavSections();
  }, 100);
  
  // Additional fallback: if no active items found, try to expand based on current URL
  setTimeout(() => {
    const activeItems = document.querySelectorAll('.nav-item.active');
    if (activeItems.length === 0) {
      console.log('[Navigation] No active items found, trying URL-based expansion');
      expandSectionByCurrentURL();
    }
  }, 200);
  
  const collapsibleTitles = document.querySelectorAll('.nav-title.collapsible');
  
  collapsibleTitles.forEach(title => {
    title.addEventListener('click', (e) => {
      // Prevent default link behavior for collapsible titles
      e.preventDefault();
      
      // Get the target content to toggle
      const targetId = title.getAttribute('data-target');
      const content = document.getElementById(targetId);
      
      if (content) {
        const isExpanded = title.classList.contains('expanded');
        
        if (isExpanded) {
          // Collapse this section
          title.classList.remove('expanded');
          content.classList.add('collapsed');
          
          // Also collapse all child sections within this content
          const childSections = content.querySelectorAll('.nav-title.collapsible');
          childSections.forEach(childTitle => {
            const childTargetId = childTitle.getAttribute('data-target');
            const childContent = document.getElementById(childTargetId);
            if (childContent) {
              childTitle.classList.remove('expanded');
              childContent.classList.add('collapsed');
            }
          });
        } else {
          // Expand this section
          title.classList.add('expanded');
          content.classList.remove('collapsed');
        }
      }
    });
  });
  
  // Prevent nav items from triggering collapse and maintain parent expansion
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      // Only stop propagation to prevent collapse, but allow normal link navigation
      e.stopPropagation(); // Prevent event from bubbling up to the nav-title
      
      // Ensure ALL parent sections stay expanded when navigating within them
      let currentElement = item;
      while (currentElement) {
        const parentContent = currentElement.closest('.nav-content');
        if (!parentContent) break;
        
        const parentTitle = parentContent.parentElement?.querySelector('.nav-title.collapsible');
        
        if (parentTitle && parentContent) {
          parentTitle.classList.add('expanded');
          parentContent.classList.remove('collapsed');
        }
        
        // Move up to check for nested sections
        currentElement = parentContent.parentElement;
      }
      
      // Allow normal link navigation - no preventDefault or manual navigation needed
    });
  });
}

// Expand navigation section based on current URL
function expandSectionByCurrentURL() {
  try {
    const currentPath = window.location.pathname;
    console.log('[Navigation] Current path:', currentPath);
    
    // Find all nav items and check if any match the current URL
    const navItems = document.querySelectorAll('.nav-item');
    let foundMatch = false;
    
    navItems.forEach(item => {
      const href = item.getAttribute('href');
      if (href) {
        // Normalize paths for comparison
        const itemPath = new URL(href, window.location.href).pathname;
        if (itemPath === currentPath) {
          console.log('[Navigation] Found matching nav item by URL:', item.textContent.trim());
          item.classList.add('active');
          foundMatch = true;
          
          // Expand parent sections
          let currentElement = item;
          while (currentElement && currentElement !== document.body) {
            if (currentElement.classList && currentElement.classList.contains('nav-content')) {
              const parentSection = currentElement.closest('.nav-section');
              if (parentSection) {
                const parentTitle = parentSection.querySelector('.nav-title.collapsible');
                if (parentTitle && currentElement.classList.contains('collapsed')) {
                  parentTitle.classList.add('expanded');
                  currentElement.classList.remove('collapsed');
                  console.log('[Navigation] Expanded section by URL:', parentTitle.textContent.trim());
                }
              }
            }
            currentElement = currentElement.parentElement;
          }
        }
      }
    });
    
    if (!foundMatch) {
      console.warn('[Navigation] No matching nav item found for current URL');
    }
  } catch (error) {
    console.error('[Navigation] Error in expandSectionByCurrentURL:', error);
  }
}

// Ensure sections containing active nav items stay expanded
function expandActiveNavSections() {
  try {
    const activeNavItems = document.querySelectorAll('.nav-item.active');
    
    console.log(`[Navigation] Found ${activeNavItems.length} active nav items`);
    
    if (activeNavItems.length === 0) {
      console.warn('[Navigation] No active navigation items found!');
      return;
    }
    
    activeNavItems.forEach(activeItem => {
      console.log(`[Navigation] Expanding sections for: ${activeItem.textContent.trim()}`);
      
      // Start from the active item and work up the DOM tree
      let currentElement = activeItem;
      let sectionsExpanded = 0;
      
      while (currentElement && currentElement !== document.body) {
        // Check if we're inside a nav-content element
        if (currentElement.classList && currentElement.classList.contains('nav-content')) {
          console.log('[Navigation] Found nav-content element with id:', currentElement.id);
          
          // Find the corresponding nav-title in the parent nav-section
          const parentSection = currentElement.closest('.nav-section');
          if (parentSection) {
            const parentTitle = parentSection.querySelector('.nav-title.collapsible');
            
            if (parentTitle && currentElement.classList.contains('collapsed')) {
              // Expand this section
              parentTitle.classList.add('expanded');
              currentElement.classList.remove('collapsed');
              sectionsExpanded++;
              console.log(`[Navigation] Expanded section: ${parentTitle.textContent.trim()}`);
            } else if (parentTitle && !currentElement.classList.contains('collapsed')) {
              console.log(`[Navigation] Section already expanded: ${parentTitle.textContent.trim()}`);
            }
          }
        }
        
        // Move up to the parent element
        currentElement = currentElement.parentElement;
      }
      
      if (sectionsExpanded === 0) {
        console.warn('[Navigation] No sections were expanded for active item:', activeItem.textContent.trim());
      } else {
        console.log(`[Navigation] Successfully expanded ${sectionsExpanded} sections`);
      }
    });
  } catch (error) {
    console.error('[Navigation] Error in expandActiveNavSections:', error);
  }
}

// Navigation Filter
function initNavigationFilter() {
  const filterInput = document.getElementById('nav-filter');
  if (!filterInput) return;
  
  filterInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const navItems = document.querySelectorAll('.nav-item');
    const navSections = document.querySelectorAll('.nav-section');
    
    if (query === '') {
      // Show all items and restore original state
      navItems.forEach(item => {
        item.style.display = 'flex';
      });
      navSections.forEach(section => {
        section.style.display = 'block';
      });
    } else {
      // Filter items
      navItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        const shouldShow = text.includes(query);
        item.style.display = shouldShow ? 'flex' : 'none';
      });
      
      // Show/hide sections based on whether they have visible items
      navSections.forEach(section => {
        const visibleItems = section.querySelectorAll('.nav-item[style*="flex"]');
        const hasVisibleItems = Array.from(section.querySelectorAll('.nav-item')).some(item => 
          item.style.display !== 'none'
        );
        section.style.display = hasVisibleItems ? 'block' : 'none';
        
        // Expand sections with matches
        if (hasVisibleItems && query !== '') {
          const navContent = section.querySelector('.nav-content');
          const navTitle = section.querySelector('.nav-title.collapsible');
          if (navContent && navTitle) {
            navContent.classList.remove('collapsed');
            navTitle.classList.add('expanded');
          }
        }
      });
    }
  });
}

// PDF Export functionality
function exportToPDF() {
  // Hide UI elements for printing
  const elementsToHide = [
    '.sidebar',
    '.header',
    '.preview-banner',
    '.resize-handle',
    '.copy-button'
  ];
  
  elementsToHide.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => el.style.display = 'none');
  });
  
  // Adjust content for printing
  const content = document.querySelector('.content');
  const mainWrapper = document.querySelector('.main-wrapper');
  
  if (content) {
    content.style.padding = '20px';
    content.style.maxWidth = 'none';
  }
  
  if (mainWrapper) {
    mainWrapper.style.paddingTop = '0';
  }
  
  // Add print-specific styles
  const printStyles = document.createElement('style');
  printStyles.id = 'print-styles';
  printStyles.textContent = `
    @media print {
      body { 
        font-size: 12pt;
        line-height: 1.4;
        color: black !important;
      }
      .content {
        margin: 0 !important;
        padding: 0 !important;
        max-width: none !important;
      }
      .main-wrapper {
        padding-top: 0 !important;
      }
      h1, h2, h3, h4, h5, h6 {
        color: black !important;
        page-break-after: avoid;
      }
      .hero {
        background: none !important;
        color: black !important;
        padding: 20px 0 !important;
        margin: 0 !important;
      }
      .hero h1 {
        color: black !important;
        text-shadow: none !important;
        font-size: 24pt !important;
      }
      .hero-subtitle {
        color: black !important;
        text-shadow: none !important;
      }
      .feature-grid, .metrics-grid {
        display: block !important;
      }
      .feature-card, .metric-card {
        break-inside: avoid;
        margin-bottom: 10px;
        border: 1px solid #ccc;
        padding: 10px;
      }
      .mermaid {
        break-inside: avoid;
        background: white !important;
        border: 1px solid #ccc;
      }
      pre, code {
        background: #f5f5f5 !important;
        border: 1px solid #ddd;
        font-size: 10pt;
      }
      table {
        break-inside: avoid;
      }
      .timeline {
        display: block !important;
      }
      .timeline-item {
        break-inside: avoid;
        margin-bottom: 15px;
        padding-left: 0 !important;
      }
      .timeline::before {
        display: none;
      }
      .timeline-item::before {
        display: none;
      }
      a {
        color: black !important;
        text-decoration: underline;
      }
      .gradient-text {
        color: black !important;
        background: none !important;
        -webkit-text-fill-color: black !important;
      }
    }
  `;
  document.head.appendChild(printStyles);
  
  // Trigger print dialog
  setTimeout(() => {
    window.print();
    
    // Restore UI after print dialog
    setTimeout(() => {
      // Remove print styles
      const printStylesEl = document.getElementById('print-styles');
      if (printStylesEl) {
        printStylesEl.remove();
      }
      
      // Restore hidden elements
      elementsToHide.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => el.style.display = '');
      });
      
      // Restore content styles
      if (content) {
        content.style.padding = '';
        content.style.maxWidth = '';
      }
      
      if (mainWrapper) {
        mainWrapper.style.paddingTop = '';
      }
    }, 500);
  }, 100);
}

// Add PDF export button functionality
function addPDFExportButton() {
  // Check configuration - default to true if not set
  const showPdfDownload = window.docBuilderConfig?.features?.showPdfDownload !== false;
  if (!showPdfDownload) return;
  
  const headerActions = document.querySelector('.header-actions');
  if (headerActions) {
    const pdfButton = document.createElement('button');
    pdfButton.innerHTML = '<i class="fas fa-file-pdf"></i>';
    pdfButton.className = 'theme-toggle';
    pdfButton.title = 'Export to PDF';
    pdfButton.setAttribute('aria-label', 'Export to PDF');
    pdfButton.addEventListener('click', exportToPDF);
    
    // Insert before theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    headerActions.insertBefore(pdfButton, themeToggle);
  }
}

// Breadcrumb Generation
function generateBreadcrumbs() {
  const breadcrumbContainer = document.getElementById('breadcrumbs');
  if (!breadcrumbContainer) return;
  
  // Decode the URL to handle special characters and spaces
  const currentPath = decodeURIComponent(window.location.pathname);
  let pathSegments = currentPath.split('/').filter(segment => segment !== '');
  
  // Find the index of 'html' directory and slice from there
  const htmlIndex = pathSegments.findIndex(segment => segment === 'html');
  if (htmlIndex !== -1) {
    // Remove everything before and including 'html'
    pathSegments = pathSegments.slice(htmlIndex + 1);
  }
  
  // Remove .html extension from the last segment
  if (pathSegments.length > 0) {
    const lastSegment = pathSegments[pathSegments.length - 1];
    if (lastSegment.endsWith('.html')) {
      pathSegments[pathSegments.length - 1] = lastSegment.slice(0, -5);
    }
  }
  
  const breadcrumbs = [];
  
  // Calculate relative path to root for proper navigation
  const depth = pathSegments.length;
  const relativeRoot = depth > 0 ? '../'.repeat(depth) : './';
  
  // Always start with Home (relative to current page)
  breadcrumbs.push({
    text: 'Home',
    href: relativeRoot + 'index.html',
    icon: 'fas fa-home'
  });
  
  // Build breadcrumb path
  let currentUrl = '';
  pathSegments.forEach((segment, index) => {
    currentUrl += '/' + segment;
    
    // Calculate relative path for this breadcrumb level
    const remainingDepth = pathSegments.length - index - 1;
    const relativePath = remainingDepth > 0 ? '../'.repeat(remainingDepth) : './';
    
    // For the last segment, don't add .html back if it's not index
    const href = index === pathSegments.length - 1 && segment !== 'index' 
      ? '#' // Current page, no navigation needed
      : relativePath + segment + '.html';
    
    // Prettify segment names
    const text = segment
      .replace(/[-_]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
      .replace(/\b(Api|Html|Css|Js|Pdf|Qa|Ai)\b/g, (match) => match.toUpperCase())
      .replace(/\bReadme\b/g, 'Overview');
    
    // Get appropriate icon based on segment
    let icon = 'fas fa-folder';
    if (segment.includes('bubble')) icon = 'fas fa-circle';
    else if (segment.includes('system')) icon = 'fas fa-sitemap';
    else if (segment.includes('middleware')) icon = 'fas fa-layer-group';
    else if (segment.includes('quickbase')) icon = 'fas fa-database';
    else if (segment.includes('product-roadmap')) icon = 'fas fa-road';
    else if (segment.includes('team')) icon = 'fas fa-users';
    else if (segment.includes('testing')) icon = 'fas fa-vial';
    else if (segment.includes('paths')) icon = 'fas fa-route';
    else if (segment.includes('diagrams')) icon = 'fas fa-project-diagram';
    else if (segment.includes('technical')) icon = 'fas fa-cogs';
    else if (segment.includes('application')) icon = 'fas fa-desktop';
    else if (index === pathSegments.length - 1) icon = 'fas fa-file-alt';
    
    breadcrumbs.push({
      text,
      href,
      icon,
      isLast: index === pathSegments.length - 1
    });
  });
  
  // Generate breadcrumb HTML
  const breadcrumbHTML = breadcrumbs.map((crumb, index) => {
    if (crumb.isLast) {
      return `<span class="breadcrumb-item current">
        <i class="${crumb.icon}"></i>
        <span>${crumb.text}</span>
      </span>`;
    } else {
      return `<a href="${crumb.href}" class="breadcrumb-item">
        <i class="${crumb.icon}"></i>
        <span>${crumb.text}</span>
      </a>`;
    }
  }).join('<i class="fas fa-chevron-right breadcrumb-separator"></i>');
  
  breadcrumbContainer.innerHTML = breadcrumbHTML;
}

// Initialize tooltip positioning for navigation items
function initTooltips() {
  const tooltipElements = document.querySelectorAll('[data-tooltip]');
  
  tooltipElements.forEach(element => {
    element.addEventListener('mouseenter', function(e) {
      const rect = element.getBoundingClientRect();
      const tooltip = window.getComputedStyle(element, '::after');
      
      // Position the tooltip using CSS variables
      element.style.setProperty('--tooltip-left', `${rect.right + 10}px`);
      element.style.setProperty('--tooltip-top', `${rect.top + rect.height / 2}px`);
    });
  });
}

// Handle .md link redirects
function initMarkdownLinkRedirects() {
  // Check if current URL ends with .md and redirect
  if (window.location.pathname.endsWith('.md')) {
    const htmlPath = window.location.pathname.replace(/\.md$/, '.html');
    console.log(`Redirecting from .md to .html: ${htmlPath}`);
    window.location.replace(htmlPath);
    return; // Stop execution as we're redirecting
  }
  
  // Intercept clicks on .md links
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (link && link.href && link.href.endsWith('.md')) {
      e.preventDefault();
      const htmlUrl = link.href.replace(/\.md$/, '.html');
      console.log(`Converting .md link to .html: ${htmlUrl}`);
      window.location.href = htmlUrl;
    }
  });
}

// Image Modal System
function initImageModal() {
  // Create modal HTML structure
  const modalHTML = `
    <div class="image-modal" id="imageModal">
      <div class="image-modal-content">
        <div class="image-modal-close" id="imageModalClose">&times;</div>
        <img class="image-modal-img" id="imageModalImg" src="" alt="">
        <div class="image-modal-caption" id="imageModalCaption"></div>
      </div>
    </div>
  `;
  
  // Add modal to document body
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('imageModalImg');
  const modalCaption = document.getElementById('imageModalCaption');
  const closeBtn = document.getElementById('imageModalClose');
  
  // Add click handlers to all content images
  const contentImages = document.querySelectorAll('.content img');
  contentImages.forEach(img => {
    img.addEventListener('click', function() {
      modal.classList.add('active');
      modalImg.src = this.src;
      modalImg.alt = this.alt;
      modalCaption.textContent = this.alt;
      
      // Hide caption if no alt text
      if (!this.alt) {
        modalCaption.style.display = 'none';
      } else {
        modalCaption.style.display = 'block';
      }
      
      // Prevent body scrolling
      document.body.style.overflow = 'hidden';
    });
  });
  
  // Close modal functions
  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  // Close on X button click
  closeBtn.addEventListener('click', closeModal);
  
  // Close on overlay click (but not on image click)
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeModal();
    }
  });
  
  // Close on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
  
  // Prevent modal content from closing modal when clicked
  modalImg.addEventListener('click', function(e) {
    e.stopPropagation();
  });
  
  document.querySelector('.image-modal-content').addEventListener('click', function(e) {
    e.stopPropagation();
  });
}

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', () => {
  initMarkdownLinkRedirects();
  highlightNavigation();
  generateTableOfContents();
  initSidebarResize();
  initCollapsibleNavigation();
  initNavigationFilter();
  addPDFExportButton();
  generateBreadcrumbs();
  initImageModal();
  initTooltips();
});