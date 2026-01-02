import { useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../../api/client";
import AdminHeader from "./AdminHeader";
import "../Css/registerStaff.css";

const RegisterStaff = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [msg, setMsg] = useState("");
  const [type, setType] = useState("");

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    try {
      await client.post("/register", {
        ...form,
        role: "staff"
      });

      setMsg("Staff registered successfully");
      setType("success");

      setTimeout(() => {
        navigate("/admin/assign-staff");
      }, 1200);
    } catch (err) {
      setMsg(err.response?.data?.message || "Registration failed");
      setType("error");
    }
  };

  return (
    <div style={{ backgroundColor: "lightblue", minHeight: "100vh" }}>
      <AdminHeader />

      <div className="assign-container" style={{ backgroundColor: "lightblue" }}>
        <h2>Register Staff</h2>

        {msg && <p className={`msg ${type}`}>{msg}</p>}

        <input
          name="name"
          placeholder="Staff Name"
          onChange={handleChange}
        />

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <button onClick={submit} className="assign-btn">
          Register Staff
        </button>
      </div>
    </div>
  );
};

export default RegisterStaff;
