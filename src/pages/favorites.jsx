// src/pages/Favorites.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css_modules/favorites.css"; // Optional: style your favorites page
import Menu from "../components/menu";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/favorites", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFavorites(res.data);
      } catch (err) {
        console.error("Error fetching favorites:", err);
      }
    };

    fetchFavorites();
  }, []);

  const handleLike = async (id, currentLiked) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:5000/api/favorites/${id}/like`,
        { liked: !currentLiked },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFavorites((prev) =>
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
        `http://localhost:5000/api/favorites/${id}/like`,
        { rating: parsed },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFavorites((prev) =>
        prev.map((m) => (m._id === id ? { ...m, rating: res.data.rating } : m))
      );
    } catch (err) {
      console.error("Rating update failed:", err.response?.data || err.message);
    }
  };

  const handleDeleteFavorite = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/favorites/${id}` , {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFavorites((prev) => prev.filter((fav) => fav._id !== id));
    } catch (err) {
      console.error("Error deleting favorite:", err);
      alert("Failed to delete movie.");
    }
  };

  return (
    <div className="favorites-layout">
      <nav className="dashboard-menu">
        <Menu/>
      </nav>
      <main className="favorites-content">
        <h2>Your Favorite Movies</h2>
        <div className="movie-grid">
          {favorites.length === 0 ? (
            <p>No favorites yet.</p>
          ) : (
            favorites.map((movie) => (
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
                <p>⭐ {movie.voteAverage}</p>
                <button onClick={() => handleLike(movie._id, movie.liked)}>
                  {movie.liked ? "❤️ Liked" : "♡ Like"}
                </button>
                <button onClick={() => handleRating(movie._id)}>⭐ Rate</button>
                {movie.rating && <p>Your Rating: {movie.rating}/10</p>}
                <button onClick={() => handleDeleteFavorite(movie._id)}>Remove</button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Favorites;
