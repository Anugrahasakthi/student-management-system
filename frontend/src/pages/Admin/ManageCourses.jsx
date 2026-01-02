import { useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import client from "../../api/client";
import AdminHeader from "./AdminHeader";
import "../Css/adminHeader.css";
import "../Css/manageCourses.css";

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [editing, setEditing] = useState(null);

  const [successMsg, setSuccessMsg] = useState("");
  const [msgType, setMsgType] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const [form, setForm] = useState({
    course_name: "",
    course_description: "",
    duration: ""
  });
  const navigate=useNavigate();

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const res = await client.get("/courses");
        setCourses(res.data.data);
      } catch (err) {
        console.error("Error loading courses:", err);
      }
    };

    loadCourses();
  }, []);

  const startEdit = (course) => {
    setEditing(course.id);
    setForm({
      course_name: course.course_name,
      course_description: course.course_description,
      duration: course.duration,
    });
  };

  const showPopup = (msg, type = "success") => {
    setSuccessMsg(msg);
    setMsgType(type);
    setTimeout(() => {
      setSuccessMsg("");
      setMsgType("");
    }, 2500);
  };



const handleUpdate = async (id) => {
  const original = courses.find(c => c.id === id);

  const noChange =
    original.course_name === form.course_name &&
    original.course_description === form.course_description &&
    original.duration === form.duration;

  if (noChange) {
    setEditing(null);        
    return;                  
  }

  try {
    await client.put(`/courses/${id}`, form);

    setCourses(prev =>
      prev.map(c => (c.id === id ? { ...c, ...form } : c))
    );

    setEditing(null);
    showPopup("Course updated successfully!", "success");
  } catch (err) {
    console.error("Update error:", err);
    showPopup(
      err.response?.data?.message || "Error updating course",
      "error"
    );
  }
};


  const handleDelete = async (id) => {
    try {
      await client.delete(`/courses/${id}`);
      setCourses((prev) => prev.filter((c) => c.id !== id));

      showPopup("Course deleted successfully!", "success");
    } catch (err) {
      console.error("Delete error:", err);
      showPopup("Error deleting course", "error");
    }
  };

  const totalPages = Math.ceil(courses.length / rowsPerPage);
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentRows = courses.slice(indexOfFirst, indexOfLast);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div style={{ backgroundColor: "lightblue", minHeight: "100vh" }}>
      <AdminHeader />

      {successMsg && (
        <div className={`success-popup ${msgType}`}>{successMsg}</div>
      )}

      <div className="manage-container" style={{ backgroundColor: "lightblue" }}>
        <div className="title-container">
          <h1 className="manage-title">Courses</h1>

          <button
            className="create-btn"
            onClick={() => navigate("/admin/create-course")}
          >
            + Create Course
          </button>
        </div>

        <table className="courses-table">
          <thead>
            <tr>
              <th>S.NO</th>
              <th>Course Name</th>
              <th>Description</th>
              <th>Duration</th>
              <th className="actions-col">Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentRows.map((course, index) => (
              <tr key={course.id}>
                <td>{indexOfFirst + index + 1}</td>
                <td>
                  {editing === course.id ? (
                    <input
                      type="text"
                      value={form.course_name}
                      onChange={(e) =>
                        setForm({ ...form, course_name: e.target.value })
                      }
                    />
                  ) : (
                    course.course_name
                  )}
                </td>

                
                <td>
                  {editing === course.id ? (
                    <input
                      type="text"
                      value={form.course_description}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          course_description: e.target.value,
                        })
                      }
                    />
                  ) : (
                    course.course_description
                  )}
                </td>

                <td>
                  {editing === course.id ? (
                    <input
                      type="text"
                      value={form.duration}
                      onChange={(e) =>
                        setForm({ ...form, duration: e.target.value })
                      }
                    />
                  ) : (
                    course.duration
                  )}
                </td>
                
                <td className="actions-col">
                  {editing === course.id ? (
                    <div className="edit-actions">
                      <button
                        className="icon-btn save-btn"
                        onClick={() => handleUpdate(course.id)}
                      >
                        <i className="bi bi-check2-circle"></i>
                      </button>

                      <button
                        className="icon-btn cancel-btn"
                        onClick={() => setEditing(null)}
                      >
                        <i className="bi bi-x-circle"></i>
                      </button>
                    </div>
                  ) : (
                    <div className="iconButtons">
                      <button
                        className="icon-btn edit-icon"
                        onClick={() => startEdit(course)}
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>

                      <button
                        className="icon-btn delete-icon"
                        onClick={() => handleDelete(course.id)}
                      >
                        <i className="bi bi-trash-fill"></i>
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        
        <div className="pagination">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={currentPage === i + 1 ? "active-page" : ""}
              onClick={() => goToPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageCourses;

