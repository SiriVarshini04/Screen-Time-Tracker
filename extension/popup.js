const API_URL = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', async () => {
    const { token, userName } = await chrome.storage.local.get(['token', 'userName']);
    if (token) {
        showStatusScreen(userName);
    } else {
        showLoginScreen();
    }
});

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('error-msg');
    
    errorMsg.innerText = '';
    
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            await chrome.storage.local.set({ 
                token: data.token, 
                userName: data.user.name 
            });
            
            // Tell background script to refresh websites now
            chrome.runtime.sendMessage({ action: 'refreshData' });
            
            showStatusScreen(data.user.name);
        } else {
            errorMsg.innerText = data.message || 'Login failed';
        }
    } catch (err) {
        errorMsg.innerText = 'Server unreachable';
    }
});

document.getElementById('logout-btn').addEventListener('click', async () => {
    await chrome.storage.local.clear();
    showLoginScreen();
});

function showLoginScreen() {
    document.getElementById('login-screen').style.display = 'block';
    document.getElementById('status-screen').style.display = 'none';
}

function showStatusScreen(name) {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('status-screen').style.display = 'block';
    document.getElementById('user-greeting').innerText = `Logged in as ${name}`;
}
