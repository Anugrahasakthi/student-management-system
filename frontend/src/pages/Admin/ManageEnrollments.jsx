// import { useState, useEffect } from "react";
// import client from "../../api/client";
// import AdminHeader from "./AdminHeader";
// import "../../pages/Css/adminEnroll.css";

// const ManageEnrollments = () => {
//   const [tab, setTab] = useState("active");
//   const [enrollments, setEnrollments] = useState([]);
//   const [dropped, setDropped] = useState([]);
//   const [courses, setCourses] = useState([]);

//   const [form, setForm] = useState({
//     student_id: "",
//     course_id: ""
//   });

//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const rowsPerPage = 5;

//   // Load active enrollments
//   const loadActiveEnrollments = async () => {
//     try {
//       const res = await client.get("/enrollments");
//       setEnrollments(res.data.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Load dropped enrollments
//   const loadDroppedEnrollments = async () => {
//     try {
//       const res = await client.get("/dropped-enrollments");
//       setDropped(res.data.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Load course list
//   const loadCourses = async () => {
//     try {
//       const res = await client.get("/courses");
//       setCourses(res.data.data);
//     } catch (err) {
//       console.error("Course load error:", err);
//     }
//   };

//   useEffect(() => {
//     loadActiveEnrollments();
//     loadDroppedEnrollments();
//     loadCourses();
//   }, []);

//   // ENROLL student
//   const handleEnroll = async (e) => {
//     e.preventDefault();
//     try {
//       await client.post("/enroll", form);
//       alert("Student enrolled successfully");

//       setForm({ student_id: "", course_id: "" });
//       loadActiveEnrollments();
//       setTab("active");
//     } catch (err) {
//       alert(err.response?.data?.message || "Enrollment failed");
//     }
//   };

//   // UNENROLL
//   const handleUnenroll = async (id) => {
//     const reason = prompt("Enter reason for unenrollment:");
//     if (!reason) return alert("Reason is required!");

//     try {
//       await client.delete(`/enroll/${id}`, {
//         data: { reason },
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`
//         }
//       });

//       alert("Unenrolled successfully");
//       loadActiveEnrollments();
//       loadDroppedEnrollments();
//     } catch (err) {
//       console.error("Unenroll error:", err);
//       alert("Failed to unenroll");
//     }
//   };

//   // Pagination calculations
//   const lastIndex = currentPage * rowsPerPage;
//   const firstIndex = lastIndex - rowsPerPage;

//   const currentRows =
//     tab === "active"
//       ? enrollments.slice(firstIndex, lastIndex)
//       : dropped.slice(firstIndex, lastIndex);

//   const totalPages =
//     tab === "active"
//       ? Math.ceil(enrollments.length / rowsPerPage)
//       : Math.ceil(dropped.length / rowsPerPage);

//   return (
//     <div>
//       <AdminHeader />

//       <div className="enroll-page-container">
//         <h1 className="page-title">Manage Enrollments</h1>

//         {/* Tabs */}
//         <div className="tabs">
//           <button
//             className={tab === "active" ? "active-tab" : ""}
//             onClick={() => {
//               setTab("active");
//               setCurrentPage(1);
//             }}
//           >
//             All Enrollments
//           </button>

//           <button
//             className={tab === "new" ? "active-tab" : ""}
//             onClick={() => setTab("new")}
//           >
//             Enroll Student
//           </button>

//           <button
//             className={tab === "dropped" ? "active-tab" : ""}
//             onClick={() => {
//               setTab("dropped");
//               setCurrentPage(1);
//             }}
//           >
//             Dropped / Unenrolled
//           </button>
//         </div>

//         {/* ACTIVE enrollments */}
//         {tab === "active" && (
//           <div className="table-container">
//             <table className="enroll-table">
//               <thead>
//                 <tr>
//                   <th>S.No</th>
//                   <th>Student ID</th>
//                   <th>Student</th>
//                   <th>Email</th>
//                   <th>Course</th>
//                   <th>Duration</th>
//                   <th>Start</th>
//                   <th>End</th>
//                   <th>Days Left</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {currentRows.map((e, i) => (
//                   <tr key={e.enrollment_id}>
//                     <td>{firstIndex + i + 1}</td>
//                     <td>{e.student_id}</td> 
//                     <td>{e.student_name}</td>
//                     <td>{e.student_email}</td>
//                     <td>{e.course_name}</td>
//                     <td>{e.duration}</td>
//                     <td>{e.enrolled_at}</td>
//                     <td>{e.end_date}</td>
//                     <td>{e.days_left}</td>
//                     <td>
//                       <button
//                         className="unenroll-btn"
//                         onClick={() => handleUnenroll(e.enrollment_id)}
//                       >
//                         Unenroll
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             {/* Pagination */}
//             <div className="pagination">
//               <button
//                 onClick={() => setCurrentPage((p) => p - 1)}
//                 disabled={currentPage === 1}
//               >
//                 Prev
//               </button>

//               <span>
//                 Page {currentPage} of {totalPages || 1}
//               </span>

//               <button
//                 onClick={() => setCurrentPage((p) => p + 1)}
//                 disabled={currentPage === totalPages || totalPages === 0}
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}

//         {/* ENROLL FORM */}
//         {tab === "new" && (
//           <div className="enroll-form-container">
//             <h2>Enroll a Student</h2>

//             <form onSubmit={handleEnroll}>
//               <label>Student ID</label>
//               <input
//                 type="number"
//                 value={form.student_id}
//                 onChange={(e) =>
//                   setForm({ ...form, student_id: e.target.value })
//                 }
//                 required
//               />

//               <label>Course</label>
//               <select
//                 value={form.course_id}
//                 onChange={(e) =>
//                   setForm({ ...form, course_id: e.target.value })
//                 }
//                 required
//               >
//                 <option value="">Select a course</option>
//                 {courses.map((c) => (
//                   <option key={c.id} value={c.id}>
//                     {c.course_name}
//                   </option>
//                 ))}
//               </select>

//               <button type="submit" className="submit-btn">
//                 Enroll Student
//               </button>
//             </form>
//           </div>
//         )}

//         {/* DROPPED */}
//         {tab === "dropped" && (
//           <div className="table-container">
//             <table className="enroll-table">
//               <thead>
//                 <tr>
//                   <th>S.No</th>
//                   <th>Student ID</th>
//                   <th>Course ID</th>
//                   <th>Course</th>
//                   <th>Dropped By</th>
//                   <th>Reason</th>
//                   <th>Dropped At</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {currentRows.map((d, i) => (
//                   <tr key={d.id}>
//                     <td>{firstIndex + i + 1}</td>
//                     <td>{d.student_id}</td>
//                     <td>{d.course_id}</td>
//                     <td>{d.course_name}</td>
//                     <td>{d.dropped_by}</td>
//                     <td>{d.reason}</td>
//                     <td>{d.dropped_at}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             {/* Pagination */}
//             <div className="pagination">
//               <button
//                 onClick={() => setCurrentPage((p) => p - 1)}
//                 disabled={currentPage === 1}
//               >
//                 Prev
//               </button>

//               <span>
//                 Page {currentPage} of {totalPages || 1}
//               </span>

//               <button
//                 onClick={() => setCurrentPage((p) => p + 1)}
//                 disabled={currentPage === totalPages || totalPages === 0}
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ManageEnrollments;
import { useState, useEffect } from "react";
import client from "../../api/client";
import AdminHeader from "./AdminHeader";
import "../../pages/Css/adminEnroll.css";

const ManageEnrollments = () => {
  const [tab, setTab] = useState("active");
  const [enrollments, setEnrollments] = useState([]);
  const [dropped, setDropped] = useState([]);
  const [courses, setCourses] = useState([]);

  const [form, setForm] = useState({
    student_id: "",
    course_id: "",
  });

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  // Toast message
  const [toast, setToast] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const loadActiveEnrollments = async () => {
    try {
      const res = await client.get("/enrollments");
      setEnrollments(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadDroppedEnrollments = async () => {
    try {
      const res = await client.get("/dropped-enrollments");
      setDropped(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadCourses = async () => {
    try {
      const res = await client.get("/courses");
      setCourses(res.data.data);
    } catch (err) {
      console.error("Course load error:", err);
    }
  };

  useEffect(() => {
    loadActiveEnrollments();
    loadDroppedEnrollments();
    loadCourses();
  }, []);

  // Enroll a student
  const handleEnroll = async (e) => {
    e.preventDefault();
    try {
      await client.post("/enroll", form);

      setToast("Student enrolled successfully!");
      setTimeout(() => setToast(""), 2000);

      setForm({ student_id: "", course_id: "" });
      loadActiveEnrollments();
      setTab("active");
    } catch (err) {
      setToast(err.response?.data?.message || "Enrollment failed");
      setTimeout(() => setToast(""), 2000);
    }
  };

  // Open modal
  const handleUnenroll = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  // Submit unenrollment
  const submitUnenroll = async () => {
    if (!reason.trim()) {
      setToast("Reason cannot be empty");
      setTimeout(() => setToast(""), 2000);
      return;
    }

    try {
      await client.delete(`/enroll/${selectedId}`, {
        data: { reason },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setShowModal(false);
      setReason("");
      setSelectedId(null);

      setToast("Unenrolled successfully!");
      setTimeout(() => setToast(""), 2000);

      loadActiveEnrollments();
      loadDroppedEnrollments();
    } catch (err) {
      console.error("Unenroll error:", err);
      setToast("Failed to unenroll");
      setTimeout(() => setToast(""), 2000);
    }
  };

  // Pagination
  const lastIndex = currentPage * rowsPerPage;
  const firstIndex = lastIndex - rowsPerPage;

  const currentRows =
    tab === "active"
      ? enrollments.slice(firstIndex, lastIndex)
      : dropped.slice(firstIndex, lastIndex);

  const totalPages =
    tab === "active"
      ? Math.ceil(enrollments.length / rowsPerPage)
      : Math.ceil(dropped.length / rowsPerPage);

  return (
    <div>
      <AdminHeader />

      <div className="enroll-page-container">
        <h1 className="page-title">Manage Enrollments</h1>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={tab === "active" ? "active-tab" : ""}
            onClick={() => {
              setTab("active");
              setCurrentPage(1);
            }}
          >
            All Enrollments
          </button>

          <button
            className={tab === "new" ? "active-tab" : ""}
            onClick={() => setTab("new")}
          >
            Enroll Student
          </button>

          <button
            className={tab === "dropped" ? "active-tab" : ""}
            onClick={() => {
              setTab("dropped");
              setCurrentPage(1);
            }}
          >
            Dropped / Unenrolled
          </button>
        </div>

        {/* ACTIVE enrollments */}
        {tab === "active" && (
          <div className="table-container">
            <table className="enroll-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Student ID</th>
                  <th>Student</th>
                  <th>Email</th>
                  <th>Course</th>
                  <th>Duration</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Days Left</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {currentRows.map((e, i) => (
                  <tr key={e.enrollment_id}>
                    <td>{firstIndex + i + 1}</td>
                    <td>{e.student_id}</td>
                    <td>{e.student_name}</td>
                    <td>{e.student_email}</td>
                    <td>{e.course_name}</td>
                    <td>{e.duration}</td>
                    <td>{e.enrolled_at}</td>
                    <td>{e.end_date}</td>
                    <td>{e.days_left}</td>
                    <td>
                      <button
                        className="unenroll-btn"
                        onClick={() => handleUnenroll(e.enrollment_id)}
                      >
                        Unenroll
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="pagination">
              <button
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
              >
                Prev
              </button>

              <span>
                Page {currentPage} of {totalPages || 1}
              </span>

              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* ENROLL FORM */}
        {tab === "new" && (
          <div className="enroll-form-container">
            <h2>Enroll a Student</h2>

            <form onSubmit={handleEnroll}>
              <label>Student ID</label>
              <input
                type="number"
                value={form.student_id}
                onChange={(e) =>
                  setForm({ ...form, student_id: e.target.value })
                }
                required
              />

              <label>Course</label>
              <select
                value={form.course_id}
                onChange={(e) =>
                  setForm({ ...form, course_id: e.target.value })
                }
                required
              >
                <option value="">Select a course</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.course_name}
                  </option>
                ))}
              </select>

              <button type="submit" className="submit-btn">
                Enroll Student
              </button>
            </form>
          </div>
        )}

        {/* DROPPED enrollments */}
        {tab === "dropped" && (
          <div className="table-container">
            <table className="enroll-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Student ID</th>
                  <th>Course ID</th>
                  <th>Course</th>
                  <th>Dropped By</th>
                  <th>Reason</th>
                  <th>Dropped At</th>
                </tr>
              </thead>

              <tbody>
                {currentRows.map((d, i) => (
                  <tr key={d.id}>
                    <td>{firstIndex + i + 1}</td>
                    <td>{d.student_id}</td>
                    <td>{d.course_id}</td>
                    <td>{d.course_name}</td>
                    <td>{d.dropped_by}</td>
                    <td>{d.reason}</td>
                    <td>{d.dropped_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="pagination">
              <button
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
              >
                Prev
              </button>

              <span>
                Page {currentPage} of {totalPages || 1}
              </span>

              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Enter Reason for Unenrollment</h3>

            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Type reason..."
            />

            <div className="modal-actions">
              <button className="ok-btn" onClick={submitUnenroll}>
                Submit
              </button>
              <button className="cancel-btn" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
};

export default ManageEnrollments;
