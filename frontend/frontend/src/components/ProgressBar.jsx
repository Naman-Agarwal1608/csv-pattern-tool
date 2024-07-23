import React from "react";

const ProgressBar = ({ progress }) => {
  return (
    <div
      className="progress my-2"
      role="progressbar"
      style={{ height: "15px" }}
    >
      <div className="progress-bar" style={{ width: `${progress}%` }}>
        {progress}%
      </div>
    </div>
  );
};

export default ProgressBar;
