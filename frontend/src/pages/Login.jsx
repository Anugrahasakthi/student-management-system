import { useState } from "react";
import { Link } from "react-router-dom";
import client from "../api/client";
import "../pages/Css/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [emailError, setEmailError] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Validate email ONLY ON BLUR
  const validateEmail = () => {
    if (!email) {
      setEmailError("");
      return;
    }

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      setEmailError("Invalid email. Eg: example@domain.com");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (emailError) return; // Stop login if invalid email

    try {
      const res = await client.post("/login", { email, password });

      if (res.data.status === 200) {
        const { token, role: backendRole, user } = res.data.data;

        // Check role match
        if (backendRole !== role) {
          setError("Please choose your correct role.");
          return;
        }

        // Save login data
        localStorage.setItem("token", token);
        localStorage.setItem("role", backendRole);
        localStorage.setItem("user", JSON.stringify(user));

        setSuccess("Login successful! Redirecting...");

        // NAVIGATE USING YOUR OLD METHOD (WORKS PERFECTLY)
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

      <form className="form-container" onSubmit={handleSubmit}>

        {/* ERROR + SUCCESS MESSAGE INSIDE FORM */}
        {error && <p className="form-error">{error}</p>}
        {success && <p className="form-success">{success}</p>}

        {/* ROLE */}
        <div className="label-input">
          <label>Role</label>
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

        {/* EMAIL */}
        <div className="label-input">
          <label>Email</label>
          <div className="input-with-hint">
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={validateEmail}
              required
            />

            {!emailError && email && (
              <p className="email-hint">Eg: example@domain.com</p>
            )}
            {emailError && <p className="email-invalid">{emailError}</p>}
          </div>
        </div>

        {/* PASSWORD */}
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
