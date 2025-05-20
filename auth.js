document.addEventListener('DOMContentLoaded', () => {
    const authButton = document.getElementById('authButton');
    const authError = document.getElementById('authError');
    let users = JSON.parse(localStorage.getItem('users')) || [];

    authButton.addEventListener('click', () => {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (!username || !password) {
            authError.textContent = "Please provide username and password.";
            return;
        }

        const existingUser = users.find(user => user.username === username);

        if (existingUser) {
            // Login
            if (existingUser.password === password) {
                window.location.href = 'navigation.html';
            } else {
                authError.textContent = "Invalid username or password.";
            }
        } else {
            // Signup
            users.push({ username, password });
            localStorage.setItem('users', JSON.stringify(users));
            authError.textContent = "Account created. Please login.";
        }
    });
});

