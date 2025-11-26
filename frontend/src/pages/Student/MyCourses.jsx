import { useEffect, useState } from "react";
import client from "../../api/client";
import Header from "../../pages/Header";
import "../Css/mycourse.css";
import cloudImg from "../../assets/clouds.png";

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 4;

  useEffect(() => {
    const loadMyCourses = async () => {
      try {
        const res = await client.get("/me/courses");
        setCourses(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (err) {
        console.error("My courses fetch error:", err);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    loadMyCourses();
  }, []);

  if (loading) return <h2>Loading...</h2>;

  // Pagination Logic
  const lastIndex = currentPage * coursesPerPage;
  const firstIndex = lastIndex - coursesPerPage;
  const currentCourses = courses.slice(firstIndex, lastIndex);

  const totalPages = Math.ceil(courses.length / coursesPerPage);

  return (
    <div>
      <Header />
      <div
        className="mycourseContainer"
        style={{ backgroundImage: `url(${cloudImg})` }}
      >
        <h1 className="course-head">My Courses ({courses.length})</h1>

        {courses.length === 0 ? (
          <p>You have not enrolled in any courses yet.</p>
        ) : (
          currentCourses.map((course) => (
            <div key={course.id} className="mycourse-card">
              <div>
                <h3>{course.course_name}</h3>
                <p>{course.course_description}</p>
              </div>
            </div>
          ))
        )}

        {/* Pagination Buttons */}
        {courses.length > 0 && (
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </button>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;
