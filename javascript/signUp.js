document.getElementById('signup-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent form from submitting the default way
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const notification = document.getElementById('notification');

    if (password !== confirmPassword) {
        notification.textContent = 'Password dan Konfirmasi Password tidak cocok';
        notification.classList.remove('text-green-500');
        notification.classList.add('text-red-500');
        return;
    }

    try {
        const response = await fetch('https://mylistanime-api.vercel.app/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        const result = await response.json();

        notification.classList.remove('text-green-500', 'text-red-500');

        if (response.status === 200) {
            notification.textContent = 'Akun berhasil dibuat';
            notification.classList.add('text-green-500');
            setTimeout(() => {
                window.location.href = './login.html';
            }, 2000); // Redirect after 2 seconds
        } else if (response.status === 400) {
            notification.textContent = 'Email atau password belum diisi';
            notification.classList.add('text-red-500');
        } else if (response.status === 409) {
            notification.textContent = 'Email telah terdaftar';
            notification.classList.add('text-red-500');
        } else {
            notification.textContent = result.message || 'Terjadi kesalahan koneksi';
            notification.classList.add('text-red-500');
        }
    } catch (error) {
        notification.textContent = 'Terjadi kesalahan koneksi';
        notification.classList.remove('text-green-500');
        notification.classList.add('text-red-500');
    }
});

function togglePasswordVisibility(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}
