// import React, { useState, useEffect } from "react";
// import "../pages/Css/Register.css";
// import client from "../api/client";
// import { useNavigate, Link } from "react-router-dom";

// const Register = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     dob: "",
//     password: "",
//     role: "student",
//   });

//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await client.post("/register", formData);

//       setSuccess("Registration successful!");
//       setError("");
//       navigate("/");
//     } catch (err) {
//       setError(err.response?.data?.message || "Registration failed");
//       setSuccess("");
//     }
//   };

//   useEffect(() => {
//     if (error) alert(error);
//     if (success) alert(success);
//   }, [error, success]);

//   return (
//     <div className="register-container">
//       <form className="form-container" onSubmit={handleSubmit}>
        
//         <h1 className="regis-heading">Register</h1>

//         <div className="label-input">
//           <label>Full Name</label>
//           <input
//             type="text"
//             name="name"
//             placeholder="Enter full name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="label-input">
//           <label>Email</label>
//           <input
//             type="email"
//             name="email"
//             placeholder="Enter your email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="label-input">
//           <label>Phone</label>
//           <input
//             type="text"
//             name="phone"
//             placeholder="Enter your phone number"
//             value={formData.phone}
//             onChange={handleChange}
//           />
//         </div>

//         <div className="label-input">
//           <label>Date of Birth</label>
//           <input
//             type="date"
//             name="dob"
//             value={formData.dob}
//             onChange={handleChange}
//           />
//         </div>

//         <div className="label-input">
//           <label>Password</label>
//           <input
//             type="password"
//             name="password"
//             placeholder="Enter a strong password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="label-input">
//           <label>Role</label>
//           <select name="role" value={formData.role} onChange={handleChange}>
//             <option value="student">Student</option>
//             <option value="admin">Admin</option>
//           </select>
//         </div>

//         <div className="button-group">
//           <button type="submit" className="link-button">Register</button>

//           <Link to="/login" className="link-button-link">
//             Already User? Login Here
//           </Link>
//         </div>

//       </form>
//     </div>
//   );
// };

// export default Register;


// import React, { useState, useEffect } from "react";
// import "../pages/Css/Register.css";
// import client from "../api/client";
// import { useNavigate, Link } from "react-router-dom";

// const Register = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     dob: "",
//     password: "",
//     role: "student",
//   });

//   const [emailError, setEmailError] = useState(""); // ⭐ NEW
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   // ⭐ Validate email same as Login.jsx
//   const handleEmailFocus = () => {
//     if (!formData.email) {
//       setEmailError("Eg: example@domain.com");
//     }
//   };

//   const handleEmailBlur = () => {
//     if (!formData.email) {
//       setEmailError("");
//       return;
//     }

//     const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!regex.test(formData.email)) {
//       setEmailError("Invalid email format. Eg: example@domain.com");
//     } else {
//       setEmailError("");
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     // Hide hint while typing
//     if (name === "email" && emailError.startsWith("Eg")) {
//       setEmailError("");
//     }

//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Stop if email is invalid
//     if (emailError.startsWith("Invalid")) {
//       setError("Please enter a valid email.");
//       return;
//     }

//     try {
//       await client.post("/register", formData);

//       setSuccess("Registration successful!");
//       setError("");

//       navigate("/");
//     } catch (err) {
//       setError(err.response?.data?.message || "Registration failed");
//       setSuccess("");
//     }
//   };

//   useEffect(() => {
//     if (error) alert(error);
//     if (success) alert(success);
//   }, [error, success]);

//   return (
//     <div className="register-container">
//       <form className="form-container" onSubmit={handleSubmit}>
        
//         <h1 className="regis-heading">Register</h1>

//         <div className="label-input">
//           <label>Full Name</label>
//           <input
//             type="text"
//             name="name"
//             placeholder="Enter full name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         {/* ⭐ EMAIL VALIDATION SAME AS LOGIN */}
//         <div className="label-input">
//           <label>Email</label>

//           <input
//             type="email"
//             name="email"
//             placeholder="Enter your email"
//             value={formData.email}
//             onChange={handleChange}
//             onFocus={handleEmailFocus}
//             onBlur={handleEmailBlur}
//             required
//           />

//           {emailError && (
//             <p
//               className={
//                 emailError.startsWith("Invalid") ? "error-text" : "hint-text"
//               }
//             >
//               {emailError}
//             </p>
//           )}
//         </div>

//         <div className="label-input">
//           <label>Phone</label>
//           <input
//             type="text"
//             name="phone"
//             placeholder="Enter your phone number"
//             value={formData.phone}
//             onChange={handleChange}
//           />
//         </div>

//         <div className="label-input">
//           <label>Date of Birth</label>
//           <input
//             type="date"
//             name="dob"
//             value={formData.dob}
//             onChange={handleChange}
//           />
//         </div>

//         <div className="label-input">
//           <label>Password</label>
//           <input
//             type="password"
//             name="password"
//             placeholder="Enter a strong password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="label-input">
//           <label>Role</label>
//           <select name="role" value={formData.role} onChange={handleChange}>
//             <option value="student">Student</option>
//             <option value="admin">Admin</option>
//           </select>
//         </div>

//         <div className="button-group">
//           <button type="submit" className="link-button">Register</button>

//           <Link to="/login" className="link-button-link">
//             Already User? Login Here
//           </Link>
//         </div>

//       </form>
//     </div>
//   );
// };

// export default Register;


import React, { useState, useEffect } from "react";
import "../pages/Css/Register.css";
import client from "../api/client";
import { useNavigate, Link } from "react-router-dom";

// FontAwesome icons
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

  // ---------------- EMAIL VALIDATION ----------------
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) return "Eg: example@domain.com";
    if (!regex.test(email)) return "Invalid email format (Eg: example@domain.com)";

    return "";
  };

  // ---------------- PASSWORD VALIDATION ----------------
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

  // ---------------- HANDLE INPUT CHANGE ----------------
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

  // ---------------- SUBMIT FORM ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (emailError || passwordError) return;

    try {
      await client.post("/register", formData);
      setSuccess("Registration successful!");
      setError("");

      setTimeout(() => {
        navigate("/login");
      }, 700);

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      setSuccess("");
    }
  };

  // Show alerts
  useEffect(() => {
    if (error) alert(error);
    if (success) alert(success);
  }, [error, success]);

  return (
    <div className="register-container">
      <form className="form-container" onSubmit={handleSubmit}>
        <h1 className="regis-heading">Register</h1>

        {/* Name */}
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

        {/* Email */}
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
          {emailError && <p className="error-text">{emailError}</p>}
        </div>

        {/* Phone */}
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

        {/* DOB */}
        <div className="label-input">
          <label>Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
          />
        </div>

        {/* PASSWORD + SHOW/HIDE */}
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
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
          </div>

          {passwordError && <p className="error-text">{passwordError}</p>}
        </div>

        {/* ROLE */}
        <div className="label-input">
          <label>Role</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* BUTTONS */}
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

