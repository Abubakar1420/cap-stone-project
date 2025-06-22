// src/pages/Login.js
import '../css_modules/login.css';
import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { getBackEndBaseUrl } from '../utility';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  console.log(getBackEndBaseUrl())
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${getBackEndBaseUrl()}/auth/login`, {
        email,
        password,
      });
      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="login-bg">
      <div className="login-container">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"
          alt="Logo"
          className="login-logo"
        />
        <form onSubmit={handleLogin}>
          <h2>Login</h2>
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
          <p className="login-footer-text">Don't have an account?</p>
          <Link to="/register" className="login-link">Create Account</Link>
        </form>
      </div>
      
    </div>
  );
};

export default Login;
