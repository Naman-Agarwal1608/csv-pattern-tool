import React from "react";
import { useState } from "react";
import ErrorAlert from "./ErrorAlert";
import TableView from "./TableView";

const PatternForm = ({ regex, replace, pattern, id }) => {
  const [finalregex, setRegex] = useState(regex);
  const [replacement, setReplacement] = useState(replace);
  const [confirmButton, setConfirmButton] = useState(false);
  const [errorAlert, setErrorAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmloading, setconfirmLoading] = useState(false);
  const [fileData, setFileData] = useState([]);

  const handleRegexChange = (e) => {
    setRegex(e.target.value);
  };

  const handleReplacementChange = (e) => {
    setReplacement(e.target.value);
  };

  const handleRetry = async (e) => {
    e.preventDefault();
    setLoading(true);
    setRegex("Retrying...");
    setReplacement("Retrying...");
    setFileData([]);

    const formData = new FormData();
    formData.append("pattern", pattern);

    try {
      const request = await fetch("http://localhost:8000/getregex/", {
        method: "POST",
        body: formData,
      });

      const response = await request.json();
      if (response.regex) {
        setRegex(response.regex);
        setReplacement(response.replacement);
      } else if (response.error) {
        setRegex("");
        setReplacement("");
        setErrorAlert(response.error);
      }
    } catch (error) {
      setRegex("");
      setReplacement("");
      setConfirmButton(true);
      setErrorAlert("Error: " + error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    setconfirmLoading(true);
    setErrorAlert(null);
    const formData = new FormData();
    formData.append("regex", finalregex);
    formData.append("replacement", replacement);
    formData.append("id", id);

    try {
      const request = await fetch("http://localhost:8000/replace/", {
        method: "POST",
        body: formData,
      });

      const response = await request.json();
      if (response.data) {
        setFileData(response.data);
        setErrorAlert(null);
      } else if (response.error) {
        setErrorAlert("Error" + response.error);
      }
    } catch (error) {
      setErrorAlert("Error: " + error);
    } finally {
      setconfirmLoading(false);
    }
  };

  return (
    <div className="my-3">
      <h4>Using LLM:</h4>
      {errorAlert && <ErrorAlert message={errorAlert} />}
      <div className="input-group flex-nowrap">
        <span className="input-group-text" id="addon-wrapping">
          With Regex:
        </span>
        <input
          type="text"
          id="regex"
          className="form-control"
          placeholder="Regex Pattern"
          onChange={handleRegexChange}
          value={finalregex}
          required
        />
        <span className="input-group-text" id="addon-wrapping">
          replacing all values with:
        </span>
        <input
          type="text"
          className="form-control"
          placeholder="replacement value"
          onChange={handleReplacementChange}
          value={replacement}
          required
        />

        <button type="button" class="btn btn-danger" onClick={handleRetry}>
          {loading && (
            <span
              class="spinner-border spinner-border-sm"
              aria-hidden="true"
            ></span>
          )}{" "}
          Retry
        </button>
        <button
          type="button"
          class="btn btn-success"
          onClick={handleConfirm}
          disabled={confirmButton}
        >
          {confirmloading && (
            <span
              class="spinner-border spinner-border-sm"
              aria-hidden="true"
            ></span>
          )}{" "}
          Confirm
        </button>
      </div>
      {fileData.length > 0 && (
        <TableView str={"After Replacement"} data={fileData} />
      )}
    </div>
  );
};

export default PatternForm;
