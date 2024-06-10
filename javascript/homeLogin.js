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
                    <a href="detailAnime.html?id=${anime.mal_id}&email=${localStorage.getItem('email')}" class="mt-2 inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Learn More</a>
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
                    <a href="detailAnime.html?id=${anime.mal_id}&email=${localStorage.getItem('email')}" class="mt-2 inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Learn More</a>
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

function getQueryParams() {
    const params = {};
    window.location.search.replace(/^\?/, '').split('&').forEach(param => {
        const [key, value] = param.split('=');
        params[key] = decodeURIComponent(value);
    });
    return params;
}

function updateUserEmail() {
    const params = getQueryParams();
    const email = params.email || localStorage.getItem('email');
    if (email) {
        localStorage.setItem('email', email); // Save email to localStorage
        const userEmailElement = document.getElementById('user-email');
        const mobileUserEmailElement = document.getElementById('mobile-user-email');
        userEmailElement.textContent = email;
        mobileUserEmailElement.textContent = email;
    }
}

fetchTopAnime();
fetchLatestAnime();
updateUserEmail();
