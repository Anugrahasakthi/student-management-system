import { useEffect, useState } from "react";
import client from "../../api/client";
import AdminHeader from "./AdminHeader";

import "../Css/manageStudents.css";

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

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

  const totalPages = Math.ceil(students.length / rowsPerPage);
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentRows = students.slice(indexOfFirst, indexOfLast);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) return <h2>Loading...</h2>;
  return (
  <div>
    <AdminHeader />

    <div className="manage-container">
      <h1>Registered Students</h1>

      {/* ✅ TABLE CARD WRAPPER */}
      
        <table className="students-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>DOB</th>
              <th>Courses</th>
            </tr>
          </thead>

          <tbody>
            {currentRows.map((s, index) => (
              <tr key={s.id}>
                <td>{indexOfFirst + index + 1}</td>
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

      {/* Pagination */}
      <div className="pagination">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={currentPage === i + 1 ? "active-page" : ""}
            onClick={() => goToPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  
);


  // return (
  //   <div>
  //     <AdminHeader />

  //     <div className="manage-container">
  //       <h1>Registered Students</h1>
        

  //       <table className="students-table">
  //         <thead>
  //           <tr>
  //             <th>S.No</th>
  //             <th>Name</th>
  //             <th>Email</th>
  //             <th>Phone</th>
  //             <th>DOB</th>
  //             <th>Courses</th>
  //           </tr>
  //         </thead>


  //         <tbody>
  //           {currentRows.map((s, index) => (
  //             <tr key={s.id}>
  //               <td>{indexOfFirst + index + 1}</td>
  //               <td>{s.name}</td>
  //               <td>{s.email}</td>
  //               <td>{s.phone}</td>
  //               <td>{s.dob}</td>
  //               <td>{s.courses || "No courses"}</td>
  //             </tr>
  //           ))}
  //         </tbody>
  //       </table>

  //       <div className="pagination">
  //         <button
  //           onClick={() => goToPage(currentPage - 1)}
  //           disabled={currentPage === 1}
  //         >
  //           Prev
  //         </button>

  //         {[...Array(totalPages)].map((_, i) => (
  //           <button
  //             key={i}
  //             className={currentPage === i + 1 ? "active-page" : ""}
  //             onClick={() => goToPage(i + 1)}
  //           >
  //             {i + 1}
  //           </button>
  //         ))}

  //         <button
  //           onClick={() => goToPage(currentPage + 1)}
  //           disabled={currentPage === totalPages}
  //         >
  //           Next
  //         </button>
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default ManageStudents;
