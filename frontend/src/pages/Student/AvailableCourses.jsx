import { useEffect, useState } from "react";
import client from "../../api/client";
import StudentHeader from "./StudentHeader";
import "../Css/AvailableCourses.css";
import cloudImg from "../../assets/clouds.png";

const AvailableCourses = () => {
  const [courses, setCourses] = useState([]);
  const [enrolledCourseNames, setEnrolledCourseNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    fetchCourses();
    fetchEnrolledCourses();
  }, []);

  // Fetch all courses
  const fetchCourses = async () => {
    try {
      const res = await client.get("/courses");
      const data = res.data.data || res.data;
      setCourses(data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch enrolled courses (match by course_name)
  const fetchEnrolledCourses = async () => {
    try {
      const res = await client.get("/me/courses");

      const enrolled = res.data.data || [];

      const names = enrolled.map((c) => c.course_name.trim());
      setEnrolledCourseNames(names);
      
    } catch (err) {
      console.error("Error fetching enrolled:", err);
    }
  };

  const handleEnroll = async (course_id, course_name) => {
    try {
      await client.post("/enroll", { course_id });
      setMessage("Successfully enrolled!");

      // Update UI
      setEnrolledCourseNames((prev) => [...prev, course_name.trim()]);
      
    } catch (err) {
      if (err.response?.status === 409) {
        setMessage("Already enrolled in this course.");
      } else {
        setMessage("Enrollment failed.");
      }
    }

    setTimeout(() => setMessage(""), 2500);
  };

  if (loading) return <h2>Loading...</h2>;

  // Pagination Logic
  const lastIndex = currentPage * rowsPerPage;
  const firstIndex = lastIndex - rowsPerPage;
  const currentRows = courses.slice(firstIndex, lastIndex);

  const totalPages = Math.ceil(courses.length / rowsPerPage);

  return (
    <div>
      <StudentHeader />
      <div
        className="AvailableCourse-cont"
        style={{ backgroundImage: `url(${cloudImg})` }}
      >
        <h1 className="title">Courses List:</h1>

        {message && <p className="success-message">{message}</p>}

        <div className="courses-table-wrapper">
          <table className="courses-table">
            <thead>
              <tr>
                <th>Course Name</th>
                <th>Description</th>
                <th>Enroll</th>
              </tr>
            </thead>

            <tbody>
              {currentRows.map((course) => {
                const isEnrolled = enrolledCourseNames.includes(
                  course.course_name.trim()
                );

                return (
                  <tr key={course.id}>
                    <td className="course-name">{course.course_name}</td>
                    <td>{course.course_description}</td>
                    <td>
                      {isEnrolled ? (
                        <span className="enrolled-tag">Enrolled</span>
                      ) : (
                        <button
                          className="enroll-btn"
                          onClick={() =>
                            handleEnroll(course.id, course.course_name)
                          }
                        >
                          Enroll
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={currentPage === index + 1 ? "active" : ""}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvailableCourses;
