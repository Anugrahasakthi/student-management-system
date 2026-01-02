import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import client from "../../api/client";
import "../Css/studentProfile.css";
import cloudImg from "../../assets/clouds.png";

const StudentProfile = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  const logout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  if (loading) return <h2>Loading...</h2>;

  return (
    <div className="profile-view-page" style={{ backgroundColor: "lightblue"}}>
      
      
      <div className="profile-header">

        <div className="header-left">
          <div className="initial-circle">{student.name.charAt(0).toUpperCase()}</div>
          <span className="header-name">{student.name}</span>
        </div>

        <div className="header-right">
          <Link to="/student/dashboard">Dashboard</Link>
          <Link to="/student/courses">Courses</Link>
          <Link to="/student/my-courses">My Courses</Link>
          <Link to="/student/profile">My Profile</Link>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>

      </div>

      
      <div className="profile-view-card" >
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
          onClick={() => navigate("/student/profile/edit")}
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default StudentProfile;
