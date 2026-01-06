import React, { useState } from "react";
import "../pages/Css/Register.css";
import client from "../api/client";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const passwordRules = [
  { label: "At least 1 uppercase letter", regex: /[A-Z]/ },
  { label: "At least 1 lowercase letter", regex: /[a-z]/ },
  { label: "At least 1 number", regex: /[0-9]/ },
  { label: "At least 1 symbol", regex: /[^A-Za-z0-9]/ },
  { label: "Minimum 8 characters", regex: /.{8,}/ },
];

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
  const [phoneError, setPhoneError] = useState("");
  const [passwordStatus, setPasswordStatus] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showRules, setShowRules] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  
  const validateEmail = (email) => {
    const regex = /^[a-z][a-z0-9]*@[a-z]+\.[a-z]{2,}$/;
    if (!email) return "Eg: example@domain.com";
    if (!regex.test(email))
      return "Invalid email format (Eg: example@domain.com)";
    return "";
  };

  
  const validatePhone = (phone) => {
    const regex = /^[6-9][0-9]{9}$/;
    if (!phone) return "Phone number is required";
    if (!regex.test(phone))
      return "Enter a valid 10-digit mobile number";
    return "";
  };

  
  const checkPasswordRules = (password) => {
    const status = {};
    passwordRules.forEach(rule => {
      status[rule.label] = rule.regex.test(password);
    });
    setPasswordStatus(status);
  };

  
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Allow only digits for phone
    if (name === "phone" && !/^\d*$/.test(value)) return;

    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === "email") setEmailError(validateEmail(value));
    if (name === "phone") setPhoneError(validatePhone(value));
    if (name === "password") checkPasswordRules(value);
  };

  const isPasswordValid =
    Object.values(passwordStatus).length === passwordRules.length &&
    Object.values(passwordStatus).every(Boolean);

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (emailError || phoneError || !isPasswordValid) return;

    try {
      await client.post("/register", formData);
      setSuccess("Registration successful!");
      setError("");

      setTimeout(() => navigate("/login"), 800);
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
          <input name="name" value={formData.name} onChange={handleChange} />
        </div>

        <div className="label-input">
          <label>Email</label>
          <input name="email" value={formData.email} onChange={handleChange} />
        </div>
        {emailError && <p className="error-text">{emailError}</p>}

        <div className="label-input">
          <label>Phone</label>
          <input
            name="phone"
            maxLength={10}
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        {phoneError && <p className="error-text">{phoneError}</p>}

        <div className="label-input">
          <label>DOB</label>
          <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
        </div>

        <div className="label-input">
          <label>Password</label>

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => setShowRules(true)}
              onBlur={() => setShowRules(false)}
            />

            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
            </span>

            {showRules && (
              <div className="password-popup">
                {passwordRules.map(rule => (
                  <p
                    key={rule.label}
                    className={
                      passwordStatus[rule.label] ? "valid" : "invalid"
                    }
                  >
                    {passwordStatus[rule.label] ? "✔" : "✖"} {rule.label}
                  </p>
                ))}
              </div>
            )}
          </div>
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



