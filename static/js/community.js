        // Mobile menu toggle
        document.querySelector(".mobile-menu").addEventListener("click", function () {
            document.querySelector("nav").classList.toggle("active");
        });

        // Data storage (in real app, this would be in MongoDB)
        let whatsappGroups = JSON.parse(localStorage.getItem('whatsappGroups')) || [
            {
                id: 'jalandhar-central',
                name: 'Jalandhar Central',
                members: '284 members',
                activity: 'Very Active',
                description: 'Discussion forum for central Jalandhar residents',
                location: 'Model Town',
                link: 'https://chat.whatsapp.com/your-actual-group-link-1'
            },
            {
                id: 'north-jalandhar',
                name: 'North Jalandhar',
                members: '192 members',
                activity: 'Active',
                description: 'Community updates for northern areas',
                location: 'Adarsh Nagar',
                link: 'https://chat.whatsapp.com/your-actual-group-link-2'
            }
        ];

        let forumPosts = JSON.parse(localStorage.getItem('forumPosts')) || [
            {
                id: '1',
                title: 'Garbage collection issues in Model Town',
                author: 'Rohit Sharma',
                authorInitials: 'RS',
                time: '2 hours ago',
                category: 'Sanitation',
                content: 'The garbage collection in Model Town has been irregular for the past week. Bins are overflowing and attracting stray animals. Has anyone else faced this issue?',
                comments: 14,
                views: 87,
                likes: 23,
                createdAt: new Date().toISOString()
            }
        ];

        let events = JSON.parse(localStorage.getItem('events')) || [
            {
                id: '1',
                title: 'Community Park Cleanup',
                date: 'Oct 28, 2023 • 9:00 AM',
                description: 'Join us for cleaning and beautifying Central Park',
                location: 'Central Park',
                attending: '24 attending',
                image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
            }
        ];

        let volunteerOpportunities = JSON.parse(localStorage.getItem('volunteerOpportunities')) || [
            {
                id: '1',
                title: 'Traffic Management Volunteer',
                organization: 'Jalandhar Traffic Police',
                description: 'Help manage traffic during peak hours at busy intersections and assist pedestrians with safe crossing.',
                timeCommitment: '4 hrs/week',
                schedule: 'Flexible',
                spotsLeft: 12
            }
        ];

        // Initialize the community page
        document.addEventListener('DOMContentLoaded', function() {
            loadWhatsAppGroups();
            loadForumPosts();
            loadEvents();
            loadVolunteerOpportunities();
            setupEventListeners();
            updateCommunityStats();
        });

        // Load WhatsApp groups
        function loadWhatsAppGroups() {
            const container = document.getElementById('whatsappGroups');
            
            if (whatsappGroups.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <i class="fab fa-whatsapp"></i>
                        <h3>No WhatsApp Groups Yet</h3>
                        <p>Be the first to create a community group!</p>
                        <button class="btn btn-whatsapp" onclick="openWhatsAppModal()">
                            <i class="fas fa-plus"></i> Create First Group
                        </button>
                    </div>
                `;
                return;
            }
            
            container.innerHTML = whatsappGroups.map(group => `
                <div class="whatsapp-group">
                    <div class="group-header">
                        <i class="fab fa-whatsapp"></i>
                        <div class="group-name">${group.name}</div>
                    </div>
                    <div class="group-members">${group.members} • ${group.activity}</div>
                    <div class="group-description">${group.description}</div>
                    <div class="group-actions">
                        <span class="group-location">${group.location}</span>
                        <button class="join-btn" data-group="${group.id}" data-link="${group.link}">
                            <i class="fab fa-whatsapp"></i> Join Group
                        </button>
                    </div>
                </div>
            `).join('');
        }

        // Load forum posts
        function loadForumPosts() {
            const container = document.getElementById('forumPosts');
            
            // Sort posts by creation date (newest first)
            const sortedPosts = forumPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            
            if (sortedPosts.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-comments"></i>
                        <h3>No Discussions Yet</h3>
                        <p>Start the conversation by creating the first post!</p>
                        <button class="btn btn-primary" onclick="openForumModal()">
                            <i class="fas fa-plus"></i> Create First Post
                        </button>
                    </div>
                `;
                return;
            }
            
            container.innerHTML = sortedPosts.slice(0, 5).map(post => `
                <div class="forum-post" onclick="viewPost('${post.id}')">
                    <div class="post-header">
                        <div>
                            <div class="post-title">${post.title}</div>
                            <div class="post-meta">
                                <div class="post-author">
                                    <div class="author-avatar">${post.authorInitials}</div>
                                    <span>${post.author}</span>
                                </div>
                                <span>${formatRelativeTime(post.createdAt)}</span>
                                <span>Category: ${post.category}</span>
                            </div>
                        </div>
                    </div>
                    <div class="post-content">${post.content}</div>
                    <div class="post-stats">
                        <div class="post-stat">
                            <i class="far fa-comment"></i> ${post.comments} comments
                        </div>
                        <div class="post-stat">
                            <i class="far fa-eye"></i> ${post.views} views
                        </div>
                        <div class="post-stat">
                            <i class="far fa-thumbs-up"></i> ${post.likes} likes
                        </div>
                    </div>
                </div>
            `).join('');
        }

        // Load events
        function loadEvents() {
            const container = document.getElementById('eventsList');
            container.innerHTML = events.map(event => `
                <div class="event-card" onclick="viewEvent('${event.id}')">
                    <div class="event-image" style="background-image: url('${event.image}')"></div>
                    <div class="event-content">
                        <div class="event-date">${event.date}</div>
                        <div class="event-title">${event.title}</div>
                        <div class="event-description">${event.description}</div>
                        <div class="event-meta">
                            <span>${event.location}</span>
                            <span>${event.attending}</span>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        // Load volunteer opportunities
        function loadVolunteerOpportunities() {
            const container = document.getElementById('volunteerOpportunities');
            container.innerHTML = volunteerOpportunities.map(opportunity => `
                <div class="volunteer-card">
                    <div class="volunteer-title">${opportunity.title}</div>
                    <div class="volunteer-organization">${opportunity.organization}</div>
                    <div class="volunteer-description">${opportunity.description}</div>
                    <div class="volunteer-details">
                        <div class="volunteer-detail">
                            <div class="detail-value">${opportunity.timeCommitment}</div>
                            <div class="detail-label">Time Commitment</div>
                        </div>
                        <div class="volunteer-detail">
                            <div class="detail-value">${opportunity.schedule}</div>
                            <div class="detail-label">Schedule</div>
                        </div>
                        <div class="volunteer-detail">
                            <div class="detail-value">${opportunity.spotsLeft}</div>
                            <div class="detail-label">Spots Left</div>
                        </div>
                    </div>
                    <button class="btn btn-primary" onclick="applyForVolunteer('${opportunity.title}')">Apply Now</button>
                </div>
            `).join('');
        }

        // Setup event listeners
        function setupEventListeners() {
            // WhatsApp group join functionality
            document.addEventListener('click', function(e) {
                if (e.target.closest('.join-btn')) {
                    const button = e.target.closest('.join-btn');
                    const groupName = button.getAttribute('data-group');
                    const groupLink = button.getAttribute('data-link');
                    joinWhatsAppGroup(groupName, groupLink);
                }
            });

            // Create post button
            document.getElementById('createPostBtn').addEventListener('click', openForumModal);

            // Modal close functionality
            document.querySelectorAll('.close-modal').forEach(button => {
                button.addEventListener('click', function() {
                    closeAllModals();
                });
            });

            // Modal background click to close
            document.querySelectorAll('.modal').forEach(modal => {
                modal.addEventListener('click', function(e) {
                    if (e.target === this) closeAllModals();
                });
            });

            // Form submissions
            document.getElementById('whatsappForm').addEventListener('submit', createWhatsAppGroup);
            document.getElementById('forumForm').addEventListener('submit', createForumPost);
            document.getElementById('volunteerForm').addEventListener('submit', submitVolunteerApplication);
        }

        // Modal functions
        function openWhatsAppModal() {
            document.getElementById('whatsappModal').style.display = 'block';
            document.getElementById('whatsappForm').reset();
        }

        function closeWhatsAppModal() {
            document.getElementById('whatsappModal').style.display = 'none';
        }

        function openForumModal() {
            document.getElementById('forumModal').style.display = 'block';
            document.getElementById('forumForm').reset();
        }

        function closeForumModal() {
            document.getElementById('forumModal').style.display = 'none';
        }

        function closeAllModals() {
            closeWhatsAppModal();
            closeForumModal();
            document.getElementById('volunteerModal').style.display = 'none';
        }

        // Create new WhatsApp group
        function createWhatsAppGroup(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('groupName').value,
                description: document.getElementById('groupDescription').value,
                location: document.getElementById('groupLocation').value,
                link: document.getElementById('groupLink').value
            };

            const newGroup = {
                id: 'group-' + Date.now(),
                name: formData.name,
                members: '1 member',
                activity: 'New',
                description: formData.description,
                location: formData.location,
                link: formData.link
            };

            whatsappGroups.push(newGroup);
            saveToLocalStorage('whatsappGroups', whatsappGroups);
            
            loadWhatsAppGroups();
            updateCommunityStats();
            closeWhatsAppModal();
            
            alert(`WhatsApp group "${formData.name}" created successfully!`);
            
            // In real app, send to backend:
            // fetch('/api/whatsapp-groups', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(newGroup)
            // });
        }

        // Create new forum post
        function createForumPost(e) {
            e.preventDefault();
            
            const formData = {
                title: document.getElementById('postTitle').value,
                category: document.getElementById('postCategory').value,
                content: document.getElementById('postContent').value
            };

            const newPost = {
                id: 'post-' + Date.now(),
                title: formData.title,
                author: 'You', // In real app, get from user session
                authorInitials: 'YU',
                time: 'Just now',
                category: formData.category,
                content: formData.content,
                comments: 0,
                views: 0,
                likes: 0,
                createdAt: new Date().toISOString()
            };

            forumPosts.push(newPost);
            saveToLocalStorage('forumPosts', forumPosts);
            
            loadForumPosts();
            updateCommunityStats();
            closeForumModal();
            
            alert('Forum post created successfully!');
            
            // In real app, send to backend:
            // fetch('/api/forum-posts', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(newPost)
            // });
        }

        // Join WhatsApp group with real link
        function joinWhatsAppGroup(groupName, groupLink) {
            const group = whatsappGroups.find(g => g.id === groupName);
            
            if (confirm(`You're about to join the "${group.name}" WhatsApp community. Continue?`)) {
                // Redirect to actual WhatsApp group link
                window.open(groupLink, '_blank');
                
                // Update member count (in real app, this would be on the backend)
                group.members = parseInt(group.members) + 1 + ' members';
                saveToLocalStorage('whatsappGroups', whatsappGroups);
                updateCommunityStats();
            }
        }

        // View post details
        function viewPost(postId) {
            const post = forumPosts.find(p => p.id === postId);
            if (post) {
                // Increase view count
                post.views++;
                saveToLocalStorage('forumPosts', forumPosts);
                
                // Show post details (in real app, navigate to post page)
                alert(`Post: ${post.title}\n\n${post.content}\n\nCategory: ${post.category}\nViews: ${post.views}`);
            }
        }

        // View event details
        function viewEvent(eventId) {
            const event = events.find(e => e.id === eventId);
            if (event) {
                alert(`Event: ${event.title}\n\n${event.description}\n\nDate: ${event.date}\nLocation: ${event.location}`);
            }
        }

        // Apply for volunteer position
        function applyForVolunteer(position) {
            document.getElementById('volunteerPosition').value = position;
            document.getElementById('volunteerModal').style.display = 'block';
            document.querySelector('.modal-header h2').textContent = `Apply for: ${position}`;
        }

        // Submit volunteer application
        function submitVolunteerApplication(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('applicantName').value,
                email: document.getElementById('applicantEmail').value,
                phone: document.getElementById('applicantPhone').value,
                message: document.getElementById('applicantMessage').value,
                position: document.getElementById('volunteerPosition').value
            };

            // Save application (in real app, send to backend)
            const applications = JSON.parse(localStorage.getItem('volunteerApplications')) || [];
            applications.push({
                ...formData,
                id: 'app-' + Date.now(),
                appliedAt: new Date().toISOString()
            });
            saveToLocalStorage('volunteerApplications', applications);
            
            alert(`Thank you ${formData.name}! We have received your application for "${formData.position}". We will contact you at ${formData.email} soon.`);
            
            closeAllModals();
        }

        // Update community statistics
        function updateCommunityStats() {
            document.getElementById('activeGroups').textContent = whatsappGroups.length;
            document.getElementById('totalMembers').textContent = whatsappGroups.reduce((total, group) => {
                return total + parseInt(group.members);
            }, 0) + '+';
            document.getElementById('issuesResolved').textContent = '156'; // This could be dynamic
            
            document.getElementById('activeTopics').textContent = forumPosts.length;
            document.getElementById('totalPosts').textContent = forumPosts.reduce((total, post) => {
                return total + post.comments + 1; // Post + comments
            }, 0);
            document.getElementById('solutionsFound').textContent = '89'; // This could be dynamic
        }

        // Utility functions
        function saveToLocalStorage(key, data) {
            localStorage.setItem(key, JSON.stringify(data));
        }

        function formatRelativeTime(dateString) {
            const date = new Date(dateString);
            const now = new Date();
            const diffInSeconds = Math.floor((now - date) / 1000);
            
            if (diffInSeconds < 60) return 'Just now';
            if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
            if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
            if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
            
            return date.toLocaleDateString();
        }