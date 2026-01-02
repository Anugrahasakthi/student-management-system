import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import client from "../../api/client";
import "../Css/editProfile.css";
import cloudImg from "../../assets/clouds.png";

const EditStaffProfile = () => {
  const [staff, setStaff] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
  });

  const [loading, setLoading] = useState(true);
  const [popupMsg, setPopupMsg] = useState("");
  const [popupType, setPopupType] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await client.get("/me/staff");
        setStaff(res.data.data);
      } catch (err) {
        console.error("Load error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleChange = (e) => {
    setStaff({ ...staff, [e.target.name]: e.target.value });
  };

  const showPopup = (msg, type = "success") => {
    setPopupMsg(msg);
    setPopupType(type);

    setTimeout(() => {
      setPopupMsg("");
      setPopupType("");

      if (type === "success") {
        navigate("/staff/profile", { replace: true });
      }
    }, 2000);
  };

  const handleSave = async () => {
    try {
      await client.put("/staff/update-profile", staff);
      showPopup("Profile updated successfully!", "success");
    } catch (err) {
      console.error("Update error:", err);
      showPopup("Profile update failed!", "error");
    }
  };

  if (loading) return <h2>Loading...</h2>;

  return (
    <div
      className="edit-profile-page"
      style={{ backgroundColor: "lightblue" }}
    >
      {popupMsg && (
        <div className={`profile-popup ${popupType}`}>{popupMsg}</div>
      )}

      <div className="edit-profile-card">
        <h2 className="edit-profile-title">Edit Profile</h2>

        <div className="edit-profile-form">
          <div className="form-row">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={staff.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <label>Email:</label>
            <input type="email" name="email" value={staff.email} disabled />
          </div>

          <div className="form-row">
            <label>Phone:</label>
            <input
              type="text"
              name="phone"
              value={staff.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <label>Date of Birth:</label>
            <input
              type="date"
              name="dob"
              value={staff.dob}
              onChange={handleChange}
            />
          </div>

          <button className="save-btn" onClick={handleSave}>
            Save Changes
          </button>

          <Link className="profile-link" to="/staff/profile">
            Back to MyProfile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EditStaffProfile;
