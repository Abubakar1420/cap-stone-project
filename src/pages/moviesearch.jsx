// src/pages/MovieSearch.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "../css_modules/moviesearch.css";
import Footer from "../components/footer";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const MovieSearch = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [genres, setGenres] = useState([]);

  const q = useQuery();
  const genreId = q.get("genre");
  const searchQuery = q.get("query");
  const sortBy = q.get("sort_by");
  console.log(API_KEY)
  // Sync input field with URL query
  useEffect(() => {
    if (searchQuery) setQuery(searchQuery);
  }, [searchQuery]);

  // Fetch genres once
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`
        );
        setGenres(res.data.genres);
      } catch (err) {
        console.error("Failed to fetch genres:", err);
      }
    };
    fetchGenres();
  }, []);

  // Fetch based on URL query params
  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = "";

        if (searchQuery) {
          url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchQuery}`;
        } else if (genreId) {
          url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`;
        } else if (sortBy) {
          url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=${sortBy}`;
        }

        if (url) {
          const res = await axios.get(url);
          setResults(res.data.results);
        }
      } catch (err) {
        console.error("TMDB fetch error:", err);
      }
    };

    fetchData();
  }, [genreId, searchQuery, sortBy]);

  // Navigate with search query in URL
  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?query=${encodeURIComponent(query.trim())}`);
  };

  const handleSave = async (movie, category) => {
    try {
      const token = localStorage.getItem("token");
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
    } catch (err) {
      console.error("Failed to save:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Failed to save movie.");
    }
  };

  const getGenreNames = (genreIds) => {
    return genreIds
      .map((id) => genres.find((g) => g.id === id)?.name)
      .filter(Boolean);
  };

  return (
    <div className="search-container">
      <h2>Search Movies</h2>
      <p>
        Search by <strong>title</strong>, <strong>genre</strong>, or <strong>release year</strong>
      </p>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search by title, genre or year..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {results.length === 0 && <p>No movies found.</p>}

      <div className="movie-grid">
        {results.map((movie) => (
          <div key={movie.id} className="movie-card">
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
              />
            ) : (
              <div className="no-image">No Image</div>
            )}
            <h3>{movie.title}</h3>
            <p>{movie.release_date?.split("-")[0]}</p>
            <p>⭐ {movie.vote_average}</p>
            <p className="genres">{getGenreNames(movie.genre_ids).join(", ")}</p>
            <button onClick={() => navigate(`/movie/${movie.id}`)}>Details</button>
            <div className="category-buttons">
              <button onClick={() => handleSave(movie, "favorite")}>❤️ Favorite</button>
              <button onClick={() => handleSave(movie, "watchLater")}>⏳ WatchList</button>
            </div>
          </div>
        ))}
      </div>
      <Footer/>
    </div>
  );
};

export default MovieSearch;
