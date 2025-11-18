import { useEffect, useState } from "react";
import client from "../../api/client";
import Header from "../Header";   
import "../Css/studentDash.css";
import cloudImg from "../../assets/clouds.png";


const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        
        const profileRes = await client.get("/me/student");
        const studentData = profileRes.data.data;
        setStudent(studentData);

        
        const coursesRes = await client.get(`/student/${studentData.id}/courses`);
        setMyCourses(coursesRes.data.data);

      } catch (err) {
        console.error("Dashboard load error:", err);
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

      <div className="dashbord-container" style={{ backgroundImage: `url(${cloudImg})` }}>
        <h1>Welcome, {student?.name} </h1>      
        <hr />
        <h2>Your Enrolled Courses:</h2>

        {myCourses.length === 0 ? (
          <p>You have not enrolled in any courses yet.</p>
        ) : (
          myCourses.map((course) => (
            <div key={course.id} className="course-card">
              <h3>{course.course_name}</h3>
              <p>{course.course_description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
