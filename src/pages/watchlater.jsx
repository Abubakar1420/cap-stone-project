import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "../css_modules/watchlater.css";
import Menu from "../components/menu";

const WatchLater = () => {
  const [movies, setMovies] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchWatchLater = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/favorites/watchLater", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMovies(res.data);
      } catch (err) {
        console.error("Failed to fetch watch later movies:", err);
      }
    };

    if (user) fetchWatchLater();
  }, [user]);

  const handleLike = async (id, currentLiked) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:5000/api/favorites/watchLater/${id}/like`,
        { liked: !currentLiked },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMovies((prev) =>
        prev.map((m) => (m._id === id ? { ...m, liked: res.data.liked } : m))
      );
    } catch (err) {
      console.error("Like update failed:", err);
    }
  };

  const handleRating = async (id) => {
    const rating = prompt("Rate this movie (1 to 10):");
    const parsed = parseFloat(rating);
    if (!parsed || parsed < 1 || parsed > 10) {
      return alert("Invalid rating. Must be 1 to 10.");
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:5000/api/favorites/watchLater/${id}/like`,
        { rating: parsed },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMovies((prev) =>
        prev.map((m) => (m._id === id ? { ...m, rating: res.data.rating } : m))
      );
    } catch (err) {
      console.error("Rating update failed:", err.response?.data || err.message);
    }
  };

  const handleSave = async (movie, category) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/favorites",
        {
          movieId: movie.movieId || movie.id,
          title: movie.title,
          posterPath: movie.posterPath || movie.poster_path,
          releaseDate: movie.releaseDate || movie.release_date,
          voteAverage: movie.voteAverage || movie.vote_average,
          category,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(`Saved to ${category}`);
    } catch (err) {
      console.error("Failed to save:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Failed to save movie.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/favorites/watchLater/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMovies(movies.filter((movie) => movie._id !== id));
    } catch (err) {
      console.error("Failed to delete movie:", err);
    }
  };

  return (
    <div className="watchlater-layout">
      <nav className="dashboard-menu">
        <Menu/>
      </nav>
      <main className="watch-later-container">
        <h2>Watch Later</h2>
        <div className="movie-grid">
          {movies.length === 0 ? (
            <p>WatchList Empty</p>
          ) : (
            movies.map((movie) => (
              <div key={movie._id} className="movie-card">
                {movie.posterPath ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w200${movie.posterPath}`}
                    alt={movie.title}
                  />
                ) : (
                  <div className="no-image">No Image</div>
                )}
                <h3>{movie.title}</h3>
                <p>{movie.releaseDate?.split("-")[0]}</p>
                <button onClick={() => handleLike(movie._id, movie.liked)}>
                  {movie.liked ? "❤️ Liked" : "♡ Like"}
                </button>
                <button onClick={() => handleRating(movie._id)}>⭐ Rate</button>
                {movie.rating && <p>Your Rating: {movie.rating}/10</p>}
                <button onClick={() => handleSave(movie, "favorite")}>❤️ Favorite</button>
                <button onClick={() => handleDelete(movie._id)}> Remove</button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default WatchLater;
