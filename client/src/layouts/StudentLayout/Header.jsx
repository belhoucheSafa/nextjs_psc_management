import React from "react";

import NOTIFICON from "../../assets/icons/notifIcon.png";
import LIGHTDARKMODEICON from "../../assets/icons/LightDarkModeIcon.png";

const Header = () => {
  const authToken = localStorage.getItem("authToken");
  const teamData = JSON.parse(localStorage.getItem("userData"));
  
  return (
    <div className="student_layout_header">
      <div className="student-layout-header-left-side">
        <div className="welcome-msg">Welcome Back Innovators !</div>
        <div className="sub-welcome-msg">Teamwork Mode Activated 🔥 </div>
      </div>
      <div className="student-layout-header-right-side">
        <div className="header-widget notification-widget">
          <img src={NOTIFICON} alt="" />
          <div className="notif-alert-wrapper">
            <div className="alert-notif">2</div>
          </div>
        </div>
        <div className="header-widget light-dark-mode-widget">
        <img src={LIGHTDARKMODEICON} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Header;
