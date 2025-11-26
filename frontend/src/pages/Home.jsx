import React from "react";
import { Link } from "react-router-dom";
import Meghan from "../assets/Meghan logo.png";
import cloudImg from "../assets/clouds.png";

import "./Home.css";

const Home = () => {
  return (
    <div
  className="home-back"
  style={{ backgroundImage: `url(${cloudImg})` }}
>

  {/* Small logo at top-left */}
  <img className="logo-top-left" src={Meghan} alt="logo" />

  {/* Centered content */}
  <div className="home-container">
    <h1>Meghan Technologies</h1>
    <h2>Student Management System</h2>

    <div className="home-buttons">
      <Link to="/login">
        <button className="home-btn">Login</button>
      </Link>

      <Link to="/register">
        <button className="home-btn">Register</button>
      </Link>
    </div>
  </div>
</div>
   
  );
};

export default Home;
