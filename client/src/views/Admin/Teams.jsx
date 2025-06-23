import React, { useState, useEffect } from "react";
import "./teams.scss";

import * as XLSX from "xlsx";

import { Progress } from "antd";
import { AntDesignOutlined, UserOutlined } from "@ant-design/icons";
import {
  Avatar,
  Divider,
  Tooltip,
  Modal,
  Input,
  Form,
  Radio,
  Button,
  Switch,
  QRCode,
  message,
  Drawer,
  InputNumber,
  Select,
  Space,
  Dropdown,
} from "antd";

import { HiUserGroup } from "react-icons/hi2";
import { HiRectangleGroup } from "react-icons/hi2";
import { LiaSchoolSolid } from "react-icons/lia";
import { MdOutlineLocalActivity } from "react-icons/md";
import { LiaHeartbeatSolid } from "react-icons/lia";
import { RiRecycleLine } from "react-icons/ri";
import { VscSettings } from "react-icons/vsc";
import { LuSettings2 } from "react-icons/lu";
import { BiDotsVertical } from "react-icons/bi";
import { HiDotsVertical } from "react-icons/hi";
import { BsDiagram2 } from "react-icons/bs";
import { MdOutlineFactCheck } from "react-icons/md";
import { MdOutlineRadioButtonChecked } from "react-icons/md";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { TbFileExport } from "react-icons/tb";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { TbSettingsShare } from "react-icons/tb";
import { TbPresentationAnalytics } from "react-icons/tb";
import { IoAnalytics } from "react-icons/io5";
import { HiOutlineEye } from "react-icons/hi2";
import { HiOutlinePencilAlt } from "react-icons/hi";
import ManAvatar from "../../assets/images/manAvatar.png";
import GirlAvatar from "../../assets/images/girlAvatar.png";
import EnvIcon from "../../assets/icons/env1.png";
import HealthIcon from "../../assets/icons/health1.png";
import EdIcon from "../../assets/icons/ed1.png";
import SportIcon from "../../assets/icons/sportCult1.png";

import axios from "axios";
import toast from "react-hot-toast";

const Teams = () => {
  const [open, setOpen] = useState(false);
  const [showTeamDetails, setShowTeamDetails] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("all");

  const [tutors, setTutors] = useState([]);
  const [students, setStudents] = useState([]);
  const [teamsData, setTeamsData] = useState([]);
  const [teamOptions, setTeamOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    selectedMembers: [],
    selectedTheme: null,
    selectedTutor: null,
  });
  const [teamReports, setTeamReports] = useState({});
  useEffect(() => {
    if (teamsData.length > 0) {
      teamsData.forEach((team) => {
        fetchReportsByTeam(team._id);
      });
    }
  }, [teamsData]);

  console.log("TAEMQ : ", teamsData);
  const fetchReportsByTeam = async (teamId) => {
    try {
      const res = await axios.get(`/reports/team/${teamId}`);
      const reports = res.data.data.reports;

      setTeamReports((prev) => ({
        ...prev,
        [teamId]: reports,
      }));
    } catch (error) {
      console.error(`Failed to fetch reports for team ${teamId}`, error);
    }
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const onCloseTeamDetails = () => {
    setShowTeamDetails(false);
    setSelectedTeam(null);
  };

  // Theme colors mapping
  const themeColors = {
    Education: "#afe5a6",
    Environment: "#89c9ff",
    Health: "#f4a850",
    "Culture & Sport": "#b990f5",
  };

  // Format date to French format
  const formatDateFR = (dateString) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    const months = [
      "Jan",
      "Fev",
      "Mar",
      "Avr",
      "Mai",
      "Juin",
      "Juil",
      "Aou",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const day = date.getDate().toString().padStart(2, "0");
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${month} ${day}, ${year}`;
  };

  const fetchTeams = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get("/teams", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const teams = res.data.data.teams;

      setTeamsData(teams);

      const formattedOptions = teams.map((team) => ({
        value: team._id,
        label: team.name,
        theme: team.theme,
      }));
      setTeamOptions(formattedOptions);

      console.log("✅ Teams fetched:", teams);
    } catch (error) {
      console.error("❌ Error fetching teams:", error);
      message.error("Failed to load teams");
    }
  };
  const fetchStudentsWithoutTeam = async () => {
    try {
      const res = await axios.get("/students");
      if (res.data.status === "success") {
        // Filter students without a team
        const studentsWithoutTeam = res.data.data.students.filter(
          (student) => !student.team
        );

        // Map and rename id -> matricule, add key
        const mappedStudents = studentsWithoutTeam.map((student, index) => ({
          ...student,
          matricule: student.id,
          key: index + 1,
        }));

        setStudents(mappedStudents);
      } else {
        message.error("Failed to fetch students.");
      }
    } catch (error) {
      message.error("Error fetching students.");
    }
  };

  // console.log("STUDENTS", students);

  const fetchTutors = () => {
    axios
      .get("/tutors", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      .then((res) => {
        setTutors(res.data.data.tutors);
      })
      .catch(() => {
        message.error("Failed to fetch tutors");
      });
  };

  useEffect(() => {
    fetchTeams();
    fetchStudentsWithoutTeam();
    fetchTutors();
  }, []);
  // console.log("✅ TUTORS : ", tutors);

  const tutorOptions = tutors.map((tutor) => ({
    label: `${tutor.firstName} ${tutor.lastName}`,
    value: tutor._id,
    data: tutor,
  }));

  const studentOptions = students.map((student) => ({
    label: student.id || student.matricule,
    value: student._id,
    data: student,
  }));

  // Handler functions
  const handleMemberChange = (selectedStudentIds) => {
    const selected = students.filter((s) => selectedStudentIds.includes(s._id));
    setFormData((prev) => ({ ...prev, selectedMembers: selected }));
  };

  const handleThemeChange = (theme) => {
    setFormData((prev) => ({ ...prev, selectedTheme: theme }));
  };

  const handleTutorChange = (tutorId) => {
    const selected = tutors.find((t) => t._id === tutorId);
    setFormData((prev) => ({ ...prev, selectedTutor: selected }));
  };

  const handleSaveTeam = async () => {
    console.log("SAVING TEAM :");

    if (
      !formData.selectedTheme ||
      // !formData.selectedTutor ||
      formData.selectedMembers.length === 0
    ) {
      toast.error("Please fill all required fields !");
      return;
    }

    try {
      const payload = {
        selectedTheme: formData.selectedTheme,
        tutorId: formData.selectedTutor?._id,
        selectedMembers: formData.selectedMembers,
      };

      console.log("PAYLOAD :", payload);
      const response = await axios.post("/teams", payload);

      const { team } = response.data.data;

      setTeamsData((prev) => [...prev, team]);
      fetchTeams();

      toast.success("Team created successfully!");

      setOpen(false);
      setFormData({
        selectedMembers: [],
        selectedTheme: null,
        selectedTutor: tutors[0] || null,
      });
    } catch (err) {
      console.error("❌ Failed to create team:", err);
      toast.error("Failed to create team.");
    }
  };

  const filteredTeams =
    selectedFilter === "all"
      ? teamsData
      : teamsData.filter((team) => team.theme === selectedFilter);

  // Get theme color
  const selectedThemeColor = formData.selectedTheme
    ? themeColors[formData.selectedTheme] || "#89c9ff"
    : "#89c9ff";

  const [assigningTutors, setAssigningTutors] = useState(false);

  const handleAssignTutors = async () => {
    console.log("🚀 Starting tutor assignment...");
    setAssigningTutors(true);
    const toastId = toast.loading("Assigning tutors to teams...");

    try {
      console.log("📦 Filtering eligible tutors...");
      const eligibleTutors = tutors.filter(
        (tutor) =>
          tutor.active &&
          Array.isArray(tutor.assignedThemes) &&
          tutor.assignedThemes.length > 0
      );

      console.log("✅ Eligible Tutors:", eligibleTutors);

      if (eligibleTutors.length === 0) {
        throw new Error("No eligible tutors available.");
      }

      // Group tutors by their assigned themes
      const tutorsByTheme = {};
      for (const tutor of eligibleTutors) {
        for (const theme of tutor.assignedThemes) {
          if (!tutorsByTheme[theme]) tutorsByTheme[theme] = [];
          tutorsByTheme[theme].push(tutor);
        }
      }
      console.log("🧠 Tutors grouped by theme:", tutorsByTheme);

      // Initialize tutor load
      const tutorLoad = {};
      for (const tutor of eligibleTutors) {
        tutorLoad[tutor._id] = 0;
      }

      const updatedTeams = [];

      for (const team of teamsData) {
        if (team.tutor) {
          console.log(`⏭️ Skipping ${team.name} - already has a tutor.`);
          continue;
        }

        const eligible = tutorsByTheme[team.theme] || [];

        if (eligible.length === 0) {
          const warningMsg = `⚠️ No eligible tutor found for theme: ${team.theme}`;
          // console.warn(warningMsg);
          // toast.warning(warningMsg);
          continue;
        }

        // Sort eligible tutors by least assigned load
        eligible.sort((a, b) => tutorLoad[a._id] - tutorLoad[b._id]);
        const selectedTutor = eligible[0];

        console.log(`🔗 Assigning ${selectedTutor.firstName} to ${team.name}`);

        const res = await axios.patch(`/teams/${team._id}/assign-tutor`, {
          tutorId: selectedTutor._id,
        });

        tutorLoad[selectedTutor._id] += 1;
        updatedTeams.push(res.data.data.team);
      }

      console.log("🏁 Assignment complete. Updated teams:", updatedTeams);

      toast.success("Tutors assigned successfully!", { id: toastId });
      fetchTeams(); // Refresh teams from backend
    } catch (err) {
      console.error("❌ Tutor assignment failed:", err);
      toast.error(err.message || "Failed to assign tutors.", { id: toastId });
    } finally {
      setAssigningTutors(false);
    }
  };

  const exportTeams = () => {
    // Theme colors mapping
    const themeColors = {
      Education: "#afe5a6",
      Environment: "#89c9ff",
      Health: "#f4a850",
      "Culture & Sport": "#b990f5",
    };

    // Create a printable HTML content
    const htmlContent = `
      <html>
        <head>
          <title>Liste des Équipes</title>
          <style>
            body { font-family: "Nunito"; margin: 20px; }
            h1 { color: #2980b9; text-align: center; }
            .team-section { 
              margin-bottom: 30px; 
              page-break-inside: avoid;
              border: 1px solid #ddd;
              padding: 15px;
              border-radius: 5px;
            }
            .team-header { 
              font-weight: bold; 
              margin-bottom: 10px;
              font-size: 14px;
              padding-bottom: 8px;
              border-bottom: 1px solid #f3f3f3;

            }
            .members-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
              font-size:14px;
            }
            .members-table th {
              color: white;
              padding: 8px;
              text-align: left;
            }
            .members-table td {
              padding: 8px;
              border-bottom: 1px solid #ddd;
            }
            .team-repartition{
            height:50px;
  
            display:flex;
            align-items:center;
            justify-content:center;
            border-radius:5px;
            background-color:#f5f5f5;
            margin-bottom:30px;
            font-weight:700;
            color:#333333
            }
            .member-header{
            border-radius:5px
            }
            @media print {
              body { padding: 0; }
              .team-section { border: none; }
            }
          </style>
        </head>
        <body>
          <div class = "team-repartition" >Teams Repartition - PSC 2K25</div>
          ${teamsData
            .map(
              (team) => `
            <div class="team-section">
              <div class="team-header">
                <span style="font-size: 14px;">Team : ${team.name}</span><br>
                Theme : ${team.theme}<br>
                Mentor : ${
                  team.tutor
                    ? `${team.tutor.firstName} ${team.tutor.lastName}`
                    : "Not Assigned"
                }
              </div>
              <table class="members-table">
                <thead class="member-header">
                  <tr>
                    <th style="background-color: ${
                      themeColors[team.theme] || "#2980b9"
                    }">#</th>
                    <th style="background-color: ${
                      themeColors[team.theme] || "#2980b9"
                    }">Student Name</th>
                    <th style="background-color: ${
                      themeColors[team.theme] || "#2980b9"
                    }">Email</th>
                  </tr>
                </thead>
                <tbody>
                  ${team.members
                    .map(
                      (member, index) => `
                    <tr>
                      <td>${index + 1}</td>
                      <td>${member.firstName} ${member.lastName}</td>
                      <td>${
                        member.id ||
                        member.email ||
                        (member._id ? member._id.slice(-6) : "N/A")
                      }</td>
                    </tr>
                  `
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          `
            )
            .join("")}
        </body>
      </html>
    `;

    // Open a new window with the content
    const printWindow = window.open("", "_blank");
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Add print button to the new window
    printWindow.onload = function () {
      const printBtn = printWindow.document.createElement("button");
      printBtn.textContent = "Print / Save PDF";
      printBtn.style.cssText = `
        position: fixed;
        top: 27px;
        right: 27px;
        padding: 10px 10px;
        background: rgb(161 124 247 / 74%);
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        z-index: 1000;
      `;
      printBtn.onclick = () => printWindow.print();
      printWindow.document.body.appendChild(printBtn);
    };
  };

  return (
    <div className="teams-wrapper">
      {/* Top Section - Navigation and Stats */}
      <div className="teams-section-top">
        <div className="teams-section-top-nav">
          <div
            className="teams-s-t-nav-widget"
            onClick={() => {
              console.log("📢 Click triggered");
              handleAssignTutors();
            }}
          >
            <div className="teams-s-t-nav-widget-top">
              <BsDiagram2 />
            </div>

            <div
              className="teams-s-t-nav-widget-bottom"
              role="button"
              tabIndex="0"
            >
              {assigningTutors ? "Assigning..." : "Assign Tutors"}
            </div>
          </div>

          <div className="teams-s-t-nav-widget">
            <div className="teams-s-t-nav-widget-top">
              <IoAnalytics className="teams-analytics-icon" />
            </div>
            <div className="teams-s-t-nav-widget-bottom">Analytics</div>
          </div>

          <div className="teams-s-t-nav-widget-center">
            <Progress
              type="circle"
              percent={75}
              size={76}
              format={() => ""}
              className="progress-deadline"
              strokeWidth={5}
              strokeColor={"#45b0ff"}
            />
            <div className="t-s-t-n-w-c-2">
              <span className="days-left-num">10</span>
              <span className="days-left-num">days left</span>
            </div>
          </div>

          <div className="teams-s-t-nav-widget">
            <div className="teams-s-t-nav-widget-top">
              <TbSettingsShare className="teams-settings-icon" />
            </div>
            <div className="teams-s-t-nav-widget-bottom">Teams Settings</div>
          </div>

          <div className="teams-s-t-nav-widget" onClick={showDrawer}>
            <div className="teams-s-t-nav-widget-top">
              <AiOutlineUsergroupAdd className="teams-add-icon" />
            </div>
            <div className="teams-s-t-nav-widget-bottom">New Team</div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Teams List */}
      <div className="teams-section-bottom-wrapper">
        <div className="teams-section-bottom">
          <div className="teams-section-bottom-nav">
            <div className="teams-section-bottom-nav-top">
              <div className="teams-management-title">MANAGE TEAMS</div>
              {/* <div className="number-of-teams-created">
                <TbFileExport className="add-team-icon" />
                Export Data
              </div> */}
              <div className="number-of-teams-created" onClick={exportTeams}>
                <TbFileExport className="add-team-icon" />
                Export Data
              </div>
            </div>

            <div className="teams-section-bottom-nav-bottom">
              <div className="themes-widgets-wrapper">
                <div
                  className={`widget-wrapper${
                    selectedFilter === "all" ? " active" : ""
                  }`}
                  onClick={() => setSelectedFilter("all")}
                >
                  <HiRectangleGroup className="widget-wrapper-icon-all-grps" />
                  All Teams
                </div>

                <div
                  className={`widget-wrapper ed${
                    selectedFilter === "Education" ? " active" : ""
                  }`}
                  onClick={() => setSelectedFilter("Education")}
                >
                  <LiaSchoolSolid className="widget-wrapper-icon" />
                  Education
                </div>

                <div
                  className={`widget-wrapper env${
                    selectedFilter === "Environment" ? " active" : ""
                  }`}
                  onClick={() => setSelectedFilter("Environment")}
                >
                  <RiRecycleLine className="widget-wrapper-icon" />
                  Environment
                </div>

                <div
                  className={`widget-wrapper health${
                    selectedFilter === "Health" ? " active" : ""
                  }`}
                  onClick={() => setSelectedFilter("Health")}
                >
                  <LiaHeartbeatSolid className="widget-wrapper-icon-health" />
                  Health
                </div>

                <div
                  className={`widget-wrapper other${
                    selectedFilter === "Culture & Sport" ? " active" : ""
                  }`}
                  onClick={() => setSelectedFilter("Culture & Sport")}
                >
                  <MdOutlineLocalActivity className="widget-wrapper-icon" />
                  Culture & Sport
                </div>
              </div>

              <div className="filter-display-cards-wrapper">
                <LuSettings2 className="filter-icon" />
                <select name="filter" className="filter-select">
                  <option value="">Filter</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Add New Team Drawer */}
          <Drawer
            title="Create New Team"
            onClose={onClose}
            open={open}
            className="add-new-team-drawer"
            width={430}
          >
            <div className="new-team-body-wrapper">
              <div className="new-team-icon-wrapper">
                <div
                  className="new-team-icon"
                  style={{
                    background: `${selectedThemeColor}1a`,
                    boxShadow: `${selectedThemeColor}2b 0px 0px 0px 1px`,
                    color: selectedThemeColor,
                  }}
                >
                  {teamsData.length + 1}
                </div>
              </div>

              <div
                className="new-team-details-container"
                style={{
                  background: `${selectedThemeColor}01`,
                  border: `1px solid ${selectedThemeColor}2b`,
                }}
              >
                <div className="new-team-id-wrapper">
                  TEAM ID: TEAM-PSC{teamsData.length + 1}
                </div>

                <div className="new-team-infos-wrapper">
                  <div className="admin-create-team-form">
                    {/* Members Selection */}
                    <div className="add-members">
                      <div className="add-members-input-wrapper">
                        <div className="label-wrapper">
                          <div className="text">Select Team Members</div>
                        </div>
                        <div className="input-wrapper">
                          <Select
                            mode="multiple"
                            style={{ width: "100%" }}
                            placeholder="Select students"
                            onChange={handleMemberChange}
                            options={studentOptions}
                            value={formData.selectedMembers.map((m) => m._id)}
                            filterOption={(inputValue, option) =>
                              option.label
                                .toLowerCase()
                                .includes(inputValue.toLowerCase())
                            }
                            optionRender={(option) => (
                              <Space>
                                <Avatar
                                  size={20}
                                  src={
                                    option.data.gender === "Female"
                                      ? GirlAvatar
                                      : ManAvatar
                                  }
                                />
                                {option.label} - {option.data.firstName}{" "}
                                {option.data.lastName}
                              </Space>
                            )}
                          />
                        </div>
                      </div>

                      <div className="members-list">
                        {formData.selectedMembers.length > 0 ? (
                          formData.selectedMembers.map((member) => (
                            <div className="member-item" key={member._id}>
                              <div className="avatar-name-mail-wrapper">
                                <div className="avatar">
                                  <img
                                    src={
                                      member.gender === "female"
                                        ? GirlAvatar
                                        : ManAvatar
                                    }
                                    alt=""
                                    className={
                                      member.gender === "female"
                                        ? "GirlAvatar"
                                        : "ManAvatar"
                                    }
                                  />
                                </div>
                                <div className="name-mail">
                                  <div className="fullname">
                                    {member.firstName} {member.lastName}
                                  </div>
                                  <div className="mail">{member.email}</div>
                                </div>
                              </div>
                              <div className="speciality-wrapper">
                                <div
                                  className={`speciality ${member.speciality
                                    ?.toLowerCase()
                                    .replace(/\s+/g, "")}`}
                                >
                                  {member.speciality || "N/A"}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <>
                            {[...Array(2)].map((_, index) => (
                              <div className="member-item-skeleton" key={index}>
                                <div className="skeleton-avatar"></div>
                                <div className="skeleton-details">
                                  <div className="skeleton-name"></div>
                                  <div className="skeleton-email"></div>
                                </div>
                                <div className="skeleton-specialty"></div>
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    </div>

                    {/* Theme Selection */}
                    <div className="select-theme">
                      <div className="label-wrapper">
                        <div className="text">Select Theme</div>
                      </div>

                      <div className="themes-boxes-wrapper">
                        <div className="theme-box">
                          <img src={EdIcon} alt="" className="theme-img ed" />
                          <div className="theme-title">Education</div>
                          <div className="theme-radio">
                            <input
                              type="radio"
                              className="input-radio"
                              checked={formData.selectedTheme === "Education"}
                              onChange={() => handleThemeChange("Education")}
                            />
                          </div>
                        </div>

                        <div className="theme-box">
                          <img
                            src={HealthIcon}
                            alt=""
                            className="theme-img health"
                          />
                          <div className="theme-title">Health</div>
                          <div className="theme-radio">
                            <input
                              type="radio"
                              className="input-radio"
                              checked={formData.selectedTheme === "Health"}
                              onChange={() => handleThemeChange("Health")}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="themes-boxes-wrapper">
                        <div className="theme-box">
                          <img src={EnvIcon} alt="" className="theme-img env" />
                          <div className="theme-title">Environment</div>
                          <div className="theme-radio">
                            <input
                              type="radio"
                              className="input-radio"
                              checked={formData.selectedTheme === "Environment"}
                              onChange={() => handleThemeChange("Environment")}
                            />
                          </div>
                        </div>
                        <div className="theme-box">
                          <img
                            src={SportIcon}
                            alt=""
                            className="theme-img sport"
                          />
                          <div className="theme-title">Culture & Sport</div>
                          <div className="theme-radio">
                            <input
                              type="radio"
                              className="input-radio"
                              checked={
                                formData.selectedTheme === "Culture & Sport"
                              }
                              onChange={() =>
                                handleThemeChange("Culture & Sport")
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tutor Assignment */}
                    <div className="assign-tutor-wrapper">
                      <div className="label-wrapper">
                        <div className="text">Assign Tutor</div>
                      </div>
                      <div className="input-wrapper">
                        <Select
                          style={{ width: "100%" }}
                          placeholder="Select a tutor"
                          options={tutorOptions}
                          value={formData.selectedTutor?._id}
                          onChange={handleTutorChange}
                          optionRender={(option) => {
                            const tutorTeamsCount = teamsData.filter(
                              (team) => team.tutor?._id === option.data._id
                            ).length;

                            return (
                              <Space
                                style={{
                                  width: "100%",
                                  justifyContent: "space-between",
                                }}
                              >
                                <span
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                  }}
                                >
                                  <Avatar
                                    size={24}
                                    src={
                                      option.data.gender === "female"
                                        ? GirlAvatar
                                        : ManAvatar
                                    }
                                  />
                                  <span
                                    style={{ fontSize: 12, fontWeight: 700 }}
                                  >
                                    {option.label}
                                  </span>
                                </span>
                                <span
                                  style={{ minWidth: 36, textAlign: "right" }}
                                >
                                  <span className="teams-count-badge">
                                    {tutorTeamsCount} teams
                                  </span>
                                </span>
                              </Space>
                            );
                          }}
                        />
                      </div>

                      {formData.selectedTutor && (
                        <div
                          className="tutor-selected-preview member-item"
                          style={{ marginTop: 10 }}
                        >
                          <div className="avatar-name-mail-wrapper">
                            <div className="avatar">
                              <Avatar
                                src={
                                  formData.selectedTutor.gender === "female"
                                    ? GirlAvatar
                                    : ManAvatar
                                }
                              />
                            </div>
                            <div className="name-mail">
                              <div className="fullname">
                                {formData.selectedTutor.firstName}{" "}
                                {formData.selectedTutor.lastName}
                              </div>
                              <div className="mail">
                                {formData.selectedTutor.email}
                              </div>
                            </div>
                          </div>
                          <div className="speciality-wrapper">
                            <div className="recommended-badge speciality">
                              Recommended
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="new-team-btns-wrapper">
                      <button className="save-team-cancel" onClick={onClose}>
                        Cancel
                      </button>
                      <button
                        className="save-team-save"
                        onClick={handleSaveTeam}
                      >
                        Save Team
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Drawer>

          {/* Teams List */}
          <div className="teams-section-bottom-teams-cards-wrapper">
            {filteredTeams.map((team) => {
              const teamNumber = team.name ? team.name.split(" ")[1] : "NA";
              const teamDate = formatDateFR(team.createdAt);

              const tutorInitial = team.tutor
                ? `${team.tutor.firstName?.[0] || ""}${
                    team.tutor.lastName?.[0] || ""
                  }`.toUpperCase()
                : "NA";

              const tutorName = team.tutor
                ? `${team.tutor.firstName || ""} ${team.tutor.lastName || ""}`
                : "Not Assigned";

              const members = team.members || [];
              const teamReportsData = teamReports[team._id] || [];

              const totalDeliverables = 3; // or dynamically detect all needed report types
              const submittedDeliverables = teamReportsData.length;

              // Map each report type to its status
              const reportTypeStatusMap = {};
              teamReportsData.forEach((report) => {
                reportTypeStatusMap[report.type] = report.teamStatus;
              });

              console.log("reports : ", teamReportsData);
              // Define the list of expected report types (adjust if needed)
              const expectedTypes = ["poster", "rapport", "video"];

              // Generate stroke colors per type
              const strokeColors = expectedTypes.map((type) => {
                const status = reportTypeStatusMap[type];

                if (status === "submitted") return "#9bdb8c";
                return "#f0f0f0";
              });

              const themeClassMap = {
                Education: "ed",
                Environment: "env",
                Health: "health",
                "Culture & Sport": "other",
              };

              const themeClass = themeClassMap[team.theme] || "default";

              return (
                <div key={team._id} className="team-card-wrapper">
                  <div className="team-card-top">
                    <div className={`team-number-wrapper ${themeClass}`}>
                      {teamNumber}
                    </div>

                    <div className="team-details-wrapper">
                      <div className="team-details-2">
                        <MdOutlineRadioButtonChecked className="date-icon" />
                        {teamDate}
                      </div>
                      <div className="team-details-1">
                        <HiOutlineUserGroup className="team-detail-grp-icon" />
                        {`TEAM-PSC${teamNumber}`}
                      </div>
                    </div>

                    <div className="team-menu-wrapper">
                      <Dropdown
                        menu={{
                          items: [
                            {
                              key: "edit",
                              label: "Edit Team",
                              icon: <HiOutlinePencilAlt />,
                            },
                            {
                              key: "show",
                              label: "Show Team Details",
                              icon: <HiOutlineEye />,
                              onClick: () => {
                                setSelectedTeam(team);
                                setShowTeamDetails(true);
                              },
                            },
                          ],
                        }}
                        trigger={["click"]}
                        placement="bottomRight"
                      >
                        <HiDotsVertical className="menu-dots" />
                      </Dropdown>
                    </div>
                  </div>

                  <div className="team-card-bottom">
                    <div className="team-tutor-members">
                      <div className="members">
                        <div className="label">Students</div>
                        <div className="avatars-wrapper">
                          <Avatar.Group shape="square" size={18}>
                            {members.map((student, i) => (
                              <Tooltip
                                key={student._id}
                                title={`${student.firstName} ${student.lastName}`}
                                placement="top"
                              >
                                <Avatar
                                  style={{
                                    backgroundColor:
                                      i % 2 === 0 ? "#fde3cf" : "#f56a00",
                                    fontSize: "8px",
                                    fontWeight: "700",
                                    borderRadius: "4px",
                                  }}
                                >
                                  {student.firstName?.[0].toUpperCase() || ""}
                                  {/* {student.lastName?.[0] || ""} */}
                                </Avatar>
                              </Tooltip>
                            ))}
                          </Avatar.Group>
                        </div>
                      </div>

                      <div className="vertical-divider"></div>

                      <div className="tutor">
                        <div className="label">Tutor</div>
                        <div className="avatars-wrapper">
                          <Avatar.Group shape="square" size={18}>
                            <Tooltip title={tutorName} placement="top">
                              <Avatar
                                style={{
                                  backgroundColor: "#fde3cf",
                                  fontSize: "10px",
                                  fontWeight: "700",
                                  borderRadius: "4px",
                                }}
                              >
                                {tutorInitial}
                              </Avatar>
                            </Tooltip>
                          </Avatar.Group>
                          <div className="tutor-name">{tutorName}</div>
                        </div>
                      </div>
                    </div>

                    <div className="reports-wrapper">
                      <div className="report-title-wrapper">
                        <div className="title">
                          <MdOutlineFactCheck className="report-ticket-icon" />
                          Reports
                        </div>
                        <div className="number">
                          <span>{submittedDeliverables}</span>
                          <span>/</span>
                          <span>{totalDeliverables}</span>
                        </div>
                      </div>

                      <div className="progresses-wrapper">
                        <Progress
                          steps={totalDeliverables}
                          percent={
                            (submittedDeliverables / totalDeliverables) * 100
                          }
                          strokeColor={strokeColors}
                          format={() => ""}
                          className="custom-progress"
                          strokeWidth={5}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Team Details Drawer */}
      {/* <Drawer
        title="Team Details"
        onClose={onCloseTeamDetails}
        open={showTeamDetails}
        className="team-details-drawer"
        width={480}
      >
        {selectedTeam && (
          <div className="team-details-modern-wrapper">
            <div className="team-details-header-modern">
              <div className="team-title-status">
                <h2>
                  {selectedTeam.name}
                  <span className="status-badge on-progress">
                    {selectedTeam.active ? "Active" : "Inactive"}
                  </span>
                </h2>
                <div className="team-details-meta">
                  <span className="meta-label">Created:</span>
                  <span className="meta-value">
                    {formatDateFR(selectedTeam.createdAt)}
                  </span>
                </div>
              </div>

              <div className="team-details-header-bottom">
                <div className="assignees">
                  <span className="meta-label">Tutor:</span>
                  <Avatar.Group size="small">
                    <Avatar
                      style={{
                        backgroundColor: "#fde3cf",
                        color: "#f56a00",
                      }}
                      src={
                        selectedTeam.tutor?.gender === "female"
                          ? GirlAvatar
                          : ManAvatar
                      }
                    >
                      {selectedTeam.tutor
                        ? `${selectedTeam.tutor.firstName?.[0] || ""}${
                            selectedTeam.tutor.lastName?.[0] || ""
                          }`
                        : "NA"}
                    </Avatar>
                  </Avatar.Group>
                  <span className="assignee-name">
                    {selectedTeam.tutor
                      ? `${selectedTeam.tutor.firstName} ${selectedTeam.tutor.lastName}`
                      : "Not Assigned"}
                  </span>
                </div>

                <div className="team-tags">
                  <span
                    className={`team-tag ${selectedTeam.theme?.replace(
                      " & ",
                      "-"
                    )}`}
                  >
                    {selectedTeam.theme}
                  </span>
                </div>
              </div>
            </div>

            <div className="team-details-section">
              <div className="section-title">
                Members ({selectedTeam.members?.length || 0})
              </div>
              <div className="section-content members-list">
                {selectedTeam.members?.length > 0 ? (
                  selectedTeam.members.map((member) => (
                    <div key={member._id} className="member-item">
                      <div className="avatar-name-mail-wrapper">
                        <div className="avatar">
                          <img
                            src={
                              member.gender === "female"
                                ? GirlAvatar
                                : ManAvatar
                            }
                            alt=""
                            className={
                              member.gender === "female"
                                ? "GirlAvatar"
                                : "ManAvatar"
                            }
                          />
                        </div>
                        <div className="name-mail">
                          <div className="fullname">
                            {member.firstName} {member.lastName}
                          </div>
                          <div className="mail">{member.email || "N/A"}</div>
                        </div>
                      </div>
                      <div className="speciality-wrapper">
                        <div
                          className={`speciality ${member.specialty
                            ?.toLowerCase()
                            .replace(/\s+/g, "")}`}
                        >
                          {member.specialty || "N/A"}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-members">
                    No members assigned to this team
                  </div>
                )}
              </div>
            </div>

            <div className="team-details-section">
              <div className="section-title">Deliverables</div>
              <div className="subtasks-progress">
                <Progress
                  percent={
                    selectedTeam.deliverables?.length > 0
                      ? Math.round(
                          (selectedTeam.deliverables.filter(
                            (d) => d.status === "submitted"
                          ).length /
                            selectedTeam.deliverables.length) *
                            100
                        )
                      : 0
                  }
                  size="small"
                />
                <span className="progress-text">
                  {selectedTeam.deliverables?.filter(
                    (d) => d.status === "submitted"
                  ).length || 0}
                  /{selectedTeam.deliverables?.length || 0} Completed
                </span>
              </div>

              <div className="subtasks-list">
                {selectedTeam.deliverables?.length > 0 ? (
                  selectedTeam.deliverables.map((deliverable, idx) => (
                    <div className="subtask-item" key={idx}>
                      <input
                        type="checkbox"
                        checked={deliverable.status === "submitted"}
                        readOnly
                      />
                      <span className="subtask-name">
                        {deliverable.name || `Deliverable ${idx + 1}`}
                      </span>
                      {deliverable.status !== "submitted" && (
                        <span className="subtask-blocker">
                          {deliverable.dueDate
                            ? `Due: ${formatDateFR(deliverable.dueDate)}`
                            : "Pending submission"}
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="no-deliverables">
                    No deliverables assigned
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Drawer> */}
    </div>
  );
};

export default Teams;
