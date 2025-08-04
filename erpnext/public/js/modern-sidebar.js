/**
 * Modern Sidebar Component
 * Handles sidebar navigation, collapsing, and mobile responsiveness
 */

class ModernSidebar {
    constructor(element) {
        this.element = element;
        this.isCollapsed = false;
        this.isMobile = window.innerWidth <= 768;
        this.mobileOpen = false;
        
        this.init();
        this.bindEvents();
        this.createTooltips();
    }

    init() {
        // Add necessary classes and structure
        this.element.classList.add('modern-sidebar');
        
        // Create mobile overlay
        if (this.isMobile) {
            this.createMobileOverlay();
        }
        
        // Set initial state
        this.updateSidebar();
    }

    bindEvents() {
        // Collapse button
        const collapseBtn = this.element.querySelector('.collapse-btn');
        if (collapseBtn) {
            collapseBtn.addEventListener('click', () => this.toggle());
        }

        // Navigation items with submenus
        const navItems = this.element.querySelectorAll('.nav-item.has-submenu');
        navItems.forEach(item => {
            const link = item.querySelector('.nav-link');
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleSubmenu(item);
            });
        });

        // Window resize handler
        window.addEventListener('resize', () => {
            const wasMobile = this.isMobile;
            this.isMobile = window.innerWidth <= 768;
            
            if (wasMobile !== this.isMobile) {
                this.handleMobileChange();
            }
        });

        // Mobile overlay click
        const overlay = document.querySelector('.sidebar-overlay');
        if (overlay) {
            overlay.addEventListener('click', () => this.closeMobile());
        }

        // ESC key to close mobile sidebar
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMobile && this.mobileOpen) {
                this.closeMobile();
            }
        });

        // Handle active states
        this.handleActiveStates();
    }

    toggle() {
        if (this.isMobile) {
            this.toggleMobile();
        } else {
            this.toggleCollapse();
        }
    }

    toggleCollapse() {
        this.isCollapsed = !this.isCollapsed;
        this.updateSidebar();
        this.saveState();
        this.adjustMainContent();
    }

    toggleMobile() {
        this.mobileOpen = !this.mobileOpen;
        this.updateMobileSidebar();
    }

    closeMobile() {
        this.mobileOpen = false;
        this.updateMobileSidebar();
    }

    updateSidebar() {
        if (this.isCollapsed) {
            this.element.classList.add('collapsed');
            document.body.classList.add('sidebar-collapsed');
        } else {
            this.element.classList.remove('collapsed');
            document.body.classList.remove('sidebar-collapsed');
        }

        // Update tooltips visibility
        this.updateTooltips();
    }

    updateMobileSidebar() {
        if (this.mobileOpen) {
            this.element.classList.add('mobile-open');
            document.querySelector('.sidebar-overlay')?.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            this.element.classList.remove('mobile-open');
            document.querySelector('.sidebar-overlay')?.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    toggleSubmenu(item) {
        const submenu = item.querySelector('.submenu');
        const link = item.querySelector('.nav-link');
        const isExpanded = link.classList.contains('expanded');

        if (isExpanded) {
            link.classList.remove('expanded');
            submenu.classList.remove('expanded');
        } else {
            // Close other submenus
            this.element.querySelectorAll('.nav-link.expanded').forEach(expandedLink => {
                if (expandedLink !== link) {
                    expandedLink.classList.remove('expanded');
                    expandedLink.closest('.nav-item').querySelector('.submenu')?.classList.remove('expanded');
                }
            });

            link.classList.add('expanded');
            submenu.classList.add('expanded');
        }
    }

    createMobileOverlay() {
        if (!document.querySelector('.sidebar-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay';
            document.body.appendChild(overlay);
        }
    }

    handleMobileChange() {
        if (this.isMobile) {
            this.createMobileOverlay();
            this.closeMobile();
        } else {
            this.mobileOpen = false;
            this.updateSidebar();
            this.adjustMainContent();
        }
    }

    createTooltips() {
        const navItems = this.element.querySelectorAll('.nav-item:not(.has-submenu)');
        navItems.forEach(item => {
            const link = item.querySelector('.nav-link');
            const text = link.querySelector('.nav-text')?.textContent;
            
            if (text) {
                const tooltip = document.createElement('div');
                tooltip.className = 'sidebar-tooltip';
                tooltip.textContent = text;
                item.appendChild(tooltip);
            }
        });
    }

    updateTooltips() {
        const tooltips = this.element.querySelectorAll('.sidebar-tooltip');
        tooltips.forEach(tooltip => {
            tooltip.style.display = (this.isCollapsed && !this.isMobile) ? 'block' : 'none';
        });
    }

    handleActiveStates() {
        // Get current route and set active navigation item
        const currentPath = window.location.pathname;
        const navLinks = this.element.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && currentPath.includes(href)) {
                link.classList.add('active');
                
                // Expand parent submenu if needed
                const parentItem = link.closest('.submenu')?.closest('.nav-item');
                if (parentItem) {
                    const parentLink = parentItem.querySelector('.nav-link');
                    const submenu = parentItem.querySelector('.submenu');
                    parentLink.classList.add('expanded');
                    submenu.classList.add('expanded');
                }
            }
        });
    }

    adjustMainContent() {
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            if (this.isMobile) {
                mainContent.style.marginLeft = '0';
            } else {
                mainContent.style.marginLeft = this.isCollapsed ? 
                    'var(--sidebar-width-collapsed)' : 
                    'var(--sidebar-width)';
            }
        }
    }

    saveState() {
        localStorage.setItem('sidebar-collapsed', this.isCollapsed.toString());
    }

    loadState() {
        const saved = localStorage.getItem('sidebar-collapsed');
        if (saved !== null) {
            this.isCollapsed = saved === 'true';
            this.updateSidebar();
            this.adjustMainContent();
        }
    }

    // Public API methods
    expand() {
        if (this.isCollapsed) {
            this.toggleCollapse();
        }
    }

    collapse() {
        if (!this.isCollapsed) {
            this.toggleCollapse();
        }
    }

    setActiveItem(href) {
        const navLinks = this.element.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === href) {
                link.classList.add('active');
            }
        });
    }

    addMenuItem(sectionSelector, itemData) {
        const section = this.element.querySelector(sectionSelector);
        if (section) {
            const navItem = this.createNavItem(itemData);
            section.appendChild(navItem);
        }
    }

    createNavItem(data) {
        const navItem = document.createElement('div');
        navItem.className = 'nav-item';
        
        if (data.submenu) {
            navItem.classList.add('has-submenu');
        }

        navItem.innerHTML = `
            <a href="${data.href || '#'}" class="nav-link">
                <div class="nav-icon">
                    ${data.icon || '<svg>...</svg>'}
                </div>
                <span class="nav-text">${data.text}</span>
                ${data.badge ? `<span class="nav-badge">${data.badge}</span>` : ''}
                ${data.submenu ? '<div class="nav-arrow"><svg>...</svg></div>' : ''}
            </a>
            ${data.submenu ? this.createSubmenu(data.submenu) : ''}
        `;

        return navItem;
    }

    createSubmenu(items) {
        const submenu = document.createElement('div');
        submenu.className = 'submenu';
        
        items.forEach(item => {
            const subItem = this.createNavItem(item);
            submenu.appendChild(subItem);
        });

        return submenu.outerHTML;
    }
}

// Auto-initialize sidebar when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.modern-sidebar, .sidebar');
    if (sidebar) {
        window.modernSidebar = new ModernSidebar(sidebar);
        window.modernSidebar.loadState();
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModernSidebar;
}