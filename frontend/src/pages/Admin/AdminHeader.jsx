import { Link, useNavigate } from "react-router-dom";
import "../Css/adminHeader.css";

const AdminHeader = () => {

  const navigate = useNavigate();

  const logout = () => {
    // Clear login data
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");

    // Go to home (REPLACE history so dashboard can't be returned)
    navigate("/", { replace: true });
  };

  return (
    <nav className="admin-nav">
      <ul className="admin-links">
        <li><Link to="/admin/dashboard">Dashboard</Link></li>
        <li><Link to="/admin/students">Students</Link></li>
        <li><Link to="/admin/courses">Courses</Link></li>
        <li><Link to="/admin/enrollments">Enrollments</Link></li>

        <li className="logout">
          <button onClick={logout} className="logout-btn">Logout</button>
        </li>
      </ul>
    </nav>
  );
};

export default AdminHeader;


