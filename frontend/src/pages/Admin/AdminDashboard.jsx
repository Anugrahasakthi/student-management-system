
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

  if (loading) return <h2>Loading...</h2>;

  return (
    <div>
      <AdminHeader />

      <div className="admin-container">
        <h1>Admin Dashboard</h1>

        <hr />

        <div className="dashboard-cards">

          <div className="dash-card">
            <h2>{stats.students}</h2>
            <p>Students</p>
          </div>

          <div className="dash-card">
            <h2>{stats.courses}</h2>
            <p>Courses</p>
          </div>

          <div className="dash-card">
            <h2>{stats.enrollments}</h2>
            <p>Enrollments</p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
