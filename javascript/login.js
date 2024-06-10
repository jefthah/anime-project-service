function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eye-icon');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    }
}

document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Mencegah form dari submit secara default
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('https://mylistanime-api.vercel.app/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (response.ok && !result.error) {
            // Redirect ke index.html dengan email di query params
            window.location.href = `../html/homeLogin.html?email=${encodeURIComponent(result.loginResult.email)}`;
        } else {
            alert(result.message || 'Login gagal');
        }
    } catch (error) {
        alert('Terjadi kesalahan koneksi');
    }
});
