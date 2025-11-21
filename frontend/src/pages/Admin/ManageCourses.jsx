import { useEffect, useState } from "react";
import client from "../../api/client";
import AdminHeader from "./AdminHeader";
import "../Css/adminHeader.css";
import "../Css/manageCourses.css";

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    course_name: "",
    course_description: "",
    duration: ""
  });

  
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
      duration: course.duration
    });
  };

 
  const handleUpdate = async (id) => {
    try {
      await client.put(`/courses/${id}`, form);

      setCourses((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, ...form } : c
        )
      );

      setEditing(null);
      alert("Course updated successfully!");
    } catch (err) {
      console.error("Update error:", err);
      alert("Error updating course");
    }
  };

  
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      await client.delete(`/courses/${id}`);

      setCourses((prev) => prev.filter((c) => c.id !== id));
      alert("Course deleted!");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting course");
    }
  };

  return (
    <div>
      <AdminHeader />

      <div className="manage-container">
        <h1 className="manage-title">Courses</h1>
{/*         <p className="manage-subtitle">View, Edit, or Delete Courses.</p> */}
        <div className="top-actions">
            <button className="create-btn"  onClick={() => window.location.href = "/admin/create-course"}>
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
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {courses.map((course, index) => (
              <tr key={course.id}>
                <td>{index + 1}</td>

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
                        setForm({ ...form, course_description: e.target.value })
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

                <td>
                  {editing === course.id ? (
                    <>
                      <button
                        className="save-btn"
                        onClick={() => handleUpdate(course.id)}
                      >
                        Save
                      </button>
                      <button
                        className="cancel-btn"
                        onClick={() => setEditing(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="edit-btn"
                        onClick={() => startEdit(course)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(course.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCourses;