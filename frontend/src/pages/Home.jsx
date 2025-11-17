import React from "react";
import { Link } from "react-router-dom";
import Meghan from "../assets/Meghan logo.png";
import cloudImg from "../assets/clouds.png";

import "./Home.css";

const Home = () => {
  return (
    <div className="home-back" style={{ backgroundImage: `url(${cloudImg})` }}>  
         <img className="logo-img" src={Meghan} alt="logo"/>  
         <div className="home-container">
            <h1>Meghan Technologies</h1>
            <h2>Student Management System</h2>

            <div className="home-buttons">
                <Link to="/login"><button className="home-btn">Login</button></Link>
                <Link to="/register"><button className="home-btn">Register</button></Link>
            </div>
         </div>  
    </div>    
  );
};

export default Home;
