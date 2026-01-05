import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../../api/client";
import StaffHeader from "./StaffHeader";
import "../Css/staffProfile.css";
import cloudImg from "../../assets/clouds.png";

const StaffProfile = () => {
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await client.get("/me/staff");
        setStaff(res.data.data);
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
    <>
      <StaffHeader />      
      <div
        className="profile-view-page"
        style={{ backgroundColor: "lightblue" }}
      >
        <div className="profile-view-card">
          <h2 className="profile-title">My Profile</h2>

          <div className="profile-row">
            <strong>Name:</strong> {staff.name}
          </div>

          <div className="profile-row">
            <strong>Email:</strong> {staff.email}
          </div>

          <div className="profile-row">
            <strong>Phone:</strong> {staff.phone || "Not added yet"}
          </div>

          <div className="profile-row">
            <strong>Date of Birth:</strong> {staff.dob || "Not added yet"}
          </div>

          <button
            className="edit-btn"
            onClick={() => navigate("/staff/profile/edit")}
          >
            Edit Profile
          </button>
        </div>
      </div>
    </>
  );
};

export default StaffProfile;
