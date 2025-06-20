import React, { useState } from "react";
import { useLocation } from "react-router-dom"; // ✅ Import this

import "./tutorLayout.scss";
import Header from "./Header";
import Sidebar from "./Sidebar";

// Icons
import { TbCloudUpload } from "react-icons/tb";
import { LuSettings } from "react-icons/lu";
import { HiOutlineRocketLaunch, HiMiniRocketLaunch, HiMiniUserGroup } from "react-icons/hi2";
import { BsStars, BsPersonFill } from "react-icons/bs";
import { FaChalkboardTeacher } from "react-icons/fa";
import { SlCloudUpload } from "react-icons/sl";

import { AntDesignOutlined, UserOutlined, InboxOutlined } from "@ant-design/icons";
import { QRCode, Avatar, Divider, Tooltip, Button, Modal, Tabs, message, Upload } from "antd";

// Assets
import BALLCOVER1 from "../../assets/images/pscCover6.jpeg";
import POSTERICON from "../../assets/icons/posterIcon.png";
import ARTICLEICON from "../../assets/icons/articleIcon2.png";
import VIDEOICON from "../../assets/icons/videoIcon3.png";
import REPORTSUPLOAD from "../../assets/icons/reportsUploadIcon.png";

// const MainLayout = ({ children }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const location = useLocation(); // ✅ Get the current path

//   const showModal = () => {
//     setIsModalOpen(true);
//   };
//   const handleOk = () => {
//     setIsModalOpen(false);
//   };
//   const handleCancel = () => {
//     setIsModalOpen(false);
//   };

//   const isDashboard = location.pathname === "/tutor/dashboard"; // ✅ Check route

//   return (
//     <div className="student_layout_container">
//       <Sidebar />

//       <div className="student_layout_middle_section_wrapper">
//         <Header />
//         <div className="student_layout_full_page_wrapper">
//           {React.cloneElement(children)}
//         </div>
//       </div>

//       {/* ✅ Conditionally render this only on /dashboard route */}
//       {isDashboard && (
//         <div className="tutor_layout_last_section_wrapper">
//           <div className="tutor_layout_last_section_1">
//             {/* Your content here */}
//           </div>
//           <div className="student_layout_last_section_2">
//             {/* Your content here */}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MainLayout;

const MainLayout = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

  const isDashboard = location.pathname === "/tutor/dashboard";

  // ✅ Extract user and token from localStorage
  const authToken = localStorage.getItem("authToken");
  const tutor = JSON.parse(localStorage.getItem("userData"));

  return (
    <div className="student_layout_container">
      <Sidebar />

      <div className="student_layout_middle_section_wrapper">
        <Header />
        <div className="student_layout_full_page_wrapper">
          {/* ✅ Inject both tutor and token as props to children */}
          {React.isValidElement(children)
            ? React.cloneElement(children, { tutor, authToken })
            : children}
        </div>
      </div>

      {isDashboard && (
        <div className="tutor_layout_last_section_wrapper">
          <div className="tutor_layout_last_section_1">{/* ... */}</div>
          <div className="student_layout_last_section_2">{/* ... */}</div>
        </div>
      )}
    </div>
  );
};

export default MainLayout;



