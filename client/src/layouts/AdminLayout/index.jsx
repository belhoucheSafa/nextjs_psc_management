import React, { useState } from "react";
import "./adminLayout.scss";
import Header from "./Header";
import Sidebar from "./Sidebar";

import PSCLOGO from "../../assets/images/mainLogo2.png";
import DRIVEICON from "../../assets/icons/driveIcon.png";
import WEBSITEICON from "../../assets/icons/websiteIcon2.png";

const MainLayout = ({ children }) => {
  const isTeamsPage = location.pathname === "/admin/teams";

  return (
    <>
      <div className="admin_layout_container">
        <div className="admin_layout_spaces_section">
          <div className="space-item-wrapper psc-space active">
            <div className="space-item ">
              <img src={PSCLOGO} alt="" className="psc-icon" />
            </div>
          </div>

          <div className="space-item-wrapper drive-space">
            <a
              href="https://drive.google.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="space-item">
                <img
                  src={DRIVEICON}
                  alt="Google Drive"
                  className="drive-icon"
                />
              </div>
            </a>
          </div>

          <div className="space-item-wrapper polytech-space">
            <a
              href="https://www.polytecsousse.tn/psc-2/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="space-item">
                <img
                  src={WEBSITEICON}
                  alt="Polytechnique Website"
                  className="polyWebsite-icon"
                />
              </div>
            </a>
          </div>
        </div>
        <Sidebar />
        <div className="admin_layout_full_page_container_1">
          <div className="admin_layout_full_page_container_2">
            {/* <Header /> */}
            {!isTeamsPage && <Header />}

            <div className="admin_layout_full_page_wrapper">
              {React.cloneElement(children)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainLayout;
