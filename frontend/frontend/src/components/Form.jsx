import React from "react";
import { useState } from "react";
import Loading from "./Loading";
import ErrorAlert from "./ErrorAlert";
import TableView from "./TableView";
import PatternForm from "./PatternForm";

const Form = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [pattern, setPattern] = useState("");
  const [regex, setregex] = useState("");
  const [replacement, setreplacement] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorAlert, setErrorAlert] = useState(null);
  const [fileData, setFileData] = useState([]);
  const [showPatternForm, setShowPatternForm] = useState(false);

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
    setShowPatternForm(false);
    const formData = new FormData();
    formData.append("file", selectedFile);

    const formDataPattern = new FormData();
    formDataPattern.append("pattern", pattern);

    try {
      const request = await fetch("http://localhost:8000/addCSV/", {
        method: "POST",
        body: formData,
      });

      const response = await request.json();

      if (response.data) {
        setFileData(response.data);
        setPattern(pattern);
        setErrorAlert(null);
        // So now we can process the pattern
        const requestRegex = await fetch("http://localhost:8000/getregex/", {
          method: "POST",
          body: formDataPattern,
        });

        const responseRegex = await requestRegex.json();
        if (responseRegex.regex) {
          setregex(responseRegex.regex);
          setreplacement(responseRegex.replacement);
          setShowPatternForm(true);
        } else {
          setErrorAlert(responseRegex.error);
          setregex("");
          setreplacement("");
        }
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
            Instruction in Natural Language
          </label>
          <input
            type="text"
            className="form-control"
            id="pattern"
            onChange={handlePatternChange}
            placeholder="Format: Find <...Something...> and replace with <...Something...>"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>

      {loading && <Loading />}
      {errorAlert && <ErrorAlert error={errorAlert} />}
      {fileData.length > 0 && (
        <TableView str={"Before Replacement"} data={fileData} />
      )}
      {showPatternForm && <PatternForm regex={regex} replace={replacement} />}
    </div>
  );
};

export default Form;
