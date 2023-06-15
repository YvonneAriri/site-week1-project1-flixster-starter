// Assign movie grid HTML element to variable
const movieGrid = document.getElementById("movie-grid");

/**
 * Get list of movies now playing in theatres by making a fetch request to moviedb API
 * with assigned API key
 */
const fetchAndShowMovies = async () => {
  try {
    const API_KEY = "1659706dfae4865fb5606d1db53414cd";
    const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&page=1`;

    const response = await fetch(url);
    const data = await response.json();
    const images = data.results;

    images.forEach((movie) => {
      // Create div element wrapper for each movie with a class name of "movie-card"
      const movieCard = document.createElement("div");
      movieCard.classList.add("movie-card");
      // Create img element for each movie with a class name of "movie-poster"
      const img = document.createElement("img");
      img.classList.add("movie-poster");
      img.src = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
      // Append movie image to movieCard div element
      movieCard.appendChild(img);
      // Append movie card to movieGrid div element
      movieGrid.appendChild(movieCard);
    });
  } catch (error) {
    // Handle any errors that occur during the fetch request
    console.log(error);
  }
};

/**
 * Immediately the page loads, we want to call the fetchAndShowMovies function so the movies
 * can be shown on the page UI
 */
window.addEventListener("load", (event) => {
  event.preventDefault();
  fetchAndShowMovies();
});
