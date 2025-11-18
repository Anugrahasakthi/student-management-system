
import React, { useState } from "react";
import "./pages.css";
import "../pages/Css/Login.css";
import client from "../api/client";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await client.post("/login", { email, password });

      if (res.data.status === 200) {
        const { token, role, user } = res.data.data;

        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("user", JSON.stringify(user));

        setSuccess("Login successful! Redirecting...");
        
        setTimeout(() => {
          navigate("/home");
        }, 1000); // waits 1 sec before redirect
      } else {
        setError(res.data.message || "Invalid credentials");
      }

    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Invalid credentials");
      } else {
        setError("Server not reachable. Check backend.");
      }
    }
  };

  return (
    <div className="login-container">
      <h1 className="heading">Login</h1>

      
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <form className="form-container" onSubmit={handleSubmit}>
        <div className="label-input">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="label-input">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Login</button>

        <Link to="/register" className="link-button">
          New User Register Here
        </Link>
      </form>
    </div>
  );
};

export default Login;
