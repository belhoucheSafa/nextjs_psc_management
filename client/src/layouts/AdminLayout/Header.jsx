import React from "react";
import { useNavigate } from 'react-router-dom';

import "./header.scss";

import NOTIFICON from "../../assets/icons/notifIcon.png";
import SETTINGSICON from "../../assets/icons/settingsIcon.png";
import LOGOUTICON from "../../assets/icons/logoutIcon.png";
import ADMINAVATAR from "../../assets/icons/adminAvatar.png";
import LIGHTDARKMODEICON from "../../assets/icons/lightDarkMode2.png"
import { HiMiniLanguage } from "react-icons/hi2";

const Header = () => {
  const navigate = useNavigate();

  const handleSettingsClick = () => {
    navigate('/admin/settings');
  };

  return (
    <div className="admin_layout_header">
      <div className="admin-header-left-side">

        <div class="admin-avatar-wrapper">
          <svg class="progress-ring" width="48" height="48">
            <circle class="bg" cx="24" cy="24" r="22" />
            <circle class="progress" cx="24" cy="24" r="22" />
          </svg>
          <img src={ADMINAVATAR} alt="Avatar" />
          <div className="badge-wrapper">
            <div class="badge">2</div>
          </div>
        </div>
        <div className="admin-greeting-wrapper">
          <div className="greeting-top">Welcome Back Admin !</div>
          <div className="greeting-bottom">
            Your leadership boosted PSC completion by 35% 🔥
          </div>
        </div>
      </div>
      <div className="admin-header-right-side">
        <div className="widget-wrapper light-dark-mode-widget">
          <img src={LIGHTDARKMODEICON} alt="" />
        </div>
        <div className="widget-wrapper notification-widget">
          <img src={NOTIFICON} alt="" />
          <div className="notif-alert-warpper">
            <div className="alert-notif"></div>
          </div>
        </div>
        <div className="widget-wrapper settings-widget" onClick={handleSettingsClick}>
          <img src={SETTINGSICON} alt="Settings" style={{ cursor: 'pointer' }} />
        </div>
        {/* <div className="widget-wrapper logout-widget">
          <img src={LOGOUTICON} alt="" />
  
        </div> */}
      </div>
    </div>
  );
};

export default Header;
