const API_URL = 'http://localhost:5000/api';

// Utility for making API requests with tokens
async function apiRequest(endpoint, method = 'GET', body = null) {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };

    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(`${API_URL}${endpoint}`, options);
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message || 'API Error');
    }
    return data;
}

// Display error messages
function showError(msgStr) {
    const el = document.getElementById('error-msg');
    if (el) {
        el.textContent = msgStr;
        el.className = 'alert alert-error';
        setTimeout(() => { el.style.display = 'none'; }, 5000);
    } else {
        alert(msgStr);
    }
}

// Check role
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

function checkAdminAuth() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
        window.location.href = 'admin-login.html';
    }
}

// ==== Theme Handling ====
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark'; // Default to dark we just made
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    }
}

function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
}

// Run immediately to prevent flash
initTheme();
