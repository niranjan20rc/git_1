import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import axios from "axios";

const JsonToExcel = () => {
  const [info, setInfo] = useState([]);

  const fetch_data = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users");
      setInfo(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetch_data();
  }, []);

  const exportToExcel = () => {
    if (info.length === 0) {
      alert("No data to export!");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(info);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });

    saveAs(blob, "data.xlsx");
  };

  const btn_style = {
  backgroundColor: "royalblue",
  color: "#fff",
  borderRadius: "5px",
  padding: "10px 20px",
  border: "none",
  cursor: "pointer",
  fontSize: "16px",
};
  return (
    <div>
      <button onClick={exportToExcel} style={ btn_style}>Download Excel</button>
    </div>
  );
};

export default JsonToExcel;
