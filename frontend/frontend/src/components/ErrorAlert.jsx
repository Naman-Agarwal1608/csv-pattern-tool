import React from "react";

const ErrorAlert = ({ error }) => {
  return (
    <div className="alert alert-danger my-3 " role="alert">
      {error}
    </div>
  );
};

export default ErrorAlert;
