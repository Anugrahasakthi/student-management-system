// // import React from "react";
// // import { Link } from "react-router-dom";
// // import Thankyou from "../assets/Thankyou.png";
// // import "./pages.css"

// // const Logout = ()=>{
// //     return(
// //         <div className='login-container'>
// //             <h1>Thanks for Visiting</h1>
// //             <img src={Thankyou} alt="thank you" className='thank-you'/>
// //             <div className="logout-options">
// //                 <Link className="logout-but" to="/">Home</Link>
// //                 <Link className="logout-but" to="/login">Login Again</Link>
// //                 <Link className="logout-but" to="/register">New User</Link>

// //             </div>
// //       </div>        
        
// //     )
// // }

// // export default Logout


// import React, { useEffect } from "react";
// import { Link } from "react-router-dom";
// import Thankyou from "../assets/Thankyou.png";
// import "./pages.css";

// const Logout = () => {

//   useEffect(() => {
//     // Remove auth details
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");

//     // Remove previous page from browser history
//     window.history.replaceState(null, "", window.location.href);
//   }, []);

//   return (
//     <div className="login-container">
//       <h1>Thanks for Visiting</h1>
//       <img src={Thankyou} alt="thank you" className="thank-you" />
//       <div className="logout-options">
//         <Link className="logout-but" to="/">Home</Link>
//         <Link className="logout-but" to="/login">Login Again</Link>
//         <Link className="logout-but" to="/register">New User</Link>
//       </div>
//     </div>
//   );
// }

// export default Logout;

import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Thankyou from "../assets/Thankyou.png";
import "./pages.css";

const Logout = () => {

  useEffect(() => {
    // Clear token & role
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    // Replace the entire history behind logout with HOME
    window.history.pushState(null, "", "/logout"); // current page
    setTimeout(() => {
      window.history.replaceState(null, "", "/"); // previous page becomes home
    }, 0);
  }, []);

  return (
    <div className="login-container">
      <h1>Thanks for Visiting</h1>
      <img src={Thankyou} alt="thank you" className="thank-you" />
      <div className="logout-options">
        <Link className="logout-but" to="/">Home</Link>
        <Link className="logout-but" to="/login">Login Again</Link>
        <Link className="logout-but" to="/register">New User</Link>
      </div>
    </div>
  );
};

export default Logout;




