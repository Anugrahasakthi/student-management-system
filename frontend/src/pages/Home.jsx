import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Tao from "../assets/tao digital logo.png";
import cloudImg from "../assets/clouds.png";

import "../pages/Css/Home.css";

const Home = () => {

  

  // useEffect(() => {
  //   // STEP 1: Replace the current entry so Login is removed from history
  //   window.history.replaceState(null, "", window.location.href);

  //   // STEP 2: Push a new state so back button has no previous page
  //   window.history.pushState(null, "", window.location.href);

  //   // STEP 3: Block back navigation permanently
  //   window.onpopstate = function () {
  //     window.history.pushState(null, "", window.location.href);
  //   };
  // }, []);

  useEffect(() => {
  // STEP 1: Replace the current entry
  window.history.replaceState(null, "", window.location.href);

  // STEP 2: Push new state
  window.history.pushState(null, "", window.location.href);

  // STEP 3: Block back in Home
  const blockBack = () => {
    window.history.pushState(null, "", window.location.href);
  };
  window.onpopstate = blockBack;

  // ⭐ CLEANUP WHEN LEAVING HOME PAGE
  return () => {
    window.onpopstate = null;
  };
}, []);



   return (
    <div
      className="home-back"
      style={{ backgroundImage: `url(${cloudImg})` }}
    >
      <img className="logo-top-left" src={Tao} alt="logo" />

      <div className="home-container">
        <h1>Tao Digital</h1>
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

