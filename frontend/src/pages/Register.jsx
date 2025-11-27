import React, { useState, useEffect } from "react";
import "../pages/Css/Register.css";
import client from "../api/client";
import { useNavigate, Link } from "react-router-dom";

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

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await client.post("/register", formData);

      setSuccess("Registration successful!");
      setError("");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      setSuccess("");
    }
  };

  useEffect(() => {
    if (error) alert(error);
    if (success) alert(success);
  }, [error, success]);

  return (
    <div className="register-container">
      <form className="form-container" onSubmit={handleSubmit}>
        
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

        <div className="label-input">
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            placeholder="Enter your phone number"
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
          <input
            type="password"
            name="password"
            placeholder="Enter a strong password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="label-input">
          <label>Role</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="button-group">
          <button type="submit" className="link-button">Register</button>

          <Link to="/login" className="link-button-link">
            Already User? Login Here
          </Link>
        </div>

      </form>
    </div>
  );
};

export default Register;
