import { Link } from "react-router-dom";
import "../Css/adminHeader.css";

const AdminHeader = () => {
  return (
    <nav className="admin-nav">
      <ul className="admin-links">
        <li><Link to="/admin/dashboard">Dashboard</Link></li>
        <li><Link to="/admin/students">Students</Link></li>
        <li><Link to="/admin/courses">Courses</Link></li>
        <li><Link to="/admin/enrollments">Enrollments</Link></li>
        <li className="logout"><Link to="/logout">Logout</Link></li>
      </ul>
    </nav>
  );
};

export default AdminHeader;
