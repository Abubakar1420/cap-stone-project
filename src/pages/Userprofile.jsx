// src/pages/UserProfile.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css_modules/Userprofile.css";

const UserProfile = () => {
  const [user, setUser] = useState({ name: "", email: "" });
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/favorites/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
        setForm({ name: res.data.name, email: res.data.email });
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "http://localhost:5000/api/favorites/profile",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Profile updated!");
      setUser(res.data);
      setEditing(false);
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="profile-container">
      <h2>User Profile</h2>

      {!editing ? (
        <div className="profile-details">
          <p>
            <strong>Name:</strong> {user.username}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <button onClick={() => setEditing(true)}>Edit Profile</button>
        </div>
      ) : (
        <div className="profile-edit-form">
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
          </label>
          <div className="form-buttons">
            <button onClick={handleUpdate}>Save</button>
            <button onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
