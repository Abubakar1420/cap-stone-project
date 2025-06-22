import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import "./watched.css";

const Watched = () => {
  const [movies, setMovies] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchWatched = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/favorites/watched", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMovies(res.data);
      } catch (err) {
        console.error("Failed to fetch watched movies:", err);
      }
    };

    if (user) fetchWatched();
  }, [user]);

  const handleDelete = async (movieId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/favorites/${movieId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMovies((prev) => prev.filter((movie) => movie._id !== movieId));
    } catch (err) {
      console.error("Failed to delete movie:", err);
      alert("Error deleting movie");
    }
  };

  return (
    <div className="watched-container">
      <h2>Watched Movies</h2>
      <div className="movie-grid">
        {movies.map((movie) => (
          <div key={movie._id} className="movie-card">
            {movie.posterPath ? (
              <img src={`https://image.tmdb.org/t/p/w200${movie.posterPath}`} alt={movie.title} />
            ) : (
              <div className="no-image">No Image</div>
            )}
            <h3>{movie.title}</h3>
            <p>{movie.releaseDate?.split("-")[0]}</p>
            <p>⭐ {movie.voteAverage}</p>
            <button onClick={() => handleDelete(movie._id)} className="delete-btn">
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Watched;
