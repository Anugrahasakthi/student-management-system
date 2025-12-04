// import { Link, useNavigate } from "react-router-dom";
// import "../Css/studentHeader.css";

// const StudentHeader = () => {

//   const navigate = useNavigate();

//   const logout = () => {
//     // Clear login data
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     localStorage.removeItem("user");

//     // Replace history & go home
//     navigate("/", { replace: true });
//   };

//   return (
//     <div className="student-header">
//       <div className="logo">Student Panel</div>

//       <nav>
//         <Link to="/student/dashboard">Dashboard</Link>
//         <Link to="/student/courses">Courses</Link>
//         <Link to="/student/profile">My Profile</Link>

//         <button className="logout-btn" onClick={logout}>Logout</button>
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
    // Clear login data
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");

    // Redirect to home and prevent going back to dashboard
    navigate("/", { replace: true });
  };

  return (
    <div className="student-header">
      <div className="logo">Student Panel</div>

      <nav>
        <Link to="/student/dashboard">Dashboard</Link>
        <Link to="/student/courses">Courses</Link>
        <Link to="/student/my-courses">My Courses</Link>
        <Link to="/student/profile">My Profile</Link>

        <button className="logout-btn" onClick={logout}>Logout</button>
      </nav>
    </div>
  );
};

export default StudentHeader;


