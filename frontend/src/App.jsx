import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

/* student */
import StudentDashboard from "./pages/Student/StudentDashboard";
import StudentProfile from "./pages/Student/StudentProfile";
import EditStudentProfile from "./pages/Student/EditStudentProfile";
import AvailableCourses from "./pages/Student/AvailableCourses";
import MyCourses from "./pages/Student/MyCourses";

/* admin */
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ManageStudents from "./pages/Admin/ManageStudents";
import ManageCourses from "./pages/Admin/ManageCourses";
import CreateCourse from "./pages/Admin/CreateCourse";
import ManageEnrollments from "./pages/Admin/ManageEnrollments";
import AssignStaffToCourse from "./pages/Admin/AssignStaffToCourse";
import RegisterStaff from "./pages/Admin/RegisterStaff";
import StaffCourses from "./pages/Admin/StaffCourses";



/* staff */
import StaffDashboard from "./pages/Staff/StaffDashboard";
import StaffProfile from "./pages/Staff/StaffProfile";
import EditStaffProfile from "./pages/Staff/EditStaffProfile";
import StaffMyCourses from "./pages/Staff/StaffMyCourses";
import StaffCoursesWithStudents from "./pages/Staff/StaffCoursesWithStudents";



/* protected route */
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* STUDENT */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/profile/edit"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <EditStudentProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/courses"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <AvailableCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/my-courses"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <MyCourses />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/students"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManageStudents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/courses"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManageCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/create-course"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <CreateCourse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/enrollments"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManageEnrollments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/assign-staff"
          element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AssignStaffToCourse />
          </ProtectedRoute>
           }
        />
        <Route
          path="/admin/register-staff"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <RegisterStaff />
            </ProtectedRoute>
           }
        />
        <Route
          path="/admin/staff-courses"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <StaffCourses />
            </ProtectedRoute>
           }
        />



        {/* STAFF */}
        <Route
          path="/staff/dashboard"
          element={
            <ProtectedRoute allowedRoles={["staff"]}>
              <StaffDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/profile"
          element={
            <ProtectedRoute allowedRoles={["staff"]}>
              <StaffProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/profile/edit"
          element={
            <ProtectedRoute allowedRoles={["staff"]}>
              <EditStaffProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff/my-courses"
          element={
            <ProtectedRoute allowedRoles={["staff"]}>
              <StaffMyCourses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff/courses-students"
          element={
            <ProtectedRoute allowedRoles={["staff"]}>
              <StaffCoursesWithStudents />
            </ProtectedRoute>
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
