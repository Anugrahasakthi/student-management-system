import { Link, useNavigate } from "react-router-dom";
import "../Css/studentHeader.css";

const StaffHeader = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  return (
    <div className="student-header">
      <div className="logo">Staff Panel</div>

      <nav>
        <Link to="/staff/dashboard">Dashboard</Link>
        <Link to="/staff/profile">My Profile</Link>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </nav>
    </div>
  );
};

export default StaffHeader;
