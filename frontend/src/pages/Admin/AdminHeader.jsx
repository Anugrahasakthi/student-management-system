
import { Link, useNavigate } from "react-router-dom";
import "../Css/adminHeader.css";

const AdminHeader = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  return (
    <header className="app-header">
      <div className="logo-text">Admin Panel</div>

      <nav className="nav-links">
        <Link to="/admin/dashboard">Dashboard</Link>
        <Link to="/admin/students">Students</Link>
        <Link to="/admin/courses">Courses</Link>
        <Link to="/admin/enrollments">Enrollments</Link>

        <button className="logout-btn" onClick={logout}>Logout</button>
      </nav>
    </header>
  );
};

export default AdminHeader;
