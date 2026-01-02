// import { useEffect, useState } from "react";
// import client from "../../api/client";
// import AdminHeader from "./AdminHeader";
// import "../Css/assignStaffCourse.css";

// const AssignStaffToCourse = () => {
//   const [staffList, setStaffList] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [staffId, setStaffId] = useState("");
//   const [courseId, setCourseId] = useState("");
//   const [message, setMessage] = useState("");
//   const [msgType, setMsgType] = useState(""); 

//   useEffect(() => {
//     const loadData = async () => {
//       const staffRes = await client.get("/admin/staff");
//       const courseRes = await client.get("/courses");

//       setStaffList(staffRes.data.data);
//       setCourses(courseRes.data.data);
//     };
//     loadData();
//   }, []);

//   const assignCourse = async () => {
//     if (!staffId || !courseId) {
//       setMessage("Please select staff and course");
//       setMsgType("error");
//       return;
//     }

//     try {
//       const res = await client.post("/admin/assign-course", {
//         staff_id: staffId,
//         course_id: courseId,
//       });

//       setMessage(res.data.message || "Course assigned successfully");
//       setMsgType("success");

//       // optional reset
//       setStaffId("");
//       setCourseId("");
//     } catch (err) {
//       setMessage(err.response?.data?.message || "Error assigning course");
//       setMsgType("error");
//     }
//   };

//   return (
//     <>
//       <AdminHeader />

//       <div className="assign-container">
//         {message && (
//           <p className={`msg ${msgType}`}>
//             {message}
//           </p>
//         )}
//         <h2>Assign Course to Staff</h2>

//         <div className="form-group">
//           <label>Select Staff</label>
//           <select value={staffId} onChange={(e) => setStaffId(e.target.value)}>
//             <option value="">-- Select Staff --</option>
//             {staffList.map((staff) => (
//               <option key={staff.id} value={staff.id}>
//                 {staff.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="form-group">
//           <label>Select Course</label>
//           <select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
//             <option value="">-- Select Course --</option>
//             {courses.map((course) => (
//               <option key={course.id} value={course.id}>
//                 {course.course_name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <button onClick={assignCourse} className="assign-btn">
//           Assign Course
//         </button>

        
//       </div>
//     </>
//   );
// };

// export default AssignStaffToCourse;

import { useEffect, useState } from "react";
import client from "../../api/client";
import AdminHeader from "./AdminHeader";
import "../Css/assignStaffCourse.css";
import { useNavigate } from "react-router-dom";


const AssignStaffToCourse = () => {
  const [staffList, setStaffList] = useState([]);
  const [courses, setCourses] = useState([]);
  const [staffId, setStaffId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState(""); // success | error

  const navigate = useNavigate();

  // 🔁 load staff + available courses
  const loadData = async () => {
    try {
      const staffRes = await client.get("/admin/staff");
      const courseRes = await client.get("/admin/available-courses");

      setStaffList(staffRes.data.data);
      setCourses(courseRes.data.data);
    } catch (err) {
      setMessage("Failed to load data");
      setMsgType("error");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const assignCourse = async () => {
    if (!staffId || !courseId) {
      setMessage("Please select staff and course");
      setMsgType("error");
      return;
    }

    try {
      const res = await client.post("/admin/assign-course", {
        staff_id: staffId,
        course_id: courseId,
      });

      setMessage(res.data.message || "Course assigned successfully");
      setMsgType("success");

      // reset selections
      setStaffId("");
      setCourseId("");

      // 🔥 reload available courses so assigned one disappears
      loadData();
    } catch (err) {
      setMessage(err.response?.data?.message || "Error assigning course");
      setMsgType("error");
    }
  };

  return (
    <>
      <AdminHeader />
      <div className="register-staff-wrapper">
  <button
    className="register-staff-btn"
    onClick={() => navigate("/admin/register-staff")}
  >
    + Register New Staff
  </button>
</div>



      <div className="assign-container">
        <h2>Assign Course to Staff</h2>

        {message && <p className={`msg ${msgType}`}>{message}</p>}

        <div className="form-group">
          <label>Select Staff</label>
          <select value={staffId} onChange={(e) => setStaffId(e.target.value)}>
            <option value="">-- Select Staff --</option>
            {staffList.map((staff) => (
              <option key={staff.id} value={staff.id}>
                {staff.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Select Course</label>
          <select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
            <option value="">-- Select Course --</option>

            {courses.length === 0 ? (
              <option disabled>No available courses</option>
            ) : (
              courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.course_name}
                </option>
              ))
            )}
          </select>
        </div>

        <button onClick={assignCourse} className="assign-btn">
          Assign Course
        </button>
      </div>
    </>
  );
};

export default AssignStaffToCourse;
