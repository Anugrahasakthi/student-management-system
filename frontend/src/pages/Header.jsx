import React from "react";
import { Link } from "react-router-dom";
import "./pages.css";
const Header = () =>{
    const token=localStorage.getItem("token");
    const role=localStorage.getItem("role");
    return (
        
            <ul className="nav-links">
                <li className="header-list"><Link to="/home">Home</Link></li>
                <li className="header-list"><Link to="/">Login</Link></li>
                {token && role ==='student' && (
                    <>
                    <li className="header-list"><Link to="/profile">My Profile</Link></li>
                    <li className="header-list"><Link to="/logout">Logout</Link></li>                    
                    </>
                )}

                {token && role ==='admin' && (
                    <>
                    <li className="header-list"><Link to="/students">Students</Link></li>
                    <li className="header-list"><Link to="/logout">Logout</Link></li>                    
                    </>
                )}
               
                
                <li className="header-list"><Link to="/register">Register</Link></li>
                
      </ul>
       
    )
}

export default Header