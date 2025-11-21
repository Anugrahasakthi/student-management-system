// import { useState } from "react";
// import client from "../../api/client";
// import AdminHeader from "./AdminHeader";

// const CreateCourse = () => {
//   const [form, setForm] = useState({
//     course_name: "",
//     course_description: "",
//     duration: ""
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       await client.post("/courses", form);

//       alert("Course created successfully!");
//       window.location.href = "/admin/courses";
//     } catch (error) {
//       console.error("Error creating course:", error);
//       alert("Failed to create course");
//     }
//   };

//   return (
//     <div>
//       <AdminHeader />

//       <div className="form-container">
//         <h1>Create New Course</h1>

//         <form onSubmit={handleSubmit}>
//           <label>Course Name</label>
//           <input
//             type="text"
//             value={form.course_name}
//             onChange={(e) => setForm({ ...form, course_name: e.target.value })}
//             required
//           />

//           <label>Description</label>
//           <input
//             type="text"
//             value={form.course_description}
//             onChange={(e) => setForm({ ...form, course_description: e.target.value })}
//             required
//           />

//           <label>Duration</label>
//           <input
//             type="text"
//             value={form.duration}
//             onChange={(e) => setForm({ ...form, duration: e.target.value })}
//             required
//           />

//           <button type="submit" className="create-btn">Create Course</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateCourse;

import { useState } from "react";
import client from "../../api/client";
import AdminHeader from "./AdminHeader";

const CreateCourse = () => {
  const [form, setForm] = useState({
    course_name: "",
    course_description: "",
    duration: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await client.post("/courses", form);

      alert(res.data.message || "Course created successfully!");
      window.location.href = "/admin/courses";

    } catch (error) {
      console.error("Error creating course:", error);

      // Show backend error message (example: "Course already exists")
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert("Failed to create course");
      }
    }
  };

  return (
    <div>
      <AdminHeader />

      <div className="form-container">
        <h1>Create New Course</h1>

        <form onSubmit={handleSubmit}>
          <label>Course Name</label>
          <input
            type="text"
            value={form.course_name}
            onChange={(e) => setForm({ ...form, course_name: e.target.value })}
            required
          />

          <label>Description</label>
          <input
            type="text"
            value={form.course_description}
            onChange={(e) => setForm({ ...form, course_description: e.target.value })}
            required
          />

          <label>Duration</label>
          <input
            type="text"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
            required
          />

          <button type="submit" className="create-btn">Create Course</button>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;
