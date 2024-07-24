import React, { useState } from "react";
import ErrorAlert from "./ErrorAlert";
import TableView from "./TableView";

const ExtraInfo = ({ uuid }) => {
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [errorAlert, setErrorAlert] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [showExtra, setShowExtra] = useState(false);

  const handleTry = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorAlert(null);
    setShowExtra(false);
    setDescription("Loading...");
    const formData = new FormData();
    formData.append("uuid", uuid);

    try {
      const request = await fetch("http://localhost:8000/getdesc/", {
        method: "POST",
        body: formData,
      });

      const response = await request.json();
      if (response.description) {
        setDescription(response.description);
      } else {
        throw new Error(response.error);
      }

      const dummyDataRequest = await fetch(
        "http://localhost:8000/getdummydata/",
        {
          method: "POST",
          body: formData,
        }
      );
      const dummyDataResponse = await dummyDataRequest.json();
      if (dummyDataResponse.error) {
        throw new Error(dummyDataResponse.error);
      }
      setTableData(dummyDataResponse);
    } catch (error) {
      console.log(error);
      setErrorAlert("Error: " + error.message);
    } finally {
      setLoading(false);
      setShowExtra(true);
    }
  };
  return (
    <div className="mb-3">
      <div>
        <h5>
          You can also generate Data description and Dummy data using LLM:
        </h5>
        <button type="button" className="btn btn-secondary" onClick={handleTry}>
          {loading && (
            <span
              className="spinner-border spinner-border-sm"
              aria-hidden="true"
            ></span>
          )}
          {!loading && "Give it a try!"}
          {loading && " Loading..."}
        </button>
        {errorAlert && <ErrorAlert error={errorAlert} />}
      </div>

      {showExtra && (
        <div className="input-group my-3">
          <span
            className="input-group-text"
            style={{ width: "20%", whiteSpace: "normal" }}
          >
            LLM Generated Description
          </span>
          <textarea
            className="form-control"
            readOnly
            aria-label="With textarea"
            id="description"
            value={description}
            rows="5"
          ></textarea>
          {tableData && (
            <TableView
              data={tableData}
              str="LLM Generated Data"
              download={true}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ExtraInfo;
