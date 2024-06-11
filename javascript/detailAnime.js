document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const animeId = params.get('id');
    const email = params.get('email');

    // Fungsi untuk memperbarui email pengguna di navbar
    function updateUserEmail() {
        const email = localStorage.getItem('email');
        if (email) {
            const userEmailElement = document.getElementById('user-email');
            const mobileUserEmailElement = document.getElementById('mobile-user-email');
            userEmailElement.textContent = email;
            mobileUserEmailElement.textContent = email;
        }
    }

    if (email) {
        localStorage.setItem('email', email);
        document.getElementById('home-link').href = `homeLogin.html?email=${email}`;
    } else {
        const storedEmail = localStorage.getItem('email');
        if (storedEmail) {
            document.getElementById('home-link').href = `homeLogin.html?email=${storedEmail}`;
        }
    }

    updateUserEmail();

    if (!animeId) {
        console.error('No anime ID found in URL');
        return;
    }

    // Atur link Write Reviews dengan parameter
    const writeReviewLink = document.getElementById('write-review-link');
    writeReviewLink.href = `../html/reviewPage.html?id=${animeId}&email=${email || localStorage.getItem('email')}`;

    // Fetch Anime Details
    fetch(`https://api.jikan.moe/v4/anime/${animeId}`)
        .then(response => response.json())
        .then(data => {
            const anime = data.data;

            document.getElementById('anime-image').src = anime.images.jpg.image_url;
            document.getElementById('anime-title').textContent = anime.title;
            document.getElementById('anime-release').textContent = `Release: ${anime.aired.string}`;
            document.getElementById('anime-genre').textContent = `Genre: ${anime.genres.map(g => g.name).join(', ')}`;
            document.getElementById('anime-author').textContent = `Author: ${anime.studios.map(s => s.name).join(', ')}`;
            document.getElementById('anime-rating').textContent = `Rating: ${anime.score}`;
            document.getElementById('anime-description').textContent = anime.synopsis;
            document.getElementById('anime-trailer-title').textContent = `${anime.title} Trailer`;

            // Populate Anime Trailer
            if (anime.trailer.embed_url) {
                document.getElementById('anime-trailer').innerHTML = `
                    <iframe width="100%" height="100%" src="${anime.trailer.embed_url}" frameborder="0" allowfullscreen></iframe>
                `;
            } else {
                document.getElementById('anime-trailer').textContent = 'No trailer available';
            }

            // Fetch Related Anime
            return fetch(`https://api.jikan.moe/v4/anime/${animeId}/recommendations`);
        })
        .then(response => response.json())
        .then(relatedData => {
            const relatedAnimeContainer = document.getElementById('related-anime');

            relatedData.data.slice(0, 4).forEach(recommendation => {
                const relatedAnime = recommendation.entry;
                const card = document.createElement('div');
                card.classList.add('bg-gray-800', 'rounded-lg', 'overflow-hidden', 'shadow-lg');
                card.innerHTML = `
                    <img src="${relatedAnime.images.jpg.image_url}" alt="${relatedAnime.title}" class="w-full h-48 object-cover">
                    <div class="p-4">
                        <a href="detailAnime.html?id=${relatedAnime.mal_id}&email=${email || localStorage.getItem('email')}" class="text-xl font-semibold text-blue-400 hover:text-blue-600">${relatedAnime.title}</a>
                        <p class="mt-2">Rating: ${relatedAnime.score || 'N/A'}</p>
                    </div>
                `;
                relatedAnimeContainer.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error fetching anime details:', error);
        });

    // Fetch and Display Reviews
    const token = localStorage.getItem('auth_token'); // Ambil token dari localStorage
    console.log('Token digunakan untuk mengambil reviews:', token); // Debug log token

    fetch(`https://mylistanime-api.vercel.app/animes/${animeId}/reviews`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Tambahkan header Authorization
        }
    })
    .then(response => {
        console.log('Fetch reviews response status:', response.status);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(reviews => {
        console.log('Reviews fetched:', reviews);
        const reviewsContainer = document.getElementById('anime-reviews');
        if (reviews.length === 0) {
            reviewsContainer.innerHTML = '<p>No reviews available.</p>';
            return;
        }
        reviews.forEach(review => {
            const reviewElement = document.createElement('div');
            reviewElement.classList.add('bg-gray-800', 'p-4', 'rounded-lg', 'shadow-lg');
            reviewElement.innerHTML = `
                <h3 class="text-xl font-semibold">${review.title}</h3>
                <p class="mt-2">${review.review}</p>
                <p class="mt-2">Rating: ${review.rating}</p>
            `;
            reviewsContainer.appendChild(reviewElement);
        });
    })
    .catch(error => {
        console.error('Error fetching reviews:', error);
        document.getElementById('anime-reviews').innerHTML = '<p>Failed to fetch reviews.</p>';
    });
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
