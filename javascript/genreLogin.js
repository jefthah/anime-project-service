document.addEventListener("DOMContentLoaded", function() {
    // Memuat navbar dari komponen HTML eksternal
    fetch('/html/layout/NavbarLogin.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-container').innerHTML = data;

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

            document.getElementById('search-input').addEventListener('input', function() {
                const query = this.value.trim();
                if (query.length > 2) {
                    performSearch(query, 'search-results');
                } else {
                    clearSearchResults('search-results');
                }
            });

            document.getElementById('mobile-search-input').addEventListener('input', function() {
                const query = this.value.trim();
                if (query.length > 2) {
                    performSearch(query, 'mobile-search-results');
                } else {
                    clearSearchResults('mobile-search-results');
                }
            });

            function performSearch(query, resultContainerId) {
                fetch(`https://api.jikan.moe/v4/anime?q=${query}&limit=10`)
                    .then(response => response.json())
                    .then(data => {
                        const searchResults = document.getElementById(resultContainerId);
                        searchResults.innerHTML = ''; 

                        data.data.forEach(anime => {
                            const resultItem = document.createElement('a');
                            resultItem.href = `/html/detailAnime.html?id=${anime.mal_id}&username=${localStorage.getItem('username')}`;
                            resultItem.classList.add('p-2', 'hover:bg-gray-200', 'cursor-pointer', 'flex', 'items-center');
                            resultItem.innerHTML = `
                                <img src="${anime.images.webp.image_url}" alt="${anime.title}" class="w-12 h-12 object-cover inline-block mr-2">
                                <span>${anime.title}</span>
                            `;
                            searchResults.appendChild(resultItem);
                        });

                        searchResults.classList.remove('hidden');
                    })
                    .catch(error => {
                        console.error('Error fetching search results:', error);
                    });
            }

            function clearSearchResults(resultContainerId) {
                const searchResults = document.getElementById(resultContainerId);
                searchResults.innerHTML = '';
                searchResults.classList.add('hidden');
            }

            updateUserUsername();
        });

    fetchGenres();
});

function getQueryParams() {
    const params = {};
    window.location.search.replace(/^\?/, '').split('&').forEach(param => {
        const [key, value] = param.split('=');
        params[key] = decodeURIComponent(value);
    });
    return params;
}

function fetchGenres() {
    fetch('https://api.jikan.moe/v4/genres/anime?order_by=popularity')
        .then(response => response.json())
        .then(data => {
            const genreContainer = document.getElementById('genre-container');
            genreContainer.innerHTML = ''; // Hapus hasil sebelumnya

            const selectedGenres = [
                1,   // Action
                2,   // Adventure
                5,   // Avant Garde
                46,  // Award Winning
                28,  // Boys Love
                4,   // Comedy
                8,   // Drama
                10,  // Fantasy
                26,  // Girls Love
                14,  // Horror
                7,   // Mystery
                22,  // Romance
                24,  // Sci-Fi
                36,  // Slice of Life
                30,  // Sports
                37,  // Supernatural
                41   // Suspense
            ];

            data.data.forEach(genre => {
                if (selectedGenres.includes(genre.mal_id)) {
                    const genreItem = document.createElement('div');
                    genreItem.classList.add('genre-category');
                    genreItem.id = genre.mal_id;
                    genreItem.textContent = genre.name;
                    genreContainer.appendChild(genreItem);

                    // Tambahkan event listener untuk mengambil anime berdasarkan genre
                    genreItem.addEventListener('click', function() {
                        fetchAnimeByGenre(genre.mal_id, genre.name);
                    });
                }
            });
        })
        .catch(error => {
            console.error('Error fetching genres:', error);
        });
}

function fetchAnimeByGenre(genreId, genreName) {
    console.log(`Fetching anime untuk genre: ${genreName} (ID: ${genreId})`);
    const loadingSpinner = document.getElementById('loading-spinner');
    loadingSpinner.classList.remove('hidden');

    fetch(`https://api.jikan.moe/v4/anime?genres=${genreId}&order_by=popularity`)
        .then(response => response.json())
        .then(data => {
            console.log('Data anime yang diterima:', data); // Log data anime yang diterima
            const animeContainer = document.getElementById('anime-container');
            animeContainer.innerHTML = ''; // Hapus hasil sebelumnya

            data.data.forEach(anime => {
                const animeItem = document.createElement('div');
                animeItem.classList.add('anime-item', 'bg-gray-800', 'rounded-lg', 'overflow-hidden', 'shadow-lg', 'text-white');
                animeItem.innerHTML = `
                    <img src="${anime.images.webp?.image_url}" alt="${anime.title}" class="w-full h-48 object-cover">
                    <div class="p-4">
                        <h3 class="text-lg font-bold mt-2">${anime.title}</h3>
                        <p class="text-gray-400">Rating: ${anime.score || 'N/A'}</p>
                        <p class="text-gray-400">Tahun: ${anime.year || 'N/A'}</p>
                        <button class="mt-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700" onclick="window.location.href='/html/detailAnime.html?id=${anime.mal_id}&username=${localStorage.getItem('username')}'">Pelajari Lebih Lanjut</button>
                    </div>
                `;
                animeContainer.appendChild(animeItem);
            });

            document.getElementById('selected-genre').textContent = `> ${genreName}`;
            loadingSpinner.classList.add('hidden');

            // Hapus kelas aktif dari semua item genre
            document.querySelectorAll('.genre-category').forEach(item => {
                item.classList.remove('active');
            });

            // Tambahkan kelas aktif ke item genre yang dipilih
            document.getElementById(genreId).classList.add('active');
        })
        .catch(error => {
            console.error('Error fetching anime:', error);
            loadingSpinner.classList.add('hidden');
        });
}

async function fetchLatestReviews(page = 1) {
    const loadingElement = document.getElementById('loading-review');
    const reviewCardsContainer = document.getElementById('review-cards');
    
    try {
        const response = await fetch(`https://mylistanime-api-anime.vercel.app/animes/reviews?page=${page}`);
        const data = await response.json();

        data.forEach(review => {
            const card = document.createElement('div');
            card.classList.add('flex', 'items-start', 'space-x-4', 'bg-gray-800', 'rounded-lg', 'overflow-hidden', 'shadow-lg', 'p-4');
            card.innerHTML = `
                <img src="${review.image}" alt="${review.title}" class="w-24 h-24 object-cover flex-shrink-0">
                <div>
                    <h3 class="text-xl font-semibold">${review.title}</h3>
                    <p class="mt-1 text-gray-400">Rating: ${review.rating}</p>
                    <p class="mt-2">${review.review}</p>
                    <p class="mt-2 text-blue-400">username: ${review.user.username}</p>
                </div>
            `;
            reviewCardsContainer.prepend(card); // Tambahkan kartu di bagian awal kontainer
        });
        
        if (data.length > 0) {
            const loadMoreButton = document.createElement('button');
            loadMoreButton.textContent = 'Muat Ulang Review';
            loadMoreButton.classList.add('mt-4', 'bg-purple-600', 'text-white', 'px-4', 'py-2', 'rounded', 'hover:bg-purple-700');
            loadMoreButton.addEventListener('click', () => {
                loadMoreButton.remove();
                fetchLatestReviews(page + 1);
            });
            reviewCardsContainer.appendChild(loadMoreButton);
        }
    } catch (error) {
        console.error('Error fetching latest review data:', error);
    } finally {
        loadingElement.style.display = 'none';
    }
}

function updateUserUsername() {
    const params = getQueryParams();
    const username = params.username || localStorage.getItem('username');
    if (username) {
        localStorage.setItem('username', username); // Simpan username ke localStorage jika ada di query params
        const userUsernameElement = document.getElementById('user-username');
        const mobileUserUsernameElement = document.getElementById('mobile-user-username');
        userUsernameElement.textContent = username;
        mobileUserUsernameElement.textContent = username;
    }
}
