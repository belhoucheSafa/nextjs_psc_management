import React, { useState } from "react";

import { PiCaretUpDownBold } from "react-icons/pi";
import { AiOutlineDashboard } from "react-icons/ai";
import { PiCalendarStarBold } from "react-icons/pi";
import { PiStudentBold } from "react-icons/pi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi2";
import { HiOutlineNewspaper } from "react-icons/hi";
import { TbLayoutDashboard } from "react-icons/tb";
import { IoDocumentAttachOutline } from "react-icons/io5";
import { LuSwatchBook } from "react-icons/lu";
import { LuNotebookTabs } from "react-icons/lu";
import { MdOutlineLibraryBooks } from "react-icons/md";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { HiOutlineLogout } from "react-icons/hi";
import { useLocation, useNavigate } from "react-router-dom";
import { LuLogOut } from "react-icons/lu";
import { RiMapPinTimeLine } from "react-icons/ri";
import { AiOutlineAlert } from "react-icons/ai";

import MAINLOGO from "../../assets/images/mainLogo2.png";
import ADMINAVATAR from "../../assets/icons/adminAvatar.png";
import LOGOUTICON from "../../assets/icons/logoutIcon.png";

import { getCurrentUser } from '../../utils/auth';

const Sidebar = () => {
  const currentUser = getCurrentUser();
  // console.log("📛 CURRENT USER " , currentUser)
  const [activeOption, setActiveOption] = useState("Option 1");
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const handleSelect = (option, path) => {
    setActiveOption(option);
    navigate(path);
    console.log("✅", option);
    setActiveOption(option);
  };
  const options = [
    {
      label: "Dashboard",
      icon: <TbLayoutDashboard />,
      path: "/admin/dashboard",
    },

    { label: "Events", icon: <PiCalendarStarBold />, path: "/admin/events" },

    { label: "Students", icon: <PiStudentBold />, path: "/admin/students" },
    { label: "Tutors", icon: <FaChalkboardTeacher />, path: "/admin/tutors" },
    { label: "Teams", icon: <HiUserGroup />, path: "/admin/teams" },
    { label: "Reports", icon: <LuSwatchBook />, path: "/admin/reports" },
    { label: "Reservations", icon: <RiMapPinTimeLine />, path: "/admin/reservations" },
    { label: "Reclamations", icon: <AiOutlineAlert />, path: "/admin/reclamations" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    window.dispatchEvent(new Event("storage"));
    navigate("/login");
  };


  return (
    <div className="admin_layout_sidebar">
      <div className="admin-layout-sidebar-top">
        <div className="admin-layout-sidebar-top-left-wrapper">
          <div className="admin-layout-sidebar-top-left">
            <img src={MAINLOGO} alt="" />
          </div>
        </div>
        <div className="admin-layout-sidebar-top-center">
          <div className="admin-layout-sidebar-top-center-top">
            <span className="span1">Poly</span>
            <span className="span2">PSC</span>
          </div>
          <div className="admin-layout-sidebar-top-center-bottom">
            <span>Ingénieur oui , Citoyen d'abord !</span>
          </div>
        </div>
        <div className="admin-layout-sidebar-top-right">
          <PiCaretUpDownBold />
        </div>
      </div>

      <div className="admin-layout-sidebar-center">
        <div className="dropdown-menu">
          <div className="group">
            <div className="group-title">Main Menu</div>

            {options.slice(0, 2).map((opt, index) => (
              <div
                key={index}
                className={`option ${currentPath === opt.path ? "active" : ""}`}
                onClick={() => navigate(opt.path)}
              >
                <div className="option-icon">{opt.icon}</div>
                <div className="option-text">{opt.label}</div>
              </div>
            ))}
          </div>

          <div className="group">
            <div className="group-title">Management</div>

            {options.slice(2).map((opt, index) => (
              <div
                key={index}
                className={`option ${currentPath === opt.path ? "active" : ""}`}
                onClick={() => navigate(opt.path)}
              >
                <div className="option-icon">{opt.icon}</div>
                <div className="option-text">{opt.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="admin-layout-sidebar-bottom" onClick={handleLogout}>
        <div className="avatar-wrapper-logout">
          <img src={ADMINAVATAR} alt="" />
        </div>
        <div className="loggged-user-details">
          <div className="user-name">{currentUser?.name}</div>
          <div className="user-role">PSC Manager</div>
        </div>
        <div className="logout-icon-wrapper">
          {/* <LuLogOut  /> */}
          <img src={LOGOUTICON} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
