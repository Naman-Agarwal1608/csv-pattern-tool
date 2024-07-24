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
  const [id, setID] = useState(null);
  let flag = false;
  let count = 0;

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
      const uploadRequest = await fetch("http://localhost:8000/addCSV/", {
        method: "POST",
        body: formData,
      });

      const reader = uploadRequest.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let result = "";
      let temp = "";
      let arr = [];

      const readStream = async () => {
        const { done, value } = await reader.read();
        if (done) {
          return;
        }
        //console.log(value);
        result = decoder.decode(value, { stream: true });
        temp = result.replaceAll("}][{", "}]||[{");
        arr = temp.split("||");

        let rows = [];
        try {
          arr.forEach((element, index) => {
            let parsed = "";
            parsed = JSON.parse(element);

            if (index === arr.length - 1) {
              // Last element (chunk) of array can contain UUID
              if (parsed[parsed.length - 1].uuid) {
                setID(parsed[parsed.length - 1].uuid);
                //console.log("UUID: " + "Found");
              } else {
                rows.push(...parsed);
                count += parsed.length;
              }
            } else {
              // Not the last chunk, can't have UUID
              rows.push(...parsed);
              count += parsed.length;
            }
          });
        } catch (e) {
          console.log("Error in parsing: " + e + "->" + arr);
        }

        try {
          if (rows.length > 0) {
            setFileData((oldData) => [...oldData, ...rows]);
            //console.log(fileData);
          }
          flag = true;
        } catch (e) {
          console.log("Error in table view: " + e + " '" + result + "'");
        }
        // Clear result for next chunks accumulation
        result = "";
        return readStream();
      };
      await readStream();
      console.log("Finished reading stream, total rows: " + count.toString());
      if (flag) {
        // Now send the instruction for getting regex
        setPattern(pattern);
        setErrorAlert(null);
        //setID(response.id);
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
        } else if (responseRegex.error) {
          setErrorAlert(responseRegex.error);
          setregex("");
          setreplacement("");
        } else {
          setErrorAlert("Error in connecting with LLM, try again later :(");
          setregex("");
          setreplacement("");
        }
      } else {
        setErrorAlert(uploadRequest.error);
        setFileData([]);
      }
    } catch (error) {
      setErrorAlert("An error occurred. Please try again. (" + error + ")");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="csv" className="form-label">
            CSV/Excel File
          </label>
          <input
            type="file"
            className="form-control"
            id="file"
            name="file"
            onChange={handleFileChange}
            accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            required
          />
        </div>
        {/* {progress > 0 && progress != 100 && <ProgressBar progress={progress} />} */}
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
        <TableView
          str={"Before Replacement"}
          data={fileData}
          download={false}
        />
      )}
      {showPatternForm && (
        <PatternForm
          regex={regex}
          replace={replacement}
          pattern={pattern}
          id={id}
        />
      )}
    </div>
  );
};

export default Form;
