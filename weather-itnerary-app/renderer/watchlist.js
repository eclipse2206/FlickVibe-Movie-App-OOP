// 1. Get DOM Elements
const saveBtn = document.getElementById('saveMovieBtn');
const savedMoviesList = document.getElementById('savedMoviesList');

// 2. Handle Save/Update Button Click
saveBtn.addEventListener('click', function() {
    // Get the values from the inputs
    const title = document.getElementById('wTitle').value.trim();
    const genre = document.getElementById('wGenre').value.trim();
    const runtime = document.getElementById('wRuntime').value.trim();
    const rating = document.getElementById('wRating').value.trim();

    // Basic Input Validation
    if (!title || !genre || !runtime || !rating) {
        alert("Error: Please fill out all fields before saving.");
        return;
    }

    if (rating < 0 || rating > 10) {
        alert("Error: IMDb rating must be between 0 and 10.");
        return;
    }

    // Create a movie object
    const newMovie = {
        title: title,
        genre: genre,
        runtime: runtime,
        rating: rating
    };

    // Retrieve existing watchlist from Local Storage
    let watchlist = JSON.parse(localStorage.getItem('myWatchlist')) || [];

    // Add the new movie to the array
    watchlist.push(newMovie);

    // Save the updated array back to Local Storage
    localStorage.setItem('myWatchlist', JSON.stringify(watchlist));

    // Clear the form inputs
    document.getElementById('wTitle').value = '';
    document.getElementById('wGenre').value = '';
    document.getElementById('wRuntime').value = '';
    document.getElementById('wRating').value = '';

    // Reset button text in case it was in "Edit" mode
    saveBtn.textContent = "Save Movie Record";

    alert(`Success: "${title}" has been added to your watchlist!`);

    // Refresh the displayed list and calculations
    displayWatchlist();
});

// 3. Function to Display Saved Movies
function displayWatchlist() {
    // Clear the current display
    savedMoviesList.innerHTML = '';

    // Get the list from Local Storage
    let watchlist = JSON.parse(localStorage.getItem('myWatchlist')) || [];

    if (watchlist.length === 0) {
        savedMoviesList.innerHTML = '<p style="color: var(--text-muted); text-align: center;">Your watchlist is empty. Add some movies above!</p>';
        // Still need to run calculations to reset the display to 0
        performCalculations(); 
        return;
    }

    // Loop through the saved movies and create a card for each
    watchlist.forEach((movie, index) => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        
        card.innerHTML = `
            <div class="movie-info">
                <div class="movie-details">
                    <h3>${movie.title}</h3>
                    <div class="movie-meta">
                        <span><i class="fa-solid fa-star text-yellow"></i> ${movie.rating}</span>
                        <span>${movie.genre}</span>
                        <span><i class="fa-solid fa-clock"></i> ${movie.runtime} mins</span>
                    </div>
                </div>
                
                <div class="button-group">
                    <button class="btn-primary" style="padding: 10px 15px; font-size: 14px; background: #4a148c;" onclick="editMovie(${index})">
                        <i class="fa-solid fa-pen"></i> Edit
                    </button>
                    <button class="btn-primary" style="padding: 10px 15px; font-size: 14px; background: #333;" onclick="deleteMovie(${index})">
                        <i class="fa-solid fa-trash"></i> Remove
                    </button>
                </div>
            </div>
        `;
        
        savedMoviesList.appendChild(card);
    });

    // CALL CALCULATIONS AT THE END OF THE DISPLAY FUNCTION
    performCalculations();
}

// 4. Function to Delete a Movie
function deleteMovie(index) {
    let watchlist = JSON.parse(localStorage.getItem('myWatchlist')) || [];
    
    // Remove the item at the specific index
    watchlist.splice(index, 1);
    
    // Save back to Local Storage
    localStorage.setItem('myWatchlist', JSON.stringify(watchlist));
    
    // Refresh the display (this will also trigger performCalculations)
    displayWatchlist();
}

// 5. Function to Edit a Movie (Populates the form)
function editMovie(index) {
    let watchlist = JSON.parse(localStorage.getItem('myWatchlist')) || [];
    const movieToEdit = watchlist[index];

    // Populate the form inputs with the movie's current data
    document.getElementById('wTitle').value = movieToEdit.title;
    document.getElementById('wGenre').value = movieToEdit.genre;
    document.getElementById('wRuntime').value = movieToEdit.runtime;
    document.getElementById('wRating').value = movieToEdit.rating;

    // Remove the old version from the array so it doesn't duplicate
    watchlist.splice(index, 1);
    localStorage.setItem('myWatchlist', JSON.stringify(watchlist));

    // Refresh the displayed list (so the old one disappears)
    displayWatchlist();

    // Change the Save button text temporarily so the user knows they are editing
    saveBtn.textContent = "Update Movie Record";
    
    // Scroll up to the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 6. Run the display function as soon as the page loads
window.onload = displayWatchlist;

// 7. Function to Perform Meaningful Calculations
function performCalculations() {
    let watchlist = JSON.parse(localStorage.getItem('myWatchlist')) || [];
    
    // Get the HTML elements where we will display the results
    const totalTimeDisplay = document.getElementById('totalTimeDisplay');
    const avgRatingDisplay = document.getElementById('avgRatingDisplay');

    // If the list is empty, reset to zero
    if (watchlist.length === 0) {
        totalTimeDisplay.textContent = "0 hours";
        avgRatingDisplay.textContent = "0.0 / 10";
        return;
    }

    let totalMinutes = 0;
    let totalRating = 0;

    // Loop through the list to calculate sums
    watchlist.forEach(movie => {
        totalMinutes += parseFloat(movie.runtime);
        totalRating += parseFloat(movie.rating);
    });

    // CALCULATION 1: Convert total minutes to hours (e.g., 150 mins = 2.5 hours)
    let totalHours = (totalMinutes / 60).toFixed(1); 
    
    // CALCULATION 2: Calculate the average rating
    let averageRating = (totalRating / watchlist.length).toFixed(1);

    // Display the results with units
    totalTimeDisplay.textContent = `${totalHours} hours (${totalMinutes} mins)`;
    avgRatingDisplay.textContent = `${averageRating} / 10`;
}