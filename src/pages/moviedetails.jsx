import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../css_modules/moviedetails.css";
import Footer from "../components/footer";
// import { FaHeart, FaClock } from "react-icons/fa";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [movieRes, creditRes, videoRes, similarRes] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`),
          axios.get(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}`),
          axios.get(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`),
          axios.get(`https://api.themoviedb.org/3/movie/${id}/similar?api_key=${API_KEY}`),
        ]);

        setMovie(movieRes.data);
        setCredits(creditRes.data.cast.slice(0, 5));
        setTrailer(videoRes.data.results.find((v) => v.type === "Trailer"));
        setSimilarMovies(similarRes.data.results.slice(0, 6));
      } catch (err) {
        console.error("Error fetching movie details:", err);
      }
    };

    fetchDetails();
  }, [id]);

  useEffect(() => {
    const fetchUserLists = async () => {
      if (!token) return;

      try {
        const [favRes, watchRes] = await Promise.all([
          axios.get("http://localhost:5000/api/favorites", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/favorites/watchLater", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setFavorites(favRes.data);
        setWatchlist(watchRes.data);
      } catch (err) {
        console.error("Failed to fetch user lists:", err);
      }
    };

    fetchUserLists();
  }, [id, token]);

  useEffect(() => {
    setIsFavorite(favorites.some((fav) => fav.movieId === Number(id)));
    setIsInWatchlist(watchlist.some((item) => item.movieId === Number(id)));
  }, [favorites, watchlist, id]);

  const handleSave = async (category) => {
    try {
      await axios.post(
        "http://localhost:5000/api/favorites",
        {
          movieId: movie.id,
          title: movie.title,
          posterPath: movie.poster_path,
          releaseDate: movie.release_date,
          voteAverage: movie.vote_average,
          category,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(`Saved to ${category}`);

      if (category === "favorite") setIsFavorite(true);
      if (category === "watchLater") setIsInWatchlist(true);
    } catch (err) {
      console.error("Failed to save:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Failed to save movie.");
    }
  };

  if (!movie) return <div>Loading...</div>;

  return (
    <div className="details-page">
      <div
        className="backdrop"
        style={{ backgroundImage: `url(${IMAGE_BASE_URL}${movie.backdrop_path})` }}
      >
        <div className="overlay">
          <div className="poster">
            <img src={`${IMAGE_BASE_URL}${movie.poster_path}`} alt={movie.title} />
          </div>
          <div className="info">
            <h1>{movie.title} <span>({movie.release_date?.split("-")[0]})</span></h1>
            <p><strong>Genres:</strong> {movie.genres?.map(g => g.name).join(", ")}</p>
            <p><strong>Runtime:</strong> {movie.runtime} min</p>
            <p><strong>Overview:</strong> {movie.overview}</p>
            <p><strong>Cast:</strong> {credits.map(c => c.name).join(", ")}</p>

            <button
              onClick={() => handleSave("watchLater")}
              disabled={isInWatchlist}
            >
              {isInWatchlist ? "✓ In Watchlist" : "⏳ Save to Watchlist"}
            </button>

            <button
              onClick={() => handleSave("favorite")}
              disabled={isFavorite}
            >
              {isFavorite ? "✓ In Favorites" : "❤️ Save to Favorite"}
            </button>

            {trailer && (
              <div className="trailer">
                <h3>Trailer:</h3>
                <iframe
                  width="100%"
                  height="315"
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  title="Trailer"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="similar-section">
        <h2>Similar Movies</h2>
        <div className="similar-grid">
          {similarMovies.map((movie) => (
            <div key={movie.id} className="similar-card">
              <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} />
              <p>{movie.title}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default MovieDetails;
