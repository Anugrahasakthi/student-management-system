

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import client from "../api/client";
import "../pages/Css/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
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
        const { token, role: backendRole, user } = res.data.data;

       
        if (backendRole !== role) {
          setError("Please choose your correct role.");
          return;
        }

        
        localStorage.setItem("token", token);
        localStorage.setItem("role", backendRole);
        localStorage.setItem("user", JSON.stringify(user));

        setSuccess("Login successful! Redirecting...");

        
        setTimeout(() => {
          window.location.href =
            backendRole === "admin"
              ? "/admin/dashboard"
              : "/student/dashboard";
        }, 800);
      } else {
        setError(res.data.message || "Invalid credentials");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Server not reachable.");
    }
  };

  return (
    <div className="login-container">
      <h1 className="heading">Login</h1>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <form className="form-container" onSubmit={handleSubmit}>
        {/* Role Selection */}
        <div className="label-input">
          <label htmlFor="role">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="student">Student</option>
          </select>
        </div>

        <div className="label-input">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="label-input">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Login</button>

        <Link to="/register" className="link-button">
          New User? Register here
        </Link>
      </form>
    </div>
  );
};

export default Login;
