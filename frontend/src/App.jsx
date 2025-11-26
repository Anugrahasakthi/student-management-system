import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";        
import Login from "./pages/Login";
import Register from "./pages/Register";
import Logout from "./pages/Logout";
import StudentProfile from "./pages/Student/StudentProfile.jsx";
import EditStudentProfile from "./pages/Student/EditStudentProfile.jsx";

import StudentDashboard from "./pages/Student/StudentDashboard";
import AvailableCourses from "./pages/Student/AvailableCourses";
import MyCourses from "./pages/Student/MyCourses";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ManageStudents from "./pages/Admin/ManageStudents";
import ManageCourses from "./pages/Admin/ManageCourses";
import CreateCourse from "./pages/Admin/CreateCourse";
import ManageEnrollments from "./pages/Admin/ManageEnrollments";






function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const isLoggedIn = Boolean(token);
  const isStudent = isLoggedIn && role === "student";
  const isAdmin = isLoggedIn && role === "admin";

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/home" element={isLoggedIn ? (isStudent ? (<Navigate to="/student/dashboard" />)
                                                : isAdmin ? (<Navigate to="/admin/dashboard" />) 
                                                : (<Navigate to="/" />)) : (<Navigate to="/" />)} />

        <Route
          path="/admin/dashboard"
          element={isAdmin ? <AdminDashboard /> : <Navigate to="/login" />}
        />

        <Route
          path="/admin/students"
          element={isAdmin ? <ManageStudents /> : <Navigate to="/login" />}
        />

        <Route
           path="/admin/courses"
           element={isAdmin ? <ManageCourses /> : <Navigate to="/login" />}
        />

        <Route
           path="/admin/create-course"
           element={isAdmin ? <CreateCourse /> : <Navigate to="/login" />}
        />

        <Route
          path="/admin/enrollments"
          element={isAdmin ? <ManageEnrollments /> : <Navigate to="/login" />}
        />


        



        
        <Route
          path="/student/dashboard"
          element={isStudent ? <StudentDashboard /> : <Navigate to="/login" />}
        />

        <Route
          path="/student/courses"
          element={isStudent ? <AvailableCourses /> : <Navigate to="/login" />}
        />

        <Route
          path="/student/my-courses"
          element={isStudent ? <MyCourses /> : <Navigate to="/login" />}
        />

       

        <Route
          path="/student/profile"
          element={isStudent ? <StudentProfile /> : <Navigate to="/login" />}
        />

        <Route
          path="/student/profile/edit"
          element={isStudent ? <EditStudentProfile /> : <Navigate to="/login" />}
        /> 

        
        <Route path="*" element={<h1>404 Not Found</h1>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
