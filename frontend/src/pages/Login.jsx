import React, { useState, useEffect } from "react";
import "./pages.css";
import client from "../api/client";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    if (error) {
      alert(error);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      console.log("Sending request...");
      const res = await client.post("/login", { email, password });
      console.log("Response from backend:", res.data);

      if (res.data.status === 200) {
        const { token, role, user } = res.data.data;

       
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("user", JSON.stringify(user));

        console.log("Login successful:", { token, role, user });
        alert("Login successful!");
        navigate("/home");

      } else {
        setError(res.data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.response) {
        console.error("Backend responded with:", err.response.data);
        setError(err.response.data.message || "Invalid credentials");
      } else {
        setError("Server not reachable. Check backend.");
      }
    }
  };

  return (
    <div className="login-container">
      <h1 className="heading">Login</h1>

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
