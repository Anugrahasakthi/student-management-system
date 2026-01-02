// import { useEffect, useState } from "react";
// import client from "../../api/client";
// import StaffHeader from "./StaffHeader";
// import "../Css/StaffCoursesWithStudents.css";

// const StaffCoursesWithStudents = () => {
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await client.get("/staff/courses-with-students");
//         setCourses(res.data.data || []);
//       } catch (err) {
//         setError("Failed to load courses");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (loading) return <h2 className="loading">Loading...</h2>;
//   if (error) return <p className="error">{error}</p>;

//   return (
//     <>
//       <StaffHeader />

//       <div className="staff-courses-container">
//         <h1>My Courses & Students</h1>

//         {courses.length === 0 ? (
//           <p>No courses assigned yet</p>
//         ) : (
//           courses.map(course => (
//             <div key={course.course_id} className="course-card">
//               <h2>{course.course_name}</h2>

//               {course.students.length === 0 ? (
//                 <p className="no-students">No students enrolled</p>
//               ) : (
//                 <table>
//                   <thead>
//                     <tr>
//                       <th>Student Name</th>
//                       <th>Email</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {course.students.map(student => (
//                       <tr key={student.id}>
//                         <td>{student.name}</td>
//                         <td>{student.email}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               )}
//             </div>
//           ))
//         )}
//       </div>
//     </>
//   );
// };

// export default StaffCoursesWithStudents;
import { useEffect, useState } from "react";
import client from "../../api/client";
import StaffHeader from "./StaffHeader";
import "../Css/StaffCoursesWithStudents.css";

const StaffCoursesWithStudents = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔹 pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await client.get("/staff/courses-with-students");
        setCourses(res.data.data || []);
      } catch (err) {
        setError("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <h2 className="loading">Loading...</h2>;
  if (error) return <p className="error">{error}</p>;

  // 🔹 pagination calculations
  const totalPages = Math.ceil(courses.length / coursesPerPage);
  const startIndex = (currentPage - 1) * coursesPerPage;
  const currentCourses = courses.slice(
    startIndex,
    startIndex + coursesPerPage
  );

  return (
    <>
      <StaffHeader />

      <div className="staff-courses-container" style={{ backgroundColor: "lightblue" }}>
        <h1>My Courses & Students</h1>

        {courses.length === 0 ? (
          <p>No courses assigned yet</p>
        ) : (
          <>
            {currentCourses.map((course) => (
              <div key={course.course_id} className="course-card">
                <h2>{course.course_name}</h2>

                {course.students.length === 0 ? (
                  <p className="no-students">No students enrolled</p>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Student Name</th>
                        <th>Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {course.students.map((student) => (
                        <tr key={student.id}>
                          <td>{student.name}</td>
                          <td>{student.email}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            ))}

            {/* 🔹 PAGINATION CONTROLS */}
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Previous
              </button>

              <span>
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default StaffCoursesWithStudents;
