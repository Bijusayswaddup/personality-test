const SESSION_TIMEOUT = 900000; // 15 minutes

async function validateAdmin() {
    const username = document.getElementById('adminName').value.trim();
    const password = document.getElementById('adminPass').value;
    const loginMessage = document.getElementById('loginMessage');
    
    try {
        const response = await fetch('admin.json');
        const adminData = await response.json();
        
        if(username !== adminData.adminCredentials.username) {
            showError("Invalid credentials");
            return;
        }
        
        // Hash verification
        const salt = adminData.adminCredentials.salt;
        const storedHash = adminData.adminCredentials.hash;
        const encoder = new TextEncoder();
        const data = encoder.encode(password + salt);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const inputHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        if(inputHash === storedHash) {
            // Create secure session
            sessionStorage.setItem('adminAuth', 'true');
            sessionStorage.setItem('lastActivity', Date.now());
            window.location.href = 'dashboard.html';
        } else {
            showError("Nice try, Joker!");
        }
    } catch (error) {
        showError("Batcomputer offline. Try again!");
        console.error('Auth error:', error);
    }
}

function showError(message) {
    const loginMessage = document.getElementById('loginMessage');
    loginMessage.textContent = message;
    loginMessage.classList.remove('hidden');
    document.getElementById('adminPass').value = '';
    setTimeout(() => loginMessage.classList.add('hidden'), 3000);
}

// Session timeout check
setInterval(() => {
    const lastActivity = sessionStorage.getItem('lastActivity');
    if(Date.now() - lastActivity > SESSION_TIMEOUT) {
        sessionStorage.clear();
    }
}, 60000);