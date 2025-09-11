// Login/Register UI Logic and API Integration

// Tab switching
function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.form-container').forEach(form => form.classList.remove('active'));

    if (tab === 'login') {
        document.querySelector('.tab-btn:nth-child(1)').classList.add('active');
        document.getElementById('loginForm').classList.add('active');
    } else {
        document.querySelector('.tab-btn:nth-child(2)').classList.add('active');
        document.getElementById('registerForm').classList.add('active');
    }
}

// Allow tab switching from JS (used after registration success)
function switchTabProgrammatically(tab) {
    switchTab(tab);
}

// Password show/hide
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
        input.type = input.type === 'password' ? 'text' : 'password';
    }
}

// Show loading spinner on submit button
function showLoadingState(form) {
    const btn = form.querySelector('.auth-btn');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<span>Processing</span> <span class="loading"></span>`;
    }
}

// Hide loading spinner, restore button text
function hideLoadingState(form) {
    const btn = form.querySelector('.auth-btn');
    if (btn) {
        btn.disabled = false;
        btn.innerHTML = btn.getAttribute('data-original-text') || btn.innerHTML;
    }
}

// Message display
function showMessage(msg, type) {
    // Remove existing messages
    document.querySelectorAll('.message').forEach(msgEl => msgEl.remove());
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.innerText = msg;
    // Insert above first form
    const card = document.querySelector('.login-card');
    card.insertBefore(message, card.firstChild);
    setTimeout(() => message.remove(), 4000);
}

// Registration validation
function validateRegistrationData(firstName, lastName, email, phone, batch, department, password, confirmPassword, terms) {
    if (!firstName || !lastName || !email || !phone || !batch || !department || !password || !confirmPassword || !terms) {
        showMessage('Please fill in all required fields and agree to Terms & Conditions.', 'error');
        return false;
    }
    if (!isValidEmail(email)) {
        showMessage('Please enter a valid email address.', 'error');
        return false;
    }
    if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
        showMessage('Enter a valid 10-digit phone number.', 'error');
        return false;
    }
    if (password.length < 6) {
        showMessage('Password should be at least 6 characters.', 'error');
        return false;
    }
    if (password !== confirmPassword) {
        showMessage('Passwords do not match.', 'error');
        return false;
    }
    return true;
}

// Email format validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// LOGIN handler
function handleLogin(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const email = formData.get('email');
    const password = formData.get('password');
    const remember = formData.get('remember');

    showLoadingState(form);

    fetch('http://127.0.0.1:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(async res => {
        const data = await res.json();
        if (res.ok) {
            showMessage('Login successful! Redirecting...', 'success');
            if (remember) localStorage.setItem('userEmail', email);
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('userEmail', email);
            setTimeout(() => window.location.href = 'index.html', 1500);
        } else {
            showMessage(data.detail || 'Invalid email or password.', 'error');
            hideLoadingState(form);
        }
    })
    .catch(() => {
        showMessage('Server error. Please try again later.', 'error');
        hideLoadingState(form);
    });
}

// REGISTER handler
function handleRegister(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const batch = formData.get('batch');
    const department = formData.get('department');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const terms = formData.get('terms');

    if (!validateRegistrationData(firstName, lastName, email, phone, batch, department, password, confirmPassword, terms)) {
        return;
    }

    showLoadingState(form);

    fetch('http://127.0.0.1:8000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            firstName, lastName, email, phone, batch, department, password,
            registrationDate: new Date().toISOString()
        })
    })
    .then(async res => {
        const data = await res.json();
        if (res.ok) {
            showMessage('Registration successful!', 'success');
            setTimeout(() => {
                switchTabProgrammatically('login');
                document.getElementById('loginEmail').value = email;
                hideLoadingState(form);
            }, 2000);
        } else {
            showMessage(data.detail || 'Registration failed.', 'error');
            hideLoadingState(form);
        }
    })
    .catch(() => {
        showMessage('Server error. Please try again later.', 'error');
        hideLoadingState(form);
    });
}

// Setup initial button text (for loading state restore)
document.querySelectorAll('.auth-form').forEach(form => {
    const btn = form.querySelector('.auth-btn');
    if (btn) btn.setAttribute('data-original-text', btn.innerHTML);
});

// Attach tab events (if not already in HTML)
document.querySelectorAll('.tab-btn').forEach((btn, idx) => {
    btn.onclick = () => switchTab(idx === 0 ? 'login' : 'register');
});

// Default tab: login
switchTab('login');