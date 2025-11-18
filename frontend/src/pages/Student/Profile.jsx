import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import client from "../../api/client";
import "../pages.css";
import girl from "../../assets/girl1.png";
import "../Css/studentProfile.css";

const Profile = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);


useEffect(() => {
  const fetchProfile = async () => {
    try {
      console.log("Fetching /me/student ...");
      const res = await client.get("/me/student");
      console.log("RESPONSE:", res.data);
      setStudent(res.data.data);
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchProfile();
}, []);


  if (loading) return <h2>Loading...</h2>;

  return (
    <div>
      <ul className="nav-links">
        <li className="header-list"><Link to="/student/dashboard">Dashboard</Link></li>
        <li className="header-list"><Link to="/logout">Logout</Link></li>
      </ul>

      <div className="prof-container">
        <h1>Welcome, {student.name}</h1>
        <img src={girl} className="image"/>
        <p><strong>Email:</strong> {student.email}</p>
        <p><strong>Phone:</strong> {student.phone}</p>
        <p><strong>DOB:</strong> {student.dob}</p>
      </div>
    </div>
  );
};

export default Profile;
