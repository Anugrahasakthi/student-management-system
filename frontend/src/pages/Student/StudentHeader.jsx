// import { Link, useNavigate } from "react-router-dom";
// import "../../pages/Css/studentHeader.css";

// const StudentHeader = () => {
//   const navigate = useNavigate();

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     navigate("/login");
//   };

//   return (
//     <div className="student-header">
//       <div className="logo">Student Panel</div>

//       <nav className="student-nav">
//         <Link to="/student/dashboard">Dashboard</Link>
//         <Link to="/student/courses">Available Courses</Link>
//         <Link to="/student/my-courses">My Courses</Link>
//         <Link to="/student/profile">My Profile</Link>

//         <button className="logout-btn" onClick={logout}>
//           Logout
//         </button>
//       </nav>
//     </div>
//   );
// };

// export default StudentHeader;

import { Link, useNavigate } from "react-router-dom";
import "../Css/studentHeader.css";

const StudentHeader = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="student-header">
      <div className="logo">Student Panel</div>

      <nav>
        <Link to="/student/dashboard">Dashboard</Link>
        <Link to="/student/courses">Available Courses</Link>
        <Link to="/student/profile">My Profile</Link>
        
        <button className="logout-btn" onClick={logout}>Logout</button>
      </nav>
    </div>
  );
};

export default StudentHeader;
