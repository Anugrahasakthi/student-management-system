import { useEffect, useState } from "react";
import client from "../../api/client";
import StudentHeader from "./StudentHeader";
import "../Css/studentDash.css";
import cloudImg from "../../assets/clouds.png";

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [summary, setSummary] = useState(null);
  const [announcements, setAnnouncements] = useState([]);

  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.replace("/");
      return;
    }
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
      window.history.pushState(null, "", window.location.href);
    };
  }, []);

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
    <div>
      <StudentHeader />

      <div
        className="student-dashboard-container"
        style={{ backgroundImage: `url(${cloudImg})` }}
      >
        <div className="profile-card">

          <img
            src={
              student.profile_pic ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
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
                onClick={() => (window.location.href = "/student/my-courses")}
              >
                View My Courses
              </button>

              <button
                className="btn-secondary"
                onClick={() => (window.location.href = "/student/profile/edit")}
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
          <h2 className="announcement-title">Announcements</h2>

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
