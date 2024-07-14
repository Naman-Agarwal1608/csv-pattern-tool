import React from "react";

const Header = () => {
  return (
    <header>
      <nav
        className="navbar navbar-expand-lg sticky-top bg-primary"
        data-bs-theme="dark"
      >
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            CSV Pattern Tool
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Header;
