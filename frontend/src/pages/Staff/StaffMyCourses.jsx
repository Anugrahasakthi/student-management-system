import { useEffect, useState } from "react";
import client from "../../api/client";
import StaffHeader from "./StaffHeader";
import "../Css/staffMyCourses.css";

const StaffMyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await client.get("/staff/my-courses");
        setCourses(res.data.data || []);
      } catch (err) {
        console.error("Error loading courses", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <h2 style={{ padding: 20 }}>Loading...</h2>;

  return (
    <>
      <StaffHeader />

      <div className="staff-courses-container" style={{ backgroundColor: "lightblue" }}>
        <h2>My Assigned Courses</h2>

        {courses.length === 0 ? (
          <p className="no-courses">No courses assigned yet</p>
        ) : (
          <div className="courses-grid">
            {courses.map((course) => (
              <div className="course-card" key={course.course_id}>
                <h3>{course.course_name}</h3>
                <p className="duration">
                  Duration: {course.duration}
                </p>
                <p className="assigned">
                  Assigned on: {course.assigned_at}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default StaffMyCourses;
