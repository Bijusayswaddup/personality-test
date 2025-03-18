// Session verification
if(!sessionStorage.getItem('adminAuth')) {
    window.location.href = 'admin.html';
}

// Activity tracker
document.addEventListener('mousemove', updateSession);
document.addEventListener('keypress', updateSession);

function updateSession() {
    sessionStorage.setItem('lastActivity', Date.now());
}

function logout() {
    sessionStorage.clear();
    window.location.href = 'admin.html';
}

// Load and display data (same as previous functionality)
function loadResults() {
    const results = JSON.parse(localStorage.getItem('personalityResults')) || [];
    // ... rest of the display logic
}

// Initialize dashboard
loadResults();
setInterval(checkSession, 1000);

function checkSession() {
    const lastActivity = sessionStorage.getItem('lastActivity');
    if(Date.now() - lastActivity > 900000) {
        logout();
    }
}