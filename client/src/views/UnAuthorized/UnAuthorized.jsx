import React from "react";
import "./unAuthorized.scss";

import UNAUTHORIZED from "../../assets/images/403.png";

const UnAuthorized = () => {
  return (
    <div className="not-found-page-wrapper">
      <img src={UNAUTHORIZED} alt="" />
    </div>
  );
};

export default UnAuthorized;
