/* eslint-disable @next/next/no-img-element */
import React from "react";

import logo from "../../../public/CB--API-BANKING-LOGO.jpg";
import "./Header.scss";

const Header = () => {
  return (
    <div className="header-wrapper">
      <div className="header">
        <img src={logo.src} width="207px" height="74px" alt="logo" />
      </div>
    </div>
  );
};

export default Header;
