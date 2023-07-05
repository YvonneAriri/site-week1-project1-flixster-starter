// API KEY for moviedb API
const API_KEY = "1659706dfae4865fb5606d1db53414cd";

// Store genres in array instead of making multiple calls to API
const genres = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

// Assign movie grid HTML element to variable
const movieGrid = document.getElementById("movie-grid");
const searchInput = document.getElementById("search-input");
const sectionTitle = document.getElementById("section-title");
const submitButton = document.getElementById("submit");
const closeSearchButton = document.getElementById("close-search-btn");
const closeModalButton = document.getElementById("close-modal-btn");
const loadMoreButton = document.getElementById("load-more-movies-btn");

let page = 1;
let searchQuery = null; // this is what stores the user input

closeModalButton.addEventListener("click", (event) => {
  event.preventDefault();
  //the event parameter represent the event object and provides information
  //the event  such a s target element and any associated data
  // event.preventDefault();
  //it lets you control and decide what happens when an event occurs
  hideMovieDetails();
});

closeSearchButton.addEventListener("click", (event) => {
  event.preventDefault();

  if (searchQuery != null) {
    // if the query is not empty
    searchInput.value = ""; // set the value of the search input to null
    searchQuery = null; // it sets the searhcQuery variable to null
    page = 1; // it takes it back to page 1
    movieGrid.innerHTML = ""; //clears the content of the movie grid removing
    //any previous displayed movie
    fetchMoviesFromAPI();
  }
});
//it takes the event object as a parameter, which contains information abou the event
//the event serves a s an object of the eventListener
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

  if (searchQuery !== null) {
    const queryUrl = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&page=${page}&query=${encodeURIComponent(
      searchQuery
    )}`;
    fetchMoviesFromAPI(queryUrl);
  } else {
    fetchMoviesFromAPI();
  }
});

const searchMovies = () => {
  //assign it to a constant variable  using the const keyword

  if (searchInput !== "") {
    //if the current value set by the user is not equal to null
    searchQuery = searchInput.value.trim(); // the searchQuery is equal to the value entered by the user
    movieGrid.innerHTML = ""; //sets the html content of the movie grid to an empty string
    sectionTitle.innerText = "Search Results"; //changing the element(now playing) to search results once a search has been made
    page = 1; //this line sets the value of the page variable to 1 indictes that
    //the search rresult will start from 1

    const queryUrl = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&page=${page}&query=${encodeURIComponent(
      searchQuery
    )}`;
    fetchMoviesFromAPI(queryUrl);
  }
};

const fetchMoviesFromAPI = async (url) => {
  const defaultUrl = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&page=${page}`;
  if (url === null) {
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

const getGenre = (genreId) => {
  return genres[genreId] || "Unknown";
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

    movieCard.addEventListener("click", (event) => {
      showMovieDetails(movie);
    });

    if (movie.poster_path == null) {
      img.classList.remove("movie-poster");
      img.classList.add("no-poster");
    }

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

function showMovieDetails(movie) {
  // Get references to the modal and its content
  const modal = document.getElementById("modal");
  const movieBackdrop = document.getElementById("movie-backdrop");
  const movieDetails = document.getElementById("modal-details");
  const modalTitle = document.getElementById("modal-title");
  const modalOverview = document.getElementById("modal-description");

  // Set the movie details in the modal
  modalTitle.innerText = movie.title;
  modalOverview.innerText = movie.overview;

  if (movie.backdrop_path !== null) {
    movieBackdrop.classList.remove("no-poster");
    movieBackdrop.src = `https://image.tmdb.org/t/p/w500/${movie.backdrop_path}`;
  } else {
    movieBackdrop.src = "";
    movieBackdrop.classList.add("no-poster");
  }
  movieBackdrop.alt = movie.title;

  let genres = "";
  movie.genre_ids.forEach((id, index) => {
    genres += getGenre(id);
    if (index !== movie.genre_ids.length - 1) {
      genres += ", ";
    }
  });

  let releaseDate = movie.release_date ? movie.release_date : "";
  genres = genres != "" ? genres : "";
  let rating = movie.vote_average ? "⭐️ " + movie.vote_average : "";

  movieDetails.innerText = [releaseDate, genres, rating].join(" | ");

  // Show the modal
  modal.style.display = "block";
}

function hideMovieDetails() {
  // Get reference to the modal
  const modal = document.getElementById("modal");

  // Hide the modal
  modal.style.display = "none";
}

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
