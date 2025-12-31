# Student Management System

A simple full-stack Student Management System built using **PHP (Backend API)** and **React (Frontend)**.  
This project focuses on role-based authentication and real-world CRUD operations for students and courses.

---

## About the Project

This application allows:

- **Admins** to manage students, courses, and enrollments
- **Students** to log in, view available courses, and manage their enrollments
- Secure authentication using **JWT**
- Clean separation between frontend and backend

The project is built from scratch without using any backend frameworks, to clearly understand how APIs, authentication, and role handling work.

---

## 🛠 Tech Stack

### Backend
- PHP 
- MySQL
- JWT Authentication
- REST API
- Apache (.htaccess routing)
- CORS configuration for frontend access

### Frontend
- React (Vite)
- Axios
- React Router

---

## Features

### Admin
- Admin login
- View registered students
- Add, edit, delete courses
- View student enrollments,enroll and unenroll students from the courses

### Student
- Student login
- View available courses
- Enroll in courses
- Unenroll from courses
- View enrolled courses

---

## Project Structure

SMS/
├── api/
│ ├── controllers/
│ │ ├── AdminController.php
│ │ ├── CourseController.php
│ │ ├── EnrollmentController.php
│ │ ├── LoginController.php
│ │ ├── RegisterController.php
│ │ └── StudentController.php
│ │
│ ├── utils/
│ │ ├── Jwt.php
│ │ ├── Response.php
│ │ └── Validator.php
│ │
│ ├── config.php
│ ├── cors.php
│ ├── db.php
│ ├── middleware.php
│ ├── index.php
│ └── .htaccess
│
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── api/
│ │ │ └── client.js
│ │ ├── assets/
│ │ ├── pages/
│ │ │ ├── Admin/
│ │ │ ├── Student/
│ │ │ └── Css/
│ │ ├── Header.jsx
│ │ ├── Home.jsx
│ │ ├── Login.jsx
│ │ ├── Register.jsx
│ │ ├── App.jsx
│ │ ├── main.jsx
│ │ └── index.css
│ │
│ ├── index.html
│ ├── package.json
│ ├── vite.config.js
│ └── README.md
│
└── README.md

## ⚙️ Requirements

### Backend (PHP)
- XAMPP (Apache + MySQL)
- PHP 8+

### Frontend (React)
- Node.js (v18 or later)
- npm

> Note: Node.js is required only to install dependencies and run the React frontend.  
> The backend is fully handled using PHP and MySQL.

---

## How to Run the Project

### Clone the Repository

```bash
git clone https://github.com/Anugrahasakthi/student-management-system.git
cd student-management-system

### Backend Setup (PHP)

1. Move the SMS folder into htdocs.

2. Start Apache and MySQL in XAMPP.

3. Create a MySQL database (example: sms_db).

4. Import your SQL file into the database.

5. Update database credentials in api/db.php.

6. Make sure Apache rewrite module is enabled.
Backend API base URL:http://localhost/SMS/api

### Frontend Setup (React)
cd frontend
npm install
npm run dev

Frontend runs at:http://localhost:5173

