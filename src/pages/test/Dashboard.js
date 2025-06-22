// src/pages/Dashboard.js
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import "./dashboard.css";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
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
        console.error("Error loading favorites:", err);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Welcome, {user?.name || user?.email}</h1>

      <h2>Your Favorite Movies</h2>
      <div className="dashboard-movies">
        {favorites.length === 0 ? (
          <p>You haven’t added any favorites yet.</p>
        ) : (
          favorites.map((movie) => (
            <div key={movie._id} className="dashboard-movie-card">
              {movie.posterPath ? (
                <img
                  src={`https://image.tmdb.org/t/p/w200${movie.posterPath}`}
                  alt={movie.title}
                />
              ) : (
                <div className="no-image">No Image</div>
              )}
              <h4>{movie.title}</h4>
              <p>{movie.releaseDate?.split("-")[0]}</p>
              <p>⭐ {movie.voteAverage}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
