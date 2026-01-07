import { useEffect, useState } from "react";
import client from "../../api/client";
import AdminHeader from "./AdminHeader";
import "../Css/staffCourses.css";

const StaffCourses = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStaffCourses();
  }, []);

  const fetchStaffCourses = async () => {
    try {
      const res = await client.get("/admin/staff-with-courses");
      setStaffList(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdminHeader />

      <div className="staff-courses-container">
        <h2>Staff & Assigned Courses</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="staff-courses-table">
            <thead>
              <tr>
                <th>Staff Name</th>
                <th>Email</th>
                <th>Courses</th>
              </tr>
            </thead>
            <tbody>
              {staffList.map((staff) => (
                <tr key={staff.staff_id}>
                  <td>{staff.name}</td>
                  <td>{staff.email}</td>
                  <td>
                    {staff.courses.length === 0 ? (
                      <span className="no-course">No courses assigned</span>
                    ) : (
                      staff.courses.map((c) => (
                        <span key={c.id} className="course-badge">
                          {c.course_name}
                        </span>
                      ))
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default StaffCourses;
