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
            // Debug: periksa respons dari server
            console.log('Respons login:', result);

            // Simpan token ke localStorage
            const token = result.loginResult.token;
            localStorage.setItem('auth_token', token);

            // Debug: periksa apakah token disimpan
            const storedToken = localStorage.getItem('auth_token');
            console.log('Token disimpan di localStorage:', storedToken);
            
            if (storedToken !== token) {
                console.error('Token yang disimpan tidak sesuai dengan token yang diterima dari API');
            }

            // Redirect ke homeLogin.html dengan username di query params
            window.location.href = `../html/homeLogin.html?username=${encodeURIComponent(result.loginResult.username)}`;
        } else {
            alert(result.message || 'Login gagal');
        }
    } catch (error) {
        console.error('Kesalahan saat login:', error);
        alert('Terjadi kesalahan koneksi');
    }
});
