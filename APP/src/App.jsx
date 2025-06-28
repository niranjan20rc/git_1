import axios from "axios";
import { useState, useEffect } from "react";
import JsonToExcel from "./JsonToExcel";

const App = () => {

  const PORT = import.meta.env.VITE__PORT;
  const [info, setInfo] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    phone: "",
    city: "",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [showForm, setShowForm] = useState(false); 

  // Fetch data
  const fetch_data = async () => {
    const response = await axios.get(`http://localhost:${PORT}/users`);
    setInfo(response.data);
  };

   
  useEffect(() => {
    fetch_data();
  }, []);

  // Handle input
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Save new
  const saveData = async () => {
    await axios.post(`http://localhost:${PORT}/users`, formData);
    setFormData({ name: "", age: "", email: "", phone: "", city: "" });
    fetch_data();
    setShowForm(false); // hide form after submit
  };

  // Edit setup
  const getIndex = (id, index) => {
    setFormData(info[index]);
    setEditIndex(id);
    setShowForm(true); // show form on edit
  };

  // Update existing
  const updatedData = async () => {
    await axios.put(`http://localhost:${PORT}/users${editIndex}`, formData);
    setFormData({ name: "", age: "", email: "", phone: "", city: "" });
    setEditIndex(null);
    fetch_data();
    setShowForm(false); // hide form after save
  };

  // Delete user
  const del = async (id) => {
    await axios.delete(`http://localhost:${PORT}/users/${id}`);
    fetch_data();
  };

  return (
    <div>

     <div
      style={{
        fontFamily: "'Segoe UI', sans-serif",
        maxWidth: "800px",
        margin: "40px auto",
        padding: "20px",
      }}
    >
      <div style={{ textAlign: "right", marginBottom: "10px" }}>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          style={{
            backgroundColor: "#343a40",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "10px 16px",
            cursor: "pointer",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span style={{ fontSize: "20px", lineHeight: "0.7" }}>☰</span>
          Add User Data
        </button>
      </div>

      {showForm && (
        <div
          style={{
            backgroundColor: "#f9f9f9",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            marginBottom: "30px",
            animation: "fadein 0.4s",
          }}
        >
          <h2 style={{ marginBottom: "20px", color: "#333" }}>
            {editIndex === null ? "Add User" : "Edit User"}
          </h2>

          {[
            { label: "Name", name: "name", value: formData.name },
            { label: "Age", name: "age", value: formData.age },
            { label: "Email", name: "email", value: formData.email },
            { label: "Phone", name: "phone", value: formData.phone },
            { label: "City", name: "city", value: formData.city },
          ].map((field, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "12px",
                gap: "20px",
              }}
            >
              <label
                htmlFor={field.name}
                style={{ minWidth: "70px", fontWeight: "600", color: "#333" }}
              >
                {field.label}
              </label>
              <input
                type="text"
                id={field.name}
                name={field.name}
                placeholder={field.label}
                value={field.value}
                onChange={handleChange}
                style={{
                  flex: 1,
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                }}
              />
            </div>
          ))}

          <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
            <button
              onClick={saveData}
              disabled={editIndex !== null}
              style={{
                flex: 1,
                padding: "10px",
                backgroundColor: editIndex !== null ? "#ccc" : "#007bff",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontWeight: "600",
                cursor: editIndex !== null ? "not-allowed" : "pointer",
              }}
            >
              Add
            </button>
            <button
              onClick={updatedData}
              disabled={editIndex === null}
              style={{
                flex: 1,
                padding: "10px",
                backgroundColor: editIndex === null ? "#ccc" : "#28a745",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontWeight: "600",
                cursor: editIndex === null ? "not-allowed" : "pointer",
              }}
            >
              Save
            </button>
          </div>
        </div>
      )}

      <div style={{ overflowX: "auto" }}>
        {/* <JsonToExcel/> */}
        <h2 style={{ marginBottom: "10px", color: "#333" }}>User Table</h2>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "#007bff",
                color: "#fff",
                textAlign: "left",
              }}
            >
              <th style={{ padding: "12px" }}>S.No</th>
              <th style={{ padding: "12px" }}>Name</th>
              <th style={{ padding: "12px" }}>Age</th>
              <th style={{ padding: "12px" }}>Email</th>
              <th style={{ padding: "12px" }}>Phone</th>
              <th style={{ padding: "12px" }}>City</th>
              <th style={{ padding: "12px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {info.map((value, index) => (
              <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "10px" }}>{index+1}</td>
                <td style={{ padding: "10px" }}>{value.name}</td>
                <td style={{ padding: "10px" }}>{value.age}</td>
                <td style={{ padding: "10px" }}>{value.email}</td>
                <td style={{ padding: "10px" }}>{value.phone}</td>
                <td style={{ padding: "10px" }}>{value.city}</td>
                <td style={{ padding: "10px" }}>
                  <button
                    onClick={() => getIndex(value._id, index)}
                    style={{
                      padding: "6px 10px",
                      marginRight: "8px",
                      backgroundColor: "royalblue",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontWeight: "500",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => del(value._id)}
                    style={{
                      padding: "6px 10px",
                      backgroundColor: "#dc3545",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontWeight: "500",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
};



export default App;
