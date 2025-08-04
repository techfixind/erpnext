/**
 * Modern Dashboard Component
 * Handles dashboard widgets, metrics, and layout management
 */

class ModernDashboard {
    constructor(container) {
        this.container = container;
        this.widgets = new Map();
        this.refreshInterval = null;
        this.isLoading = false;
        
        this.init();
    }

    init() {
        this.container.classList.add('modern-dashboard');
        this.bindEvents();
        this.initializeWidgets();
        this.setupAutoRefresh();
    }

    bindEvents() {
        // Refresh button
        const refreshBtn = this.container.querySelector('.list-refresh, .dashboard-refresh');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refresh());
        }

        // Widget actions
        this.container.addEventListener('click', (e) => {
            if (e.target.closest('.widget-refresh')) {
                const widget = e.target.closest('.widget-card');
                this.refreshWidget(widget);
            }
            
            if (e.target.closest('.widget-expand')) {
                const widget = e.target.closest('.widget-card');
                this.toggleWidgetSize(widget);
            }
        });

        // Metric card hover effects
        this.container.addEventListener('mouseenter', (e) => {
            if (e.target.closest('.metric-card')) {
                this.animateMetricCard(e.target.closest('.metric-card'));
            }
        }, true);
    }

    initializeWidgets() {
        // Initialize metric cards
        const metricCards = this.container.querySelectorAll('.metric-card');
        metricCards.forEach(card => this.initMetricCard(card));

        // Initialize chart widgets
        const chartWidgets = this.container.querySelectorAll('.widget-card[data-widget-type="chart"]');
        chartWidgets.forEach(widget => this.initChartWidget(widget));

        // Initialize activity widgets
        const activityWidgets = this.container.querySelectorAll('.widget-card[data-widget-type="activity"]');
        activityWidgets.forEach(widget => this.initActivityWidget(widget));

        // Initialize table widgets
        const tableWidgets = this.container.querySelectorAll('.widget-card[data-widget-type="table"]');
        tableWidgets.forEach(widget => this.initTableWidget(widget));
    }

    initMetricCard(card) {
        const value = card.querySelector('.metric-value');
        const change = card.querySelector('.metric-change');
        
        // Animate value counting up
        this.animateValue(value);
        
        // Set up real-time updates if data attribute exists
        const updateUrl = card.dataset.updateUrl;
        if (updateUrl) {
            this.widgets.set(card, {
                type: 'metric',
                updateUrl: updateUrl,
                lastUpdated: Date.now()
            });
        }

        // Add click handler for drill-down
        const drillDownUrl = card.dataset.drillDown;
        if (drillDownUrl) {
            card.style.cursor = 'pointer';
            card.addEventListener('click', () => {
                window.location.href = drillDownUrl;
            });
        }
    }

    initChartWidget(widget) {
        const chartContainer = widget.querySelector('.chart-container');
        if (!chartContainer) return;

        const chartType = widget.dataset.chartType || 'line';
        const dataUrl = widget.dataset.dataUrl;

        if (dataUrl) {
            this.loadChartData(widget, dataUrl, chartType);
            this.widgets.set(widget, {
                type: 'chart',
                chartType: chartType,
                dataUrl: dataUrl,
                lastUpdated: Date.now()
            });
        }
    }

    initActivityWidget(widget) {
        const activityList = widget.querySelector('.activity-list');
        if (!activityList) return;

        const dataUrl = widget.dataset.dataUrl;
        if (dataUrl) {
            this.loadActivityData(widget, dataUrl);
            this.widgets.set(widget, {
                type: 'activity',
                dataUrl: dataUrl,
                lastUpdated: Date.now()
            });
        }

        // Auto-refresh every 30 seconds
        setInterval(() => {
            if (dataUrl) {
                this.loadActivityData(widget, dataUrl);
            }
        }, 30000);
    }

    initTableWidget(widget) {
        const table = widget.querySelector('.data-table');
        if (!table) return;

        const dataUrl = widget.dataset.dataUrl;
        if (dataUrl) {
            this.loadTableData(widget, dataUrl);
            this.widgets.set(widget, {
                type: 'table',
                dataUrl: dataUrl,
                lastUpdated: Date.now()
            });
        }

        // Add sorting functionality
        this.initTableSorting(table);
    }

    animateValue(element) {
        if (!element) return;

        const targetValue = parseFloat(element.textContent.replace(/[^\d.-]/g, ''));
        if (isNaN(targetValue)) return;

        const duration = 1000; // 1 second
        const startTime = Date.now();
        const startValue = 0;

        const animate = () => {
            const currentTime = Date.now();
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = startValue + (targetValue - startValue) * easeOut;
            
            // Format the value based on the original format
            const originalText = element.dataset.originalValue || element.textContent;
            const formattedValue = this.formatValue(currentValue, originalText);
            element.textContent = formattedValue;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        element.dataset.originalValue = element.textContent;
        requestAnimationFrame(animate);
    }

    formatValue(value, originalFormat) {
        // Try to match the original format
        if (originalFormat.includes('%')) {
            return Math.round(value) + '%';
        } else if (originalFormat.includes('$')) {
            return '$' + value.toLocaleString();
        } else if (originalFormat.includes(',')) {
            return value.toLocaleString();
        } else {
            return Math.round(value).toString();
        }
    }

    animateMetricCard(card) {
        // Add subtle animation effect
        card.style.transform = 'translateY(-2px)';
        setTimeout(() => {
            card.style.transform = '';
        }, 200);
    }

    async loadChartData(widget, url, chartType) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            this.renderChart(widget, data, chartType);
        } catch (error) {
            console.error('Failed to load chart data:', error);
            this.showWidgetError(widget, 'Failed to load chart data');
        }
    }

    async loadActivityData(widget, url) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            this.renderActivityList(widget, data);
        } catch (error) {
            console.error('Failed to load activity data:', error);
            this.showWidgetError(widget, 'Failed to load activity data');
        }
    }

    async loadTableData(widget, url) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            this.renderTable(widget, data);
        } catch (error) {
            console.error('Failed to load table data:', error);
            this.showWidgetError(widget, 'Failed to load table data');
        }
    }

    renderChart(widget, data, chartType) {
        const chartContainer = widget.querySelector('.chart-container');
        // This would integrate with a charting library like Chart.js or D3.js
        // For now, we'll create a placeholder
        chartContainer.innerHTML = `
            <div class="chart-placeholder" style="height: 200px; display: flex; align-items: center; justify-content: center; background: var(--color-surface-secondary); border-radius: var(--radius-md);">
                <span style="color: var(--color-text-secondary);">Chart: ${chartType} (${data.length} data points)</span>
            </div>
        `;
    }

    renderActivityList(widget, activities) {
        const activityList = widget.querySelector('.activity-list');
        if (!activityList) return;

        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon ${activity.type}">
                    ${this.getActivityIcon(activity.type)}
                </div>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-description">${activity.description}</div>
                    <div class="activity-time">${this.formatTime(activity.timestamp)}</div>
                </div>
            </div>
        `).join('');
    }

    renderTable(widget, data) {
        const tableContainer = widget.querySelector('.widget-content');
        if (!tableContainer || !data.columns || !data.rows) return;

        const table = document.createElement('table');
        table.className = 'data-table';
        
        // Create header
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        data.columns.forEach(column => {
            const th = document.createElement('th');
            th.textContent = column.label;
            th.className = column.sortable ? 'sortable' : '';
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Create body
        const tbody = document.createElement('tbody');
        data.rows.forEach(row => {
            const tr = document.createElement('tr');
            data.columns.forEach(column => {
                const td = document.createElement('td');
                const value = row[column.key];
                
                if (column.type === 'status') {
                    td.innerHTML = `<span class="status-badge status-${value.toLowerCase()}">${value}</span>`;
                } else if (column.type === 'currency') {
                    td.textContent = this.formatCurrency(value);
                } else {
                    td.textContent = value;
                }
                
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);

        // Replace existing table or add new one
        const existingTable = tableContainer.querySelector('.data-table');
        if (existingTable) {
            existingTable.replaceWith(table);
        } else {
            tableContainer.appendChild(table);
        }
    }

    initTableSorting(table) {
        const headers = table.querySelectorAll('th.sortable');
        headers.forEach(header => {
            header.addEventListener('click', () => {
                this.sortTable(table, header);
            });
        });
    }

    sortTable(table, header) {
        const headerIndex = Array.from(header.parentNode.children).indexOf(header);
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        
        const isCurrentlyAsc = header.classList.contains('sort-asc');
        
        // Remove existing sort classes
        table.querySelectorAll('th').forEach(th => {
            th.classList.remove('sort-asc', 'sort-desc');
        });
        
        // Sort rows
        rows.sort((a, b) => {
            const aValue = a.children[headerIndex].textContent.trim();
            const bValue = b.children[headerIndex].textContent.trim();
            
            // Try to parse as numbers
            const aNum = parseFloat(aValue.replace(/[^\d.-]/g, ''));
            const bNum = parseFloat(bValue.replace(/[^\d.-]/g, ''));
            
            if (!isNaN(aNum) && !isNaN(bNum)) {
                return isCurrentlyAsc ? bNum - aNum : aNum - bNum;
            } else {
                return isCurrentlyAsc ? 
                    bValue.localeCompare(aValue) : 
                    aValue.localeCompare(bValue);
            }
        });
        
        // Update header class
        header.classList.add(isCurrentlyAsc ? 'sort-desc' : 'sort-asc');
        
        // Reorder DOM
        rows.forEach(row => tbody.appendChild(row));
    }

    getActivityIcon(type) {
        const icons = {
            success: '<svg>...</svg>', // Success icon
            warning: '<svg>...</svg>', // Warning icon
            error: '<svg>...</svg>',   // Error icon
            info: '<svg>...</svg>'     // Info icon
        };
        return icons[type] || icons.info;
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        
        return date.toLocaleDateString();
    }

    formatCurrency(value) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(value);
    }

    refresh() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        const refreshBtn = this.container.querySelector('.list-refresh, .dashboard-refresh');
        if (refreshBtn) {
            refreshBtn.classList.add('refreshing');
        }

        // Refresh all widgets
        const promises = [];
        this.widgets.forEach((widgetData, widget) => {
            promises.push(this.refreshWidget(widget));
        });

        Promise.all(promises).finally(() => {
            this.isLoading = false;
            if (refreshBtn) {
                refreshBtn.classList.remove('refreshing');
            }
        });
    }

    async refreshWidget(widget) {
        const widgetData = this.widgets.get(widget);
        if (!widgetData) return;

        try {
            switch (widgetData.type) {
                case 'metric':
                    await this.updateMetricCard(widget, widgetData.updateUrl);
                    break;
                case 'chart':
                    await this.loadChartData(widget, widgetData.dataUrl, widgetData.chartType);
                    break;
                case 'activity':
                    await this.loadActivityData(widget, widgetData.dataUrl);
                    break;
                case 'table':
                    await this.loadTableData(widget, widgetData.dataUrl);
                    break;
            }
            widgetData.lastUpdated = Date.now();
        } catch (error) {
            console.error('Failed to refresh widget:', error);
            this.showWidgetError(widget, 'Refresh failed');
        }
    }

    async updateMetricCard(card, url) {
        const response = await fetch(url);
        const data = await response.json();
        
        const valueElement = card.querySelector('.metric-value');
        const changeElement = card.querySelector('.metric-change');
        
        if (valueElement && data.value !== undefined) {
            valueElement.textContent = data.value;
            this.animateValue(valueElement);
        }
        
        if (changeElement && data.change !== undefined) {
            changeElement.textContent = data.change;
            changeElement.className = `metric-change ${data.changeType || 'neutral'}`;
        }
    }

    showWidgetError(widget, message) {
        const content = widget.querySelector('.widget-content');
        if (content) {
            content.innerHTML = `
                <div class="widget-error" style="text-align: center; padding: var(--space-8); color: var(--color-text-secondary);">
                    <div style="margin-bottom: var(--space-2);">⚠️</div>
                    <div>${message}</div>
                </div>
            `;
        }
    }

    toggleWidgetSize(widget) {
        widget.classList.toggle('full-width');
    }

    setupAutoRefresh() {
        // Auto-refresh every 5 minutes
        this.refreshInterval = setInterval(() => {
            this.refresh();
        }, 5 * 60 * 1000);
    }

    destroy() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
        this.widgets.clear();
    }

    // Public API methods
    addWidget(type, config) {
        const widget = this.createWidget(type, config);
        const container = this.container.querySelector('.widgets-grid, .metrics-grid');
        if (container) {
            container.appendChild(widget);
            this.initializeWidget(widget, type);
        }
        return widget;
    }

    removeWidget(widget) {
        this.widgets.delete(widget);
        widget.remove();
    }

    createWidget(type, config) {
        const widget = document.createElement('div');
        widget.className = `widget-card ${config.className || ''}`;
        widget.dataset.widgetType = type;
        
        if (config.dataUrl) {
            widget.dataset.dataUrl = config.dataUrl;
        }

        widget.innerHTML = `
            <div class="widget-header">
                <h3 class="widget-title">${config.title}</h3>
                <div class="widget-actions">
                    <button class="btn btn-secondary widget-refresh">Refresh</button>
                </div>
            </div>
            <div class="widget-content">
                ${config.content || '<div class="loading-shimmer large"></div>'}
            </div>
        `;

        return widget;
    }
}

// Auto-initialize dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = document.querySelector('.modern-dashboard, .dashboard');
    if (dashboard) {
        window.modernDashboard = new ModernDashboard(dashboard);
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModernDashboard;
}