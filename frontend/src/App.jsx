import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Logout from "./pages/Logout";
import Students from "./pages/Admin/Students";
import Profile from "./pages/Student/Profile";


function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  return (
    <BrowserRouter>
      <Routes>      
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />   
        <Route path="/logout" element={<Logout />} />  
        <Route path="/students" element={token && role === "admin" ? <Students /> : <Navigate to="/login" />} />
        <Route path="/profile" element={token && role === "student" ? <Profile /> : <Navigate to="/login" />} /> 
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
