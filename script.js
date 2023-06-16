// API KEY for moviedb API
const API_KEY = "1659706dfae4865fb5606d1db53414cd";

// Assign movie grid HTML element to variable
const movieGrid = document.getElementById("movie-grid");
const searchInput = document.getElementById("search-input");
const sectionTitle = document.getElementById("section-title");
const submitButton = document.getElementById("submit");
const closeSearchButton = document.getElementById("close-search-btn");
const loadMoreButton = document.getElementById("load-more-movies-btn");

let page = 1;
let searchQuery = null;

closeSearchButton.addEventListener("click", (event) => {
  event.preventDefault();

  if (searchQuery != null) {
    searchInput.value = "";
    searchQuery = null;
    page = 1;
    movieGrid.innerHTML = "";
    fetchMoviesFromAPI();
  }
});

searchInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    searchMovies();
  }
});

submitButton.addEventListener("click", (event) => {
  event.preventDefault();
  searchMovies();
});

loadMoreButton.addEventListener("click", (event) => {
  page += 1;
  event.preventDefault();

  if (searchQuery != null) {
    const queryUrl = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&page=${page}&query=${encodeURIComponent(
      searchQuery
    )}`;
    fetchMoviesFromAPI(queryUrl);
  } else {
    fetchMoviesFromAPI();
  }
});

const searchMovies = () => {
  if (searchInput.value != "") {
    searchQuery = searchInput.value;
    movieGrid.innerHTML = "";
    sectionTitle.innerText = "Search Results";
    page = 1;

    const queryUrl = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&page=${page}&query=${encodeURIComponent(
      searchQuery
    )}`;
    fetchMoviesFromAPI(queryUrl);
  }
};

const fetchMoviesFromAPI = async (url) => {
  const defaultUrl = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&page=${page}`;
  if (!url) {
    sectionTitle.innerText = "Now Playing";
  }

  try {
    // Hide load more until movies have been gotten from API
    loadMoreButton.style.visibility = "hidden";

    const response = await fetch(url || defaultUrl);

    const data = await response.json();
    const movies = data.results;

    showMovies(movies);
    if (page < data.total_pages) {
      loadMoreButton.style.visibility = "visible";
    }
  } catch (error) {
    // Handle any errors that occur during the fetch request
    console.log(error);
  }
};

/**
 * Get list of movies now playing in theatres by making a fetch request to moviedb API
 * with assigned API key
 */
const showMovies = (movies) => {
  movies.forEach((movie) => {
    // Create div element wrapper for each movie with a class name of "movie-card"
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");
    movieCard.title = movie.title;

    // Create div element wrapper for each movie with a class name of "movie-title"
    const movieTitle = document.createElement("div");
    movieTitle.classList.add("movie-title");

    // Create div element wrapper for each movie with a class name of "movie-vote"
    const movieVote = document.createElement("div");
    movieVote.classList.add("movie-votes");

    // Create img element for each movie with a class name of "movie-poster"
    const img = document.createElement("img");
    img.classList.add("movie-poster");
    img.src = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
    img.alt = movie.title;

    movieTitle.textContent = movie.title;
    movieVote.textContent = "⭐️ " + movie.vote_average;

    // Append movie image to movieCard div element
    movieCard.appendChild(img);
    //Append movieRating to movieGrid div element
    movieCard.appendChild(movieVote);
    //Append movie title to movieCard div element
    movieCard.appendChild(movieTitle);
    //Append movie card to movieGrid div element
    movieGrid.appendChild(movieCard);
  });
};

/**
 * Immediately the page loads, we want to call the fetchAndShowMovies function so the movies
 * can be shown on the page UI
 */
window.addEventListener("load", (event) => {
  event.preventDefault();

  // When page loads, we want to focus search input
  searchInput.focus();
  fetchMoviesFromAPI();
});
