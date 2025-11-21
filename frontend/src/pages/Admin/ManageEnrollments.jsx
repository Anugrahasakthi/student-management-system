import { useState, useEffect } from "react";
import client from "../../api/client";
import AdminHeader from "./AdminHeader";
import "../../pages/Css/adminEnroll.css";

const ManageEnrollments = () => {
  const [tab, setTab] = useState("active"); // active | new | dropped

  const [enrollments, setEnrollments] = useState([]);
  const [dropped, setDropped] = useState([]);
  const [form, setForm] = useState({
    student_id: "",
    course_id: ""
  });

  // Load active enrollments
  const loadActiveEnrollments = async () => {
    try {
      const res = await client.get("/enrollments");
      setEnrollments(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Load dropped enrollments
  const loadDroppedEnrollments = async () => {
    try {
      const res = await client.get("/dropped-enrollments");
      setDropped(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadActiveEnrollments();
    loadDroppedEnrollments();
  }, []);

  // Enroll a student
  const handleEnroll = async (e) => {
    e.preventDefault();
    try {
      await client.post("/enroll", form);
      alert("Student enrolled successfully");

      setForm({ student_id: "", course_id: "" });
      loadActiveEnrollments();
      setTab("active");
    } catch (err) {
      alert(err.response?.data?.message || "Enrollment failed");
    }
  };

  // Unenroll (admin removing)
  const handleUnenroll = async (id) => {
    const reason = prompt("Enter reason for unenrollment:");
    if (!reason) return alert("Reason is required");

    try {
      await client.delete(`/enroll/${id}`, {
        data: { reason } // Backend accepts reason
      });

      alert("Unenrolled successfully");
      loadActiveEnrollments();
      loadDroppedEnrollments();
    } catch (err) {
      alert("Failed to unenroll");
    }
  };

  return (
    <div>
      <AdminHeader />

      <div className="enroll-page-container">

        <h1 className="page-title">Manage Enrollments</h1>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={tab === "active" ? "active-tab" : ""}
            onClick={() => setTab("active")}
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
            onClick={() => setTab("dropped")}
          >
            Dropped / Unenrolled
          </button>
        </div>

        {/* Active enrollments table */}
        {tab === "active" && (
          <div className="table-container">
            <table className="enroll-table">
              <thead>
                <tr>
                  <th>S.No</th>
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
                {enrollments.map((e, i) => (
                  <tr key={e.enrollment_id}>
                    <td>{i + 1}</td>
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
          </div>
        )}

        {/* Enroll a student form */}
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

              <label>Course ID</label>
              <input
                type="number"
                value={form.course_id}
                onChange={(e) =>
                  setForm({ ...form, course_id: e.target.value })
                }
                required
              />

              <button type="submit" className="submit-btn">
                Enroll Student
              </button>
            </form>
          </div>
        )}

        {/* Dropped enrollments */}
        {tab === "dropped" && (
          <div className="table-container">
            <table className="enroll-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Enrollment ID</th>
                  <th>Student ID</th>
                  <th>Course ID</th>
                  <th>Dropped By</th>
                  <th>Reason</th>
                  <th>Dropped At</th>
                </tr>
              </thead>

              <tbody>
                {dropped.map((d, i) => (
                  <tr key={d.id}>
                    <td>{i + 1}</td>
                    <td>{d.enrollment_id}</td>
                    <td>{d.student_id}</td>
                    <td>{d.course_id}</td>
                    <td>{d.dropped_by}</td>
                    <td>{d.reason}</td>
                    <td>{d.dropped_at}</td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}

      </div>
    </div>
  );
};

export default ManageEnrollments;
