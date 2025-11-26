import { useEffect, useState } from "react";
import client from "../../api/client";
import "../Css/studentProfile.css";
import cloudImg from "../../assets/clouds.png";

const StudentProfile = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await client.get("/me/student");
        setStudent(res.data.data);
      } catch (err) {
        console.error("Profile load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) return <h2>Loading...</h2>;

  return (
    <div className="profile-view-page" style={{ backgroundImage: `url(${cloudImg})` }}>
      
      {/* Header */}
    <div className="profile-header">

  <div className="header-left">
      <div className="initial-circle">{student.name.charAt(0).toUpperCase()}</div>
      <span className="header-name">{student.name}</span>
  </div>

  <div className="header-right">
      <a href="/student/dashboard">Dashboard</a>
      <button className="logout-btn"
        onClick={() => {
          localStorage.clear();
          window.location.href = "/login";
        }}
      >
        Logout
      </button>
  </div>

</div>


      {/* Profile Card */}
      <div className="profile-view-card">
        <h2 className="profile-title">My Profile</h2>

        <div className="profile-row"><strong>Name:</strong> {student.name}</div>
        <div className="profile-row"><strong>Email:</strong> {student.email}</div>
        <div className="profile-row"><strong>Phone:</strong> {student.phone || "Not added yet"}</div>
        <div className="profile-row"><strong>Date of Birth:</strong> {student.dob || "Not added yet"}</div>
        <div className="profile-row"><strong>Address:</strong> {student.address || "Not added yet"}</div>
        <div className="profile-row"><strong>Education:</strong> {student.education || "Not added yet"}</div>
        <div className="profile-row"><strong>Hobbies:</strong> {student.hobbies || "Not added yet"}</div>

        <button
          className="edit-btn"
          onClick={() => (window.location.href = "/student/profile/edit")}
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default StudentProfile;
