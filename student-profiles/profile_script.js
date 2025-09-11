// Simple & Clean Profile JavaScript

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadProfile();
    setupEventListeners();
    updateBioCounter();
    updateDisplay();
});

// Setup all event listeners
function setupEventListeners() {
    // Profile picture upload
    const fileInput = document.getElementById('fileInput');
    fileInput?.addEventListener('change', handleImageUpload);
    
    // Auto-save inputs
    const inputs = document.querySelectorAll('input, select, textarea, [contenteditable]');
    inputs.forEach(input => {
        if (input.contentEditable === 'true') {
            input.addEventListener('blur', saveProfile);
            input.addEventListener('input', handleContentChange);
        } else {
            input.addEventListener('change', saveProfile);
            input.addEventListener('input', handleInputChange);
        }
    });
    
    // Bio counter
    const bioTextarea = document.getElementById('bio');
    bioTextarea?.addEventListener('input', updateBioCounter);
    
    // Job status change
    const jobStatus = document.getElementById('jobStatus');
    jobStatus?.addEventListener('change', updateStatusBadge);
    
    // Batch year change
    const batchYear = document.getElementById('batchYear');
    batchYear?.addEventListener('input', updateDisplay);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboard);
}

// Handle image upload
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file
    if (!file.type.startsWith('image/')) {
        showToast('Please select an image file', 'error');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        showToast('Image size should be less than 5MB', 'error');
        return;
    }
    
    // Read and display
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = document.getElementById('profilePicture');
        if (img) {
            img.src = e.target.result;
            localStorage.setItem('profilePicture', e.target.result);
            showToast('Profile picture updated!');
        }
    };
    reader.readAsDataURL(file);
}

// Handle content changes for contenteditable elements
function handleContentChange(event) {
    const element = event.target;
    
    if (element.id === 'profileName') {
        if (element.textContent.length > 50) {
            showToast('Name should be less than 50 characters', 'error');
        }
        updateDisplay();
    }
    
    // Auto-save after 1 second of no typing
    clearTimeout(element.saveTimeout);
    element.saveTimeout = setTimeout(saveProfile, 1000);
}

// Handle regular input changes
function handleInputChange(event) {
    const element = event.target;
    
    if (element.id === 'batchYear') {
        const year = parseInt(element.value);
        const currentYear = new Date().getFullYear();
        
        if (year < 1950 || year > currentYear + 10) {
            element.style.borderColor = 'var(--error)';
            showToast('Please enter a valid year', 'error');
        } else {
            element.style.borderColor = '';
            updateDisplay();
        }
    }
    
    if (element.id === 'bio') {
        updateBioCounter();
    }
    
    // Auto-save
    clearTimeout(element.saveTimeout);
    element.saveTimeout = setTimeout(saveProfile, 1000);
}

// Update bio character counter
function updateBioCounter() {
    const bioTextarea = document.getElementById('bio');
    const bioCount = document.getElementById('bioCount');
    
    if (bioTextarea && bioCount) {
        const length = bioTextarea.value.length;
        bioCount.textContent = length;
        
        // Change color based on length
        if (length > 550) {
            bioCount.style.color = 'var(--error)';
        } else if (length > 450) {
            bioCount.style.color = 'var(--warning)';
        } else {
            bioCount.style.color = 'var(--text-light)';
        }
    }
}

// Update status badge
function updateStatusBadge() {
    const jobStatus = document.getElementById('jobStatus');
    const statusBadge = document.getElementById('statusBadge');
    
    if (!jobStatus || !statusBadge) return;
    
    const statusMap = {
        'employed': { icon: 'fas fa-briefcase', text: 'Employed' },
        'unemployed': { icon: 'fas fa-search', text: 'Open to opportunities' },
        'student': { icon: 'fas fa-graduation-cap', text: 'Student' },
        'freelancer': { icon: 'fas fa-laptop', text: 'Freelancer' },
        'entrepreneur': { icon: 'fas fa-rocket', text: 'Entrepreneur' }
    };
    
    const status = statusMap[jobStatus.value] || statusMap['employed'];
    statusBadge.innerHTML = `<i class="${status.icon}"></i>${status.text}`;
    
    saveProfile();
}

// Update display elements
function updateDisplay() {
    const batchYear = document.getElementById('batchYear')?.value;
    const batchDisplay = document.getElementById('batchDisplay');
    
    if (batchYear && batchDisplay) {
        batchDisplay.textContent = batchYear;
    }
}

// Save profile data
function saveProfile() {
    const data = {
        name: document.getElementById('profileName')?.textContent || '',
        jobStatus: document.getElementById('jobStatus')?.value || '',
        batchYear: document.getElementById('batchYear')?.value || '',
        jobTitle: document.getElementById('jobTitle')?.value || '',
        location: document.getElementById('location')?.value || '',
        bio: document.getElementById('bio')?.value || '',
        social: {
            linkedin: document.getElementById('linkedin')?.value || '',
            github: document.getElementById('github')?.value || '',
            twitter: document.getElementById('twitter')?.value || '',
            instagram: document.getElementById('instagram')?.value || ''
        },
        experience: getTimelineData('experienceList'),
        education: getTimelineData('educationList'),
        skills: getSkillsData(),
        lastSaved: new Date().toISOString()
    };
    
    try {
        localStorage.setItem('userProfile', JSON.stringify(data));
        
        // Visual feedback on save button
        const saveBtn = document.querySelector('.btn-save');
        if (saveBtn) {
            const originalText = saveBtn.innerHTML;
            saveBtn.innerHTML = '<i class="fas fa-check"></i>Saved!';
            saveBtn.style.background = 'var(--success)';
            
            setTimeout(() => {
                saveBtn.innerHTML = originalText;
                saveBtn.style.background = '';
            }, 2000);
        }
        
    } catch (error) {
        showToast('Error saving profile', 'error');
        console.error('Save error:', error);
    }
}

// Load profile data
function loadProfile() {
    try {
        const saved = localStorage.getItem('userProfile');
        const savedImage = localStorage.getItem('profilePicture');
        
        if (saved) {
            const data = JSON.parse(saved);
            
            // Load basic info
            setValue('profileName', data.name, 'textContent');
            setValue('jobStatus', data.jobStatus, 'value');
            setValue('batchYear', data.batchYear, 'value');
            setValue('jobTitle', data.jobTitle, 'value');
            setValue('location', data.location, 'value');
            setValue('bio', data.bio, 'value');
            
            // Load social links
            if (data.social) {
                setValue('linkedin', data.social.linkedin, 'value');
                setValue('github', data.social.github, 'value');
                setValue('twitter', data.social.twitter, 'value');
                setValue('instagram', data.social.instagram, 'value');
            }
            
            // Load timeline data
            if (data.experience) loadTimelineData('experienceList', data.experience);
            if (data.education) loadTimelineData('educationList', data.education);
            if (data.skills) loadSkillsData(data.skills);
            
            updateStatusBadge();
            updateDisplay();
            updateBioCounter();
        }
        
        // Load profile picture
        if (savedImage) {
            const img = document.getElementById('profilePicture');
            if (img) img.src = savedImage;
        }
        
    } catch (error) {
        console.error('Load error:', error);
    }
}

function setValue(id, value, property) {
    const element = document.getElementById(id);
    if (element && value) {
        element[property] = value;
    }
}

// Get timeline data
function getTimelineData(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return [];
    
    const items = container.querySelectorAll('.timeline-item');
    return Array.from(items).map(item => ({
        title: item.querySelector('h4')?.textContent || '',
        company: item.querySelector('p')?.textContent || '',
        duration: item.querySelector('span')?.textContent || '',
        description: item.querySelector('.description')?.textContent || ''
    }));
}

// Load timeline data
function loadTimelineData(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container || !data.length) return;
    
    container.innerHTML = '';
    data.forEach(item => {
        const element = createTimelineItem(item);
        container.appendChild(element);
    });
}

// Get skills data
function getSkillsData() {
    const container = document.getElementById('skillsContainer');
    if (!container) return [];
    
    const skills = container.querySelectorAll('.skill-tag');
    return Array.from(skills).map(skill => skill.textContent);
}

// Load skills data
function loadSkillsData(skills) {
    const container = document.getElementById('skillsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    skills.forEach(skill => {
        const tag = document.createElement('span');
        tag.className = 'skill-tag';
        tag.textContent = skill;
        tag.onclick = () => removeSkill(tag);
        container.appendChild(tag);
    });
}

// Create timeline item
function createTimelineItem(data = {}) {
    const item = document.createElement('div');
    item.className = 'timeline-item';
    item.innerHTML = `
        <div class="timeline-dot"></div>
        <div class="timeline-content">
            <h4 contenteditable="true">${data.title || 'Position Title'}</h4>
            <p contenteditable="true">${data.company || 'Company Name'}</p>
            <span contenteditable="true">${data.duration || 'Start - End Date'}</span>
            <div class="description" contenteditable="true">${data.description || 'Description of role and achievements...'}</div>
            <button class="btn-remove" onclick="removeItem(this)">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    // Add event listeners to new contenteditable elements
    const editables = item.querySelectorAll('[contenteditable]');
    editables.forEach(el => {
        el.addEventListener('blur', saveProfile);
        el.addEventListener('input', handleContentChange);
    });
    
    return item;
}

// Add experience
function addExperience() {
    const container = document.getElementById('experienceList');
    if (!container) return;
    
    const item = createTimelineItem();
    container.appendChild(item);
    
    // Focus on title
    const title = item.querySelector('h4');
    if (title) {
        title.focus();
        title.textContent = '';
    }
    
    showToast('Experience added! Click to edit.');
    saveProfile();
}

// Add education
function addEducation() {
    const container = document.getElementById('educationList');
    if (!container) return;
    
    const item = createTimelineItem({
        title: 'Degree Name',
        company: 'Institution Name',
        duration: 'Year - Year',
        description: 'Details about your education...'
    });
    container.appendChild(item);
    
    // Focus on title
    const title = item.querySelector('h4');
    if (title) {
        title.focus();
        title.textContent = '';
    }
    
    showToast('Education added! Click to edit.');
    saveProfile();
}

// Add skill
function addSkill() {
    const skillName = prompt('Enter skill name:');
    if (!skillName || !skillName.trim()) return;
    
    const container = document.getElementById('skillsContainer');
    if (!container) return;
    
    const tag = document.createElement('span');
    tag.className = 'skill-tag';
    tag.textContent = skillName.trim();
    tag.onclick = () => removeSkill(tag);
    
    container.appendChild(tag);
    showToast('Skill added!');
    saveProfile();
}

// Remove item
function removeItem(button) {
    const item = button.closest('.timeline-item');
    if (item && confirm('Remove this item?')) {
        item.remove();
        showToast('Item removed');
        saveProfile();
    }
}

// Remove skill
function removeSkill(tag) {
    if (confirm('Remove this skill?')) {
        tag.remove();
        showToast('Skill removed');
        saveProfile();
    }
}

// Share profile
function shareProfile() {
    const name = document.getElementById('profileName')?.textContent || 'Alumni';
    const bio = document.getElementById('bio')?.value || '';
    const batch = document.getElementById('batchYear')?.value || '';
    
    const shareText = `🎓 ${name} - Alumni Profile

${bio.substring(0, 200)}${bio.length > 200 ? '...' : ''}

Class of ${batch} | AlumniConnect

#Alumni #Networking`;
    
    if (navigator.share) {
        navigator.share({
            title: `${name} - Alumni Profile`,
            text: shareText,
            url: window.location.href
        }).catch(console.error);
    } else {
        navigator.clipboard.writeText(shareText).then(() => {
            showToast('Profile details copied to clipboard!');
        }).catch(() => {
            showToast('Share feature not supported', 'error');
        });
    }
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const messageEl = document.getElementById('toastMessage');
    const icon = toast?.querySelector('.toast-icon i');
    
    if (!toast || !messageEl) return;
    
    messageEl.textContent = message;
    
    // Update icon and color
    if (icon) {
        if (type === 'error') {
            icon.className = 'fas fa-exclamation-circle';
            toast.style.borderLeftColor = 'var(--error)';
        } else {
            icon.className = 'fas fa-check-circle';
            toast.style.borderLeftColor = 'var(--success)';
        }
    }
    
    toast.classList.add('show');
    
    // Auto hide after 3 seconds
    setTimeout(hideToast, 3000);
}

// Hide toast
function hideToast() {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.classList.remove('show');
    }
}

// Handle keyboard shortcuts
function handleKeyboard(event) {
    // Ctrl/Cmd + S to save
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        saveProfile();
        showToast('Profile saved!');
    }
    
    // Escape to blur
    if (event.key === 'Escape') {
        document.activeElement?.blur();
    }
}

// Initialize smooth animations
function initAnimations() {
    const sections = document.querySelectorAll('.section');
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            section.style.transition = 'all 0.4s ease';
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    console.log('Profile page loaded successfully!');
    setTimeout(initAnimations, 100);
});