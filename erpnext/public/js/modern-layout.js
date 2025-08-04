/**
 * Enhanced main layout template for ERPNext with modern UI
 * This template integrates the modern sidebar, header, and main content area
 */

// Enhanced layout configuration for Frappe Framework
const modernLayoutConfig = {
    enable_sidebar: true,
    enable_modern_header: true,
    enable_breadcrumbs: true,
    enable_dark_mode: true,
    responsive_breakpoints: {
        mobile: 768,
        tablet: 1024,
        desktop: 1200
    }
};

// Override default Frappe layout
frappe.provide('frappe.ui');

frappe.ui.ModernLayout = class ModernLayout extends frappe.ui.Page {
    constructor(opts) {
        super(opts);
        this.init_modern_layout();
    }

    init_modern_layout() {
        // Initialize modern components
        this.setup_modern_header();
        this.setup_modern_sidebar();
        this.setup_breadcrumbs();
        this.setup_theme_toggle();
        this.setup_responsive_handlers();
    }

    setup_modern_header() {
        if (!modernLayoutConfig.enable_modern_header) return;

        // Create modern header for mobile
        const header = $(`
            <div class="modern-header">
                <div class="header-left">
                    <button class="mobile-menu-btn" id="mobile-menu-toggle">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 12h18M3 6h18M3 18h18"/>
                        </svg>
                    </button>
                    <a href="/app/home" class="header-logo">
                        <img src="/assets/erpnext/images/erpnext-logo.svg" alt="ERPNext">
                        <span class="logo-text">ERPNext</span>
                    </a>
                </div>
                <div class="header-center">
                    <div class="global-search">
                        <input type="text" class="search-input" placeholder="Search anything...">
                        <div class="search-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                            </svg>
                        </div>
                    </div>
                </div>
                <div class="header-right">
                    <button class="header-action" id="notifications-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                        </svg>
                        <span class="notification-badge">3</span>
                    </button>
                    <div class="user-menu">
                        <div class="user-avatar" id="user-menu-toggle">A</div>
                        <div class="user-dropdown" id="user-dropdown">
                            <div class="dropdown-header">
                                <div class="user-name">Administrator</div>
                                <div class="user-email">admin@example.com</div>
                            </div>
                            <div class="dropdown-menu">
                                <a href="/app/user/Administrator" class="dropdown-item">
                                    <div class="item-icon">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                        </svg>
                                    </div>
                                    Profile
                                </a>
                                <a href="/app/system-settings" class="dropdown-item">
                                    <div class="item-icon">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.82,11.69,4.82,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
                                        </svg>
                                    </div>
                                    Settings
                                </a>
                                <a href="/api/method/logout" class="dropdown-item">
                                    <div class="item-icon">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                                        </svg>
                                    </div>
                                    Logout
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `);

        $('body').prepend(header);
        this.bind_header_events();
    }

    setup_modern_sidebar() {
        if (!modernLayoutConfig.enable_sidebar) return;

        // Load sidebar template
        const sidebarHtml = this.get_sidebar_html();
        const sidebar = $(sidebarHtml);
        
        $('body').prepend(sidebar);
        
        // Initialize sidebar JavaScript
        if (window.ModernSidebar) {
            this.sidebar = new ModernSidebar(sidebar[0]);
        }
    }

    get_sidebar_html() {
        // This would normally load from the template file
        return `
            <div class="modern-sidebar">
                <div class="sidebar-header">
                    <a href="/app/home" class="logo">
                        <img src="/assets/erpnext/images/erpnext-logo.svg" alt="ERPNext">
                        <span class="logo-text">ERPNext</span>
                    </a>
                    <button class="collapse-btn" title="Toggle Sidebar">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 12h18M3 6h18M3 18h18"/>
                        </svg>
                    </button>
                </div>
                <div class="sidebar-nav">
                    ${this.get_navigation_html()}
                </div>
                <div class="sidebar-footer">
                    <div class="user-info">
                        <div class="user-avatar">A</div>
                        <div class="user-details">
                            <div class="user-name">${frappe.session.user_fullname || 'User'}</div>
                            <div class="user-role">${frappe.user_roles ? frappe.user_roles[0] : 'User'}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    get_navigation_html() {
        // Build navigation based on user permissions and modules
        const modules = this.get_user_modules();
        let navHtml = '';

        // Dashboard
        navHtml += `
            <div class="nav-section">
                <div class="section-title">Overview</div>
                <div class="nav-item">
                    <a href="/app/home" class="nav-link ${window.location.pathname === '/app/home' ? 'active' : ''}">
                        <div class="nav-icon">📊</div>
                        <span class="nav-text">Dashboard</span>
                    </a>
                </div>
            </div>
        `;

        // Modules
        navHtml += '<div class="nav-section"><div class="section-title">Modules</div>';
        
        modules.forEach(module => {
            navHtml += this.get_module_nav_html(module);
        });
        
        navHtml += '</div>';

        return navHtml;
    }

    get_module_nav_html(module) {
        const hasSubmenus = module.links && module.links.length > 0;
        
        return `
            <div class="nav-item ${hasSubmenus ? 'has-submenu' : ''}">
                <a href="${hasSubmenus ? '#' : module.route}" class="nav-link">
                    <div class="nav-icon">${module.icon}</div>
                    <span class="nav-text">${module.label}</span>
                    ${hasSubmenus ? '<div class="nav-arrow">→</div>' : ''}
                </a>
                ${hasSubmenus ? this.get_submenu_html(module.links) : ''}
            </div>
        `;
    }

    get_submenu_html(links) {
        let submenuHtml = '<div class="submenu">';
        
        links.forEach(link => {
            submenuHtml += `
                <div class="nav-item">
                    <a href="${link.route}" class="nav-link">
                        <span class="nav-text">${link.label}</span>
                    </a>
                </div>
            `;
        });
        
        submenuHtml += '</div>';
        return submenuHtml;
    }

    get_user_modules() {
        // Get modules based on user permissions
        const defaultModules = [
            {
                label: 'Accounting',
                icon: '💰',
                route: '/app/accounts',
                links: [
                    { label: 'Sales Invoice', route: '/app/sales-invoice' },
                    { label: 'Purchase Invoice', route: '/app/purchase-invoice' },
                    { label: 'Payment Entry', route: '/app/payment-entry' },
                    { label: 'Journal Entry', route: '/app/journal-entry' }
                ]
            },
            {
                label: 'CRM',
                icon: '🤝',
                route: '/app/crm',
                links: [
                    { label: 'Leads', route: '/app/lead' },
                    { label: 'Opportunities', route: '/app/opportunity' },
                    { label: 'Customers', route: '/app/customer' },
                    { label: 'Contacts', route: '/app/contact' }
                ]
            },
            {
                label: 'Sales',
                icon: '🛒',
                route: '/app/selling',
                links: [
                    { label: 'Quotations', route: '/app/quotation' },
                    { label: 'Sales Orders', route: '/app/sales-order' },
                    { label: 'Delivery Notes', route: '/app/delivery-note' }
                ]
            },
            {
                label: 'Stock',
                icon: '📦',
                route: '/app/stock',
                links: [
                    { label: 'Items', route: '/app/item' },
                    { label: 'Warehouses', route: '/app/warehouse' },
                    { label: 'Stock Entries', route: '/app/stock-entry' }
                ]
            }
        ];

        return defaultModules;
    }

    setup_breadcrumbs() {
        if (!modernLayoutConfig.enable_breadcrumbs) return;

        const breadcrumb = $(`
            <div class="breadcrumb-nav">
                <ol class="breadcrumb" id="modern-breadcrumb">
                    <li class="breadcrumb-item"><a href="/app/home">Home</a></li>
                </ol>
            </div>
        `);

        // Insert after header or at top of content
        if ($('.modern-header').length) {
            $('.modern-header').after(breadcrumb);
        } else {
            $('body').prepend(breadcrumb);
        }

        this.update_breadcrumbs();
    }

    update_breadcrumbs() {
        const path = window.location.pathname;
        const breadcrumbContainer = $('#modern-breadcrumb');
        
        if (!breadcrumbContainer.length) return;

        // Clear existing breadcrumbs except home
        breadcrumbContainer.find('.breadcrumb-item:not(:first)').remove();

        // Build breadcrumbs based on current path
        const pathParts = path.split('/').filter(part => part && part !== 'app');
        
        pathParts.forEach((part, index) => {
            const isLast = index === pathParts.length - 1;
            const href = '/app/' + pathParts.slice(0, index + 1).join('/');
            const label = this.format_breadcrumb_label(part);
            
            const breadcrumbItem = $(`
                <li class="breadcrumb-item ${isLast ? 'active' : ''}">
                    ${isLast ? label : `<a href="${href}">${label}</a>`}
                </li>
            `);
            
            breadcrumbContainer.append(breadcrumbItem);
        });
    }

    format_breadcrumb_label(part) {
        return part.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    setup_theme_toggle() {
        if (!modernLayoutConfig.enable_dark_mode) return;

        const themeToggle = $(`
            <button class="theme-toggle" id="theme-toggle" title="Toggle Dark Mode">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/>
                </svg>
            </button>
        `);

        $('.header-right').prepend(themeToggle);
        this.bind_theme_toggle();
    }

    bind_header_events() {
        // Mobile menu toggle
        $('#mobile-menu-toggle').on('click', () => {
            $('.modern-sidebar').toggleClass('mobile-open');
            $('.sidebar-overlay').toggleClass('active');
        });

        // User menu toggle
        $('#user-menu-toggle').on('click', (e) => {
            e.stopPropagation();
            $('#user-dropdown').toggleClass('active');
        });

        // Close user menu when clicking outside
        $(document).on('click', (e) => {
            if (!$(e.target).closest('.user-menu').length) {
                $('#user-dropdown').removeClass('active');
            }
        });

        // Global search
        $('.search-input').on('input', frappe.utils.debounce((e) => {
            this.handle_global_search(e.target.value);
        }, 300));
    }

    bind_theme_toggle() {
        $('#theme-toggle').on('click', () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
            localStorage.setItem('theme', isDark ? 'light' : 'dark');
        });

        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        }
    }

    handle_global_search(query) {
        if (!query || query.length < 2) return;

        // Implement global search functionality
        frappe.call({
            method: 'frappe.desk.search.search_widget',
            args: { query: query },
            callback: (r) => {
                this.show_search_results(r.message || []);
            }
        });
    }

    show_search_results(results) {
        // Create and show search results dropdown
        const searchResults = $(`
            <div class="search-results">
                ${results.map(result => `
                    <a href="${result.route}" class="search-result-item">
                        <div class="result-title">${result.title}</div>
                        <div class="result-type">${result.type}</div>
                    </a>
                `).join('')}
            </div>
        `);

        $('.global-search').append(searchResults);
    }

    setup_responsive_handlers() {
        const breakpoints = modernLayoutConfig.responsive_breakpoints;
        
        // Handle window resize
        $(window).on('resize', frappe.utils.debounce(() => {
            const width = $(window).width();
            
            if (width <= breakpoints.mobile) {
                this.switch_to_mobile_layout();
            } else if (width <= breakpoints.tablet) {
                this.switch_to_tablet_layout();
            } else {
                this.switch_to_desktop_layout();
            }
        }, 200));

        // Initial layout setup
        this.setup_responsive_handlers();
    }

    switch_to_mobile_layout() {
        $('body').addClass('mobile-layout').removeClass('tablet-layout desktop-layout');
        $('.modern-sidebar').removeClass('mobile-open');
    }

    switch_to_tablet_layout() {
        $('body').addClass('tablet-layout').removeClass('mobile-layout desktop-layout');
    }

    switch_to_desktop_layout() {
        $('body').addClass('desktop-layout').removeClass('mobile-layout tablet-layout');
    }

    // Public API
    refresh_navigation() {
        const navContainer = $('.sidebar-nav');
        navContainer.html(this.get_navigation_html());
        
        if (this.sidebar) {
            this.sidebar.handleActiveStates();
        }
    }

    set_active_module(module) {
        $('.nav-link').removeClass('active');
        $(`.nav-link[href*="${module}"]`).addClass('active');
    }

    update_user_info(user) {
        $('.user-name').text(user.full_name || user.name);
        $('.user-email').text(user.email);
        $('.user-avatar').text((user.full_name || user.name).charAt(0).toUpperCase());
    }
};

// Initialize modern layout when Frappe is ready
frappe.ready(() => {
    if (frappe.session && frappe.session.user !== 'Guest') {
        window.modernLayout = new frappe.ui.ModernLayout();
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = frappe.ui.ModernLayout;
}