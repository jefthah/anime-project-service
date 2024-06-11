document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('auth_token'); // Ambil token dari localStorage
    console.log('Token digunakan untuk mengambil daftar anime:', token); // Debug log token

    fetch('https://mylistanime-api.vercel.app/animes', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Tambahkan header Authorization
        }
    })
    .then(response => {
        console.log('Fetch anime list response status:', response.status);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(animes => {
        console.log('Anime list fetched:', animes);
        const animeListContainer = document.getElementById('anime-list');
        animes.forEach(anime => {
            const card = document.createElement('div');
            card.classList.add('bg-gray-800', 'rounded-lg', 'overflow-hidden', 'shadow-lg');
            card.innerHTML = `
                <img src="${anime.image}" alt="${anime.title}" class="w-full h-48 object-cover">
                <div class="p-4">
                    <h3 class="text-xl font-semibold text-blue-400">${anime.title}</h3>
                    <p class="mt-2">Rating: ${anime.rating}</p>
                    <p class="mt-2">Review: ${anime.review}</p>
                    <p class="mt-2">Genres: ${anime.genres}</p>
                    <p class="mt-2">Episodes: ${anime.episodes}</p>
                    <p class="mt-2">Year: ${anime.year}</p>
                </div>
            `;
            animeListContainer.appendChild(card);
        });
    })
    .catch(error => {
        console.error('Error fetching anime list:', error);
        document.getElementById('anime-list').innerHTML = '<p>Failed to fetch anime list.</p>';
    });

    // Fungsi untuk mendapatkan query parameter
    function getQueryParams() {
        const params = {};
        window.location.search.replace(/^\?/, '').split('&').forEach(param => {
            const [key, value] = param.split('=');
            params[key] = decodeURIComponent(value);
        });
        return params;
    }

    // Fungsi untuk memperbarui email pengguna di navbar
    function updateUserEmail() {
        const params = getQueryParams();
        const email = params.email || localStorage.getItem('email');
        if (email) {
            localStorage.setItem('email', email); // Simpan email ke localStorage
            const userEmailElement = document.getElementById('user-email');
            const mobileUserEmailElement = document.getElementById('mobile-user-email');
            userEmailElement.textContent = email;
            mobileUserEmailElement.textContent = email;
        }
    }

    updateUserEmail();
});

document.getElementById('menu-button').addEventListener('click', function() {
    var menu = document.getElementById('mobile-menu');
    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        menu.style.maxHeight = menu.scrollHeight + 'px';
    } else {
        menu.style.maxHeight = '0';
        menu.addEventListener('transitionend', function() {
            menu.classList.add('hidden');
        }, { once: true });
    }
});
