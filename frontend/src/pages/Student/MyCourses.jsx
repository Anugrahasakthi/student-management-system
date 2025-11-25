import { useEffect, useState } from "react";
import client from "../../api/client";
import Header from "../../pages/Header";
import "../Css/mycourse.css";
import cloudImg from "../../assets/clouds.png";

const MyCourses = () => {
  const [courses, setCourses] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMyCourses = async () => {
      try {
        const res = await client.get("/me/courses");

        // ensure safe array
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

  return (
    <div>
      <Header />
      <div
        className="mycourseContainer"
        style={{ backgroundImage: `url(${cloudImg})` }}
      >
        <h1 className="course-head">My Courses ({courses.length})</h1>
        <hr />

        {courses.length === 0 ? (
          <p>You have not enrolled in any courses yet.</p>
        ) : (
          courses.map((course) => (
            <div key={course.id} className="courses-card">
              <h3>{course.course_name}</h3>
              <p>{course.course_description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyCourses;
