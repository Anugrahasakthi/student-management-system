// import { Link, useNavigate } from "react-router-dom";
// import "../Css/studentHeader.css";

// const StaffHeader = () => {
//   const navigate = useNavigate();

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     localStorage.removeItem("user");
//     navigate("/", { replace: true });
//   };

//   return (
//     <div className="student-header">
//       <div className="logo">Staff Panel</div>

//       <nav>
//         <Link to="/staff/dashboard">Dashboard</Link>
//         <Link to="/staff/my-courses">My Courses</Link>
//         <Link to="/staff/courses-students">My Students</Link>
//         <Link to="/staff/profile">My Profile</Link>
//         <button className="logout-btn" onClick={logout}>
//           Logout
//         </button>
//       </nav>
//     </div>
//   );
// };

// export default StaffHeader;

import { NavLink, useNavigate } from "react-router-dom";
import "../Css/staffHeader.css";

const StaffHeader = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  return (
    <header className="staff-header">
      <div className="logo">Staff Panel</div>

      <nav>
        <NavLink to="/staff/dashboard">
          Dashboard
        </NavLink>

        <NavLink to="/staff/my-courses">
          My Courses
        </NavLink>

        <NavLink to="/staff/courses-students">
          My Students
        </NavLink>

        <NavLink to="/staff/profile">
          My Profile
        </NavLink>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </nav>
    </header>
  );
};

export default StaffHeader;


