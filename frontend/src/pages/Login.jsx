import { useState } from "react";
import { Link } from "react-router-dom";
import client from "../api/client";
import "../pages/Css/Login.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [emailError, setEmailError] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailFocus = () => {
    if (!email) setEmailError("Eg: example@domain.com");
  };

  const handleEmailBlur = () => {
    if (!email) {
      setEmailError("");
      return;
    }
    const regex = /^[a-z][a-z0-9]*@[a-z]+\.[a-z]{2,}$/;
    setEmailError(
      regex.test(email)
        ? ""
        : "Invalid email format. Eg: example@domain.com"
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (emailError.startsWith("Invalid")) return;

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

        
        <div className="form-row">
          <label>Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            className="role-box"
          >
            <option value="" disabled hidden>Select Role</option>
            <option value="admin">Admin</option>
            <option value="student">Student</option>
          </select>
        </div>

       
        <div className="form-row">
          <label>Email</label>
          <div className="email-box">
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError.startsWith("Eg")) setEmailError("");
              }}
              onFocus={handleEmailFocus}
              onBlur={handleEmailBlur}
              required
            />
          </div>
        </div>

        {emailError && (
          <p
            className={
              emailError.startsWith("Invalid")
                ? "error-text"
                : "hint-text"
            }
          >
            {emailError}
          </p>
        )}

        
        <div className="form-row">
          <label>Password</label>
          <div className="pass-box">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              <FontAwesomeIcon
                icon={showPassword ? faEye : faEyeSlash}
              />
            </span>
          </div>
        </div>

        <button className="login-btn" type="submit">
          Login
        </button>

        <Link to="/register" className="register-link">
          New User? Register Here
        </Link>
      </form>
    </div>
  );
};

export default Login;
