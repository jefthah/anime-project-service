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
        performSearch(query);
    } else {
        clearSearchResults();
    }
});

document.getElementById('mobile-search-input').addEventListener('input', function() {
    const query = this.value.trim();
    if (query.length > 2) {
        performSearch(query);
    } else {
        clearSearchResults();
    }
});

function performSearch(query) {
    // Fetch search results from the API and display them in a dropdown
    fetch(`https://api.jikan.moe/v4/anime?q=${query}&limit=10`)
        .then(response => response.json())
        .then(data => {
            const searchResults = document.getElementById('search-results');
            searchResults.innerHTML = ''; // Clear previous results

            data.data.forEach(anime => {
                const resultItem = document.createElement('a');
                resultItem.href = `detailAnime.html?id=${anime.mal_id}&email=${localStorage.getItem('email')}`;
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

function clearSearchResults() {
    const searchResults = document.getElementById('search-results');
    searchResults.innerHTML = '';
    searchResults.classList.add('hidden');
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
    const userEmailElement = document.getElementById('user-email');
    const mobileUserEmailElement = document.getElementById('mobile-user-email');
    
    if (email) {
        localStorage.setItem('email', email);
        userEmailElement.textContent = email;
        mobileUserEmailElement.textContent = email;
        // Tandai bahwa email ada dengan menggunakan atribut data-email
        userEmailElement.setAttribute('data-email', 'true');
        mobileUserEmailElement.setAttribute('data-email', 'true');
    } else {
        // Tandai bahwa email tidak ada dengan menggunakan atribut data-email
        userEmailElement.setAttribute('data-email', 'false');
        mobileUserEmailElement.setAttribute('data-email', 'false');
    }
}

// Tambahkan event listener untuk tombol logout
document.getElementById('logout-link').addEventListener('click', function() {
    logoutUser();
});

// Fungsi untuk logout pengguna
function logoutUser() {
    // Hapus data email dari localStorage
    localStorage.removeItem('email');
    
    // Setelah menghapus data email, Anda dapat mengarahkan pengguna ke halaman logout atau melakukan aksi lain yang diperlukan.
    
    // Contoh: Redirect ke halaman logout
    // window.location.href = '';
}



// KOMPONEN









document.addEventListener('DOMContentLoaded', () => {
    updateUserEmail();
});
