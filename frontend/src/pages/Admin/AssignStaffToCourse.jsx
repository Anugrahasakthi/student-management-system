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
  const [msgType, setMsgType] = useState("");

  const navigate = useNavigate();

  // Load staff & courses
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

 
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setMsgType("");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  const assignCourse = async () => {
    if (!staffId || !courseId) {
      setMessage("Please select staff and course");
      setMsgType("error");
      return;
    }

    try {
      setMessage("");
      setMsgType("");

      const res = await client.post("/admin/assign-course", {
        staff_id: staffId,
        course_id: courseId,
      });

      setMessage(res.data.message || "Course assigned successfully");
      setMsgType("success");      
      setStaffId("");
      setCourseId("");     
      loadData();
    } catch (err) {
      setMessage(err.response?.data?.message || "Error assigning course");
      setMsgType("error");
    }
  };

  return (
    <div style={{ backgroundColor: "lightblue", minHeight: "100vh" }}>
      <AdminHeader />

      <div className="register-staff-wrapper">
        <button
          className="register-staff-btn"
          onClick={() => navigate("/admin/register-staff")}
        >
          Register New Staff
        </button>
        <button
          className="staff-courses-btn"
          onClick={() => navigate("/admin/staff-courses")}
        >
          Staff’s Courses
        </button>
    </div>   


      <div className="assign-container">
        <h2>Assign Course to Staff</h2>

        {message && <p className={`msg ${msgType}`}>{message}</p>}

        <div className="form-group">
          <label>Select Staff</label>
          <select
            value={staffId}
            onChange={(e) => {
              setStaffId(e.target.value);
              setMessage("");
              setMsgType("");
            }}
          >
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
          <select
            value={courseId}
            onChange={(e) => {
              setCourseId(e.target.value);
              setMessage("");
              setMsgType("");
            }}
          >
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
    </div>
  );
};

export default AssignStaffToCourse;
