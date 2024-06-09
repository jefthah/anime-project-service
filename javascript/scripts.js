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

async function fetchTopAnime() {
    const loadingElement = document.getElementById('loading-top-anime');
    const animeCardsContainer = document.getElementById('anime-cards');
    
    try {
        const response = await fetch('https://api.jikan.moe/v4/top/anime');
        const data = await response.json();
        const top8Anime = data.data.slice(0, 8);

        top8Anime.forEach(anime => {
            const card = document.createElement('div');
            card.classList.add('bg-gray-800', 'rounded-lg', 'overflow-hidden', 'shadow-lg');
            card.innerHTML = `
                <img src="${anime.images.webp.image_url}" alt="${anime.title}" class="w-full h-48 object-cover">
                <div class="p-4">
                    <h3 class="text-xl font-semibold">${anime.title}</h3>
                    <a href="${anime.url}" target="_blank" class="mt-2 inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Learn More</a>
                </div>
            `;
            animeCardsContainer.appendChild(card);
        });
    } catch (error) {
        console.error('Error fetching top anime data:', error);
    } finally {
        loadingElement.style.display = 'none';
    }
}

async function fetchLatestAnime() {
    const loadingElement = document.getElementById('loading-latest');
    const latestCardsContainer = document.getElementById('latest-cards');
    
    try {
        const response = await fetch('https://api.jikan.moe/v4/anime?q=LATEST&sfw');
        const data = await response.json();
        const latest8Anime = data.data.slice(0, 8);

        latest8Anime.forEach(anime => {
            const card = document.createElement('div');
            card.classList.add('bg-gray-800', 'rounded-lg', 'overflow-hidden', 'shadow-lg');
            card.innerHTML = `
                <img src="${anime.images.webp.image_url}" alt="${anime.title}" class="w-full h-48 object-cover">
                <div class="p-4">
                    <h3 class="text-xl font-semibold">${anime.title}</h3>
                    <a href="${anime.url}" target="_blank" class="mt-2 inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Learn More</a>
                </div>
            `;
            latestCardsContainer.appendChild(card);
        });
    } catch (error) {
        console.error('Error fetching latest anime data:', error);
    } finally {
        loadingElement.style.display = 'none';
    }
}

async function fetchAnimeNews() {
    const loadingElement = document.getElementById('loading-news');
    const newsCardsContainer = document.getElementById('news-cards');
    
    try {
        // Assuming you are fetching news for a specific anime ID, e.g., ID = 1
        const animeId = 1;
        const response = await fetch(`https://api.jikan.moe/v4/anime/${animeId}/news`);
        const data = await response.json();
        const newsItems = data.data.slice(0, 10); // Get the first 10 news items

        newsItems.forEach(news => {
            const card = document.createElement('div');
            card.classList.add('bg-gray-800', 'rounded-lg', 'p-4', 'shadow-lg', 'flex', 'space-x-4');
            card.innerHTML = `
                <img src="${news.images.jpg.image_url}" alt="${news.title}" class="w-24 h-24 object-cover flex-shrink-0">
                <div class="flex flex-col justify-between">
                    <div>
                        <h3 class="text-xl font-semibold">${news.title}</h3>
                        <p class="text-gray-400">${news.date}</p>
                        <p class="text-gray-400">${news.excerpt}</p>
                    </div>
                    <a href="${news.url}" target="_blank" class="mt-2 inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Read More</a>
                </div>
            `;
            newsCardsContainer.appendChild(card);
        });
    } catch (error) {
        console.error('Error fetching anime news:', error);
    } finally {
        loadingElement.style.display = 'none';
    }
}

fetchAnimeNews();

fetchTopAnime();
fetchLatestAnime();
