document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const animeId = params.get('id');
    const email = params.get('email');

    if (email) {
        localStorage.setItem('email', email);
        document.getElementById('home-link').href = `homeLogin.html?email=${email}`;
    }

    if (!animeId) {
        console.error('No anime ID found in URL');
        return;
    }

    // Atur link Write Reviews dengan parameter
    const writeReviewLink = document.getElementById('write-review-link');
    writeReviewLink.href = `../html/reviewPage.html?id=${animeId}&email=${email}`;

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
                        <a href="detailAnime.html?id=${relatedAnime.mal_id}&email=${email}" class="text-xl font-semibold text-blue-400 hover:text-blue-600">${relatedAnime.title}</a>
                        <p class="mt-2">Rating: ${relatedAnime.score || 'N/A'}</p>
                    </div>
                `;
                relatedAnimeContainer.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error fetching anime details:', error);
        });
});
