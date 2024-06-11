document.addEventListener('DOMContentLoaded', async function () {
    const params = new URLSearchParams(window.location.search);
    const animeId = params.get('id');
    const username = params.get('username');

    if (!animeId) {
        console.error('ID anime tidak ditemukan di URL');
        return;
    }

    try {
        const response = await fetch(`https://api.jikan.moe/v4/anime/${animeId}`);
        if (!response.ok) {
            throw new Error('Gagal mengambil detail anime');
        }

        const data = await response.json();
        const anime = data.data;

        // Isi detail anime
        document.getElementById('anime-image').src = anime.images.jpg.image_url;
        document.getElementById('anime-title').textContent = `Review: ${anime.title}`;
        document.getElementById('anime-release').textContent = `Release: ${anime.aired.string}`;
        document.getElementById('anime-genre').textContent = `Genre: ${anime.genres.map(g => g.name).join(', ')}`;
        document.getElementById('anime-author').textContent = `Author: ${anime.studios.map(s => s.name).join(', ')}`;
        document.getElementById('anime-rating').textContent = `Rating: ${anime.score}`;
        document.getElementById('anime-description').textContent = anime.synopsis;

        // Tangani pengiriman ulasan
        document.getElementById('review-form').addEventListener('submit', async function (event) {
            event.preventDefault();

            const reviewTextElement = document.getElementById('review-text');
            const reviewRatingElement = document.getElementById('review-rating');

            if (!reviewTextElement || !reviewRatingElement) {
                console.error('Satu atau lebih elemen formulir tidak ditemukan');
                return;
            }

            const reviewText = reviewTextElement.value.trim();
            const reviewRating = reviewRatingElement.value;

            if (reviewText === '' || reviewRating === '') {
                alert('Mohon isi teks ulasan dan rating');
                return;
            }

            const reviewData = {
                title: anime.title,
                rating: parseFloat(reviewRating),
                review: reviewText
            };

            try {
                const token = localStorage.getItem('auth_token');
                if (!token) {
                    alert('Anda tidak memiliki izin. Silakan login kembali.');
                    return;
                }

                // Debug: periksa token yang digunakan
                console.log('Token yang digunakan dari localStorage:', token);

                const reviewResponse = await fetch('https://mylistanime-api.vercel.app/animes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(reviewData)
                });

                // Debug: periksa respons dari server
                const responseBody = await reviewResponse.text();
                console.log('Response body:', responseBody);
                console.log('Response status:', reviewResponse.status);

                if (reviewResponse.ok) {
                    const result = JSON.parse(responseBody);
                    alert('Review berhasil ditambahkan!');
                    window.location.href = `detailAnime.html?id=${animeId}&username=${username}`;
                } else if (reviewResponse.status === 401) {
                    console.error('Error submitting review: Unauthorized');
                    alert('Gagal mengirim review. Anda tidak memiliki izin.');
                } else {
                    console.error('Error submitting review:', responseBody);
                    alert('Gagal mengirim review. Silakan coba lagi.');
                }
            } catch (error) {
                console.error('Error submitting review:', error);
                alert('Terjadi kesalahan. Silakan coba lagi.');
            }
        });
    } catch (error) {
        console.error('Error fetching anime details:', error);
    }
});
