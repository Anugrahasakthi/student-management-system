import { useEffect, useState } from "react";
import { Link ,useNavigate} from "react-router-dom";
import client from "../../api/client";
import "../Css/editProfile.css";
import cloudImg from "../../assets/clouds.png";

const EditStudentProfile = () => {
  const [student, setStudent] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
    education: "",
    hobbies: "",
  });

  const [loading, setLoading] = useState(true);


  const [popupMsg, setPopupMsg] = useState("");
  const [popupType, setPopupType] = useState(""); 
  const navigate = useNavigate();


  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await client.get("/me/student");
        setStudent(res.data.data);
      } catch (err) {
        console.error("Load error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const showPopup = (msg, type = "success") => {
    setPopupMsg(msg);
    setPopupType(type);

    setTimeout(() => {
      setPopupMsg("");
      setPopupType("");

      if (type === "success") {
        navigate("/student/profile", { replace: true });

      }

    }, 2000);
  };

  const handleSave = async () => {
    try {
      await client.put("/student/update-profile", student);
      showPopup("Profile updated successfully!", "success");
    } catch (err) {
      console.error("Update error:", err);
      showPopup("Profile update failed!", "error");
    }
  };

  if (loading) return <h2>Loading...</h2>;

  return (
    <div className="edit-profile-page" style={{ backgroundColor: "lightblue", minHeight: "120vh" }} >      
      {popupMsg && (
        <div className={`profile-popup ${popupType}`}>
          {popupMsg}
        </div>
      )}

      <div className="edit-profile-card">
        <h2 className="edit-profile-title">Edit Profile</h2>

        <div className="edit-profile-form">

          <div className="form-row">
            <label>Name:</label>
            <input type="text" name="name" value={student.name} onChange={handleChange} />
          </div>

          <div className="form-row">
            <label>Email:</label>
            <input type="email" name="email" value={student.email} disabled />
          </div>

          <div className="form-row">
            <label>Phone:</label>
            <input type="text" name="phone" value={student.phone} onChange={handleChange} />
          </div>

          <div className="form-row">
            <label>Date of Birth:</label>
            <input type="date" name="dob" value={student.dob} onChange={handleChange} />
          </div>

          <div className="form-row">
            <label>Address:</label>
            <textarea name="address" value={student.address} onChange={handleChange}></textarea>
          </div>

          <div className="form-row">
            <label>Education:</label>
            <input type="text" name="education" value={student.education} onChange={handleChange} />
          </div>

          <div className="form-row">
            <label>Hobbies:</label>
            <input type="text" name="hobbies" value={student.hobbies} onChange={handleChange} />
          </div>

          <button className="save-btn" onClick={handleSave}>
            Save Changes
          </button>
          <Link className="profile-link" to="/student/profile">Back to MyProfile</Link>
        </div>
      </div>
    </div>
  );
};

export default EditStudentProfile;
