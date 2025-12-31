import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import client from "../api/client";
import "../pages/Css/Login.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const [emailError, setEmailError] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Email helpers
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

    if (!selectedRole) {
      setError("Please select a role");
      return;
    }

    if (emailError.startsWith("Invalid")) return;

    try {
      const res = await client.post("/login", { email, password });

      if (res.data.status === 200) {
        const { token, role: backendRole, user } = res.data.data;

        // 🔴 IMPORTANT CHECK
        if (backendRole !== selectedRole) {
          setError("Selected role does not match your account");
          return;
        }

        // Save auth
        localStorage.setItem("token", token);
        localStorage.setItem("role", backendRole);
        localStorage.setItem("user", JSON.stringify(user));

        setSuccess("Login successful!");

        // Redirect
        if (backendRole === "admin") {
          navigate("/admin/dashboard", { replace: true });
        } else if (backendRole === "staff") {
          navigate("/staff/dashboard", { replace: true });
        } else {
          navigate("/student/dashboard", { replace: true });
        }
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

        {/* ROLE DROPDOWN */}
        <div className="form-row">
          <label>Role</label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="role-box"
            required
          >
            <option value="" disabled>
              Select Role
            </option>
            <option value="admin">Admin</option>
            <option value="student">Student</option>
            <option value="staff">Staff</option>
          </select>
        </div>

        {/* EMAIL */}
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
                ? "error-texts"
                : "hint-text"
            }
          >
            {emailError}
          </p>
        )}

        {/* PASSWORD */}
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
              <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
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

