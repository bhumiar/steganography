document.getElementById('loginButton').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('loginPassword').value;

    if (username === 'user' && password === 'pass') {
        window.location.href = 'embed.html';
    } else {
        document.getElementById('loginError').innerText = 'Invalid username or password.';
    }
});