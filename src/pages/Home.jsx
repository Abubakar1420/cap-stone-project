// src/pages/Home.js
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css_modules/home.css";
import Footer from "../components/footer";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

const Home = () => {
  const [nowPlaying, setNowPlaying] = useState([]);
  const [genres, setGenres] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`);
        const data = await res.json();
        setNowPlaying(data.results);
      } catch (err) {
        console.error("Failed to fetch now playing:", err);
      }
    };

    const fetchGenres = async () => {
      try {
        const res = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`);
        const data = await res.json();
        setGenres(data.genres);
      } catch (err) {
        console.error("Failed to fetch genres:", err);
      }
    };

    fetchNowPlaying();
    fetchGenres();
  }, []);

  return (
    <div className="home-container">
      <section className="hero">
        <div className="hero-content">
          <h1>🎬 Discover Movies You'll Love</h1>
          <p>Browse trending movies, save favorites, and build your perfect watchlist.</p>
          <div className="hero-buttons">
            <Link to="/search" className="btn-primary">🔍 Search Movies</Link>
            <Link to="/dashboard" className="btn-secondary">🎞️ Go to Dashboard</Link>
          </div>
        </div>
        <div className="hero-image">
          <img src="https://image.tmdb.org/t/p/w780//4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg" alt="Movie Poster" />
        </div>
      </section>

      <section className="carousel-section">
        <h2>🎬 Now Playing</h2>
        <div className="scroll-container">
          {nowPlaying.map((movie) => (
            <div key={movie.id} className="scroll-card" onClick={() => navigate(`/movie/${movie.id}`)}>
              <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} />
              <p>{movie.title}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="genre-slider">
        <h2>🎭 Browse by Genre</h2>
        <div className="genre-scroll">
          {genres.map((genre) => (
            <button key={genre.id} className="genre-button" onClick={() => navigate(`/search?genre=${genre.id}`)}>
              {genre.name}
            </button>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <h2>🎟️ Ready to dive in?</h2>
        <p>Create an account or login to start curating your personal movie list!</p>
        <div className="hero-buttons">
          <Link to="/register" className="btn-primary">Sign Up</Link>
          <Link to="/login" className="btn-secondary">Login</Link>
        </div>
      </section>
      <Footer/>
    </div>
  );
};

export default Home;
