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


