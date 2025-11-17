import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";        // New common homepage
import Login from "./pages/Login";
import Register from "./pages/Register";
import Logout from "./pages/Logout";

import Students from "./pages/Admin/Students";

import Profile from "./pages/Student/Profile";
import StudentDashboard from "./pages/Student/StudentDashboard";
import AvailableCourses from "./pages/Student/AvailableCourses";
import MyCourses from "./pages/Student/MyCourses";

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
                                                : isAdmin ? (<Navigate to="/admin/students" />) 
                                                : (<Navigate to="/" />)) : (<Navigate to="/" />)} />

        <Route
          path="/admin/students"
          element={isAdmin ? <Students /> : <Navigate to="/login" />}
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
          element={isStudent ? <Profile /> : <Navigate to="/login" />}
        />

        
        <Route path="*" element={<h1>404 Not Found</h1>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
