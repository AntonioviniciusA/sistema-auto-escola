import React from "react";
import logo from "../assets/logo.png";

const logo = () => {
  return (
    <div className="logo-container">
      <div className="logo-placeholder">
        <img loading="lazy" src={logo} alt="logo" />
      </div>
    </div>
  );
};

export default logo;
