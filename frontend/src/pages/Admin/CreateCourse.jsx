import { useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../../api/client";
import AdminHeader from "./AdminHeader";
import "../Css/createCourse.css";

const CreateCourse = () => {
  const [form, setForm] = useState({
    course_name: "",
    course_description: "",
    duration: ""
  });

  const navigate=useNavigate();

  // Popup states (same as manageCourses)
  const [successMsg, setSuccessMsg] = useState("");
  const [msgType, setMsgType] = useState("");

  const showPopup = (msg, type = "success") => {
    setSuccessMsg(msg);
    setMsgType(type);
    setTimeout(() => {
      setSuccessMsg("");
      setMsgType("");
      if (type === "success") {
        navigate("/admin/courses");
      }
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await client.post("/courses", form);

      showPopup("Course created successfully!", "success");

    } catch (error) {
      if (error.response?.data?.message) {
        showPopup(error.response.data.message, "error");
      } else {
        showPopup("Failed to create course", "error");
      }
    }
  };

  return (
    <div>
      <AdminHeader />

      {/* Popup */}
      {successMsg && (
        <div className={`success-popup ${msgType}`}>
          {successMsg}
        </div>
      )}

      <div className="form-container">
        <h1>Create New Course</h1>

        <div className="create-course-page">
          <form onSubmit={handleSubmit}>
            <label>Course Name</label>
            <input
              type="text"
              value={form.course_name}
              onChange={(e) => setForm({ ...form, course_name: e.target.value })}
              required
            />

            <label>Description</label>
            <input
              type="text"
              value={form.course_description}
              onChange={(e) =>
                setForm({ ...form, course_description: e.target.value })
              }
              required
            />

            <label>Duration</label>
            <input
              type="text"
              value={form.duration}
              onChange={(e) =>
                setForm({ ...form, duration: e.target.value })
              }
              required
            />

            <div className="button-row">
              <button type="submit" className="course-submit-btn">
                Create Course
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;
