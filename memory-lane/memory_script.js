// Memory Lane JavaScript Implementation
class MemoryLane {
    constructor() {
        this.memories = [];
        this.currentUser = { role: 'admin', name: 'Admin User', batch: null };
        this.currentFilter = 'all';
        this.uploadedFiles = [];
        
        this.init();
        this.loadSampleData();
    }

    init() {
        this.bindEvents();
        this.updateUIForUserRole();
        this.renderMemories();
    }

    bindEvents() {
        // Upload button
        document.getElementById('uploadBtn').addEventListener('click', () => {
            this.showUploadModal();
        });

        // Batch filter
        document.getElementById('batchFilter').addEventListener('change', (e) => {
            this.currentFilter = e.target.value;
            this.renderMemories();
        });

        // Upload form
        document.getElementById('uploadForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleUpload();
        });

        // File upload area
        const fileUploadArea = document.getElementById('fileUploadArea');
        const fileInput = document.getElementById('memoryFile');

        fileUploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        fileUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileUploadArea.classList.add('drag-over');
        });

        fileUploadArea.addEventListener('dragleave', () => {
            fileUploadArea.classList.remove('drag-over');
        });

        fileUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            fileUploadArea.classList.remove('drag-over');
            this.handleFileSelect(e.dataTransfer.files);
        });

        fileInput.addEventListener('change', (e) => {
            this.handleFileSelect(e.target.files);
        });

        // Modal close events
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                this.closeModal(e.target.closest('.modal'));
            });
        });

        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
        });

        // Cancel button
        document.querySelector('.btn-cancel').addEventListener('click', () => {
            this.closeModal(document.getElementById('uploadModal'));
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    updateUIForUserRole() {
        const userRoleSpan = document.getElementById('userRole');
        const batchGroup = document.getElementById('batchGroup');

        if (this.currentUser.role === 'student') {
            userRoleSpan.textContent = `Student - ${this.currentUser.name}`;
            batchGroup.style.display = 'none';
        } else {
            userRoleSpan.textContent = 'Admin';
            batchGroup.style.display = 'block';
        }
    }

    loadSampleData() {
        // Sample memories data
        this.memories = [
            {
                id: 1,
                title: "Graduation Day 2024",
                description: "The most memorable day of our academic journey",
                batch: "2024",
                type: "image",
                files: ["graduation-2024.jpg"],
                uploadDate: new Date('2024-05-15'),
                uploader: "Admin",
                views: 156,
                likes: 89
            },
            {
                id: 2,
                title: "Fresher's Welcome",
                description: "First day memories that started it all",
                batch: "2024",
                type: "video",
                files: ["fresher-welcome.mp4"],
                uploadDate: new Date('2024-08-20'),
                uploader: "John Doe",
                views: 234,
                likes: 167
            },
            {
                id: 3,
                title: "Annual Sports Day",
                description: "Victory, friendship, and unforgettable moments",
                batch: "2023",
                type: "image",
                files: ["sports-day-2023.jpg", "sports-winners.jpg"],
                uploadDate: new Date('2024-02-10'),
                uploader: "Admin",
                views: 298,
                likes: 178
            },
            {
                id: 4,
                title: "Tech Fest 2023",
                description: "Innovation meets creativity",
                batch: "2023",
                type: "video",
                files: ["tech-fest-highlights.mp4"],
                uploadDate: new Date('2024-01-22'),
                uploader: "Sarah Wilson",
                views: 445,
                likes: 289
            },
            {
                id: 5,
                title: "Cultural Night",
                description: "Celebrating diversity through art and music",
                batch: "2022",
                type: "image",
                files: ["cultural-night-1.jpg", "cultural-night-2.jpg", "cultural-night-3.jpg"],
                uploadDate: new Date('2024-03-05'),
                uploader: "Mike Johnson",
                views: 378,
                likes: 245
            },
            {
                id: 6,
                title: "Farewell Ceremony",
                description: "Goodbye is not forever, it's see you later",
                batch: "2021",
                type: "video",
                files: ["farewell-ceremony.mp4"],
                uploadDate: new Date('2024-04-18'),
                uploader: "Admin",
                views: 567,
                likes: 423
            },
            {
                id: 7,
                title: "Campus Tour",
                description: "Exploring every corner of our beloved campus",
                batch: "2024",
                type: "image",
                files: ["campus-tour-1.jpg", "campus-tour-2.jpg"],
                uploadDate: new Date('2024-06-12'),
                uploader: "Emma Davis",
                views: 189,
                likes: 134
            },
            {
                id: 8,
                title: "Study Group Sessions",
                description: "Learning together, growing together",
                batch: "2023",
                type: "image",
                files: ["study-group.jpg"],
                uploadDate: new Date('2024-07-08'),
                uploader: "Alex Chen",
                views: 267,
                likes: 198
            }
        ];
    }

    renderMemories() {
        const grid = document.getElementById('achievementsGrid');
        const filteredMemories = this.currentFilter === 'all' 
            ? this.memories 
            : this.memories.filter(memory => memory.batch === this.currentFilter);

        grid.innerHTML = '';

        filteredMemories.forEach(memory => {
            const achievementItem = this.createAchievementItem(memory);
            grid.appendChild(achievementItem);
        });

        // Add empty state if no memories
        if (filteredMemories.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; color: #a0aec0; padding: 60px 20px;">
                    <i class="fas fa-photo-video" style="font-size: 4rem; margin-bottom: 20px; opacity: 0.5;"></i>
                    <h3 style="font-size: 1.5rem; margin-bottom: 10px;">No Memories Found</h3>
                    <p style="font-size: 1rem;">Start creating memories by uploading photos and videos!</p>
                </div>
            `;
            grid.appendChild(emptyState);
        }
    }

    createAchievementItem(memory) {
        const item = document.createElement('div');
        item.className = `achievement-item unlocked ${memory.type}`;
        item.setAttribute('data-memory-id', memory.id);

        const icon = this.getMemoryIcon(memory.type, memory.files.length);
        const formattedDate = memory.uploadDate.toLocaleDateString();

        item.innerHTML = `
            <div class="achievement-icon">${icon}</div>
            <div class="achievement-title">${memory.title}</div>
            <div class="achievement-meta">
                <span class="batch-badge">Batch ${memory.batch}</span>
                <div class="achievement-stats">
                    <span class="stat-item">
                        <i class="fas fa-eye"></i>
                        ${this.formatNumber(memory.views)}
                    </span>
                    <span class="stat-item">
                        <i class="fas fa-heart"></i>
                        ${this.formatNumber(memory.likes)}
                    </span>
                </div>
                <span style="font-size: 10px; margin-top: 5px; opacity: 0.8;">${formattedDate}</span>
            </div>
        `;

        item.addEventListener('click', () => {
            this.showMemoryDetail(memory);
        });

        return item;
    }

    getMemoryIcon(type, fileCount) {
        if (type === 'video') {
            return '<i class="fas fa-video"></i>';
        } else if (fileCount > 1) {
            return '<i class="fas fa-images"></i>';
        } else {
            return '<i class="fas fa-image"></i>';
        }
    }

    formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    showUploadModal() {
        const modal = document.getElementById('uploadModal');
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Reset form
        document.getElementById('uploadForm').reset();
        this.uploadedFiles = [];
        this.updateFilePreview();
    }

    showMemoryDetail(memory) {
        const modal = document.getElementById('memoryModal');
        const titleEl = document.getElementById('memoryDetailTitle');
        const contentEl = document.getElementById('memoryDetailContent');
        const descriptionEl = document.getElementById('memoryDetailDescription');
        const batchEl = document.getElementById('memoryDetailBatch');
        const dateEl = document.getElementById('memoryDetailDate');
        const uploaderEl = document.getElementById('memoryDetailUploader');

        titleEl.textContent = memory.title;
        descriptionEl.textContent = memory.description;
        batchEl.textContent = `Batch ${memory.batch}`;
        dateEl.textContent = memory.uploadDate.toLocaleDateString();
        uploaderEl.textContent = `Uploaded by ${memory.uploader}`;

        // Create media grid
        const mediaGrid = document.createElement('div');
        mediaGrid.className = 'memory-media-grid';

        memory.files.forEach(file => {
            const mediaItem = document.createElement('div');
            mediaItem.className = 'memory-media-item';

            if (memory.type === 'video') {
                mediaItem.innerHTML = `
                    <video controls>
                        <source src="placeholder-video.mp4" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                `;
            } else {
                mediaItem.innerHTML = `
                    <img src="https://picsum.photos/400/300?random=${memory.id}" alt="${file}" loading="lazy">
                `;
            }

            mediaGrid.appendChild(mediaItem);
        });

        contentEl.innerHTML = '';
        contentEl.appendChild(mediaGrid);

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    handleFileSelect(files) {
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
                this.uploadedFiles.push(file);
            }
        });
        this.updateFilePreview();
    }

    updateFilePreview() {
        const preview = document.getElementById('filePreview');
        preview.innerHTML = '';

        this.uploadedFiles.forEach((file, index) => {
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';

            if (file.type.startsWith('image/')) {
                const img = document.createElement('img');
                img.src = URL.createObjectURL(file);
                img.alt = file.name;
                previewItem.appendChild(img);
            } else if (file.type.startsWith('video/')) {
                const video = document.createElement('video');
                video.src = URL.createObjectURL(file);
                video.controls = true;
                video.muted = true;
                previewItem.appendChild(video);
            }

            const removeBtn = document.createElement('button');
            removeBtn.className = 'preview-remove';
            removeBtn.innerHTML = '×';
            removeBtn.addEventListener('click', () => {
                this.uploadedFiles.splice(index, 1);
                this.updateFilePreview();
            });

            previewItem.appendChild(removeBtn);
            preview.appendChild(previewItem);
        });
    }

    handleUpload() {
        this.showLoading();

        const title = document.getElementById('memoryTitle').value;
        const description = document.getElementById('memoryDescription').value;
        const batch = document.getElementById('memoryBatch').value;

        if (!title.trim()) {
            alert('Please enter a memory title');
            this.hideLoading();
            return;
        }

        if (this.uploadedFiles.length === 0) {
            alert('Please select at least one file to upload');
            this.hideLoading();
            return;
        }

        // Simulate upload process
        setTimeout(() => {
            const newMemory = {
                id: this.memories.length + 1,
                title: title.trim(),
                description: description.trim() || 'No description provided',
                batch: this.currentUser.role === 'admin' ? batch : this.currentUser.batch,
                type: this.uploadedFiles.some(f => f.type.startsWith('video/')) ? 'video' : 'image',
                files: this.uploadedFiles.map(f => f.name),
                uploadDate: new Date(),
                uploader: this.currentUser.name,
                views: Math.floor(Math.random() * 100),
                likes: Math.floor(Math.random() * 50)
            };

            this.memories.unshift(newMemory);
            this.renderMemories();
            this.closeModal(document.getElementById('uploadModal'));
            this.hideLoading();
            this.showNotification('Memory uploaded successfully!', 'success');
        }, 2000);
    }

    showLoading() {
        document.getElementById('loadingIndicator').style.display = 'block';
    }

    hideLoading() {
        document.getElementById('loadingIndicator').style.display = 'none';
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#48bb78' : '#667eea'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 1002;
            font-weight: 600;
            animation: slideInRight 0.3s ease-out;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    closeModal(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
        document.body.style.overflow = 'auto';
    }

    // Utility method to switch user role (for demo purposes)
    switchUserRole(role, name = null, batch = null) {
        this.currentUser = {
            role: role,
            name: name || (role === 'admin' ? 'Admin User' : 'Student User'),
            batch: batch
        };
        this.updateUIForUserRole();
        this.renderMemories();
    }

    // Search functionality
    searchMemories(query) {
        if (!query.trim()) {
            this.renderMemories();
            return;
        }

        const filteredMemories = this.memories.filter(memory => 
            memory.title.toLowerCase().includes(query.toLowerCase()) ||
            memory.description.toLowerCase().includes(query.toLowerCase()) ||
            memory.uploader.toLowerCase().includes(query.toLowerCase())
        );

        const grid = document.getElementById('achievementsGrid');
        grid.innerHTML = '';

        filteredMemories.forEach(memory => {
            const achievementItem = this.createAchievementItem(memory);
            grid.appendChild(achievementItem);
        });

        if (filteredMemories.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; color: #a0aec0; padding: 60px 20px;">
                    <i class="fas fa-search" style="font-size: 4rem; margin-bottom: 20px; opacity: 0.5;"></i>
                    <h3 style="font-size: 1.5rem; margin-bottom: 10px;">No Results Found</h3>
                    <p style="font-size: 1rem;">Try adjusting your search terms</p>
                </div>
            `;
            grid.appendChild(emptyState);
        }
    }
}

// Add some CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .achievement-item {
        animation: fadeInUp 0.6s ease-out forwards;
        animation-delay: calc(var(--item-index, 0) * 0.1s);
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Initialize the Memory Lane application
document.addEventListener('DOMContentLoaded', function() {
    const memoryLane = new MemoryLane();
    
    // Expose to global scope for demo purposes
    window.memoryLane = memoryLane;
    
    // Add search functionality to header if needed
    const headerControls = document.querySelector('.header-controls');
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search memories...';
    searchInput.className = 'search-input';
    searchInput.style.cssText = `
        padding: 10px 15px;
        border: 2px solid #e0e6ed;
        border-radius: 8px;
        font-size: 14px;
        width: 200px;
        margin-right: 15px;
    `;
    
    searchInput.addEventListener('input', (e) => {
        memoryLane.searchMemories(e.target.value);
    });
    
    headerControls.insertBefore(searchInput, headerControls.firstChild);
    
    // Demo: Add role switching buttons for testing
    if (window.location.hash === '#demo') {
        const demoControls = document.createElement('div');
        demoControls.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            display: flex;
            gap: 10px;
            z-index: 1000;
        `;
        
        const adminBtn = document.createElement('button');
        adminBtn.textContent = 'Switch to Admin';
        adminBtn.style.cssText = `
            padding: 8px 16px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
        `;
        adminBtn.addEventListener('click', () => {
            memoryLane.switchUserRole('admin');
        });
        
        const studentBtn = document.createElement('button');
        studentBtn.textContent = 'Switch to Student';
        studentBtn.style.cssText = `
            padding: 8px 16px;
            background: #48bb78;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
        `;
        studentBtn.addEventListener('click', () => {
            memoryLane.switchUserRole('student', 'John Doe', '2024');
        });
        
        demoControls.appendChild(adminBtn);
        demoControls.appendChild(studentBtn);
        document.body.appendChild(demoControls);
    }
    
    console.log('Memory Lane initialized successfully!');
    console.log('Available methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(memoryLane)));
});