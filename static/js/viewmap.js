// Mobile menu toggle
document.querySelector(".mobile-menu").addEventListener("click", function () {
    document.querySelector("nav").classList.toggle("active");
});

// Authentication State Management
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
let isAdmin = localStorage.getItem("isAdmin") === "true" || false;

// DOM Elements
const authModal = document.getElementById("authModal");
const adminModal = document.getElementById("adminModal");
const loginBtn = document.getElementById("loginBtn");
const adminLoginBtn = document.getElementById("adminLoginBtn");
const closeModal = document.getElementById("closeModal");
const closeAdminModal = document.getElementById("closeAdminModal");
const authTabs = document.querySelectorAll(".auth-tab");
const authForms = document.querySelectorAll(".auth-form");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const adminLoginForm = document.getElementById("adminLoginForm");
const switchToSignup = document.getElementById("switchToSignup");
const switchToLogin = document.getElementById("switchToLogin");
const switchToUserLogin = document.getElementById("switchToUserLogin");
const authButtons = document.getElementById("authButtons");
const userMenu = document.getElementById("userMenu");
const userAvatar = document.getElementById("userAvatar");
const avatarInitials = document.getElementById("avatarInitials");
const dropdownMenu = document.getElementById("dropdownMenu");
const logoutBtn = document.getElementById("logoutBtn");

// Initialize authentication state
function initAuthState() {
    if (currentUser) {
        showUserMenu();
    } else {
        showAuthButtons();
    }
}

// Show authentication buttons
function showAuthButtons() {
    authButtons.style.display = "flex";
    userMenu.style.display = "none";
}

// Show user menu
function showUserMenu() {
    authButtons.style.display = "none";
    userMenu.style.display = "flex";
    
    if (isAdmin) {
        userAvatar.classList.add("admin-avatar");
        avatarInitials.textContent = "A";
    } else {
        userAvatar.classList.remove("admin-avatar");
        avatarInitials.textContent = getInitials(currentUser.name);
    }
}

// Get user initials
function getInitials(name) {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
}

// Switch auth tabs
function switchTab(tabName) {
    // Update tabs
    authTabs.forEach((tab) => {
        tab.classList.toggle("active", tab.dataset.tab === tabName);
    });

    // Update forms
    authForms.forEach((form) => {
        form.classList.toggle("active", form.id === `${tabName}Form`);
    });

    // Update modal title
    document.getElementById("modalTitle").textContent =
        tabName === "login" ? "Welcome Back" : "Join City Care";
}

// Handle login
function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const rememberMe = document.getElementById("rememberMe").checked;

    // Simple validation
    if (!email || !password) {
        alert("Please fill in all fields");
        return;
    }

    // Simulate API call - replace with actual authentication
    const userData = {
        id: 1,
        name: "John Doe",
        email: email,
        phone: "+1234567890",
        address: "123 Main St, City",
    };

    // Store user data
    currentUser = userData;
    isAdmin = false;
    localStorage.setItem("currentUser", JSON.stringify(userData));
    localStorage.setItem("isAdmin", "false");

    if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
    }

    // Close modal and update UI
    authModal.classList.remove("active");
    showUserMenu();

    // Show success message
    alert("Successfully logged in! Welcome to City Care.");
}

// Handle signup
function handleSignup(event) {
    event.preventDefault();

    const name = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const phone = document.getElementById("signupPhone").value;
    const address = document.getElementById("signupAddress").value;
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById(
        "signupConfirmPassword"
    ).value;
    const agreeTerms = document.getElementById("agreeTerms").checked;

    // Validation
    if (!name || !email || !phone || !address || !password || !confirmPassword) {
        alert("Please fill in all fields");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    if (!agreeTerms) {
        alert("Please agree to the Terms of Service and Privacy Policy");
        return;
    }

    // Simulate API call - replace with actual registration
    const userData = {
        id: Date.now(),
        name: name,
        email: email,
        phone: phone,
        address: address,
    };

    // Store user data
    currentUser = userData;
    isAdmin = false;
    localStorage.setItem("currentUser", JSON.stringify(userData));
    localStorage.setItem("isAdmin", "false");

    // Close modal and update UI
    authModal.classList.remove("active");
    showUserMenu();

    // Show success message
    alert("Account created successfully! Welcome to City Care.");
}

// Handle admin login
function handleAdminLogin(event) {
    event.preventDefault();

    const email = document.getElementById("adminEmail").value;
    const password = document.getElementById("adminPassword").value;
    const secretKey = document.getElementById("adminSecretKey").value;
    const rememberMe = document.getElementById("adminRememberMe").checked;

    // Simple validation
    if (!email || !password || !secretKey) {
        alert("Please fill in all fields");
        return;
    }

    // Check admin credentials (in a real app, this would be a secure API call)
    if (email === "admin@citycare.gov" && password === "admin123" && secretKey === "CITYCARE2023") {
        // Simulate admin user data
        const adminData = {
            id: 999,
            name: "City Care Admin",
            email: email,
            role: "Administrator"
        };

        // Store admin data
        currentUser = adminData;
        isAdmin = true;
        localStorage.setItem("currentUser", JSON.stringify(adminData));
        localStorage.setItem("isAdmin", "true");

        if (rememberMe) {
            localStorage.setItem("adminRememberMe", "true");
        }

        // Close modal and update UI
        adminModal.classList.remove("active");
        showUserMenu();

        // Show success message
        alert("Admin login successful! Welcome to the City Care Admin Panel.");
    } else {
        alert("Invalid admin credentials. Please try again.");
    }
}

// Handle logout
function handleLogout() {
    currentUser = null;
    isAdmin = false;
    localStorage.removeItem("currentUser");
    localStorage.removeItem("isAdmin");
    showAuthButtons();
    dropdownMenu.classList.remove("active");
    alert("You have been logged out successfully.");
}

// Event Listeners for Authentication
loginBtn.addEventListener("click", () => {
    authModal.classList.add("active");
    switchTab("login");
});

adminLoginBtn.addEventListener("click", () => {
    adminModal.classList.add("active");
});

closeModal.addEventListener("click", () => {
    authModal.classList.remove("active");
});

closeAdminModal.addEventListener("click", () => {
    adminModal.classList.remove("active");
});

authTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        switchTab(tab.dataset.tab);
    });
});

switchToSignup.addEventListener("click", (e) => {
    e.preventDefault();
    switchTab("signup");
});

switchToLogin.addEventListener("click", (e) => {
    e.preventDefault();
    switchTab("login");
});

switchToUserLogin.addEventListener("click", (e) => {
    e.preventDefault();
    adminModal.classList.remove("active");
    authModal.classList.add("active");
    switchTab("login");
});

loginForm.addEventListener("submit", handleLogin);
signupForm.addEventListener("submit", handleSignup);
adminLoginForm.addEventListener("submit", handleAdminLogin);

userAvatar.addEventListener("click", () => {
    dropdownMenu.classList.toggle("active");
});

logoutBtn.addEventListener("click", handleLogout);

// Close modal when clicking outside
window.addEventListener("click", (e) => {
    if (e.target === authModal) {
        authModal.classList.remove("active");
    }
    
    if (e.target === adminModal) {
        adminModal.classList.remove("active");
    }

    // Close dropdown when clicking outside
    if (
        !e.target.closest(".user-dropdown") &&
        dropdownMenu.classList.contains("active")
    ) {
        dropdownMenu.classList.remove("active");
    }
});

// Initialize authentication state
initAuthState();

// Google Maps functionality
let map;
let markers = [];
let userLocationMarker;
let issuesData = [];

// Jalandhar coordinates
const defaultLat = 31.5143;
const defaultLng = 75.9115;

// Initialize Google Map
function initMap() {
    console.log("Initializing Google Map...");
    
    const jalandhar = { lat: defaultLat, lng: defaultLng };
    
    // Initialize map
    map = new google.maps.Map(document.getElementById('cityMap'), {
        zoom: 13,
        center: jalandhar,
        mapTypeId: 'roadmap',
        styles: [
            {
                "featureType": "administrative",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#444444"}]
            },
            {
                "featureType": "landscape",
                "elementType": "all",
                "stylers": [{"color": "#f2f2f2"}]
            },
            {
                "featureType": "poi",
                "elementType": "all",
                "stylers": [{"visibility": "off"}]
            },
            {
                "featureType": "road",
                "elementType": "all",
                "stylers": [{"saturation": -100}, {"lightness": 45}]
            },
            {
                "featureType": "road.highway",
                "elementType": "all",
                "stylers": [{"visibility": "simplified"}]
            },
            {
                "featureType": "road.arterial",
                "elementType": "labels.icon",
                "stylers": [{"visibility": "off"}]
            },
            {
                "featureType": "transit",
                "elementType": "all",
                "stylers": [{"visibility": "off"}]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [{"color": "#3498db"}, {"visibility": "on"}]
            }
        ]
    });

    // Generate sample data and add markers
    generateSampleData();
    addMarkersToMap();
    
    // Set up map controls
    setupMapControls();

    // Update nearby issues list
    updateNearbyIssues();
}

// Generate sample data for Jalandhar
function generateSampleData() {
    const categories = [
        "roads",
        "sanitation",
        "streetlights",
        "water",
        "traffic",
        "parks",
        "other",
    ];
    const statuses = ["submitted", "in-progress", "resolved", "rejected"];
    const locations = [
        { lat: 31.5143, lng: 75.9115, name: "Jalandhar City Center" },
        { lat: 31.525, lng: 75.906, name: "Model Town" },
        { lat: 31.505, lng: 75.916, name: "Lajpat Nagar" },
        { lat: 31.52, lng: 75.925, name: "Civil Lines" },
        { lat: 31.5, lng: 75.9, name: "Basti Sheikh" },
        { lat: 31.53, lng: 75.89, name: "Adarsh Nagar" },
        { lat: 31.495, lng: 75.93, name: "Rama Mandi" },
    ];

    const jalandharIssues = [
        "Pothole on GT Road near BMC Chowk",
        "Garbage accumulation in Model Town Market",
        "Streetlight not working in Lajpat Nagar",
        "Water leakage near Civil Lines",
        "Traffic signal malfunction at PAP Chowk",
        "Broken swings in Company Bagh",
        "Sewage overflow in Basti Sheikh",
        "Damaged road near Lovely Professional University",
        "Illegal parking issues in Adarsh Nagar",
        "Stray animal problem in Rama Mandi",
    ];

    issuesData = [];

    for (let i = 0; i < 40; i++) {
        const location = locations[Math.floor(Math.random() * locations.length)];
        const category = categories[Math.floor(Math.random() * categories.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const issueTitle = jalandharIssues[Math.floor(Math.random() * jalandharIssues.length)];

        // Add some random variation to coordinates
        const lat = location.lat + (Math.random() - 0.5) * 0.02;
        const lng = location.lng + (Math.random() - 0.5) * 0.02;

        issuesData.push({
            id: `CC-JAL-2023-${1000 + i}`,
            title: issueTitle,
            description: `${issueTitle} needs immediate attention from authorities.`,
            category: category,
            status: status,
            lat: lat,
            lng: lng,
            date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
            address: `${location.name}, Jalandhar`,
            urgency: ["low", "medium", "high"][Math.floor(Math.random() * 3)],
        });
    }
}

// Add markers to Google Map
function addMarkersToMap() {
    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    markers = [];

    issuesData.forEach((issue) => {
        const markerColor = getStatusColor(issue.status);
        
        const marker = new google.maps.Marker({
            position: { lat: issue.lat, lng: issue.lng },
            map: map,
            title: issue.title,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: markerColor,
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2
            },
            animation: google.maps.Animation.DROP
        });

        const infowindow = new google.maps.InfoWindow({
            content: createPopupContent(issue)
        });

        marker.addListener('click', function() {
            // Close all other infowindows
            markers.forEach(m => {
                if (m.infowindow) {
                    m.infowindow.close();
                }
            });
            
            infowindow.open(map, marker);
            highlightIssueInSidebar(issue.id);
            
            // Center map on marker
            map.panTo(marker.getPosition());
        });

        // Store infowindow reference
        marker.infowindow = infowindow;
        marker.issueData = issue;
        markers.push(marker);
    });
}

// Get color based on status
function getStatusColor(status) {
    switch (status) {
        case "submitted":
            return "#3498db";
        case "in-progress":
            return "#f39c12";
        case "resolved":
            return "#27ae60";
        case "rejected":
            return "#e74c3c";
        default:
            return "#95a5a6";
    }
}

// Create popup content for markers
function createPopupContent(issue) {
    return `
        <div class="popup-content">
            <h3>${issue.title}</h3>
            <p><strong>Status:</strong> <span class="issue-status">${issue.status}</span></p>
            <p><strong>Category:</strong> <span class="category-tag category-${issue.category}">${issue.category}</span></p>
            <p>${issue.description}</p>
            <p><strong>Address:</strong> ${issue.address}</p>
            <p><strong>Reported:</strong> ${issue.date.toLocaleDateString()}</p>
            <button class="btn btn-primary" onclick="viewIssueDetails('${issue.id}')">View Details</button>
        </div>
    `;
}

// Set up map controls
function setupMapControls() {
    // Locate Me button
    document.getElementById('locateMe').addEventListener('click', function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                // Remove existing user location marker
                if (userLocationMarker) {
                    userLocationMarker.setMap(null);
                }

                // Add new user location marker
                userLocationMarker = new google.maps.Marker({
                    position: pos,
                    map: map,
                    title: 'Your Location',
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 8,
                        fillColor: '#e74c3c',
                        fillOpacity: 1,
                        strokeColor: '#ffffff',
                        strokeWeight: 3
                    },
                    zIndex: 1000
                });

                map.setCenter(pos);
                map.setZoom(15);
                updateNearbyIssues();
            }, function(error) {
                alert("Unable to retrieve your location. Please ensure location services are enabled.");
            });
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    });

    // Zoom controls
    document.getElementById('zoomIn').addEventListener('click', function() {
        map.setZoom(map.getZoom() + 1);
    });

    document.getElementById('zoomOut').addEventListener('click', function() {
        map.setZoom(map.getZoom() - 1);
    });

    // Set up filter toggle
    document.getElementById('toggleFilters').addEventListener('click', function() {
        this.classList.toggle('active');
    });

    // Set up mobile controls toggle
    document.getElementById('mobileControlsToggle').addEventListener('click', function() {
        const controls = document.getElementById('mapControls');
        controls.classList.toggle('expanded');
        this.querySelector('i').classList.toggle('fa-chevron-up');
        this.querySelector('i').classList.toggle('fa-chevron-down');
    });

    // Set up heatmap toggle
    document.getElementById('heatmapToggle').addEventListener('change', function() {
        if (this.checked) {
            enableHeatmap();
        } else {
            disableHeatmap();
        }
    });

    // Set up search functionality
    document.getElementById('searchIssues').addEventListener('input', function() {
        filterMarkers();
    });

    // Set up filter checkboxes
    document.querySelectorAll('.filter-option input').forEach((checkbox) => {
        checkbox.addEventListener('change', filterMarkers);
    });
}

// Filter markers based on current filters
function filterMarkers() {
    const searchTerm = document.getElementById('searchIssues').value.toLowerCase();

    // Get active status filters
    const activeStatuses = [];
    document.querySelectorAll('input[data-status]:checked').forEach((checkbox) => {
        activeStatuses.push(checkbox.getAttribute('data-status'));
    });

    // Get active category filters
    const activeCategories = [];
    document.querySelectorAll('input[data-category]:checked').forEach((checkbox) => {
        activeCategories.push(checkbox.getAttribute('data-category'));
    });

    markers.forEach((marker) => {
        const issue = marker.issueData;
        const matchesSearch = searchTerm === '' ||
            issue.title.toLowerCase().includes(searchTerm) ||
            issue.description.toLowerCase().includes(searchTerm) ||
            issue.address.toLowerCase().includes(searchTerm);

        const matchesStatus = activeStatuses.length === 0 || activeStatuses.includes(issue.status);
        const matchesCategory = activeCategories.length === 0 || activeCategories.includes(issue.category);

        if (matchesSearch && matchesStatus && matchesCategory) {
            marker.setMap(map);
        } else {
            marker.setMap(null);
        }
    });

    // Update nearby issues list
    updateNearbyIssues();
}

// Update nearby issues list
function updateNearbyIssues() {
    const nearbyIssuesContainer = document.getElementById('nearbyIssues');
    const nearbyCount = document.getElementById('nearbyCount');

    // Clear current list
    nearbyIssuesContainer.innerHTML = '';

    // Get user location or use map center
    let centerLat, centerLng;
    if (userLocationMarker) {
        const pos = userLocationMarker.getPosition();
        centerLat = pos.lat();
        centerLng = pos.lng();
    } else {
        const center = map.getCenter();
        centerLat = center.lat();
        centerLng = center.lng();
    }

    // Calculate distances and sort by proximity
    const issuesWithDistance = issuesData.map((issue) => {
        const distance = calculateDistance(centerLat, centerLng, issue.lat, issue.lng);
        return { ...issue, distance };
    });

    // Sort by distance and take top 5
    const nearbyIssues = issuesWithDistance
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 5);

    // Update count
    nearbyCount.textContent = `(${nearbyIssues.length})`;

    // Add issues to list
    nearbyIssues.forEach((issue) => {
        const issueElement = document.createElement('div');
        issueElement.className = 'issue-item';
        issueElement.setAttribute('data-issue-id', issue.id);

        issueElement.innerHTML = `
            <div class="issue-header">
                <div>
                    <div class="issue-title">${issue.title}</div>
                    <div class="issue-meta">
                        <span class="category-tag category-${issue.category}">${issue.category}</span>
                        <span class="issue-status">${issue.status}</span>
                    </div>
                </div>
            </div>
            <div class="issue-description">${issue.description}</div>
            <div class="issue-distance">
                <i class="fas fa-location-arrow"></i>
                ${issue.distance < 1 ? `${Math.round(issue.distance * 1000)}m away` : `${issue.distance.toFixed(1)}km away`}
            </div>
        `;

        issueElement.addEventListener('click', function() {
            // Center map on this issue
            map.setCenter({ lat: issue.lat, lng: issue.lng });
            map.setZoom(16);

            // Find and trigger the corresponding marker
            const marker = markers.find(m => m.issueData.id === issue.id);
            if (marker) {
                google.maps.event.trigger(marker, 'click');
            }

            // Highlight in sidebar
            highlightIssueInSidebar(issue.id);
        });

        nearbyIssuesContainer.appendChild(issueElement);
    });
}

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Highlight issue in sidebar
function highlightIssueInSidebar(issueId) {
    // Remove active class from all issues
    document.querySelectorAll('.issue-item').forEach((item) => {
        item.classList.remove('active');
    });

    // Add active class to selected issue
    const issueElement = document.querySelector(`.issue-item[data-issue-id="${issueId}"]`);
    if (issueElement) {
        issueElement.classList.add('active');
    }
}

// View issue details
function viewIssueDetails(issueId) {
    alert(`Viewing details for issue: ${issueId}\n\nIn a real application, this would open a detailed view or modal.`);
}

// Enable heatmap (simulated)
function enableHeatmap() {
    alert("Heatmap view enabled. In a real application, this would show a density visualization of issues.");
    // In a real app, you would use Google Maps Heatmap layer
}

// Disable heatmap
function disableHeatmap() {
    // In a real app, this would remove the heatmap layer
}

// Handle map loading errors
function handleMapError() {
    console.error("Error loading Google Maps");
    alert("Error loading map. Please check your internet connection and try again.");
}

// Make functions globally available for HTML onclick handlers
window.viewIssueDetails = viewIssueDetails;
window.initMap = initMap;