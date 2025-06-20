import React, { useState, useEffect } from "react";
import "./teams.scss";

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

const Teams = ({ tutor, authToken }) => {

  const [showTeamDetails, setShowTeamDetails] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("all");

  const [teamsData, setTeamsData] = useState([]);
  const [teamOptions, setTeamOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    selectedMembers: [],
    selectedTheme: null,
    selectedTutor: null,
  });

  // Theme colors mapping
  const themeColors = {
    Education: "#89c9ff",
    Environnement: "#afe5a6",
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

  // const fetchTeams = async () => {
  //   try {
  //     const token = localStorage.getItem("authToken");
  //     const res = await axios.get("/teams", {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     const teams = res.data.data.teams;

  //     setTeamsData(teams);

  //     const formattedOptions = teams.map((team) => ({
  //       value: team._id,
  //       label: team.name,
  //       theme: team.theme,
  //     }));
  //     setTeamOptions(formattedOptions);

  //     console.log("✅ Teams fetched:", teams);
  //   } catch (error) {
  //     console.error("❌ Error fetching teams:", error);
  //     message.error("Failed to load teams");
  //   }
  // };

  const fetchTeams = async () => {
    try {

      const tutorId = tutor?._id;

      if (!tutorId) {
        console.warn("⚠️ Tutor ID not found in localStorage.");
        return;
      }


      const res = await axios.get("/teams", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const allTeams = res.data.data.teams;


      // Filter only teams assigned to the logged-in tutor
      const tutorTeams = allTeams.filter((team) => team.tutor?._id === tutorId);


      setTeamsData(tutorTeams);

      const formattedOptions = tutorTeams.map((team) => ({
        value: team._id,
        label: team.name,
        theme: team.theme,
      }));
      setTeamOptions(formattedOptions);

      console.log("✅ Tutor's Teams fetched:", tutorTeams);
    } catch (error) {
      console.error("❌ Error fetching tutor's teams:", error);
      message.error("Failed to load tutor's teams");
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const filteredTeams =
    selectedFilter === "all"
      ? teamsData
      : teamsData.filter((team) => team.theme === selectedFilter);

  // Get theme color
  const selectedThemeColor = formData.selectedTheme
    ? themeColors[formData.selectedTheme] || "#89c9ff"
    : "#89c9ff";

  return (
    <div className="teams-tutor-wrapper">
      {/* Bottom Section - Teams List */}
      <div className="teams-section-bottom-wrapper">
        <div className="teams-section-bottom">
          <div className="teams-section-bottom-nav">
            <div className="teams-section-bottom-nav-top">
              <div className="teams-management-title">ASSIGNED TEAMS</div>
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
                    selectedFilter === "Environnement" ? " active" : ""
                  }`}
                  onClick={() => setSelectedFilter("Environnement")}
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
              const submittedDeliverables =
                team.deliverables?.filter((d) => d.status === "submitted")
                  .length || 0;
              const totalDeliverables = team.deliverables?.length || 0;

              const themeClassMap = {
                Education: "ed",
                Environnement: "env",
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
                          steps={totalDeliverables || 3}
                          percent={
                            totalDeliverables > 0
                              ? (submittedDeliverables / totalDeliverables) *
                                100
                              : 0
                          }
                          strokeColor={
                            team.deliverables?.map((d) =>
                              d.status === "submitted" ? "#9cdb89" : "#f0f0f0"
                            ) || ["#f0f0f0", "#f0f0f0", "#f0f0f0"]
                          }
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
    </div>
  );
};

export default Teams;
