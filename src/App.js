// src/App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/Register";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import PrivateRoute from "./components/privateRoutes";
import MovieSearch from "./pages/moviesearch";
import Navbar from "./components/navbar";
import Favorites from "./pages/favorites";
import WatchLater from "./pages/watchlater";
import DashboardI from "./pages/dashboard";
import UserProfile from "./pages/Userprofile";
import MovieDetails from "./pages/moviedetails";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Navbar/>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home/>} />
          <Route path="/home" element={  
            <PrivateRoute>
              <Home />
            </PrivateRoute> }/>
          <Route path="/profile" element={  
            <PrivateRoute>
              <UserProfile/>
            </PrivateRoute> }/>
          <Route path="/dashboard" element={
            <PrivateRoute>
              <DashboardI />
            </PrivateRoute>}/>
          <Route path="/search" element={
            <PrivateRoute>
              <MovieSearch />
            </PrivateRoute>}/>
          <Route path="/favorites" element={
            <PrivateRoute>
              <Favorites />
            </PrivateRoute>}/>
          <Route path="/watch-later" element={
            <PrivateRoute>
              <WatchLater />
            </PrivateRoute>}/>
          <Route path="/movie/:id" element={
            <PrivateRoute>
              <MovieDetails/>
            </PrivateRoute>}/>
          
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
