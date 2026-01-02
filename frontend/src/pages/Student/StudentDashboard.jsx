import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../../api/client";
import StudentHeader from "./StudentHeader";
import "../Css/studentDash.css";
import cloudImg from "../../assets/clouds.png";

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [summary, setSummary] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const navigate = useNavigate();

  // Check login token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/", { replace: true });
      return;
    }
  }, [navigate]);

  const loadProfile = async () => {
    const res = await client.get("/me/student");
    setStudent(res.data.data);
  };

  const loadSummary = async () => {
    const res = await client.get("/student/dashboard-summary");
    setSummary(res.data.data);
  };

  const loadAnnouncements = async () => {
    try {
      const res = await client.get("/courses");

      const sorted = res.data.data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      setAnnouncements(sorted.slice(0, 2));
    } catch (err) {
      console.error("Error loading announcements:", err);
    }
  };

  useEffect(() => {
    loadProfile();
    loadSummary();
    loadAnnouncements();
  }, []);

  if (!student || !summary) return <h2>Loading...</h2>;

  return (
    <div >
      <StudentHeader />

      <div
        className="student-dashboard-container"
        style={{ backgroundColor: "lightblue"}}
      >
        
        <div className="profile-card">
          <img
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
            alt="profile"
            className="profile-photo"
          />

          <div className="profile-details">
            <h2>{student.name}</h2>
            <p className="email">{student.email}</p>
            <p>Phone: {student.phone}</p>

            <div className="profile-buttons">
              <button
                className="btn-primary"
                onClick={() => navigate("/student/my-courses")}
              >
                View My Courses
              </button>

              <button
                className="btn-secondary"
                onClick={() => navigate("/student/profile/edit")}
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        
        <div className="summary-cards">
          <div className="summary-card">
            <h2>{summary.enrolled_total}</h2>
            <p>Total Enrolled Courses</p>
          </div>

          <div className="summary-card">
            <h2>{summary.in_progress}</h2>
            <p>In-Progress Courses</p>
          </div>

          <div className="summary-card">
            <h2>{summary.dropped}</h2>
            <p>Dropped Courses</p>
          </div>
        </div>

        
        <div className="announcement-box">
          <h2 className="announcement-title"><i className="bi bi-journal-bookmark icon-books"></i> Announcement</h2>
          <p className="announcement-desc">Enroll now to the newly added Courses</p>

          {announcements.length === 0 ? (
            <p className="no-announcement">No announcements available.</p>
          ) : (
            announcements.map((item) => (
              <div key={item.id} className="announcement-item">
                {item.course_name}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

