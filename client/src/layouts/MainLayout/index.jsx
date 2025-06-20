import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

const MainLayout = ({ children }) => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible((prev) => !prev);
  };

  return (
    <>
      <div className="container">
        <div className="main_layout">
          <Sidebar isVisible={isSidebarVisible} toggleSidebar={toggleSidebar} />

          <div className="full_page_container">
            <Header />

            <div className="full_page_wrapper">
              {React.cloneElement(children, { onViewProfile: toggleSidebar })}
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default MainLayout;
