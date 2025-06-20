import React, { useState, useEffect } from "react";
import "./tutorDashboard.scss";

import { IoOpenOutline } from "react-icons/io5";
import { MdOpenInNew } from "react-icons/md";
import { CgArrowsExpandUpRight } from "react-icons/cg";
import { FaRegHandPointRight } from "react-icons/fa";
import { FaUpRightFromSquare } from "react-icons/fa6";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { LuClockAlert } from "react-icons/lu";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { TbProgressCheck } from "react-icons/tb";
import { CgCloseO } from "react-icons/cg";
import { LuCircleChevronRight } from "react-icons/lu";
import {
  FaRegClock,
  FaEdit,
  FaPaperPlane,
  FaExclamation,
  FaTimes,
  FaCheck,
} from "react-icons/fa";

import { Link } from "react-router-dom";

import POSTERICON from "../../assets/icons/posterIcon.png";
import ARTICLEICON from "../../assets/icons/articleIcon2.png";
import VIDEOICON from "../../assets/icons/videoIcon3.png";
import BG1 from "../../assets/images/bg1.png";
import EnvIcon from "../../assets/icons/env1.png";
import HealthIcon from "../../assets/icons/health1.png";
import EdIcon from "../../assets/icons/ed1.png";
import SportIcon from "../../assets/icons/sportCult1.png";
import TEAMMEMBERSICON from "../../assets/icons/teamMembersIcon.png";
import EVENTSICON from "../../assets/icons/eventIcon.png";
import TEAMMEETICON from "../../assets/icons/teammeetIcon1.png";

import axios from "axios";
import dayjs from "dayjs";
// Theme data
const themes = [
  { name: "Education", key: "ed", color: "#89c9ff" },
  { name: "Environnement", key: "env", color: "#9cdb89" },
  { name: "Health", key: "health", color: "#f4a850" },
  { name: "Culture & Sport", key: "other", color: "#b990f5" },
];

// Report types
const reportTypes = [
  {
    key: "article",
    label: "Article",
    icon: ARTICLEICON,
    iconStyle: { width: "26px" },
  },
  {
    key: "poster",
    label: "Poster",
    icon: POSTERICON,
    iconStyle: { width: "28px" },
  },
  {
    key: "video",
    label: "Video",
    icon: VIDEOICON,
    iconStyle: { width: "22px" },
  },
];

// Status mappings
const statusMap = {
  approved: {
    label: "Approved",
    icon: IoCheckmarkDoneCircleOutline,
    color: "#ecf8e3",
    text: "#a1d65c",
    iconStyle: { fontSize: "14px" },
  },
  pending: {
    label: "Pending",
    icon: TbProgressCheck,
    color: "#fcf5da",
    text: "#e6ca34",
    iconStyle: { fontSize: "15px" },
  },
  rejected: {
    label: "Rejected",
    icon: CgCloseO,
    color: "#ffe6e6",
    text: "#fe545c",
    iconStyle: { fontSize: "12px" },
  },
};

// Admin Decision
const adminDecisions = {
  ADMIN_APPROVED: {
    label: "Approved",
    icon: IoCheckmarkDoneCircleOutline,
    color: "#ecf8e3",
    text: "#a1d65c",
    iconStyle: { fontSize: "14px" },
  },
  ADMIN_PENDING: {
    label: "Pending",
    icon: TbProgressCheck,
    color: "#fcf5da",
    text: "#e6ca34",
    iconStyle: { fontSize: "15px" },
  },
  ADMIN_REJECTED: {
    label: "Rejected",
    icon: CgCloseO,
    color: "#ffe6e6",
    text: "#fe545c",
    iconStyle: { fontSize: "12px" },
  },
};

const TutorDashboard = ({ tutor, authToken }) => {
  // console.log("👨‍🏫 Logged-in Tutor:", tutor, authToken);

  // function StatusTag({ status, statusMap }) {
  //   console.log('Missing status value' , status  , statusMap);
  //   // if (!status) return null;
  //   if (!status) {
  //     console.log('Missing status value'); // Debug log
  //     return null;
  //   }
  //   // Convert status to lowercase to match map keys
  //   const normalizedStatus = status.toLowerCase();
  //   const statusData = statusMap[normalizedStatus];

  //   if (!statusData) return null;

  //   const { label, icon: Icon, color, text, iconStyle } = statusData;

  //   return (
  //     <div
  //       className="table-report-tag"
  //       style={{ backgroundColor: color, color: text }}
  //       title={label}
  //     >
  //       <Icon style={{ marginRight: 5, ...iconStyle }} />
  //       {label}
  //     </div>
  //   );
  // }

  function StatusTag({ status, statusMap }) {
    if (!status) return null;

    const statusData = statusMap[status]; // no lowercasing

    if (!statusData) {
      console.warn("❌ Missing status value", status, statusMap);
      return null;
    }

    const { label, icon: Icon, color, text, iconStyle } = statusData;

    return (
      <div
        className="table-report-tag"
        style={{ backgroundColor: color, color: text }}
        title={label}
      >
        <Icon style={{ marginRight: 5, ...iconStyle }} />
        {label}
      </div>
    );
  }

  function TeamTag({ name, theme }) {
    if (!name || !theme) return null;

    // Find theme by matching key (case-insensitive)
    const themeData = themes.find(
      (t) =>
        t.key.toLowerCase() === theme.toLowerCase() ||
        t.name.toLowerCase() === theme.toLowerCase()
    );

    if (!themeData) return <div className="team-tag">{name}</div>;

    return (
      <div
        className="team-tag"
        style={{
          backgroundColor: themeData.color,
          color: "white",
        }}
      >
        {name}
      </div>
    );
  }

  function ReportIcon({ type }) {
    const reportType = reportTypes.find((rt) => rt.key === type);
    if (!reportType) return null;

    return (
      <img
        src={reportType.icon}
        alt={reportType.label}
        style={reportType.iconStyle}
      />
    );
  }

  const team = {
    name: "Team Alpha",
    theme: "Education",
  };

  // Theme color and icon mapping in English
  const themeData = {
    Education: {
      color: "#89c9ff",
      icon: EdIcon,
    },
    Environment: {
      color: "#afe5a6",
      icon: EnvIcon,
    },
    Health: {
      color: "#f4a850",
      icon: HealthIcon,
    },
    "Culture and Sports": {
      color: "#b990f5",
      icon: SportIcon,
    },
  };

  // Extract theme info
  const currentTheme = themeData[team.theme];

  const imageClass = `card-img theme-img-${team.theme
    .toLowerCase()
    .replace(/\s+/g, "-")}`;

  const TimelineItem = ({ title, description }) => (
    <div className="timeline-item-wrapper">
      <div className="left-side">
        <div className="circle-1">
          <div className="circle-2"></div>
        </div>
        <div className="line"></div>
      </div>
      <div className="right-side">
        <div className="main-title">{title}</div>
        <div className="description">{description}</div>
      </div>
    </div>
  );

  const TimelineBetweenItem = ({ title, description }) => (
    <div className="timeline-between-item-wrapper">
      <div className="left-side">
        <div className="circle-1">
          <div className="circle-2"></div>
        </div>
        <div className="line"></div>
      </div>
      <div className="right-side">
        <div className="main-title">{title}</div>
        <div className="description">{description}</div>
      </div>
    </div>
  );

  const themeClassMap = {
    Education: "theme-education-light",
    Environnement: "theme-environment-light",
    Health: "theme-health-light",
    "Culture & Sport": "theme-culture-and-sports-light",
  };

  const themeAbbreviationMap = {
    Education: "Ed",
    Environnement: "Env",
    Health: "Health",
    "Culture & Sport": "Sport",
  };

  const [teams, setTeams] = useState([]);

  // Flatten the reports data for table display
  const deliverables = teams.flatMap((team) =>
    team.reports.map((report) => ({
      ...report,
      teamName: team.name,
      teamTheme: team.theme,
    }))
  );

  const fetchTutorReports = async () => {
    try {
      const tutor = JSON.parse(localStorage.getItem("userData"));
      const token = localStorage.getItem("authToken");

      const res = await axios.get(`/reports/tutor/${tutor._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data.data;
      setTeams(data); // array of { teamId, name, theme, reports: [...] }
      console.log("✅ TEAMS REPORTS : ", res.data.data);
    } catch (err) {
      console.error("❌ Error fetching tutor reports:", err);
    }
  };
  useEffect(() => {
    fetchTutorReports();
  }, []);

  // console.log("✅ DELIVERABLES : ", deliverables);

  return (
    <div className="student-dashboard-container">
      <div className="student-dashboard-section-1">
        <div className="student-dashboard-card-wrapper">
          <div className="card-left-side">
            <div className="top-text">Themes Assigned</div>

            <div className="themes-assigned-wrapper">
              {tutor?.assignedThemes?.map((theme, index) => (
                <div
                  key={index}
                  className={`assigned-theme-tag ${
                    themeClassMap[theme] || "default-theme-class"
                  }`}
                >
                  {themeAbbreviationMap[theme] || theme}
                </div>
              ))}
            </div>
          </div>
          <div
            className={`card-right-side theme-${team.theme
              .toLowerCase()
              .replace(/\s+/g, "-")}-light`}
          >
            <img
              src={currentTheme.icon}
              alt={`${team.theme} Icon`}
              className={`card-img theme-img-${team.theme
                .toLowerCase()
                .replace(/\s+/g, "-")}`}
            />
          </div>
        </div>

        <div className="student-dashboard-card-wrapper">
          <div className="card-left-side">
            <div className="top-text">Assigned Teams</div>
            <div className="bottom-text team-members-tag">
              {tutor?.assignedTeams?.length > 1 && (
                <span>{tutor.assignedTeams.length} Teams</span>
              )}
              {tutor?.assignedTeams?.length === 1 && <span>1 Team</span>}
              {(tutor?.assignedTeams?.length === 0 ||
                !tutor?.assignedTeams) && <span>No Teams</span>}
            </div>
          </div>
          <div className="card-right-side team-members-icon-wrapper">
            <img
              src={TEAMMEMBERSICON}
              alt=""
              className="card-img team-members-icon"
            />
          </div>
        </div>

        <div className="student-dashboard-card-wrapper">
          <div className="card-left-side">
            <div className="top-text">Team Meetings</div>
            <div className="bottom-text meetings-tag">
              Plan Meets <LuCircleChevronRight className="meetings-icon" />
            </div>
          </div>
          <div className="card-right-side team-meetings-icon-wrapper">
            <img
              src={TEAMMEETICON}
              alt=""
              className="card-img team-meetings-icon"
            />
          </div>
        </div>
      </div>
      <div className="student-dashboard-section-2">
        <div className="timeline-title">Leveling Up : One Phase at a Time</div>

        <div className="text-wrapper">
          <div className="psc-timeline-wrapper">
            <TimelineItem
              title="TEAM BUILDING STAGE"
              description="Great journeys begin with united minds and shared purpose"
            />

            <TimelineBetweenItem
              title="PSC LAUNCH CONFERENCE"
              description="Fuel your ambition, gain clarity, and step into the PSC adventure"
            />

            <TimelineBetweenItem
              title="SPONSORSHIP CONFERENCE"
              description="Master the art of pitching and learn how to attract real support"
            />

            <TimelineItem
              title="BRANDING & GRAPHIC DESIGN"
              description="Turn your vision into a powerful identity the world will recognize"
            />

            <TimelineItem
              title="PROJECT DELIVERABLES"
              description="Summarize your journey with quality work that speaks for itself"
            />

            <TimelineBetweenItem
              title="PITCHING CONFERENCE"
              description="Build confidence, refine your voice, and pitch with power and purpose"
            />

            <TimelineItem
              title="BALL DAY EVENT"
              description="Step into the spotlight and proudly showcase your team's impact !"
            />

            <TimelineItem
              title="DEFENSE DAY"
              description="Stand tall, share your story, and make your final mark with pride"
            />
          </div>
        </div>
        <div className="bg-wrapper"></div>
      </div>
      <div className="student-dashboard-section-3">
        <div className="reports-table-title">
          <div className="left-title">Recent Submitted Deliverables</div>
          <Link to="/tutor/reports" className="right-call-to-action">
            <div className="text">Expand Details</div>
            <FaUpRightFromSquare className="icon" />
          </Link>
        </div>

        <div className="reports-table-wrapper">
          <div className="table-header">
            <div className="report-name-column-table-head table-header-tag-name">
              Report
            </div>
            <div className="team-submission-column-table-head table-header-tag">
              Team
            </div>
            <div className="tutor-decision-column-table-head table-header-tag">
              Status
            </div>
            <div className="admin-decision-column-table-head table-header-tag">
              Admin Decision
            </div>
            {/* <div className="deadline-column-table-head table-header-tag">
              Deadline
            </div> */}
          </div>
          <div className="table-divider"></div>
          <div className="table-body">
            {deliverables.map((deliverable, index) => (
              <React.Fragment key={index}>
                <div className="table-body-row">
                  <div className="report-name-column">
                    <div className="report-image">
                      <ReportIcon type={deliverable.type} />
                    </div>
                    <div className="report-details">
                      <div className="report-name">{deliverable.fileName}</div>
                      <div className="report-type">
                        Submitted On :{" "}
                        {dayjs(deliverable.createdAt).format("YYYY-MM-DD")}
                      </div>
                    </div>
                  </div>

                  <div className="submission-status-column">
                    <TeamTag
                      name={deliverable.teamName}
                      theme={deliverable.teamTheme}
                    />
                  </div>

                  <div className="tutor-decision-column">
                    <StatusTag
                      status={deliverable.tutorStatus}
                      statusMap={statusMap}
                    />
                  </div>

                  <div className="admin-decision-column">
                    <StatusTag
                      status={
                        deliverable.adminStatus
                          ? `ADMIN_${deliverable.adminStatus.toUpperCase()}` // matches ADMIN_APPROVED
                          : null
                      }
                      statusMap={adminDecisions}
                    />
                  </div>

                  {/* <StatusTag
                    status={deliverable.tutorStatus} // No need to lowercase here, component handles it
                    statusMap={statusMap}
                  /> */}

                  {/* <div className="deadline-column">
                    <div className="deadline-tag table-report-tag">
                      <span>-</span> {5} Days
                    </div>
                  </div> */}
                </div>
                <div className="table-row-divider"></div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;
