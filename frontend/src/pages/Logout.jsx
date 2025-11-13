import React from "react";
import { Link } from "react-router-dom";
import Thankyou from "../assets/Thank you.png";
import "./pages.css"

const Logout = ()=>{
    return(
        <div className='login-container'>
            <h1>Thanks for Visiting</h1>
            <img src={Thankyou} alt="thank you" className='thank-you'/>
            <div className="logout-options">
                <Link className="logout-but" to="/">Login Again</Link>
                <Link className="logout-but" to="/register">New User</Link>

            </div>
      </div>        
        
    )
}

export default Logout