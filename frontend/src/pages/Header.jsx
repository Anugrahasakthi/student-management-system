import React from "react";
import { Link } from "react-router-dom";
import "../pages/Css/header.css";

const Header = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return (
    <ul className="nav-links">

      {/* ALWAYS SHOW HOME */}
      

      {/* PUBLIC (not logged in) */}
      {!token && (
        <>
          <li className="header-list">
            <Link to="/">Login</Link>
          </li>
          <li className="header-list">
            <Link to="/register">Register</Link>
          </li>
        </>
      )}

  
      {token && role === "student" && (
        <>
          <li className="header-list">
            <Link to="/student/dashboard">Dashboard</Link>
          </li>
          <li className="header-list">
            <Link to="/student/courses">Courses</Link>
          </li>
          <li className="header-list">
            <Link to="/student/my-courses">My Courses</Link>
          </li>
          <li className="header-list">
            <Link to="/student/profile">My Profile</Link>
          </li>
          <li className="header-list">
            <Link to="/logout">Logout</Link>
          </li>
        </>
      )}

      {/* ADMIN LINKS */}
      {token && role === "admin" && (
        <>
          <li className="header-list">
            <Link to="/admin/students">Students</Link>
          </li>
          <li className="header-list">
            <Link to="/logout">Logout</Link>
          </li>
        </>
      )}

    </ul>
  );
};

export default Header;
