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

  const handleEmailFocus = () => {
    if (!email) {
      setEmailError("Eg: example@domain.com");
    }
  };

  const handleEmailBlur = () => {
    if (!email) {
      setEmailError("");
      return;
    }

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      setEmailError("Invalid email format. Eg: example@domain.com");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (emailError && emailError.startsWith("Invalid")) return;

    try {
      const res = await client.post("/login", { email, password });

      if (res.data.status === 200) {
        const { token, role: backendRole, user } = res.data.data;

        if (backendRole !== role) {
          setError("Selected role does not match your account.");
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
      setError(err.response?.data?.message || "Server not reachable");
    }
  };

  return (
    <div className="login-container">

      <form className="login-card" onSubmit={handleSubmit}>
        <h1 className="login-heading">Login</h1>

        {error && <p className="msg-error">{error}</p>}
        {success && <p className="msg-success">{success}</p>}

        <div className="row">
          <label>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="student">Student</option>
          </select>
        </div>

        <div className="row">
          <label>Email</label>
          <div className="input-box">
            <input 
              style={{marginLeft:25, width:360}}
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError.startsWith("Eg")) setEmailError(""); // clear hint while typing
              }}
              onFocus={handleEmailFocus}
              onBlur={handleEmailBlur}
              required
            />
            {emailError && (
              <p className={emailError.startsWith("Invalid") ? "error-text" : "hint-text"}>
                {emailError}
              </p>
            )}
          </div>
        </div>

        <div className="row">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="login-btn" type="submit">Login</button>

        <Link to="/register" className="register-link">
          New User? Register Here
        </Link>
      </form>
    </div>
  );
};

export default Login;


