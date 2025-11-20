import { useEffect, useState } from "react";
import client from "../../api/client";
import AdminHeader from "./AdminHeader";

import "../Css/manageStudents.css";

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const res = await client.get("/students"); 
        setStudents(res.data.data);
      } catch (err) {
        console.error("Error fetching students:", err);
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, []);

  if (loading) return <h2>Loading...</h2>;

  return (
    <div>
      <AdminHeader />

      <div className="manage-container">
        <h1>Registered Students</h1>
        

        <table className="students-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>DOB</th>
              <th>Courses</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s, index) => (
              <tr key={s.id}>
                <td>{index + 1}</td>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.phone}</td>
                <td>{s.dob}</td>
                <td>{s.courses || "No courses"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageStudents;
