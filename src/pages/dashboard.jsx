// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css_modules/dashboard.css";
import Menu from "../components/menu";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

const Dashboard = () => {
  const [searchInput, setSearchInput] = useState("");
  const [genres, setGenres] = useState([]);
  const [trending, setTrending] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchInput)}`);
    }
  };

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`
        );
        const data = await res.json();
        setGenres(data.genres);
      } catch (err) {
        console.error("Failed to fetch genres:", err);
      }
    };

    const fetchTrending = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`
        );
        const data = await res.json();
        setTrending(data.results);
      } catch (err) {
        console.error("Failed to fetch trending:", err);
      }
    };

    const fetchRecommendations = async () => {
      try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/550/recommendations?api_key=${API_KEY}`);
        const data = await res.json();
        setRecommendations(data.results);
      } catch (err) {
        console.error("Failed to fetch recommendations:", err);
      }
    };

    const fetchNewReleases = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`
        );
        const data = await res.json();
        setNewReleases(data.results);
      } catch (err) {
        console.error("Failed to fetch new releases:", err);
      }
    };

    fetchGenres();
    fetchTrending();
    fetchRecommendations();
    fetchNewReleases();
  }, []);

  return (
    <div className="dashboard-container">
      <Menu/>
      <main className="dashboard-content">
        <header className="dashboard-header">
          <h2>Welcome</h2>
        </header>

        <section className="dashboard-search-section">
          <h2>Discover Movies</h2>
          <form onSubmit={handleSubmit} className="dashboard-search-form">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by title, genre or year..."
            />
            <button type="submit">Search</button>
          </form>
        </section>

        <section className="dashboard-filter-section">
          <h3>Filter by</h3>
          <div className="filter-buttons">
            <button onClick={() => navigate('/search?sort_by=vote_average.desc')}>Rating</button>
            <button onClick={() => navigate('/search?sort_by=release_date.desc')}>Release Date</button>
            <button onClick={() => navigate('/search?sort_by=popularity.desc')}>Popularity</button>
          </div>
        </section>

        <section className="dashboard-genre-tabs genre-tabs">
          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => navigate(`/search?genre=${genre.id}`)}
              className="genre-tab"
            >
              {genre.name}
            </button>
          ))}
        </section>

        <section className="dashboard-section">
          <h3>🔥 Trending Now</h3>
          <div className="scroll-container">
            {trending.map((movie) => (
              <div
                  key={movie.id}
                  className="scroll-card"
                  onClick={() => navigate(`/movie/${movie.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                    alt={movie.title}
                  />
                  <p>{movie.title}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-section">
          <h3>🎯 Recommendations</h3>
          <div className="scroll-container">
            {recommendations.map((movie) => (
              <div
                  key={movie.id}
                  className="scroll-card"
                  onClick={() => navigate(`/movie/${movie.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                    alt={movie.title}
                  />
                  <p>{movie.title}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-section">
          <h3>🆕 New Releases</h3>
          <div className="scroll-container">
            {newReleases.map((movie) => (
              <div
                  key={movie.id}
                  className="scroll-card"
                  onClick={() => navigate(`/movie/${movie.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                    alt={movie.title}
                  />
                  <p>{movie.title}</p>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
};

export default Dashboard;
