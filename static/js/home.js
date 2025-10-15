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

    const name = document.getElementById('adminName').value;
    const secretKey = document.getElementById('adminSecretKey').value;
    const rememberMe = document.getElementById('adminRememberMe').checked;

    // Simple validation
    if (!name || !secretKey) {
        alert("Please fill in all fields");
        return;
    }

    // Check admin credentials
    const adminCredentials = [
        { name: "admin", secretKey: "admin123" },
        { name: "citycare", secretKey: "citycare2024" },
        { name: "administrator", secretKey: "admin@123" },
        { name: "superadmin", secretKey: "super@2024" }
    ];

    const isValidAdmin = adminCredentials.some(cred => 
        cred.name.toLowerCase() === name.toLowerCase() && 
        cred.secretKey === secretKey
    );

    if (isValidAdmin) {
        // Simulate admin user data
        const adminData = {
            id: 999,
            name: name.charAt(0).toUpperCase() + name.slice(1),
            email: `${name}@citycare.gov`,
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

        // Close modal
        adminModal.style.display = "none";

        // Show success message
        alert("Admin login successful! Redirecting to Admin Panel...");

        // Redirect to admin page
        window.location.href = "/admin";

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

// Mobile menu toggle
document.querySelector(".mobile-menu").addEventListener("click", function () {
    document.querySelector("nav").classList.toggle("active");
});

// Simple animation for feature cards on scroll
window.addEventListener("scroll", function () {
    const featureCards = document.querySelectorAll(".feature-card");
    const windowHeight = window.innerHeight;

    featureCards.forEach((card) => {
        const position = card.getBoundingClientRect().top;

        if (position < windowHeight - 100) {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
        }
    });
});

// Initialize feature cards with some opacity for animation
document.addEventListener("DOMContentLoaded", function () {
    const featureCards = document.querySelectorAll(".feature-card");
    featureCards.forEach((card) => {
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        card.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    });

    // Initialize authentication state
    initAuthState();

    // Trigger the scroll event to check initial positions
    window.dispatchEvent(new Event("scroll"));
});