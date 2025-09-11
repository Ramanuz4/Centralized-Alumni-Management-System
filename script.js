// Enhanced Alumni Management System JavaScript with Mobile Support

// Sample Data
let alumniData = [
    {
        id: 1,
        name: "John Doe",
        email: "john.doe@email.com",
        phone: "+91-9876543210",
        batch: "2022",
        department: "CSE",
        company: "Google",
        position: "Software Engineer",
        avatar: "https://via.placeholder.com/50"
    },
    {
        id: 2,
        name: "Jane Smith",
        email: "jane.smith@email.com",
        phone: "+91-9876543211",
        batch: "2023",
        department: "ECE",
        company: "Microsoft",
        position: "Product Manager",
        avatar: "https://via.placeholder.com/50"
    },
    {
        id: 3,
        name: "Mike Johnson",
        email: "mike.johnson@email.com",
        phone: "+91-9876543212",
        batch: "2021",
        department: "ME",
        company: "Tesla",
        position: "Mechanical Engineer",
        avatar: "https://via.placeholder.com/50"
    },
    {
        id: 4,
        name: "Sarah Wilson",
        email: "sarah.wilson@email.com",
        phone: "+91-9876543213",
        batch: "2024",
        department: "CSE",
        company: "Apple",
        position: "iOS Developer",
        avatar: "https://via.placeholder.com/50"
    },
    {
        id: 5,
        name: "David Brown",
        email: "david.brown@email.com",
        phone: "+91-9876543214",
        batch: "2022",
        department: "ECE",
        company: "Intel",
        position: "Hardware Engineer",
        avatar: "https://via.placeholder.com/50"
    },
    {
        id: 6,
        name: "Emily Davis",
        email: "emily.davis@email.com",
        phone: "+91-9876543215",
        batch: "2023",
        department: "CSE",
        company: "Netflix",
        position: "Data Scientist",
        avatar: "https://via.placeholder.com/50"
    }
];

let eventsData = [
    {
        id: 1,
        title: "Annual Alumni Meet 2024",
        date: "2024-12-25",
        time: "18:00",
        location: "Main Auditorium",
        description: "Annual gathering of all alumni",
        attendees: 120,
        type: "networking"
    },
    {
        id: 2,
        title: "Tech Industry Panel Discussion",
        date: "2025-01-15",
        time: "16:00",
        location: "Online Event",
        description: "Discussion on latest tech trends",
        attendees: 85,
        type: "professional"
    }
];

// Global State
let currentView = 'grid';
let filteredAlumniData = [...alumniData];

// DOM Elements
const elements = {
    // Navigation
    navLinks: document.querySelectorAll('.nav-link'),
    sections: document.querySelectorAll('.section'),
    mobileMenuBtn: document.getElementById('mobileMenuBtn'),
    mobileNav: document.getElementById('mobileNav'),
    mobileOverlay: document.getElementById('mobileOverlay'),
    
    // Alumni
    alumniGrid: document.getElementById('alumniGrid'),
    alumniSearch: document.getElementById('alumniSearch'),
    clearSearch: document.getElementById('clearSearch'),
    batchFilter: document.getElementById('batchFilter'),
    departmentFilter: document.getElementById('departmentFilter'),
    applyFilters: document.getElementById('applyFilters'),
    resetFilters: document.getElementById('resetFilters'),
    resultsCount: document.getElementById('resultsCount'),
    viewBtns: document.querySelectorAll('.view-btn'),
    
    // Events
    eventTypeFilter: document.getElementById('eventTypeFilter'),
    
    // Charts
    registrationChart: document.getElementById('registrationChart'),
    departmentChart: document.getElementById('departmentChart'),
    chartPeriod: document.getElementById('chartPeriod')
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    initializeNavigation();
    initializeMobileMenu();
    initializeScrollAnimations();
    renderAlumniGrid(alumniData);
    initializeEventListeners();
    initializeCharts();
    updateDashboardStats();
    initializeViewToggle();
    
    console.log('Enhanced Alumni Management System initialized');
}

// Mobile Menu System
function initializeMobileMenu() {
    if (elements.mobileMenuBtn) {
        elements.mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    if (elements.mobileOverlay) {
        elements.mobileOverlay.addEventListener('click', closeMobileMenu);
    }
    
    // Close menu when clicking nav links
    document.querySelectorAll('.mobile-nav .nav-link').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    elements.mobileMenuBtn.classList.toggle('active');
    elements.mobileNav.classList.toggle('active');
    elements.mobileOverlay.classList.toggle('active');
    document.body.style.overflow = elements.mobileNav.classList.contains('active') ? 'hidden' : '';
}

function closeMobileMenu() {
    elements.mobileMenuBtn.classList.remove('active');
    elements.mobileNav.classList.remove('active');
    elements.mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Scroll Animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const delay = element.getAttribute('data-delay') || 0;
                
                setTimeout(() => {
                    element.classList.add('animate');
                }, delay);
                
                observer.unobserve(element);
            }
        });
    }, observerOptions);
    
    // Observe all elements with scroll animation
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// Navigation System
function initializeNavigation() {
    elements.navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('href').substring(1);
            showSection(targetSection);
            
            // Update active nav link
            updateActiveNavLink(this);
            
            // Close mobile menu if open
            closeMobileMenu();
        });
    });
}

function showSection(sectionId) {
    elements.sections.forEach(section => {
        section.classList.remove('active');
        if (section.id === sectionId) {
            section.classList.add('active');
            section.classList.add('fade-in');
            
            // Trigger scroll animations for new section
            setTimeout(() => {
                initializeScrollAnimations();
            }, 100);
        }
    });
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateActiveNavLink(activeLink) {
    // Update both desktop and mobile nav links
    elements.navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    const href = activeLink.getAttribute('href');
    document.querySelectorAll(`[href="${href}"]`).forEach(link => {
        link.classList.add('active');
    });
}

// View Toggle System
function initializeViewToggle() {
    elements.viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const view = this.getAttribute('data-view');
            toggleView(view);
        });
    });
}

function toggleView(view) {
    currentView = view;
    
    // Update button states
    elements.viewBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-view') === view) {
            btn.classList.add('active');
        }
    });
    
    // Update grid class
    if (elements.alumniGrid) {
        elements.alumniGrid.classList.toggle('list-view', view === 'list');
    }
}

// Alumni Management
function renderAlumniGrid(data) {
    if (!elements.alumniGrid) return;
    
    elements.alumniGrid.innerHTML = '';
    filteredAlumniData = data;
    
    if (data.length === 0) {
        elements.alumniGrid.innerHTML = `
            <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: #666;">
                <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <h3>No alumni found</h3>
                <p>Try adjusting your search criteria or filters</p>
                <button class="btn-primary" onclick="resetFilters()" style="margin-top: 1rem;">
                    <i class="fas fa-undo"></i> Reset Filters
                </button>
            </div>
        `;
        updateResultsCount(0);
        return;
    }
    
    data.forEach((alumni, index) => {
        const alumniCard = createAlumniCard(alumni, index);
        elements.alumniGrid.appendChild(alumniCard);
    });
    
    updateResultsCount(data.length);
    
    // Trigger scroll animations for new cards
    setTimeout(() => {
        initializeScrollAnimations();
    }, 100);
}

function createAlumniCard(alumni, index) {
    const card = document.createElement('div');
    card.className = 'alumni-card animate-on-scroll';
    card.setAttribute('data-delay', index * 50);
    
    card.innerHTML = `
        <div class="alumni-header">
            <img src="${alumni.avatar}" alt="${alumni.name}" class="alumni-avatar" loading="lazy">
            <div>
                <div class="alumni-name">${alumni.name}</div>
                <div class="alumni-batch">Batch ${alumni.batch} • ${alumni.department}</div>
            </div>
        </div>
        <div class="alumni-info">
            <span><i class="fas fa-envelope"></i> ${alumni.email}</span>
            <span><i class="fas fa-phone"></i> ${alumni.phone}</span>
            <span><i class="fas fa-building"></i> ${alumni.company}</span>
            <span><i class="fas fa-briefcase"></i> ${alumni.position}</span>
        </div>
        <div class="alumni-actions">
            <button class="btn-outline" onclick="viewAlumniProfile(${alumni.id})">
                <i class="fas fa-eye"></i> View Profile
            </button>
            <button class="btn-outline" onclick="contactAlumni(${alumni.id})">
                <i class="fas fa-envelope"></i> Contact
            </button>
        </div>
    `;
    
    return card;
}

function updateResultsCount(count) {
    if (elements.resultsCount) {
        const total = alumniData.length;
        if (count === total) {
            elements.resultsCount.textContent = `Showing all ${total} alumni`;
        } else {
            elements.resultsCount.textContent = `Showing ${count} of ${total} alumni`;
        }
    }
}

// Search and Filter System
function filterAlumni() {
    const searchTerm = elements.alumniSearch?.value.toLowerCase() || '';
    const batchValue = elements.batchFilter?.value || '';
    const departmentValue = elements.departmentFilter?.value || '';
    
    const filteredData = alumniData.filter(alumni => {
        const matchesSearch = alumni.name.toLowerCase().includes(searchTerm) ||
                            alumni.email.toLowerCase().includes(searchTerm) ||
                            alumni.company.toLowerCase().includes(searchTerm) ||
                            alumni.position.toLowerCase().includes(searchTerm);
        
        const matchesBatch = !batchValue || alumni.batch === batchValue;
        const matchesDepartment = !departmentValue || alumni.department === departmentValue;
        
        return matchesSearch && matchesBatch && matchesDepartment;
    });
    
    renderAlumniGrid(filteredData);
    
    // Show/hide clear search button
    if (elements.clearSearch) {
        elements.clearSearch.style.display = searchTerm ? 'block' : 'none';
    }
}

function resetFilters() {
    if (elements.alumniSearch) elements.alumniSearch.value = '';
    if (elements.batchFilter) elements.batchFilter.value = '';
    if (elements.departmentFilter) elements.departmentFilter.value = '';
    if (elements.clearSearch) elements.clearSearch.style.display = 'none';
    
    renderAlumniGrid(alumniData);
}

// Event Listeners
function initializeEventListeners() {
    // Search functionality with debouncing
    if (elements.alumniSearch) {
        let searchTimeout;
        elements.alumniSearch.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(filterAlumni, 300);
        });
    }
    
    // Clear search
    if (elements.clearSearch) {
        elements.clearSearch.addEventListener('click', function() {
            elements.alumniSearch.value = '';
            this.style.display = 'none';
            filterAlumni();
        });
    }
    
    // Filter controls
    if (elements.batchFilter) {
        elements.batchFilter.addEventListener('change', filterAlumni);
    }
    
    if (elements.departmentFilter) {
        elements.departmentFilter.addEventListener('change', filterAlumni);
    }
    
    if (elements.applyFilters) {
        elements.applyFilters.addEventListener('click', filterAlumni);
    }
    
    if (elements.resetFilters) {
        elements.resetFilters.addEventListener('click', resetFilters);
    }
    
    // Event type filter
    if (elements.eventTypeFilter) {
        elements.eventTypeFilter.addEventListener('change', filterEvents);
    }
    
    // Chart controls
    if (elements.chartPeriod) {
        elements.chartPeriod.addEventListener('change', refreshCharts);
    }
    
    // Form submissions
    const addAlumniForm = document.getElementById('addAlumniForm');
    if (addAlumniForm) {
        addAlumniForm.addEventListener('submit', handleAddAlumni);
    }
    
    const createEventForm = document.getElementById('createEventForm');
    if (createEventForm) {
        createEventForm.addEventListener('submit', handleCreateEvent);
    }
    
    // Export buttons
    document.querySelectorAll('.export-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const type = this.textContent.trim().split(' ')[1]; // Get CSV, PDF, Excel
            exportData(type);
        });
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Touch events for mobile
    initializeTouchEvents();
}

// Touch Events for Mobile
function initializeTouchEvents() {
    let touchStartY = 0;
    let touchEndY = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.changedTouches[0].screenY;
    });
    
    document.addEventListener('touchend', function(e) {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipeGesture();
    });
    
    function handleSwipeGesture() {
        const swipeThreshold = 50;
        const diff = touchStartY - touchEndY;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe up - could trigger some action
                console.log('Swipe up detected');
            } else {
                // Swipe down - could trigger some action
                console.log('Swipe down detected');
            }
        }
    }
}

// Event Management
function filterEvents() {
    const eventType = elements.eventTypeFilter?.value || '';
    
    const filteredEvents = eventsData.filter(event => {
        return !eventType || event.type === eventType;
    });
    
    // Update events display (if needed)
    console.log('Filtered events:', filteredEvents);
}

// Modal Management
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Focus first input
        const firstInput = modal.querySelector('input, select, textarea');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
        
        // Reset form
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
        }
    }
}

// Form Handlers
function handleAddAlumni(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const newAlumni = {
        id: alumniData.length + 1,
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        batch: formData.get('batch'),
        department: formData.get('department'),
        company: formData.get('company') || 'Not specified',
        position: 'Not specified',
        avatar: "https://via.placeholder.com/50"
    };
    
    // Validate required fields
    if (!newAlumni.name || !newAlumni.email || !newAlumni.phone || !newAlumni.batch || !newAlumni.department) {
        showMessage('Please fill in all required fields', 'error');
        return;
    }
    
    // Validate email format
    if (!isValidEmail(newAlumni.email)) {
        showMessage('Please enter a valid email address', 'error');
        return;
    }
    
    alumniData.push(newAlumni);
    renderAlumniGrid(filteredAlumniData.length === alumniData.length - 1 ? alumniData : filteredAlumniData);
    closeModal('addAlumniModal');
    showMessage('Alumni added successfully!', 'success');
    
    updateDashboardStats();
}

function handleCreateEvent(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const newEvent = {
        id: eventsData.length + 1,
        title: formData.get('title'),
        description: formData.get('description') || 'No description provided',
        date: formData.get('date'),
        time: formData.get('time'),
        location: formData.get('location'),
        type: 'networking',
        attendees: 0
    };
    
    // Validate required fields
    if (!newEvent.title || !newEvent.date || !newEvent.time || !newEvent.location) {
        showMessage('Please fill in all required fields', 'error');
        return;
    }
    
    eventsData.push(newEvent);
    closeModal('createEventModal');
    showMessage('Event created successfully!', 'success');
    
    updateDashboardStats();
}

// Dashboard Functions
function updateDashboardStats() {
    // Update total alumni count with animation
    const totalAlumniElement = document.querySelector('.stat-card:first-child h3');
    if (totalAlumniElement) {
        animateCounter(totalAlumniElement, alumniData.length);
    }
    
    // Update events count
    const eventsCountElement = document.querySelector('.stat-card:nth-child(2) h3');
    if (eventsCountElement) {
        animateCounter(eventsCountElement, eventsData.length);
    }
}

function animateCounter(element, targetValue) {
    const startValue = parseInt(element.textContent.replace(/,/g, '')) || 0;
    const duration = 1000;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentValue = Math.floor(startValue + (targetValue - startValue) * progress);
        element.textContent = currentValue.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Utility Functions
function viewAlumniProfile(alumniId) {
    const alumni = alumniData.find(a => a.id === alumniId);
    if (alumni) {
        // Create a more sophisticated modal or page for profile view
        showMessage(`Viewing profile for ${alumni.name}`, 'info');
    }
}

function contactAlumni(alumniId) {
    const alumni = alumniData.find(a => a.id === alumniId);
    if (alumni) {
        const subject = encodeURIComponent('Alumni Connect - Reaching Out');
        const body = encodeURIComponent(`Dear ${alumni.name},\n\nI hope this email finds you well.\n\nBest regards,\nAlumni Team`);
        
        // Check if mobile device
        if (isMobileDevice()) {
            // For mobile, try to open email app
            window.location.href = `mailto:${alumni.email}?subject=${subject}&body=${body}`;
        } else {
            // For desktop, open in new window
            window.open(`mailto:${alumni.email}?subject=${subject}&body=${body}`);
        }
        
        showMessage(`Email client opened for ${alumni.name}`, 'success');
    }
}

function sendBulkEmail() {
    showMessage('Bulk email feature would be implemented here', 'info');
}

function generateReport() {
    showMessage('Report generation feature would be implemented here', 'info');
}

function exportData(type) {
    showMessage(`${type} export feature would be implemented here`, 'info');
    
    if (type.toLowerCase() === 'csv') {
        exportCSV();
    }
}

function exportCSV() {
    const headers = ['Name', 'Email', 'Phone', 'Batch', 'Department', 'Company', 'Position'];
    const csvContent = [
        headers.join(','),
        ...filteredAlumniData.map(alumni => [
            `"${alumni.name}"`,
            alumni.email,
            alumni.phone,
            alumni.batch,
            alumni.department,
            `"${alumni.company}"`,
            `"${alumni.position}"`
        ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alumni_data_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    showMessage('CSV exported successfully!', 'success');
}

// Helper Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (elements.alumniSearch) {
            elements.alumniSearch.focus();
        }
    }
    
    // Escape to close modals or mobile menu
    if (e.key === 'Escape') {
        const openModals = document.querySelectorAll('.modal[style*="block"]');
        openModals.forEach(modal => {
            modal.style.display = 'none';
        });
        document.body.style.overflow = '';
        
        closeMobileMenu();
    }
    
    // Alt + M to toggle mobile menu
    if (e.altKey && e.key === 'm') {
        e.preventDefault();
        toggleMobileMenu();
    }
}

function showMessage(text, type) {
    // Remove existing messages
    document.querySelectorAll('.message').forEach(msg => msg.remove());
    
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.innerHTML = `
        <i class="fas fa-${getMessageIcon(type)}"></i>
        ${text}
    `;
    
    // Insert at the top of the main content
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.insertBefore(message, mainContent.firstChild);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (message.parentNode) {
                message.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => message.remove(), 300);
            }
        }, 5000);
    }
}

function getMessageIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Charts Initialization
function initializeCharts() {
    // Check if Chart.js is available
    if (typeof Chart === 'undefined') {
        console.log('Chart.js not loaded, skipping chart initialization');
        return;
    }
    
    initializeRegistrationChart();
    initializeDepartmentChart();
}

function initializeRegistrationChart() {
    const canvas = elements.registrationChart;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Sample data - count alumni by batch
    const batchCounts = alumniData.reduce((acc, alumni) => {
        acc[alumni.batch] = (acc[alumni.batch] || 0) + 1;
        return acc;
    }, {});
    
    const labels = Object.keys(batchCounts).sort();
    const data = labels.map(batch => batchCounts[batch]);
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Alumni Registered',
                data: data,
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#667eea',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

function initializeDepartmentChart() {
    const canvas = elements.departmentChart;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Sample data - count alumni by department
    const deptCounts = alumniData.reduce((acc, alumni) => {
        acc[alumni.department] = (acc[alumni.department] || 0) + 1;
        return acc;
    }, {});
    
    const labels = Object.keys(deptCounts);
    const data = labels.map(dept => deptCounts[dept]);
    const colors = ['#667eea', '#764ba2', '#22c55e', '#f59e0b', '#ef4444'];
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors.slice(0, labels.length),
                borderWidth: 0,
                hoverBorderWidth: 2,
                hoverBorderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            cutout: '60%'
        }
    });
}

function refreshCharts() {
    // Refresh charts when period changes
    console.log('Refreshing charts...');
}

// Performance optimizations
function optimizeForMobile() {
    if (isMobileDevice()) {
        // Reduce animation duration on mobile
        document.documentElement.style.setProperty('--animation-duration', '0.3s');
        
        // Optimize touch scrolling
        document.body.style.webkitOverflowScrolling = 'touch';
    }
}

// Initialize mobile optimizations
document.addEventListener('DOMContentLoaded', optimizeForMobile);

// Handle orientation change
window.addEventListener('orientationchange', function() {
    setTimeout(() => {
        // Refresh layout after orientation change
        window.dispatchEvent(new Event('resize'));
    }, 100);
});

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Export functions for global access
window.openModal = openModal;
window.closeModal = closeModal;
window.viewAlumniProfile = viewAlumniProfile;
window.contactAlumni = contactAlumni;
window.sendBulkEmail = sendBulkEmail;
window.generateReport = generateReport;
window.resetFilters = resetFilters;
window.toggleView = toggleView;

console.log('Enhanced Alumni Management System with mobile support loaded successfully!');