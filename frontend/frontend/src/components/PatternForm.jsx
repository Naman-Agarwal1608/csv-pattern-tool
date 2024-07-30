import React from "react";
import { useState } from "react";
import ErrorAlert from "./ErrorAlert";
import TableView from "./TableView";
import ExtraInfo from "./ExtraInfo";

const PatternForm = ({ regex, replace, pattern, id }) => {
  const [finalregex, setRegex] = useState(regex);
  const [replacement, setReplacement] = useState(replace);
  const [confirmButton, setConfirmButton] = useState(false);
  const [errorAlert, setErrorAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmloading, setconfirmLoading] = useState(false);
  const [fileData, setFileData] = useState([]);
  const [showExtraInfo, setShowExtraInfo] = useState(false);

  const handleRegexChange = (index, value) => {
    const updatedRegexes = [...finalregex];
    updatedRegexes[index] = value;
    setRegex(updatedRegexes);
  };

  const handleReplacementChange = (index, value) => {
    const updatedReplacements = [...replacement];
    updatedReplacements[index] = value;
    setReplacement(updatedReplacements);
  };

  const handleAddPattern = () => {
    setRegex([...finalregex, ""]);
    setReplacement([...replacement, ""]);
  };

  const handleRemovePattern = (index) => {
    const updatedRegexes = finalregex.filter((_, i) => i !== index);
    const updatedReplacements = replacement.filter((_, i) => i !== index);
    setRegex(updatedRegexes);
    setReplacement(updatedReplacements);
  };

  const handleRetry = async (e) => {
    e.preventDefault();
    setLoading(true);
    setRegex(["Retrying..."]);
    setReplacement(["Retrying..."]);
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
    setFileData([]);
    setShowExtraInfo(false);
    // const formData = new FormData();
    // formData.append("regex", finalregex);
    // formData.append("replacement", replacement);
    // formData.append("id", id);

    try {
      const request = await fetch("http://localhost:8000/replace/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          regex: finalregex,
          replacement: replacement,
          id: id,
        }),
      });

      const reader = request.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let result = "";
      let temp = "";
      let arr = [];

      const readStream = async () => {
        const { done, value } = await reader.read();
        if (done) {
          return;
        }
        result += decoder.decode(value, { stream: true });
        if (result.endsWith("}]")) {
          //If result ends with "}]", then the chunk received is complete
          //and can be processed

          //If chunks are small and are concatenated
          temp = result.replaceAll("}][{", "}]||[{");
          arr = temp.split("||");

          let rows = [];
          try {
            arr.forEach((element) => {
              let parsed = JSON.parse(element);
              rows.push(...parsed);
            });
          } catch (e) {
            console.log("Error in parsing: " + e + "->" + arr);
          }

          try {
            if (rows.length > 0) {
              setFileData((oldData) => [...oldData, ...rows]);
            }
          } catch (e) {
            console.log("Error in table view: " + e + " '" + result + "'");
          }
          result = ""; //Chunks processed, clear result for next chunks accumulation
        }
        return readStream();
      };

      // const readStream = async () => {
      //   const { done, value } = await reader.read();
      //   if (done) {
      //     return;
      //   }
      //   //console.log(value);
      //   result = decoder.decode(value, { stream: true });
      //   temp = result.replaceAll("}][{", "}]||[{");
      //   arr = temp.split("||");

      //   let rows = [];
      //   arr.forEach((element) => {
      //     let parsed = JSON.parse(element);
      //     rows.push(...parsed);
      //   });

      //   setFileData((oldData) => [...oldData, ...rows]);
      //   // Clear result for next chunks accumulation
      //   result = "";
      //   return readStream();
      // };
      await readStream();
    } catch (error) {
      setErrorAlert("Error: " + error);
    } finally {
      setconfirmLoading(false);
      setShowExtraInfo(true);
    }
  };

  return (
    <div className="my-3">
      <h4>Using LLM:</h4>
      {errorAlert && <ErrorAlert message={errorAlert} />}
      {finalregex.map((item, index) => (
        <div className="input-group flex-nowrap mb-2" key={index}>
          <span className="input-group-text" id="addon-wrapping">
            With Regex:
          </span>
          <input
            type="text"
            id="regex"
            className="form-control"
            placeholder="Regex Pattern"
            onChange={(e) => handleRegexChange(index, e.target.value)}
            value={item}
            required
          />
          <span className="input-group-text" id="addon-wrapping">
            replacing all values with:
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="replacement value"
            onChange={(e) => handleReplacementChange(index, e.target.value)}
            value={replacement[index]}
            required
          />
          {index > 0 && (
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => handleRemovePattern(index)}
            >
              Remove
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        className="btn btn-primary m-2"
        onClick={handleAddPattern}
      >
        Add Pattern
      </button>
      <button
        type="button"
        className="btn btn-danger my-2"
        onClick={handleRetry}
      >
        {loading && (
          <span
            className="spinner-border spinner-border-sm"
            aria-hidden="true"
          ></span>
        )}{" "}
        Retry
      </button>
      <button
        type="button"
        className="btn btn-success mx-2"
        onClick={handleConfirm}
        disabled={confirmButton}
      >
        {confirmloading && (
          <span
            className="spinner-border spinner-border-sm"
            aria-hidden="true"
          ></span>
        )}{" "}
        Confirm
      </button>
      {fileData.length > 0 && (
        <TableView str={"After Replacement"} data={fileData} download={true} />
      )}
      {showExtraInfo && <ExtraInfo uuid={id} />}
    </div>
  );
};

export default PatternForm;
