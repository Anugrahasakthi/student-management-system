import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../../api/client";
import AdminHeader from "./AdminHeader";
import "../Css/adminDash.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/", { replace: true });
      return;
    }
  }, [navigate]);

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentCourses, setRecentCourses] = useState([]);

  // Load Dashboard Stats
  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await client.get("/admin/stats");
        setStats(res.data.data);
      } catch (err) {
        console.error("Error loading admin stats:", err);

        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    if (localStorage.getItem("token")) {
      loadStats();
    }
  }, [navigate]);

  // Load recently added courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await client.get("/courses");

        // sort by created_at (most recent first)
        const sorted = res.data.data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        setRecentCourses(sorted.slice(0, 2)); // take only latest 2
      } catch (error) {
        console.error("Error loading courses:", error);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <h2>Loading...</h2>;

  return (
    <div>
      <AdminHeader />

      <div className="admin-container">
        <h1>Admin Dashboard</h1>

        <hr />

        {/* Statistics Cards */}
        <div className="dashboard-cards">
          <div className="dash-card">
            <h2>{stats.students}</h2>
            <p>Students</p>
          </div>

          <div className="dash-card">
            <h2>{stats.courses}</h2>
            <p>Courses</p>
          </div>
        </div>

        {/* Announcements Section */}
        <div className="announcement-section">
          <h2 className="announce-title">📢 Announcements</h2>

          <div className="announce-box">
            {recentCourses.length === 0 ? (
              <p>No recent courses added</p>
            ) : (
              recentCourses.map((course) => (
                <div key={course.id} className="announce-item">
                  <h3>{course.course_name}</h3>
                  
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
