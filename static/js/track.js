// Mobile menu toggle
document.querySelector(".mobile-menu").addEventListener("click", function () {
    document.querySelector("nav").classList.toggle("active");
});

// DOM Elements
const reportsContainer = document.getElementById('reportsContainer');
const loadingIndicator = document.getElementById('loadingIndicator');
const emptyState = document.getElementById('emptyState');
const statsSubmitted = document.getElementById('statsSubmitted');
const statsInProgress = document.getElementById('statsInProgress');
const statsResolved = document.getElementById('statsResolved');
const statsTotal = document.getElementById('statsTotal');

// Load reports when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadReports();
    loadStats();
});

// Load all reports
async function loadReports() {
    try {
        showLoading();
        
        const response = await fetch('/api/user-reports');
        
        if (!response.ok) {
            throw new Error(`Failed to load reports: ${response.status}`);
        }
        
        const data = await response.json();
        
        hideLoading();
        
        if (data.success && data.reports) {
            displayReports(data.reports);
        } else {
            showError('Failed to load reports: ' + (data.message || 'Unknown error'));
            showEmptyState();
        }
    } catch (error) {
        hideLoading();
        showError('Failed to load reports. Please try again.');
        showEmptyState();
    }
}

// Load statistics
async function loadStats() {
    try {
        const response = await fetch('/api/reports/stats');
        const data = await response.json();
        
        if (data.success) {
            if (statsSubmitted) statsSubmitted.textContent = data.stats.submitted;
            if (statsInProgress) statsInProgress.textContent = data.stats.in_progress;
            if (statsResolved) statsResolved.textContent = data.stats.resolved;
            if (statsTotal) statsTotal.textContent = data.stats.total;
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Display reports in the container
function displayReports(reports) {
    if (!reports || reports.length === 0) {
        showEmptyState();
        return;
    }
    
    hideEmptyState();
    
    const reportsHTML = reports.map(report => {
        const location = report.location || {
            address: report.address || 'No address provided',
            landmark: report.landmark || '',
            ward: report.ward || ''
        };
        
        const contact = report.contact || {
            email: report.contact_email || 'No email provided',
            phone: report.contact_phone || ''
        };
        
        const statusClass = getStatusClass(report.status);
        const urgencyClass = getUrgencyClass(report.urgency_level);
        const createdDate = formatDate(report.created_at);
        
        return `
            <div class="report-card" data-report-id="${report.id}">
                <div class="report-header">
                    <div class="report-title-section">
                        <h3 class="report-title">${report.title || 'Untitled Report'}</h3>
                        <div class="report-meta">
                            <span class="report-category">${report.category || 'General'}</span>
                            <span class="report-date">${createdDate}</span>
                        </div>
                    </div>
                    <div class="report-status">
                        <span class="status-badge ${statusClass}">${formatStatus(report.status)}</span>
                        <span class="urgency-badge ${urgencyClass}">${report.urgency_level || 'medium'}</span>
                    </div>
                </div>
                
                <div class="report-content">
                    <p class="report-description">${report.description || 'No description provided'}</p>
                    
                    <div class="report-details">
                        <div class="detail-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${location.address}</span>
                            ${location.landmark ? `<small>Near ${location.landmark}</small>` : ''}
                        </div>
                        
                        <div class="detail-item">
                            <i class="fas fa-envelope"></i>
                            <span>${contact.email}</span>
                        </div>
                        
                        ${contact.phone ? `
                        <div class="detail-item">
                            <i class="fas fa-phone"></i>
                            <span>${contact.phone}</span>
                        </div>
                        ` : ''}
                    </div>
                </div>
                
                <div class="report-footer">
                    <div class="report-stats">
                        <span class="stat">
                            <i class="fas fa-thumbs-up"></i>
                            ${report.upvotes || 0}
                        </span>
                        <span class="stat">
                            <i class="fas fa-comments"></i>
                            ${report.comments_count || 0}
                        </span>
                    </div>
                    
                    <div class="report-actions">
                        <button class="btn btn-outline btn-sm" onclick="viewReportDetails('${report.id}')">
                            <i class="fas fa-eye"></i> View Details
                        </button>
                        <button class="btn btn-primary btn-sm" onclick="updateReportStatus('${report.id}')">
                            <i class="fas fa-sync-alt"></i> Update Status
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    if (reportsContainer) {
        reportsContainer.innerHTML = reportsHTML;
    }
}

// View report details
function viewReportDetails(reportId) {
    // For now, show an alert. You can implement a modal or detail page later.
    alert(`Viewing report: ${reportId}\n\nDetailed information would be shown here.`);
}

// Update report status
async function updateReportStatus(reportId) {
    const newStatus = prompt('Enter new status (submitted, in-progress, resolved):');
    
    if (newStatus && ['submitted', 'in-progress', 'resolved'].includes(newStatus)) {
        try {
            const response = await fetch(`/api/reports/${reportId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus })
            });
            
            const data = await response.json();
            
            if (data.success) {
                alert('Status updated successfully!');
                loadReports();
                loadStats();
            } else {
                alert('Failed to update status: ' + data.message);
            }
        } catch (error) {
            alert('Failed to update status. Please try again.');
        }
    } else if (newStatus) {
        alert('Invalid status. Please use: submitted, in-progress, or resolved');
    }
}

// Utility functions
function getStatusClass(status) {
    const statusMap = {
        'submitted': 'status-pending',
        'in-progress': 'status-progress',
        'resolved': 'status-resolved'
    };
    return statusMap[status] || 'status-pending';
}

function getUrgencyClass(urgency) {
    const urgencyMap = {
        'high': 'urgency-high',
        'medium': 'urgency-medium',
        'low': 'urgency-low'
    };
    return urgencyMap[urgency] || 'urgency-medium';
}

function formatStatus(status) {
    const statusMap = {
        'submitted': 'Submitted',
        'in-progress': 'In Progress',
        'resolved': 'Resolved'
    };
    return statusMap[status] || status;
}

function formatDate(dateString) {
    if (!dateString) return 'Unknown date';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return dateString;
    }
}

// UI State Management
function showLoading() {
    if (loadingIndicator) loadingIndicator.style.display = 'block';
    if (reportsContainer) reportsContainer.style.display = 'none';
    if (emptyState) emptyState.style.display = 'none';
}

function hideLoading() {
    if (loadingIndicator) loadingIndicator.style.display = 'none';
    if (reportsContainer) reportsContainer.style.display = 'block';
}

function showEmptyState() {
    if (emptyState) emptyState.style.display = 'block';
    if (reportsContainer) reportsContainer.style.display = 'none';
}

function hideEmptyState() {
    if (emptyState) emptyState.style.display = 'none';
    if (reportsContainer) reportsContainer.style.display = 'block';
}

function showError(message) {
    // Create a temporary error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <div style="background: #f8d7da; color: #721c24; padding: 12px; border-radius: 4px; margin: 10px 0; border: 1px solid #f5c6cb;">
            <strong>Error:</strong> ${message}
            <button onclick="this.parentElement.remove()" style="float: right; background: none; border: none; color: #721c24; cursor: pointer;">×</button>
        </div>
    `;
    
    if (reportsContainer && reportsContainer.parentNode) {
        reportsContainer.parentNode.insertBefore(errorDiv, reportsContainer);
    }
}

// Refresh functionality
function refreshReports() {
    loadReports();
    loadStats();
}

// Auto-refresh every 30 seconds
setInterval(refreshReports, 30000);

// Make functions globally available
window.viewReportDetails = viewReportDetails;
window.updateReportStatus = updateReportStatus;
window.refreshReports = refreshReports;