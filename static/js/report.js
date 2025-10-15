// Mobile menu toggle
document.querySelector(".mobile-menu").addEventListener("click", function () {
    document.querySelector("nav").classList.toggle("active");
});

// Initialize map
let map, marker;

function initMap() {
    // Default coordinates for India center
    const defaultLat = 20.5937;
    const defaultLng = 78.9629;

    // Initialize map
    map = L.map("issueMap").setView([defaultLat, defaultLng], 5);

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Add default marker
    marker = L.marker([defaultLat, defaultLng], { 
        draggable: true 
    }).addTo(map);

    // Update address when marker is dragged
    marker.on("dragend", function () {
        updateAddressFromMarker();
    });

    // Update marker when map is clicked
    map.on("click", function (e) {
        marker.setLatLng(e.latlng);
        updateAddressFromMarker();
    });
}

// Update address field based on marker position
function updateAddressFromMarker() {
    const latlng = marker.getLatLng();
    document.getElementById("address").value = `Lat: ${latlng.lat.toFixed(4)}, Lng: ${latlng.lng.toFixed(4)}`;
}

// Use current location
document.getElementById("useCurrentLocation").addEventListener("click", function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                map.setView([lat, lng], 15);
                marker.setLatLng([lat, lng]);
                updateAddressFromMarker();

                // Update active button
                document.querySelectorAll(".location-btn").forEach((btn) => btn.classList.remove("active"));
                this.classList.add("active");
            }.bind(this),
            function (error) {
                alert("Location access denied. Please pick a location on the map.");
            }
        );
    } else {
        alert("Geolocation not supported. Please pick a location on the map.");
    }
});

// Pick on map
document.getElementById("pickOnMap").addEventListener("click", function () {
    document.querySelectorAll(".location-btn").forEach((btn) => btn.classList.remove("active"));
    this.classList.add("active");
});

// Urgency level selection
document.querySelectorAll(".urgency-option").forEach((option) => {
    option.addEventListener("click", function () {
        document.querySelectorAll(".urgency-option").forEach((opt) => opt.classList.remove("active"));
        this.classList.add("active");
        document.getElementById("urgencyLevel").value = this.getAttribute("data-level");
    });
});

// File upload handling
const fileInput = document.getElementById("fileInput");
const fileUpload = document.getElementById("fileUpload");
const filePreview = document.getElementById("filePreview");

fileUpload.addEventListener("click", function () {
    fileInput.click();
});

fileUpload.addEventListener("dragover", function (e) {
    e.preventDefault();
    this.style.borderColor = "#3498db";
    this.style.backgroundColor = "rgba(52, 152, 219, 0.1)";
});

fileUpload.addEventListener("dragleave", function () {
    this.style.borderColor = "#ddd";
    this.style.backgroundColor = "transparent";
});

fileUpload.addEventListener("drop", function (e) {
    e.preventDefault();
    this.style.borderColor = "#ddd";
    this.style.backgroundColor = "transparent";

    if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
    }
});

fileInput.addEventListener("change", function () {
    if (this.files.length > 0) {
        handleFiles(this.files);
    }
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
            authModal.style.display = "none";
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
            authModal.style.display = "none";
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
                adminModal.style.display = "none";
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

        // Event Listeners
        loginBtn.addEventListener("click", () => {
            authModal.style.display = "block";
            switchTab("login");
        });

        adminLoginBtn.addEventListener("click", () => {
            adminModal.style.display = "block";
        });

        closeModal.addEventListener("click", () => {
            authModal.style.display = "none";
        });

        closeAdminModal.addEventListener("click", () => {
            adminModal.style.display = "none";
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
            adminModal.style.display = "none";
            authModal.style.display = "block";
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
                authModal.style.display = "none";
            }
            
            if (e.target === adminModal) {
                adminModal.style.display = "none";
            }

            // Close dropdown when clicking outside
            if (
                !e.target.closest(".user-dropdown") &&
                dropdownMenu.classList.contains("active")
            ) {
                dropdownMenu.classList.remove("active");
            }
        });

        // Social login handlers (placeholder)
        document.querySelectorAll(".social-btn").forEach((btn) => {
            btn.addEventListener("click", () => {
                alert("Social login integration would be implemented here");
            });
        });

function handleFiles(files) {
    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            alert(`File ${file.name} is too large. Maximum size is 10MB.`);
            continue;
        }

        // Check file type
        if (!file.type.match("image.*") && !file.type.match("video.*")) {
            alert(`File ${file.name} is not a supported image or video format.`);
            continue;
        }

        const reader = new FileReader();

        reader.onload = function (e) {
            const fileItem = document.createElement("div");
            fileItem.className = "file-item";

            if (file.type.match("image.*")) {
                fileItem.innerHTML = `
                    <img src="${e.target.result}" alt="${file.name}">
                    <div class="remove" data-file="${file.name}">&times;</div>
                `;
            } else if (file.type.match("video.*")) {
                fileItem.innerHTML = `
                    <video src="${e.target.result}" controls></video>
                    <div class="remove" data-file="${file.name}">&times;</div>
                `;
            }

            filePreview.appendChild(fileItem);

            // Add remove functionality
            fileItem.querySelector(".remove").addEventListener("click", function () {
                fileItem.remove();
            });
        };

        reader.readAsDataURL(file);
    }
}
// Form submission with API call
document.getElementById("issueForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    // Validate form
    const urgencyLevel = document.getElementById("urgencyLevel").value;
    if (!urgencyLevel) {
        alert("Please select an urgency level");
        return;
    }

    // Get current marker position
    const markerLatLng = marker.getLatLng();

    // Get form data
    const formData = {
        category: document.getElementById("issueCategory").value,
        title: document.getElementById("issueTitle").value,
        description: document.getElementById("issueDescription").value,
        urgency_level: urgencyLevel,
        latitude: markerLatLng.lat,
        longitude: markerLatLng.lng,
        address: document.getElementById("address").value,
        landmark: document.getElementById("landmark").value,
        ward: document.getElementById("ward").value,
        contact_email: document.getElementById("contactEmail").value,
        contact_phone: document.getElementById("contactPhone").value,
        image_paths: getUploadedFiles()
    };

    console.log("Submitting form data:", formData); // Debug log

    try {
        // Show loading state
        const submitBtn = document.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitBtn.disabled = true;

        // Send to backend
        const response = await fetch('/api/submit-report', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        console.log("Server response:", result); // Debug log

        if (result.success) {
            showSuccessMessage(result.report_id);
            resetForm();
        } else {
            alert("Error submitting report: " + result.message);
        }

    } catch (error) {
        console.error('Error:', error);
        alert("Network error. Please check your connection and try again.");
    } finally {
        // Reset button state
        const submitBtn = document.querySelector('button[type="submit"]');
        submitBtn.textContent = "Submit Report";
        submitBtn.disabled = false;
    }
});

// Test database connection (optional - for debugging)
async function testDatabaseConnection() {
    try {
        const response = await fetch('/api/test-db');
        const result = await response.json();
        console.log('Database test:', result);
    } catch (error) {
        console.error('Database test failed:', error);
    }
}



// Get uploaded files (placeholder - implement file upload logic)
function getUploadedFiles() {
    const fileItems = document.querySelectorAll('.file-item');
    const files = [];
    fileItems.forEach(item => {
        // In real implementation, you would upload files to server
        // and get their paths here
        files.push('path/to/uploaded/file.jpg');
    });
    return files;
}

// Reset form function
function resetForm() {
    document.getElementById("issueForm").reset();
    filePreview.innerHTML = "";
    document.querySelectorAll(".urgency-option").forEach((opt) => opt.classList.remove("active"));
    document.querySelectorAll(".location-btn")[0].classList.add("active");
    
    // Reset map to default position
    map.setView([20.5937, 78.9629], 5);
    marker.setLatLng([20.5937, 78.9629]);
    updateAddressFromMarker();
}

// Show success message with report ID
function showSuccessMessage(reportId) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <div style="background: #d4edda; color: #155724; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4><i class="fas fa-check-circle"></i> Report Submitted Successfully!</h4>
            <p>Your report ID: <strong>${reportId}</strong></p>
            <p>You can use this ID to track your report status.</p>
        </div>
    `;
    
    const formCard = document.querySelector('.form-card');
    formCard.parentNode.insertBefore(successDiv, formCard);
    
    // Remove success message after 10 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 10000);
}

// Load nearby reports when location is set
function loadNearbyReports(lat, lng) {
    fetch(`/api/reports/nearby?lat=${lat}&lng=${lng}&radius=2`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                updateNearbyIssuesList(data.reports);
            }
        })
        .catch(error => {
            console.error('Error loading nearby reports:', error);
        });
}

// Update nearby issues list
function updateNearbyIssuesList(reports) {
    const issuesList = document.querySelector('.issues-list');
    
    if (reports.length === 0) {
        issuesList.innerHTML = '<p>No similar issues found in your area.</p>';
        return;
    }
    
    issuesList.innerHTML = reports.map(report => `
        <div class="issue-card">
            <div class="issue-image" style="background-image: url('https://images.unsplash.com/photo-1572271356578-3d5fa5d4d8c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80')"></div>
            <div class="issue-content">
                <span class="issue-category">${report.category}</span>
                <h3 class="issue-title">${report.title}</h3>
                <p>${report.description.substring(0, 100)}...</p>
                <div class="issue-meta">
                    <span>${getDistance(report.location.latitude, report.location.longitude)} away</span>
                    <span class="issue-status status-${report.status}">${report.status}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Calculate distance (simplified)
function getDistance(lat2, lng2) {
    const currentLat = marker.getLatLng().lat;
    const currentLng = marker.getLatLng().lng;
    
    // Simple distance calculation (for demo)
    const distance = Math.sqrt(Math.pow(lat2 - currentLat, 2) + Math.pow(lng2 - currentLng, 2)) * 111;
    return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`;
}

// Form submission
document.getElementById("issueForm").addEventListener("submit", function (e) {
    e.preventDefault();

    // Validate form
    const urgencyLevel = document.getElementById("urgencyLevel").value;
    if (!urgencyLevel) {
        alert("Please select an urgency level");
        return;
    }

    // Show success message
    alert("Thank you for reporting the issue! Your report has been submitted.");

    // Reset form
    this.reset();
    filePreview.innerHTML = "";
    document.querySelectorAll(".urgency-option").forEach((opt) => opt.classList.remove("active"));
    document.querySelectorAll(".location-btn")[0].classList.add("active");
});

// Initialize map when page loads
window.addEventListener("DOMContentLoaded", initMap);