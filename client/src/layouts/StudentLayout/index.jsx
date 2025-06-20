import React, { useState, useRef, useEffect } from "react";
import "./studentLayout.scss";

import Header from "./Header";
import Sidebar from "./Sidebar";

import { TbCloudUpload } from "react-icons/tb";
import { LuSettings } from "react-icons/lu";
import { HiOutlineRocketLaunch } from "react-icons/hi2";
import { HiMiniRocketLaunch } from "react-icons/hi2";
import { BsStars } from "react-icons/bs";
import { HiMiniUserGroup } from "react-icons/hi2";
import { BsPersonFill } from "react-icons/bs";
import { FaChalkboardTeacher } from "react-icons/fa";
// import { TbCloudUpload } from "react-icons/tb";
import { SlCloudUpload } from "react-icons/sl";
import { LuFileUp } from "react-icons/lu";
import { PiTrashSimple } from "react-icons/pi";

import { AntDesignOutlined, UserOutlined } from "@ant-design/icons";
import { QRCode } from "antd";
import { Avatar, Divider, Tooltip } from "antd";
import { Button, Modal, Tabs } from "antd";

import BALLCOVER1 from "../../assets/images/pscCover6.jpeg";
import POSTERICON from "../../assets/icons/posterIcon.png";
import ARTICLEICON from "../../assets/icons/articleIcon2.png";
import VIDEOICON from "../../assets/icons/videoIcon3.png";
import REPORTSUPLOAD from "../../assets/icons/reportsUploadIcon.png";

import { InboxOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";

import toast from "react-hot-toast";
import axios from "axios";

const getLatestReportPerType = (reports) => {
  const latest = {};

  reports.forEach((report) => {
    const type = report.type;

    // Keep only the latest submitted report of each type
    if (
      !latest[type] ||
      new Date(report.createdAt) > new Date(latest[type].createdAt)
    ) {
      latest[type] = report;
    }
  });

  return latest; 
};

const MainLayout = ({ children }) => {
  // ✅ Extract user and token from localStorage
  const authToken = localStorage.getItem("authToken");
  const teamData = JSON.parse(localStorage.getItem("userData"));

  // console.log("🔥 : ", authToken, teamData);

  const fileInputRef = useRef(null);
  const [reports, setReports] = useState([]);
  const [latestReports, setLatestReports] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedType, setSelectedType] = useState("poster");

  // const [selectedFile, setselectedFile] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset using ref
    }
  };

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
  };

  const allowedExtensions = {
    poster: ["pdf"],
    article: ["doc", "docx"],
    video: ["mp4", "mov"],
  };
  const handleUpload = async () => {
    const token = localStorage.getItem("authToken");
    if (!selectedFile || !selectedType) {
      toast.error("Please select both a file and report type");
      return;
    }

    // 🔴 1. VALIDATE FILE TYPE BEFORE UPLOAD
    if (selectedFile && selectedType) {
      const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
      const isValidExtension =
        allowedExtensions[selectedType]?.includes(fileExtension);

      if (!isValidExtension) {
        toast.error(
          `Invalid file type for "${selectedType}". Allowed: ${allowedExtensions[
            selectedType
          ].join(", ")}`
        );
        return; // Stop upload if invalid
      }
    } else {
      toast.error("Please select both a file and a report type.");
      return;
    }

    // 🟢 2. PROCEED IF VALIDATION PASSES
    try {
      const formData = new FormData();
      formData.append("type", selectedType);
      formData.append("teamId", teamData._id);
      formData.append("teamName", teamData.name.replace(/\s+/g, "_"));
      formData.append("report", selectedFile);

      const res = await axios.post(`/reports/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.status === "success") {
        toast.success("Report uploaded successfully!");
        fileInputRef.current.value = "";
        setSelectedFile(null);
        setSelectedType(null);
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("❌ Failed to upload report. Please try again.");
    }
  };

  const fetchTeamReports = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const userData = localStorage.getItem("userData");

      if (!authToken || !userData) {
        console.warn("Missing auth token or user data in localStorage.");
        return;
      }

      const team = JSON.parse(userData);

      const res = await axios.get(`/reports/team/${team._id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const allReports = res.data.data.reports;
      setReports(allReports);
      setLatestReports(getLatestReportPerType(allReports)); 

    } catch (error) {
      console.error("❌ Failed to fetch team reports:", error);
      setReports([]);
      setLatestReports({});
    }
  };

  useEffect(() => {
    fetchTeamReports();
  }, []);

  console.log("📛 LATEST REPORTS : ", latestReports);

  return (
    <>
      <div className="student_layout_container">
        <Sidebar />
        <div className="student_layout_first_section_wrapper">
          <div className="student-layout-first-section-1">
            <div className="team-qrcode-wrapper">
              <QRCode value={teamData?._id} />
            </div>

            <div className="team-details-wrapper">
              <div className="team-name">
                <div className="team-name-text">
                  <HiMiniUserGroup className="icon" />

                  <div className="text">{teamData?.name}</div>
                </div>

                <div className="team-members-avatars">
                  <Avatar.Group shape="square">
                    {teamData?.members?.map((member, index) => {
                      const fullName = `${member.firstName} ${member.lastName}`;
                      const initials =
                        (member.firstName?.[0] || "") +
                        (member.lastName?.[0] || "");

                      const colors = [
                        "#fde3cf",
                        "#f56a00",
                        "#b0df71",
                        "#b498fa",
                        "#9cddf5",
                      ];
                      const bgColor = colors[index % colors.length];

                      return (
                        <Tooltip
                          title={fullName}
                          placement="top"
                          key={member._id || index}
                        >
                          <Avatar style={{ backgroundColor: bgColor }}>
                            {initials.toUpperCase()}
                          </Avatar>
                        </Tooltip>
                      );
                    })}
                  </Avatar.Group>
                </div>
              </div>
              <div className="team-tutor">
                <FaChalkboardTeacher className="icon" />
                <div className="text">
                  {teamData?.tutor ? (
                    <>
                      {teamData.tutor.gender === "female" ? "Mrs." : "Mr."}{" "}
                      {capitalize(teamData.tutor.firstName)}{" "}
                      {capitalize(teamData.tutor.lastName)}
                    </>
                  ) : (
                    "No Tutor Assigned Yet"
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="student-layout-first-section-3 "></div>

          <div className="student-layout-first-section-4">
            <div className="upload-deliverable-text-wrapper">
              <div className="deliverable-text-1">
                Upload Team Reports
                <br /> for Review
              </div>
              <div className="deliverable-text-2">
                Submit your team reports for review and feedback
              </div>
            </div>
            <div className="upload-deliverable-button" onClick={showModal}>
              <TbCloudUpload className="upload-deliverable-btn-icon" />
              <span>UPLOAD REPORTS</span>
            </div>
          </div>
        </div>

        {/* START UPLOAD REPORTS MODAL */}
        <Modal
          title={null}
          footer={null}
          closable={true}
          open={isModalOpen}
          onCancel={handleCancel}
          style={{
            width: "80%",
            height: "90vh",
            maxWidth: "none",
            top: "5vh",
          }}
          className="upload-reports-modal"
        >
          <div className="upload-reports-modal-header">
            <div className="icon">
              <img src={REPORTSUPLOAD} alt="" />
            </div>
            <div className="text">PROJECT REPORTS SUBMISSION</div>
          </div>
          <div className="upload-reports-modal-body">
            <div className="upload-body-left">
              <div
                className={`upload-container ${
                  selectedFile ? "file-selected-container" : ""
                }`}
              >
                <input
                  type="file"
                  id="fileElem"
                  accept="*"
                  className="input-upload"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
                <div
                  className={`upload-area-wrapper ${
                    selectedFile ? "file-selected-area" : ""
                  }`}
                >
                  <div className="upload-icon">
                    <SlCloudUpload />
                  </div>
                  <div className="upload-description-1">
                    CLICK OR DRAG FILE TO THIS AREA TO UPLOAD
                  </div>
                  <div className="upload-description-2">
                    Support for a single upload only. Please respect the
                    required file type and format for each report.
                  </div>
                </div>
                {selectedFile && (
                  <div className="file-info-wrapper">
                    <div className="file-info-container">
                      <div className="file-icon">
                        <LuFileUp />
                      </div>
                      <div className="file-details">
                        <div className="file-name">{selectedFile.name}</div>
                        <div className="file-size">
                          {(selectedFile.size / 1024).toFixed(1)} KB of{" "}
                          {(selectedFile.size / 1024).toFixed(1)} KB · ●
                          Completed
                        </div>
                      </div>
                      <div className="file-remove" onClick={handleRemoveFile}>
                        <PiTrashSimple />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="upload-body-right">
              <div className="top-section">
                <div className="title-wrapper">DELIVERABLES TRACKER</div>
                <div className="deliverables-wrapper">
                  <div className="deliverable-card">
                    <div className="card-part-1">
                      <img src={POSTERICON} alt="" />
                    </div>
                    <div className="card-part-2">
                      <div className="top-text">Project Poster</div>
                      <div className="bottom-text">PDF - A4 Size</div>
                    </div>
                    <div className="card-part-3">
                      <div
                        className={`status ${
                          latestReports["poster"] ? "submitted" : "unsubmitted"
                        }`}
                      >
                        {latestReports["poster"] ? "Submitted" : "Unsubmitted"}
                      </div>
                    </div>
                  </div>

                  <div className="deliverable-card">
                    <div className="card-part-1">
                      <img src={ARTICLEICON} alt="" />
                    </div>
                    <div className="card-part-2">
                      <div className="top-text">Project Article</div>
                      <div className="bottom-text">
                        Word (.docx) - PDF - A4 Size
                      </div>
                    </div>
                    <div className="card-part-3">
                      <div
                        className={`status ${
                          latestReports["article"] ? "submitted" : "unsubmitted"
                        }`}
                      >
                        {latestReports["article"] ? "Submitted" : "Unsubmitted"}
                      </div>
                    </div>
                  </div>

                  <div className="deliverable-card">
                    <div className="card-part-1">
                      <img src={VIDEOICON} alt="" className="video-icon" />
                    </div>
                    <div className="card-part-2">
                      <div className="top-text">Video Report</div>
                      <div className="bottom-text">Media File - MP4</div>
                    </div>
                    <div className="card-part-3">
                      <div
                        className={`status ${
                          latestReports["video"] ? "submitted" : "unsubmitted"
                        }`}
                      >
                        {latestReports["video"] ? "Submitted" : "Unsubmitted"}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="report-selection-wrapper">
                  <div className="title">SELECT REPORT TO SUBMIT</div>
                  <div className="choices-wrapper">
                    <div className="choice-wrapper">
                      <div className="check-box">
                        <input
                          type="radio"
                          className="input-radio"
                          name="reportType"
                          value="poster"
                          onChange={handleTypeChange}
                          defaultChecked
                        />
                      </div>
                      <div className="value">Poster</div>
                    </div>

                    <div className="choice-wrapper">
                      <div className="check-box">
                        <input
                          type="radio"
                          className="input-radio"
                          name="reportType"
                          value="article"
                          onChange={handleTypeChange}
                        />
                      </div>
                      <div className="value">Article</div>
                    </div>

                    <div className="choice-wrapper">
                      <div className="check-box">
                        <input
                          type="radio"
                          className="input-radio"
                          name="reportType"
                          value="video"
                          onChange={handleTypeChange}
                        />
                      </div>
                      <div className="value">Video</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bottom-section">
                <div
                  className={
                    !selectedFile || !selectedType
                      ? "confirm-upload-button disabled-button"
                      : "confirm-upload-button active-button"
                  }
                  onClick={handleUpload}
                >
                  Submit Report
                </div>
              </div>
            </div>
          </div>
          {/* <div className="upload-reports-modal-footer"></div> */}
        </Modal>

        {/* END UPLOAD REPORTS MODAL */}

        <div className="student_layout_middle_section_wrapper">
          <Header />

          <div className="student_layout_full_page_wrapper">
            {React.cloneElement(children)}
          </div>
        </div>

        <div className="student_layout_last_section_wrapper">
          <div className="student_layout_last_section_1"></div>
        </div>
      </div>
    </>
  );
};

export default MainLayout;
