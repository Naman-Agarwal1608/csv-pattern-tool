import React from "react";
import { useState } from "react";

const Form = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [pattern, setPattern] = useState("");

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handlePatternChange = (e) => {
    setPattern(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("pattern", pattern);
    fetch("http://localhost:8000/addCSV/", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="csv" className="form-label">
          CSV/Excel File
        </label>
        <input
          type="file"
          className="form-control"
          id="file"
          onChange={handleFileChange}
          accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="pattern" className="form-label">
          Pattern in Natural Language
        </label>
        <input
          type="text"
          className="form-control"
          id="pattern"
          onChange={handlePatternChange}
          placeholder="e.g.: find email addresses"
          required
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
};

export default Form;
