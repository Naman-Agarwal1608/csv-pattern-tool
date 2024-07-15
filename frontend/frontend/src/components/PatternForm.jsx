import React from "react";
import { useState } from "react";

const PatternForm = ({ regex, replace }) => {
  const [finalregex, setRegex] = useState("");
  const [replacement, setReplacement] = useState("");

  const handleRegexChange = (e) => {
    setRegex(e.target.value);
  };

  const handleReplacementChange = (e) => {
    setReplacement(e.target.value);
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("regex", regex);
    formData.append("replacement", replacement);

    const request = await fetch("http://localhost:8000/replace/", {
      method: "POST",
      body: formData,
    });
  };

  return (
    <div className="my-3">
      <h4>Using LLM:</h4>

      <div className="input-group flex-nowrap">
        <span className="input-group-text" id="addon-wrapping">
          With Regex:
        </span>
        <input
          type="text"
          id="regex"
          className="form-control"
          placeholder="Regex Pattern"
          value={regex}
          readOnly
        />
        <span className="input-group-text" id="addon-wrapping">
          replacing all values with:
        </span>
        <input
          type="text"
          className="form-control"
          placeholder="replacement value"
          onChange={handleReplacementChange}
          value={replace}
          readOnly
        />
      </div>
    </div>
  );
};

export default PatternForm;
