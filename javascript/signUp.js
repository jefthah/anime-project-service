document.getElementById('signup-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent form from submitting the default way
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
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        notification.textContent = result.message;
        notification.classList.remove('text-green-500', 'text-red-500');
        if (response.ok && !result.error) {
            notification.classList.add('text-green-500');
            setTimeout(() => {
                window.location.href = './login.html';
            }, 0); // Redirect after 0 seconds
        } else {
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
