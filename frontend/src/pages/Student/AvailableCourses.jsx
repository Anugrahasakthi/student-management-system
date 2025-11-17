import { useEffect, useState } from "react";
import client from "../../api/client";
import Header from "../../pages/Header";
import "../pages.css";

const AvailableCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await client.get("/courses");
        setCourses(res.data.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleEnroll = async (course_id) => {
    try {
      await client.post("/enroll", { course_id });

      setMessage("Successfully enrolled!");

      setCourses((prev) =>
        prev.map((c) =>
          c.id === course_id ? { ...c, enrolled: true } : c
        )
      );

    } catch (err) {
      if (err.response?.status === 409) {
        setMessage("Already enrolled in this course.");
      } else {
        setMessage("Enrollment failed.");
      }
      console.error("Enroll error:", err);
    }

    setTimeout(() => setMessage(""), 2000);
  };

  if (loading) return <h2>Loading...</h2>;

  return (
    <div>
      <Header />
      <div className="container">
        <h1>Available Courses</h1>

        {message && <p className="success-message">{message}</p>}

        {courses.map((course) => (
          <div key={course.id} className="course-card">
            <h3>{course.course_name}</h3>
            <p>{course.course_description}</p>

            {course.enrolled ? (
              <button className="enrolled-btn" disabled>✔ Enrolled</button>
            ) : (
              <button className="enroll-btn" onClick={() => handleEnroll(course.id)}>Enroll</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailableCourses;
