import React, { useState } from "react";
import "../pages/Css/Register.css";
import client from "../api/client";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    password: "",
    role: "student",
  });

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  
  const validateEmail = (email) => {
    const regex = /^[a-z][a-z0-9]*@[a-z]+\.[a-z]{2,}$/;


    if (!email) return "Eg: example@domain.com";
    if (!regex.test(email)) return "Invalid email format (Eg: example@domain.com)";

    return "";
  };


  const validatePassword = (password) => {
    const rules = [
      { regex: /[A-Z]/, message: "Must contain at least 1 uppercase letter" },
      { regex: /[a-z]/, message: "Must contain at least 1 lowercase letter" },
      { regex: /[0-9]/, message: "Must contain at least 1 number" },
      { regex: /[^A-Za-z0-9]/, message: "Must contain at least 1 symbol" },
      { regex: /.{8,}/, message: "Minimum 8 characters required" },
    ];

    for (let rule of rules) {
      if (!rule.regex.test(password)) return rule.message;
    }
    return "";
  };

 
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "email") {
      setEmailError(validateEmail(value));
    }

    if (name === "password") {
      setPasswordError(validatePassword(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (emailError || passwordError) return;

    try {
      await client.post("/register", formData);
      setSuccess("Registration successful!");
      setError("");

      setTimeout(() => {
        navigate("/login");
      }, 800);

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      setSuccess("");
    }
  };

  return (
    <div className="register-container">
      <form className="form-container" onSubmit={handleSubmit}>        
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <h1 className="regis-heading">Register</h1>        
        <div className="label-input">
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter full name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="label-input">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          
        </div>
        {emailError && <p className="error-text">{emailError}</p>}
        <div className="label-input">
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            placeholder="Enter phone number"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <div className="label-input">
          <label>Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
          />
        </div>
        <div className="label-input">
          <label>Password</label>

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter a strong password"
              value={formData.password}
              onChange={handleChange}
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
        {passwordError && <p className="error-text">{passwordError}</p>}
        <div className="label-input">
          <label>Role</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="student">student</option>
            <option value="admin">admin</option>
          </select>
        </div>
        <div className="button-group">
          <button type="submit" className="link-button">
            Register
          </button>
          <Link to="/login" className="link-button-link">
            Already User? Login Here
          </Link>
        </div>        
      </form>
    </div>
  );
};

export default Register;