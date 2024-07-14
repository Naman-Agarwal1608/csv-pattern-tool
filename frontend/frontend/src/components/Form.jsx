import React from "react";
import { useState } from "react";
import Loading from "./Loading";
import ErrorAlert from "./ErrorAlert";
import TableView from "./TableView";

const Form = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [pattern, setPattern] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorAlert, setErrorAlert] = useState(null);
  const [fileData, setFileData] = useState([]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handlePatternChange = (e) => {
    setPattern(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFileData([]);
    setErrorAlert(null);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("pattern", pattern);

    try {
      const request = await fetch("http://localhost:8000/addCSV/", {
        method: "POST",
        body: formData,
      });

      const response = await request.json();

      if (response.data) {
        setFileData(response.data);
        setErrorAlert(null);
      } else {
        setErrorAlert(response.error);
        setFileData([]);
      }
    } catch (error) {
      setErrorAlert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-3">
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

      {loading && <Loading />}
      {errorAlert && <ErrorAlert error={errorAlert} />}
      {fileData.length > 0 && <TableView data={fileData} />}
    </div>
  );
};

export default Form;
