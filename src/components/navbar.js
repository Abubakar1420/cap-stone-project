import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import './navbar.css';


const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
        <nav className="navbar">
            <div>
                <Link to="/">Home</Link>
                {user && <Link to="/profile">Profile</Link>}
                {user && <Link to="/dashboard">Dashboard</Link>}
                {user && <Link to="/search">Search</Link>}
            </div>
            <div className="right">
                {user ? (
                <button onClick={logout}>Logout</button>
                ) : (
                <>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </>
                )}
            </div>
        </nav>

  );
};

export default Navbar;
