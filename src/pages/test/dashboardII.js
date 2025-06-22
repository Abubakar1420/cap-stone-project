import React from "react";
import { Link } from "react-router-dom";
import Favorites from "../favorites";
import WatchLater from "../watchlater";
import Watched from "../watched";
import "./dashboardII.css";

const Dashboard = () => {
  return (
    <div className="container">
        <div className="menu">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/search">Search</Link>
            <Link to="/favorites">Favorites</Link>
            <Link to="//watch-later">Watch Later</Link>
            <Link to="/watched">Watched</Link>
        </div>
        <div className="dashboard-container">
        <h2>My Dashboard</h2>
        <section className="dashboard-search">
            <search></search>
            <div className="sesarchBY"></div>
            <div className="trending"></div>
        </section>
        <section className="dashboard-section">
            <h3>❤️ Favorites</h3>
            <Favorites />
        </section>

        <section className="dashboard-section">
            <h3>⏳ Watch Later</h3>
            <WatchLater />
        </section>

        <section className="dashboard-section">
            <h3>✅ Watched</h3>
            <Watched />
        </section>
        </div>
    </div>
  );
};

export default Dashboard;
