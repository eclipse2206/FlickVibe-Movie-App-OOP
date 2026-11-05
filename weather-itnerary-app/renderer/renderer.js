const API_KEY = '1231af72';

// 1. UPDATE THIS LINE: Match your new HTML ID
const searchInput = document.getElementById('movieSearch'); 
const genreSelect = document.getElementById('genreSelect');
const searchBtn = document.getElementById('searchBtn');
const resultsContainer = document.getElementById('movieResults'); // Changed from resultsContainer to movieResults
const errorMsg = document.getElementById('errorMsg');
const suggestionText = document.getElementById('suggestionText');

searchBtn.addEventListener('click', handleSearch);

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

genreSelect.addEventListener('change', () => {
    if (resultsContainer.children.length > 0) {
        generateSmartSuggestion(genreSelect.value, searchInput.value);
    }
});

async function handleSearch() {
    const query = searchInput.value.trim();
    const selectedGenre = genreSelect.value;
    if (errorMsg) errorMsg.textContent = '';
    resultsContainer.innerHTML = '';

    if (!query) {
        if (errorMsg) errorMsg.textContent = 'Error: Please enter a valid movie title to search.';
        if (suggestionText) suggestionText.textContent = 'No suggestions available due to invalid input.';
        return;
    }

    try {
        const response = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${API_KEY}`);
        
        if (!response.ok) {
            throw new Error('Network response failed or API unreachable.');
        }

        const data = await response.json();

        if (data.Response === 'False') {
            if (errorMsg) errorMsg.textContent = `Error: ${data.Error || 'No matching movies found.'}`;
            if (suggestionText) suggestionText.textContent = 'No suggestions available due to empty API results.';
            return;
        }

        // 2. UPDATE THIS BLOCK: The new Movie Card design
        data.Search.forEach(movie => {
            const card = document.createElement('div');
            card.className = 'movie-card';
            
            const posterSrc = movie.Poster !== 'N/A' 
                ? movie.Poster 
                : 'https://via.placeholder.com/300x450/1a0b22/ff3333?text=No+Poster';
            
            card.innerHTML = `
                <div class="poster-wrapper">
                    <img src="${posterSrc}" alt="${movie.Title}">
                </div>
                <div class="movie-info">
                    <h3>${movie.Title}</h3>
                    <p><i class="fa-solid fa-star text-yellow"></i> ${movie.Year} | ${movie.Type.toUpperCase()}</p>
                    <!-- The button is now styled inside the card -->
                    <button class="quick-add-btn btn-primary" style="margin-top: 10px; padding: 8px 15px; font-size: 12px; width: 100%;" data-title="${movie.Title}" data-type="${movie.Type}">
                        Add to Watchlist
                    </button>
                </div>
            `;
            
            // Optional: Make the whole card clickable too
            card.addEventListener('click', () => {
                quickAddToWatchlist(movie.Title, movie.Type);
            });

            resultsContainer.appendChild(card);
        });

        // 3. UPDATE THIS BLOCK: Fix button click logic
        document.querySelectorAll('.quick-add-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevents the card's click event from firing twice
                const title = e.target.getAttribute('data-title');
                const type = e.target.getAttribute('data-type');
                quickAddToWatchlist(title, type);
            });
        });

        generateSmartSuggestion(selectedGenre, query);

    } catch (err) {
        if (errorMsg) errorMsg.textContent = `Error: Failed to fetch API data (${err.message}).`;
        if (suggestionText) suggestionText.textContent = 'Suggestion unavailable due to failed request.';
    }
}

function generateSmartSuggestion(genre, query) {
    // (Keep existing suggestion logic exactly as it is)
    if (!suggestionText) return;
    
    if (!genre) {
        suggestionText.textContent = `Successfully retrieved search results for "${query}". Please select a genre preference to activate tailored recommendations.`;
        return;
    }

    let suggestion = '';
    switch (genre) {
        case 'Action':
            suggestion = `High-octane action preference selected! We recommend choosing fast-paced blockbusters with high stunt coordination from your results for an adrenaline rush.`;
            break;
        case 'Comedy':
            suggestion = `Comedy preference selected! Pick light-hearted titles from your search list to guarantee laughter and relaxation.`;
            break;
        case 'Horror':
            suggestion = `Horror preference selected! Dim the lights and choose a suspenseful thriller or horror flick for maximum fright.`;
            break;
        case 'Drama':
            suggestion = `Drama preference selected! Focus on character-driven emotional storylines from your retrieved options.`;
            break;
        case 'Sci-Fi':
            suggestion = `Sci-Fi preference selected! Explore futuristic concepts and mind-bending plots from the list.`;
            break;
        default:
            suggestion = `Enjoy your viewing session with any selected title matching your query "${query}"!`;
    }

    suggestionText.textContent = suggestion;
}

function quickAddToWatchlist(title, type) {
    let watchlist = JSON.parse(localStorage.getItem('movieWatchlist')) || [];
    watchlist.push({ title: title, genre: type || 'General', runtime: 120, rating: 7.5 });
    localStorage.setItem('movieWatchlist', JSON.stringify(watchlist));
    
    alert(`Success: "${title}" was added to your local watchlist storage!`);
}