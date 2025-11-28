import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Meghan from "../assets/Meghan logo.png";
import cloudImg from "../assets/clouds.png";

import "../pages/Css/Home.css";

const Home = () => {

  useEffect(() => {
    // STEP 1: Replace the current entry so Login is removed from history
    window.history.replaceState(null, "", window.location.href);

    // STEP 2: Push a new state so back button has no previous page
    window.history.pushState(null, "", window.location.href);

    // STEP 3: Block back navigation permanently
    window.onpopstate = function () {
      window.history.pushState(null, "", window.location.href);
    };
  }, []);

  return (
    <div
      className="home-back"
      style={{ backgroundImage: `url(${cloudImg})` }}
    >
      <img className="logo-top-left" src={Meghan} alt="logo" />

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

