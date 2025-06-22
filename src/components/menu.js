import React from "react";
import { Link } from "react-router-dom";

const Menu = () =>{


    return(
         <nav className="dashboard-menu">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/search">Search</Link>
        <Link to="/favorites">Favorites</Link>
        <Link to="/watch-later">WatchList</Link>
      </nav>
    );
} 

export default Menu;