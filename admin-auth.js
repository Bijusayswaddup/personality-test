function validateAdmin() {
    const username = document.getElementById('adminName').value.trim();
    const loginMessage = document.getElementById('loginMessage');
    
    if (username === "bijuthebatman") {
        sessionStorage.setItem('adminAuth', 'true');
        window.location.href = 'dashboard.html';
    } else {
        loginMessage.textContent = "Access denied! You're not Biju!";
        loginMessage.classList.remove('hidden');
        setTimeout(() => loginMessage.classList.add('hidden'), 3000);
    }
}