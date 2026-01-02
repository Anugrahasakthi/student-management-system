// import { useEffect, useState } from "react";
// import client from "../../api/client";
// import StaffHeader from "./StaffHeader";
// import "../Css/staffDashboard.css";

// const StaffDashboard = () => {
//   const [profile, setProfile] = useState(null);

//   useEffect(() => {
//     const loadProfile = async () => {
//       const res = await client.get("/me/staff");
//       setProfile(res.data.data);
//     };
//     loadProfile();
//   }, []);

//   return (
//     <>
//       <StaffHeader />

//       <div className="staff-dashboard">
//         <h2>Welcome {profile?.name || "Staff"}</h2>

//         <div className="staff-cards">
//           <div className="staff-card">
//             <h3>Profile</h3>
//             <p>View & edit your profile</p>
//           </div>

//           <div className="staff-card">
//             <h3>Courses</h3>
//             <p>View assigned courses</p>
//           </div>

//           <div className="staff-card">
//             <h3>Students</h3>
//             <p>View students under you</p>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default StaffDashboard;
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import client from "../../api/client";
// import StaffHeader from "./StaffHeader";
// import "../Css/staffDashboard.css";
// import cloudImg from "../../assets/clouds.png";

// const StaffDashboard = () => {
//   const [staff, setStaff] = useState(null);
//   const [stats, setStats] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const loadData = async () => {
//       const profileRes = await client.get("/me/staff");
//       setStaff(profileRes.data.data);

//       const statsRes = await client.get("/staff/dashboard");
//       setStats(statsRes.data.data);
//     };

//     loadData();
//   }, []);

//   return (
//     <>
//       <StaffHeader />

//       <div
//         className="staff-dashboard"
//         style={{ backgroundImage: `url(${cloudImg})` }}
//       >
//         {/* PROFILE CARD (SAME AS STUDENT) */}
//         <div className="dashboard-profile-card">
//           <div className="profile-avatar">
//             {staff?.name?.charAt(0).toUpperCase()}
//           </div>

//           <div className="profile-details">
//             <h2>{staff?.name}</h2>
//             <p>{staff?.email}</p>
//             <p>Phone: {staff?.phone || "Not added yet"}</p>

//             <div className="profile-buttons">
//               <button
//                 className="primary-btn"
//                 onClick={() => navigate("/staff/my-courses")}
//               >
//                 View My Courses
//               </button>

//               <button
//                 className="secondary-btn"
//                 onClick={() => navigate("/staff/profile")}
//               >
//                 Edit Profile
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* STATS (SAME LAYOUT AS STUDENT) */}
//         <div className="dashboard-stats">
//           <div className="stat-card">
//             <h1>{stats?.assigned_courses || 0}</h1>
//             <p>Assigned Courses</p>
//           </div>

//           <div className="stat-card">
//             <h1>{stats?.students || 0}</h1>
//             <p>Total Students</p>
//           </div>

//           <div className="stat-card">
//             <h1>{stats?.active_courses || 0}</h1>
//             <p>Active Courses</p>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default StaffDashboard;

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
        {/* PROFILE CARD */}
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

        {/* STATS */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <h1>{stats?.assigned_courses || 0}</h1>
            <p>Assigned Courses</p>
          </div>

          <div className="stat-card">
            <h1>{stats?.students || 0}</h1>
            <p>Total Students</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default StaffDashboard;
