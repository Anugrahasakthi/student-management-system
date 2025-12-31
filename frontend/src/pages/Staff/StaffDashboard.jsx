import { useEffect, useState } from "react";
import client from "../../api/client";
import StaffHeader from "./StaffHeader";
import "../Css/staffDashboard.css";

const StaffDashboard = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      const res = await client.get("/me/staff");
      setProfile(res.data.data);
    };
    loadProfile();
  }, []);

  return (
    <>
      <StaffHeader />

      <div className="staff-dashboard">
        <h2>Welcome {profile?.name || "Staff"} 👋</h2>

        <div className="staff-cards">
          <div className="staff-card">
            <h3>Profile</h3>
            <p>View & edit your profile</p>
          </div>

          <div className="staff-card">
            <h3>Courses</h3>
            <p>View assigned courses</p>
          </div>

          <div className="staff-card">
            <h3>Students</h3>
            <p>View students under you</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default StaffDashboard;
