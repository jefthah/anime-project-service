document.addEventListener('DOMContentLoaded', async function() {
    const params = new URLSearchParams(window.location.search);
    const animeId = params.get('id');
    const email = params.get('email');
    
    if (!animeId) {
        console.error('No anime ID found in URL');
        return;
    }

    try {
        // Fetch Anime Details
        const response = await fetch(`https://api.jikan.moe/v4/anime/${animeId}`);
        const data = await response.json();
        const anime = data.data;

        // Populate Anime Details
        document.getElementById('anime-image').src = anime.images.jpg.image_url;
        document.getElementById('anime-title').textContent = `Review: ${anime.title}`;
        document.getElementById('anime-release').textContent = `Release: ${anime.aired.string}`;
        document.getElementById('anime-genre').textContent = `Genre: ${anime.genres.map(g => g.name).join(', ')}`;
        document.getElementById('anime-author').textContent = `Author: ${anime.studios.map(s => s.name).join(', ')}`;
        document.getElementById('anime-rating').textContent = `Rating: ${anime.score}`;
        document.getElementById('anime-description').textContent = anime.synopsis;

        // Handle Review Submission
        document.getElementById('review-form').addEventListener('submit', async function(event) {
            event.preventDefault();

            const reviewerName = document.getElementById('reviewer-name').value;
            const reviewText = document.getElementById('review-text').value;
            const reviewRating = document.getElementById('review-rating').value;

            const reviewData = {
                title: anime.title,
                rating: reviewRating,
                review: reviewText
            };

            try {
                const reviewResponse = await fetch('https://mylistanime-docs.vercel.app/api/animes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(reviewData)
                });

                if (reviewResponse.ok) {
                    const result = await reviewResponse.json();
                    alert('Review berhasil ditambahkan!');
                    window.location.href = `detailAnime.html?id=${animeId}&email=${email}`;
                } else {
                    console.error('Error submitting review:', reviewResponse.statusText);
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
