const API_KEY = "YOUR_TMDB_API_KEY";
const BASE_URL = "https://api.themoviedb.org/3";

async function searchMovie(movieName) {
    const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${movieName}`);
    const data = await res.json();
    return data.results.length ? data.results[0] : null;
}

async function getSimilarMovies(movieId) {
    const res = await fetch(`${BASE_URL}/movie/${movieId}/similar?api_key=${API_KEY}`);
    const data = await res.json();
    return data.results;
}

async function getRecommendedMovies(movieId) {
    const res = await fetch(`${BASE_URL}/movie/${movieId}/recommendations?api_key=${API_KEY}`);
    const data = await res.json();
    return data.results;
}

function mergeRecommendations(similar, recommended, limit = 5) {
    const merged = [...similar, ...recommended];
    const unique = merged.filter((movie, index, self) =>
        index === self.findIndex(m => m.id === movie.id)
    );
    return unique.slice(0, limit);
}

async function getHybridRecommendations() {
    const movieName = document.getElementById("movieName").value;
    const moviesDiv = document.getElementById("movies");
    moviesDiv.innerHTML = "";

    if (!movieName) return alert("Please enter a movie name!");

    const movie = await searchMovie(movieName);
    if (!movie) return alert("Movie not found!");

    const similar = await getSimilarMovies(movie.id);
    const recommended = await getRecommendedMovies(movie.id);

    const hybrid = mergeRecommendations(similar, recommended, 8);

    hybrid.forEach(m => {
        moviesDiv.innerHTML += `
            <div class="movie-card">
                <img src="https://image.tmdb.org/t/p/w200${m.poster_path}" alt="${m.title}">
                <h3>${m.title}</h3>
                <p>⭐ ${m.vote_average}</p>
            </div>
        `;
    });
}
