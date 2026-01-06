import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../../api/client";
import StaffHeader from "./StaffHeader";
import "../Css/staffDashboard.css";

const StaffDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const profileRes = await client.get("/me/staff");
        setProfile(profileRes.data.data);

        const statsRes = await client.get("/staff/dashboard");
        setStats(statsRes.data.data);
      } catch (err) {
        console.error("Dashboard load error:", err);
      }
    };

    loadData();
  }, []);

  return (
    <>
      <StaffHeader />

      <div className="staff-dashboard">
        
        <div className="profile-card">
          <div className="profile-left">
            <div className="avatar-circle">
              {profile?.name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <h2>{profile?.name}</h2>
              <p>{profile?.email}</p>
              <p>Phone: {profile?.phone || "Not added"}</p>

              <div className="profile-actions">
                <button
                  className="primary-btn"
                  onClick={() => navigate("/staff/my-courses")}
                >
                  View Assigned Courses
                </button>

                <button
                  className="danger-btn"
                  onClick={() => navigate("/staff/profile/edit")}
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        
        <div className="dashboard-stats">
          <div className="stat-card" onClick={() => navigate("/staff/my-courses")}>
            <h1>{stats?.assigned_courses || 0}</h1>
            <p>Assigned Courses</p>
          </div>

          <div className="stat-card"  onClick={() => navigate("/staff/courses-students")}>
            <h1>{stats?.students || 0}</h1>
            <p>Total Students</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default StaffDashboard;
