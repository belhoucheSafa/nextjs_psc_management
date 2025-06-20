import React from "react";
import { Link } from "react-router-dom";
import MAINLOGO from "../../assets/images/mainLogo2.png";
import LOGOUTICON from "../../assets/icons/logoutIcon.png";

import { PiCaretUpDownBold } from "react-icons/pi";
import { LuLayoutDashboard } from "react-icons/lu";
import { LuFileClock } from "react-icons/lu";
import { LuShieldAlert } from "react-icons/lu";
import { TbCalendarPin } from "react-icons/tb";
import { TbCalendarStar } from "react-icons/tb";
import { TbLogout2 } from "react-icons/tb";

import { TbLayoutDashboardFilled } from "react-icons/tb";
import { BiSolidCalendarStar } from "react-icons/bi";
import { BsFileEarmarkTextFill } from "react-icons/bs";
import { TbAlertHexagonFilled } from "react-icons/tb";
import { GiBarracksTent } from "react-icons/gi";

const Sidebar = () => {
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    window.dispatchEvent(new Event("storage"));
    navigate("/login");
  };

  return (
    <div className="student_layout_sidebar">
      <div className="student-layout-sidebar-top">
        <div className="student-layout-sidebar-top-left-wrapper">
          <div className="student-layout-sidebar-top-left">
            <img src={MAINLOGO} alt="" />
          </div>
        </div>
      </div>

      <div className="student-layout-sidebar-center">
        <ul className="student-layout-sidebar-center-ul">
          <li className="student-layout-sidebar-center-li">
            <Link
              to="/student/dashboard"
              className="student-layout-sidebar-center-menu-item"
            >
              <TbLayoutDashboardFilled className="student-layout-sidebar-icon-dashboard" />
            </Link>
          </li>

          <li className="student-layout-sidebar-center-li">
            <Link
              to="/psc/events"
              className="student-layout-sidebar-center-menu-item"
            >
              <BiSolidCalendarStar className="student-layout-sidebar-icon-events" />
            </Link>
          </li>

          <li className="student-layout-sidebar-center-li">
            <div className="student-layout-sidebar-center-menu-item">
              <BsFileEarmarkTextFill className="student-layout-sidebar-icon-report" />
            </div>
          </li>
          <li className="student-layout-sidebar-center-li">
            <div className="student-layout-sidebar-center-menu-item">
              <TbAlertHexagonFilled className="student-layout-sidebar-icon-reclamation" />
            </div>
          </li>
          <li className="student-layout-sidebar-center-li">
            <div className="student-layout-sidebar-center-menu-item">
              <GiBarracksTent className="student-layout-sidebar-icon-recservation" />
            </div>
          </li>

          {/* <li className="student-layout-sidebar-center-li">
            <div className='student-layout-sidebar-center-menu-item'>
              < GiBarracksTent className='student-layout-sidebar-icon-recservation' />
            </div>
          </li> */}
        </ul>
      </div>

      <div className="student-layout-sidebar-bottom" onClick={handleLogout}>
        <TbLogout2 className="logout-icon" />
      </div>
    </div>
  );
};

export default Sidebar;
