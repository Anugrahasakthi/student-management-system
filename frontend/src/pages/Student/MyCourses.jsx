import { useEffect, useState } from "react";
import client from "../../api/client";
import Header from "../../pages/Header";
import "../Css/mycourse.css";
import cloudImg from "../../assets/clouds.png";

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const profileRes = await client.get("/me/student");
        const studentData = profileRes.data.data;
        setStudent(studentData);

        const courseRes = await client.get(`/student/${studentData.id}/courses`);
        setCourses(courseRes.data.data);

      } catch (err) {
        console.error("My courses fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <h2>Loading...</h2>;

  return (
    <div>
      <Header />

      <div className="mycourseContainer" style={{ backgroundImage: `url(${cloudImg})` }}>
        <h1 className="course-head">My Courses</h1>
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
