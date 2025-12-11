import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../../api/client";
import AdminHeader from "./AdminHeader";
import "../Css/adminDash.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [topCourses, setTopCourses] = useState([]);
  const [topStudents, setTopStudents] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.replace("/");
      return;
    }

    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
      window.history.pushState(null, "", window.location.href);
    };
  }, []);

  
  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await client.get("/admin/stats");
        setStats(res.data.data);
      } catch (err) {
        window.location.replace("/");
      } finally {
        setLoading(false);
      }
    };

    if (localStorage.getItem("token")) loadStats();
  }, []);

  
  useEffect(() => {
    const loadEnrollmentStats = async () => {
      try {
        const res = await client.get("/enrollments");
        const enrollments = res.data.data;

        // Group by course
        const courseCounts = {};
        enrollments.forEach((e) => {
          courseCounts[e.course_name] =
            (courseCounts[e.course_name] || 0) + 1;
        });

        const sortedCourses = Object.entries(courseCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 2);

        setTopCourses(sortedCourses);

        // Group by student
        const studentCounts = {};
        enrollments.forEach((e) => {
          studentCounts[e.student_name] =
            (studentCounts[e.student_name] || 0) + 1;
        });

        const sortedStudents = Object.entries(studentCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 2);

        setTopStudents(sortedStudents);
      } catch (error) {
        console.error("Error loading enrollment stats", error);
      }
    };

    loadEnrollmentStats();
  }, []);

  
  if (loading)
    return (
      <div
        style={{
          height: "100vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "26px",
          fontWeight: "600",
          background: "white",
          overflow: "hidden",
        }}
      >
        Loading...
      </div>
    );

  return (
    <div>
      <AdminHeader />

      <div className="admin-container">
        <h1>Admin Dashboard</h1>
        <hr />

        <div className="dashboard-cards">
          <div className="dash-card" onClick={() => navigate("/admin/students")} style={{ cursor: "pointer" }}>
            <h2>{stats.students}</h2>
            <p>Students</p>
          </div>

          <div className="dash-card" onClick={() => navigate("/admin/courses")} style={{ cursor: "pointer" }}>
            <h2>{stats.courses}</h2>
            <p>Courses</p>
          </div>
        </div>

        {/* Tables Section */}
        <div className="tables-row">

          {/* Top Courses */}
          <div className="table-card">
            <h2 className="table-title">Top 2 Courses (Most Enrollments)</h2>
            <table>
              <thead>
                <tr>
                  <th>Course Name</th>
                  <th>Students Enrolled</th>
                </tr>
              </thead>
              <tbody>
                {topCourses.map((c, index) => (
                  <tr key={index}>
                    <td>{c.name}</td>
                    <td>{c.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Top Students */}
          <div className="table-card">
            <h2 className="table-title">Top 2 Students (Most Courses)</h2>
            <table>
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Courses Enrolled</th>
                </tr>
              </thead>
              <tbody>
                {topStudents.map((s, index) => (
                  <tr key={index}>
                    <td>{s.name}</td>
                    <td>{s.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
